import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { Minus, Plus, ShoppingCart, CheckCircle, Truck, ShieldCheck, MessageCircle, ArrowLeft, ChevronRight } from 'lucide-react';

import { addToCart } from '../../store/cartSlice';
import { AppDispatch, Product } from '../../store/store';
import { Comments } from '../Comments/Comments';
import { ZoomImage } from "../ZoomImage.tsx";
import { setSeo } from '../../lib/seo';

const apiUrl = import.meta.env.VITE_API_URL;

// --- COMPONENTES AUXILIARES ---

interface AddToCartNotificationProps {
    productName: string;
    quantity: number;
    isVisible: boolean;
}

const AddToCartNotification = ({ productName, quantity, isVisible }: AddToCartNotificationProps) => {
    return (
        <div
            className={`fixed top-5 right-5 z-50 flex items-center gap-4 p-4 rounded-2xl shadow-2xl shadow-slate-900/10 bg-white border border-slate-100 transition-all duration-500 ease-out ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
            }`}
        >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600">
                <CheckCircle className="h-6 w-6" />
            </div>
            <div>
                <p className="font-bold text-slate-800 text-sm">¡Añadido al carrito!</p>
                <p className="text-xs text-slate-500 mt-0.5">{`${quantity} x ${productName}`}</p>
            </div>
        </div>
    );
};

interface ImageGalleryProps {
    images: string[];
    productName: string;
}

const ImageGallery = ({ images, productName }: ImageGalleryProps) => {
    const [mainImage, setMainImage] = useState(images[0]);

    useEffect(() => {
        if (images && images.length > 0) {
            setMainImage(images[0]);
        }
    }, [images]);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-square w-full bg-slate-100 rounded-2xl flex flex-col items-center justify-center border border-slate-200 gap-3">
                <ShoppingCart className="h-10 w-10 text-slate-300" />
                <p className="text-sm font-medium text-slate-400">No hay imagen disponible</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="aspect-square w-full bg-white rounded-2xl overflow-hidden flex items-center justify-center border border-slate-200/80 shadow-sm p-6">
                <ZoomImage
                    src={mainImage}
                    alt={`Vista principal de ${productName}`}
                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                />
            </div>
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                    {images.map((img: string, index: number) => (
                        <button
                            key={index}
                            type="button"
                            className={`relative aspect-square bg-white rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                                mainImage === img
                                    ? 'border-primary shadow-md shadow-primary/10 ring-1 ring-primary/20'
                                    : 'border-slate-200 hover:border-slate-300'
                            }`}
                            onClick={() => setMainImage(img)}
                            aria-label={`Ver imagen ${index + 1} de ${productName}`}
                        >
                            <img
                                src={img}
                                alt={`${productName} - vista ${index + 1}`}
                                className="w-full h-full object-contain p-2"
                                loading="lazy"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

interface InfoTabsProps {
    product: Product;
}

const InfoTabs = ({ product }: InfoTabsProps) => {
    const [activeTab, setActiveTab] = useState('description');
    const tabBase = "py-3 px-5 font-semibold text-sm md:text-base cursor-pointer border-b-[3px] transition-all duration-200 rounded-t-lg";
    const activeTabStyles = "border-primary text-primary bg-primary/5";
    const inactiveTabStyles = "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-200";

    return (
        <div className="w-full mt-10 md:mt-14 col-span-1 lg:col-span-2">
            <div className="border-b border-slate-200">
                <nav className="-mb-[1px] flex gap-1" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('description')}
                        className={`${tabBase} ${activeTab === 'description' ? activeTabStyles : inactiveTabStyles}`}
                    >
                        Descripción
                    </button>
                    <button
                        onClick={() => setActiveTab('specifications')}
                        className={`${tabBase} ${activeTab === 'specifications' ? activeTabStyles : inactiveTabStyles}`}
                    >
                        Especificaciones
                    </button>
                </nav>
            </div>
            <div className="py-8 text-slate-700">
                {activeTab === 'description' && (
                    <div className="max-w-3xl">
                        <p className="text-base leading-7 text-slate-600">
                            {product.description || 'No hay descripción disponible para este producto.'}
                        </p>
                    </div>
                )}
                {activeTab === 'specifications' && (
                    <div className="max-w-xl">
                        <ul className="space-y-4">
                            <li className="flex items-center gap-4 py-3 border-b border-slate-100">
                                <span className="font-bold text-slate-800 w-32 text-sm uppercase tracking-wider">SKU</span>
                                <span className="text-slate-600 font-mono text-sm">{product.sku}</span>
                            </li>
                            <li className="flex items-center gap-4 py-3 border-b border-slate-100">
                                <span className="font-bold text-slate-800 w-32 text-sm uppercase tracking-wider">Categoría</span>
                                <span className="text-slate-600 text-sm">{product.category || "No especificado"}</span>
                            </li>
                            <li className="flex items-center gap-4 py-3 border-b border-slate-100">
                                <span className="font-bold text-slate-800 w-32 text-sm uppercase tracking-wider">Marca</span>
                                <span className="text-slate-600 text-sm">{product.vendor?.vendorName || "No especificado"}</span>
                            </li>
                        </ul>
                    </div>
                )}
                {activeTab === 'reviews' && <Comments />}
            </div>
        </div>
    );
};

const TrustPill = ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
    <div className="flex items-center gap-2 text-slate-500">
        <Icon className="h-4 w-4 text-primary flex-shrink-0" />
        <span className="text-xs font-medium">{text}</span>
    </div>
);

// --- SKELETON DE CARGA ---

const ProductSkeleton = () => (
    <div className="animate-pulse">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <div className="h-4 w-48 bg-slate-200 rounded mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Imagen skeleton */}
                <div className="aspect-square bg-slate-200 rounded-2xl" />
                {/* Detalles skeleton */}
                <div className="flex flex-col gap-4">
                    <div className="h-3 w-20 bg-slate-200 rounded" />
                    <div className="h-10 w-3/4 bg-slate-200 rounded" />
                    <div className="h-8 w-40 bg-slate-200 rounded mt-2" />
                    <div className="space-y-2 mt-4">
                        <div className="h-4 w-full bg-slate-200 rounded" />
                        <div className="h-4 w-5/6 bg-slate-200 rounded" />
                        <div className="h-4 w-4/6 bg-slate-200 rounded" />
                    </div>
                    <div className="h-12 w-full bg-slate-200 rounded-xl mt-6" />
                </div>
            </div>
        </div>
    </div>
);

// --- COMPONENTE PRINCIPAL ---

export const ProductPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const fromUrl =
        typeof location.state === "object" &&
        location.state !== null &&
        "from" in location.state &&
        typeof (location.state as { from?: unknown }).from === "string"
            ? (location.state as { from: string }).from
            : "/tienda";
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [showNotification, setShowNotification] = useState(false);
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        async function fetchProductDetails() {
            setIsLoading(true);
            try {
                const response = await axios.get<Product>(
                    `${apiUrl}/rest/api/1/producto?id=${encodeURIComponent(id || "")}`,
                    {
                        withCredentials: true
                    }
                );
                setProduct(response.data);
            } catch (error) {
                console.error("Error fetching product:", error);
                setProduct(null);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProductDetails().catch();
    }, [id]);

    useEffect(() => {
        if (!product) return;

        const canonicalPath = `/producto/${encodeURIComponent(String(product.id))}`;
        setSeo({
            title: `${product.name} | SISCAD Industrial`,
            description: product.description || 'Producto industrial disponible en SISCAD Industrial.',
            canonicalPath,
            image: product.imageUrl || '/siscadindustrial-recortado.svg',
            type: 'product',
            jsonLdId: 'product-jsonld',
            jsonLd: {
                '@context': 'https://schema.org',
                '@type': 'Product',
                name: product.name,
                description: product.description || 'Producto industrial disponible en SISCAD Industrial.',
                image: product.imageUrl ? [product.imageUrl] : undefined,
                sku: product.sku,
                brand: {
                    '@type': 'Brand',
                    name: product.vendor?.vendorName || 'SISCAD Industrial',
                },
                offers: {
                    '@type': 'Offer',
                    priceCurrency: 'MXN',
                    price: product.price,
                    availability: 'https://schema.org/InStock',
                    url: `https://siscadindustrial.cloud${canonicalPath}`,
                },
            },
        });
    }, [product]);

    const handleQuantityChange = (amount: number) => {
        setQuantity(prev => Math.max(1, prev + amount));
    };

    const handleAddToCart = () => {
        if (!product) return;
        dispatch(addToCart({
            producto: {
                id: String(product.id),
                name: product.name,
                price: product.price,
                sku: product.sku,
            },
            quantity: quantity
        }));
        setShowNotification(true);
        setTimeout(() => {
            setShowNotification(false);
        }, 3000);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),rgba(248,250,252,1)_40%,rgba(226,232,240,1)_100%)]">
                <ProductSkeleton />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),rgba(248,250,252,1)_40%,rgba(226,232,240,1)_100%)] flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                        <ShoppingCart className="h-8 w-8 text-slate-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Producto no encontrado</h2>
                    <p className="text-slate-500 mb-6">
                        No pudimos cargar los detalles del producto. Es posible que no exista o haya un problema temporal.
                    </p>
                    <Link
                        to={fromUrl}
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-red-700 hover:shadow-xl transition-all duration-200"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver al catálogo
                    </Link>
                </div>
            </div>
        );
    }

    const productImages = product.imageUrl ? [product.imageUrl] : [];

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),rgba(248,250,252,1)_40%,rgba(226,232,240,1)_100%)]">
            <AddToCartNotification productName={product.name} quantity={quantity} isVisible={showNotification} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6 lg:mb-8" aria-label="Breadcrumb">
                    <Link to={fromUrl} className="hover:text-primary transition-colors font-medium">Tienda</Link>
                    <ChevronRight className="h-4 w-4 text-slate-300" />
                    <span className="text-slate-800 font-semibold truncate max-w-[200px] sm:max-w-md">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Galería */}
                    <div>
                        <ImageGallery images={productImages} productName={product.name} />
                    </div>

                    {/* Detalles */}
                    <div className="flex flex-col">
                        {/* Meta */}
                        <div className="flex items-center gap-3 mb-3">
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                                {product.vendor?.vendorName || "Marca"}
                            </span>
                            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                                {product.category || "Industrial"}
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
                            {product.name}
                        </h1>

                        <p className="mt-1 text-sm font-medium text-slate-400">
                            SKU: <span className="text-slate-600 font-mono">{product.sku}</span>
                        </p>

                        {/* Precio */}
                        <div className="mt-5 flex items-baseline gap-3">
                            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                                {product.price.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                            </span>
                            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                                IVA incluido
                            </span>
                        </div>

                        {/* Descripción breve */}
                        <div className="mt-5">
                            <p className="text-sm leading-7 text-slate-600 line-clamp-4">
                                {product.description || "No hay descripción disponible."}
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="my-6 border-t border-slate-200" />

                        {/* Cantidad y CTA */}
                        <div className="flex flex-col gap-5">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">Cantidad</span>
                                <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-sm">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        className="px-3.5 py-2.5 text-slate-500 hover:bg-slate-50 rounded-l-xl transition disabled:opacity-40"
                                        disabled={quantity <= 1}
                                        aria-label="Disminuir cantidad"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="px-5 py-2 text-center font-bold text-slate-800 min-w-[3rem]">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        className="px-3.5 py-2.5 text-slate-500 hover:bg-slate-50 rounded-r-xl transition"
                                        aria-label="Aumentar cantidad"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="w-full sm:w-auto sm:self-start inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-bold text-white shadow-lg shadow-primary/20 hover:bg-red-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                Agregar al carrito
                            </button>
                        </div>

                        {/* Trust signals */}
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <TrustPill icon={Truck} text="Envíos a todo México" />
                            <TrustPill icon={ShieldCheck} text="Cotización disponible" />
                            <TrustPill icon={MessageCircle} text="Atención B2B / B2C" />
                            <TrustPill icon={CheckCircle} text="Stock verificado" />
                        </div>
                    </div>

                    {/* Tabs */}
                    <InfoTabs product={product} />
                </div>
            </main>
        </div>
    );
};
