import {AppDispatch, Product} from "../../../store/store.ts"
import {useEffect, useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import {getAccessToken} from "../../../store/auth.ts";
import { useDispatch } from 'react-redux';
import {addToCart} from "../../../store/cartSlice.ts";

const apiUrl = import.meta.env.VITE_API_URL;

interface QuoteItem {
    id: number;
    product: Product;
    quantity: number;
}

/** Define la estructura completa de una cotización. */
interface Quote {
    id: string;
    quoteNumber: string;
    nombre: string;
    correo: string;
    items: QuoteItem[];
    createdAt: string;
    updatedAt: string;
}


const formatCurrency = (amount: number) => {
    return amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
};

/** NUEVO: Componente de esqueleto para mostrar durante la carga. */
const LoadingSkeleton = () => (
    <div className="max-w-4xl mx-auto animate-pulse">
        {/* Skeleton para la cabecera */}
        <div className="mb-6">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Skeleton para la lista de productos */}
            <div className="lg:col-span-2 bg-gray-200 rounded-lg h-96"></div>
            {/* Skeleton para la barra lateral */}
            <div className="lg:col-span-1 space-y-8">
                <div className="bg-gray-200 rounded-lg h-24"></div>
                <div className="bg-gray-200 rounded-lg h-48"></div>
            </div>
        </div>
    </div>
);

/** Componente para mostrar un solo producto en la lista de detalles. */
const ProductDetailRow = ({ item }: { item: QuoteItem }) => (
    <div className="flex items-center gap-4 py-4">
        <img
            src={item.product.imageUrl}
            alt={item.product.name}
            className="h-20 w-20 object-contain bg-white rounded-md border border-gray-200 p-1"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/80x80/e2e8f0/e2e8f0?text='; }}
        />
        <div className="flex-grow">
            <p className="font-semibold text-gray-800">{item.product.name}</p>
            <p className="text-sm text-gray-500">SKU: {item.product.sku}</p>
            <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
        </div>
        <div className="text-right font-semibold text-gray-800">
            {formatCurrency(item.product.price * item.quantity)}
        </div>
    </div>
);



const QuotePage = () => {
    const [quote, setQuote] = useState<Quote>();
    const {id} = useParams();

    const dispatch: AppDispatch = useDispatch();

    const shopAgain = () => {
        quote?.items?.forEach((item) => {
            dispatch(addToCart({
                producto: item.product,
                quantity: item.quantity,
            }));
        })
    }

    useEffect(() => {
        async function loadQuote(){
            try{
                const quoteRequest = await axios.get(`${apiUrl}/rest/api/1/quotes/${id}`, {
                    headers: {
                        Authorization: `Bearer ${getAccessToken()}`
                    }
                })
                const quoteData : Quote = quoteRequest.data
                setQuote(quoteData)
            }catch{
                //console.log(`Failed to load quote: ${id}`)
            }
        }

        loadQuote().catch()
    }, [id])

    // --- Cálculos para el resumen ---
     // Valor de ejemplo para el envío

    const subtotal  = useMemo(() => {
        // console.log("Calculando subtotal..."); // Para demostrar que solo se ejecuta cuando es necesario
        if(quote){
            return (quote.items.length > 0)? quote.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0): 0;
        }
        return 0;
    }, [quote]);

    const shippingCost = useMemo(()=>{
        if(subtotal < 0){
            return 0
        }
        return subtotal > 200? 0 : 220;
    }, [subtotal]);

    const total = useMemo(()=> {
        return subtotal + shippingCost;
    }, [subtotal, shippingCost]);

    return (
        (quote)?<div className="bg-gray-50 min-h-screen p-4 sm:p-6 md:p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* --- Cabecera de la página --- */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Detalles de la Cotización <span className="text-red-600">{quote.quoteNumber}</span>
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Realizada el: {new Date(quote.createdAt).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {/* --- Contenido principal (dos columnas) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* --- Columna Izquierda: Lista de Productos --- */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                            <div className="p-4 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Productos en esta cotización ({quote.items.length})
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-200 px-4">
                                {quote.items.map(item => (
                                    <ProductDetailRow key={item.id} item={item} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* --- Columna Derecha: Resumen del Pago --- */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                            <div className="p-4 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Resumen de la cotización
                                </h2>
                            </div>
                            <div className="p-4 space-y-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Envío (estimado)</span>
                                    <span>{formatCurrency(shippingCost)}</span>
                                </div>
                                <hr className="my-2"/>
                                <div className="flex justify-between font-bold text-xl text-gray-900">
                                    <span>Total</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50/75 rounded-b-lg">
                                <button className="w-full px-5 py-3 text-sm font-semibold text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors" onClick={shopAgain}>
                                    Agregar al carrito
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> : <LoadingSkeleton />
    );
};

export default QuotePage;