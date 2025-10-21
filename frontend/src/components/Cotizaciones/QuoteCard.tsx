// --- Componente para la Tarjeta de Cotización Individual ---
import {Link} from "react-router-dom";
import {AppDispatch} from "../../store/store.ts";
import {useDispatch} from "react-redux";
import {addToCart} from "../../store/cartSlice.ts";

export interface Product {
    id: string;
    name: string;
    sku: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
}

/** Define la estructura de un ítem dentro de una cotización. */
export interface QuoteItem {
    id: number;
    product: Product;
    quantity: number;
}

/** Define la estructura completa de una cotización. */
export interface Quote {
    id: string;
    //quoteNumber: string; // Un número de cotización más amigable para el usuario.
    nombre: string;
    correo: string;
    items: QuoteItem[];
    createdAt: string;
    updatedAt: string;
}

function generateQuoteNumberFromUUID(uuid: string) {
    // 1. Toma los últimos 6 caracteres del string del UUID.
    // 2. Los convierte a mayúsculas para un formato consistente.
    const shortId = uuid.slice(-6).toUpperCase();

    // 3. Le agregas un prefijo para mayor claridad.
    return `QT-${shortId}`;
}

const ProductPreview = ({ items }: { items: QuoteItem[] }) => {
    if (!items || items.length === 0) return null;

    const firstItemImage = items[0].product.imageUrl;
    const remainingItemsCount = items.length - 1;

    return (
        <div className="flex items-center -space-x-4">
            <img
                src={firstItemImage}
                alt={items[0].product.name}
                className="h-16 w-16 rounded-full border-2 border-white object-contain bg-white shadow-sm z-10"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/64x64/e2e8f0/e2e8f0?text='; }}
            />
            {remainingItemsCount > 0 && (
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg border-2 border-white">
                    +{remainingItemsCount}
                </div>
            )}
        </div>
    );
};

const QuoteCard = ({ quote }: { quote: Quote }) => {
    // Función para calcular el total de la cotización.
    const total = quote.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);


    const dispatch: AppDispatch = useDispatch();

    const shopAgain = () => {
        quote.items.forEach((item) => {
            dispatch(addToCart({
                producto: item.product,
                quantity: item.quantity,
            }));
        })
    }

    // Función para formatear fechas.
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("es-MX", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const featuredItems = quote.items.slice(0, 2);

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6 overflow-hidden">
            {/* Cabecera de la Tarjeta */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
                <div>
                    <h3 className="font-bold text-lg text-gray-800">Cotización #{generateQuoteNumberFromUUID(quote.id)}</h3>
                    <p className="text-sm text-gray-500">Realizada el {formatDate(quote.createdAt)}</p>
                </div>
            </div>

            {/* Contenido Principal */}
            <div className="flex flex-col md:flex-row gap-6 p-4">
                <div className="flex-shrink-0">
                    <ProductPreview items={quote.items} />
                </div>
                <div className="flex-grow">
                    <h4 className="font-semibold text-gray-700">Productos destacados:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                        {featuredItems.map(item => (
                            <li key={item.id}>
                                {item.product.name} <span className="text-gray-500">(x{item.quantity})</span>
                            </li>
                        ))}
                        {quote.items.length > 2 && (
                            <li className="text-gray-500 font-medium">y {quote.items.length - 2} más...</li>
                        )}
                    </ul>
                </div>
            </div>

            {/* Pie de la Tarjeta */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-gray-50/75 rounded-b-lg">
                <div>
                    <span className="text-gray-600">Total estimado:</span>
                    <span className="font-bold text-xl text-gray-900 ml-2">
            {total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
          </span>
                </div>
                <div className="flex gap-3">
                    <Link
                        to={`/cotizacion/${quote.id}`}
                        //onClick={() => console.log(`Viendo detalles de la cotización ${generateQuoteNumberFromUUID(quote.id)}`)}
                        className="px-5 py-2 text-sm font-semibold text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
                    >
                        Ver Detalles
                    </Link>
                    <button
                        onClick={shopAgain}
                        className="px-5 py-2 text-sm font-semibold text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                        Añadir al carrito
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuoteCard;
