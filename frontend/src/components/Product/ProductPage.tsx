import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
// Star, Heart
import {  Minus, Plus, ShoppingCart, CheckCircle } from 'lucide-react';

// ASUMO QUE ESTOS IMPORTS SON CORRECTOS SEGÚN TU ESTRUCTURA
import { getAccessToken } from '../../store/auth';
import { addToCart } from '../../store/cartSlice';
import { AppDispatch, Product } from '../../store/store';
import { Comments } from '../Comments/Comments';
import {ZoomImage} from "../ZoomImage.tsx"; // Tu componente de comentarios

// --- CONFIGURACIÓN ---
const apiUrl = import.meta.env.VITE_API_URL;


// --- COMPONENTES AUXILIARES MEJORADOS ---

// Componente para mostrar las estrellas de calificación
// const StarRating = ({ rating = 0, size = 5 }) => {
//   const fullStars = Math.floor(rating);
//   const halfStar = rating % 1 !== 0;
//   const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
//   return (
//       <div className={`flex items-center text-yellow-400`}>
//         {[...Array(fullStars)].map((_, i) => <Star key={`full_${i}`} fill="currentColor" className={`w-${size} h-${size}`} />)}
//         {halfStar && <Star key="half" fill="currentColor" className={`w-${size} h-${size} opacity-50`} />}
//         {[...Array(emptyStars)].map((_, i) => <Star key={`empty_${i}`} className={`w-${size} h-${size} text-gray-300`} />)}
//       </div>
//   );
// };

// Componente para la notificación "Añadido al carrito"

interface AddToCartNotificationProps{
  productName: string;
  quantity: number;
  isVisible: boolean;
}

const AddToCartNotification = ({ productName, quantity, isVisible }: AddToCartNotificationProps) => {
  return (
      <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-4 p-4 rounded-lg shadow-lg bg-white border border-gray-200 transition-transform duration-300 ease-in-out ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}
      >
        <CheckCircle className="h-8 w-8 text-green-500" />
        <div>
          <p className="font-semibold text-gray-800">¡Añadido al carrito!</p>
          <p className="text-sm text-gray-600">{`${quantity} x ${productName}`}</p>
        </div>
      </div>
  );
};


interface ImageGalleryProps {
  images: string[];
  productName: string;
}

// Galería de imágenes mejorada
const ImageGallery = ({ images, productName } : ImageGalleryProps) => {
  const [mainImage, setMainImage] = useState(images[0]);

  useEffect(() => {
    // Asegura que la imagen principal se actualice si las imágenes del producto cambian
    if (images && images.length > 0) {
      setMainImage(images[0]);
    }
  }, [images]);

  if (!images || images.length === 0) {
    return <div className="aspect-square w-full bg-gray-200 rounded-lg flex items-center justify-center"><p>No hay imagen</p></div>;
  }

  return (
      <div className="flex flex-col gap-4">
        <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200">
          <ZoomImage
              src={mainImage}
              alt={`Vista principal de ${productName}`}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {images.map((img: string, index: number) => (
              <div
                  key={index}
                  className={`cursor-pointer aspect-square bg-gray-100 rounded-md overflow-hidden border-2 ${mainImage === img ? 'border-blue-500' : 'border-transparent'}`}
                  onClick={() => setMainImage(img)}
              >
                <img src={img} alt={`${productName} - vista ${index + 1}`} className="w-full h-full object-cover" />
              </div>
          ))}
        </div>
      </div>
  );
};

// Pestañas de información
interface InfoTabsProps {
  product: Product;
}
const InfoTabs = ( {product}: InfoTabsProps) => {
  const [activeTab, setActiveTab] = useState('description');
  const tabStyles = "py-2 px-4 font-medium text-sm md:text-base cursor-pointer border-b-2 transition-colors duration-300";
  const activeTabStyles = "border-blue-500 text-blue-600";
  const inactiveTabStyles = "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300";

  return (
      <div className="w-full mt-8 md:mt-12 col-span-1 lg:col-span-2">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex gap-6" aria-label="Tabs">
            <button onClick={() => setActiveTab('description')} className={`${tabStyles} ${activeTab === 'description' ? activeTabStyles : inactiveTabStyles}`}>Descripción</button>
            <button onClick={() => setActiveTab('specifications')} className={`${tabStyles} ${activeTab === 'specifications' ? activeTabStyles : inactiveTabStyles}`}>Especificaciones</button>
            {/*<button onClick={() => setActiveTab('reviews')} className={`${tabStyles} ${activeTab === 'reviews' ? activeTabStyles : inactiveTabStyles}`}>Opiniones</button>*/}
          </nav>
        </div>
        <div className="py-6 text-gray-700">
          {activeTab === 'description' && <p>{product.description || 'No hay descripción disponible.'}</p>}
          {activeTab === 'specifications' && (
              <ul className="space-y-2">
                <li className="flex"><span className="font-semibold w-40">SKU:</span><span>{product.sku}</span></li>
                {/* Aquí podrías mapear un objeto de especificaciones si tu API lo proveyera */}
              </ul>
          )}
          {activeTab === 'reviews' && <Comments />}
        </div>
      </div>
  );
};

// --- COMPONENTE PRINCIPAL DE LA PÁGINA DE PRODUCTO ---

export const ProductPage = () => {
  const { id } = useParams();
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
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getAccessToken()}`
              }
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
    // Opcional: Mostrar una notificación de "Añadido al carrito"
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-lg text-gray-600">Cargando producto...</p>
          </div>
        </div>
    );
  }

  if (!product) {
    return (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Producto no encontrado</h2>
          <p className="text-gray-600">No pudimos cargar los detalles del producto. Inténtalo de nuevo más tarde.</p>
        </div>
    );
  }

  // Creamos un array de imágenes para la galería. En un caso real, tu API debería proveer esto.
  const productImages = product.imageUrl
      ? [product.imageUrl]
      : [];

  return (
      <div className="bg-white">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10">
            {/* Columna de la Galería de Imágenes */}
            <AddToCartNotification productName={product.name} quantity={quantity} isVisible={showNotification}/>
            <div>
              <ImageGallery images={productImages} productName={product.name} />
            </div>

            {/* Columna de Detalles del Producto */}
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">SKU: {product.sku}</p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-1">{product.name}</h1>

              <p className="text-3xl text-gray-900 mt-4 flex flex-col gap-x-2">
                {product.price.toLocaleString("es-MX", { style: "currency", currency: "MXN" })} <span className={"text-xs"}>IVA incluido</span>
              </p>

              <div className="mt-6">
                <h3 className="sr-only">Descripción</h3>
                <div className="text-base text-gray-700 space-y-4">
                  <p>{product.description}</p>
                </div>
              </div>

              <div className="mt-8">
                {/* Selector de cantidad */}
                <div className="flex items-center gap-4">
                  <h4 className="text-sm font-medium text-gray-900">Cantidad</h4>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button onClick={() => handleQuantityChange(-1)} className="px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-l-md transition disabled:opacity-50" disabled={quantity <= 1}>
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-1.5 text-center font-medium">{quantity}</span>
                    <button onClick={() => handleQuantityChange(1)} className="px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-r-md transition">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="mt-6 flex gap-4">
                  <button onClick={handleAddToCart} className="flex-1 bg-red-600 text-white font-semibold py-3 px-6 rounded-md flex items-center justify-center gap-2 hover:bg-red-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <ShoppingCart className="h-5 w-5" />
                    Agregar al carrito
                  </button>
                  {/*<button className="p-3 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100 hover:text-red-500 transition">*/}
                  {/*  <Heart className="h-6 w-6" />*/}
                  {/*  <span className="sr-only">Añadir a favoritos</span>*/}
                  {/*</button>*/}
                </div>
              </div>
            </div>

            {/* Pestañas de información (abarca ambas columnas en vista de tablet/desktop) */}
            <InfoTabs product={product} />
          </div>
        </main>
      </div>
  );
};
