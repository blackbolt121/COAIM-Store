import {Quote} from "./QuoteCard.tsx";
import QuoteCard from "./QuoteCard.tsx";
import {useEffect, useState} from "react";
import {Package} from "lucide-react";
import axios from "axios";
import {getAccessToken} from "../../store/auth.ts";
const apiUrl = import.meta.env.VITE_API_URL;
// -----------------------------------------------------------------------------
// 2. DATOS DE EJEMPLO (MOCK DATA)
// Simulamos la respuesta que recibirías de tu API /rest/api/1/quotes.
// Se ha eliminado el campo 'status' de los datos.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// 3. COMPONENTES DE REACT
// Dividimos la UI en piezas reutilizables para un código más limpio.
// -----------------------------------------------------------------------------

// --- Componente para la Vista Previa de Productos ---



// --- Componente Principal de la Página ---
// Este es el componente que exportarás y usarás en tu aplicación.
const CotizacionLanding = () => {
    // En un caso real, aquí harías el fetch a tu API.
    // const [quotes, setQuotes] = useState<Quote[]>([]);
    // const [loading, setLoading] = useState(true);
    // useEffect(() => {
    //   fetch('/rest/api/1/quotes')
    //     .then(res => res.json())
    //     .then(data => {
    //       setQuotes(data);
    //       setLoading(false);
    //     });
    // }, []);
    // if (loading) return <p>Cargando cotizaciones...</p>;

    const [quotes, setQuotes] = useState<Quote[]>([]);

    useEffect(() => {
        async function loadQuotes () {
            try {
                const cotizacionesRequest = await axios.get(`${apiUrl}/rest/api/1/quotes`, {
                    headers: {
                        "Authorization": `Bearer ${getAccessToken()}`
                    }
                })
                const cotizaciones: Quote[] = cotizacionesRequest.data;
                setQuotes(cotizaciones)
            }catch {
                console.log("No se puedo obtener las cotizaciones del usuario")
            }
        }

        loadQuotes().catch(error => console.log(error));
    }, []);

    return (
        <div className="bg-gray-50 p-4 sm:p-6 md:p-8 min-h-screen font-sans">
            <div className="max-w-5xl mx-auto">

                {/* Título de la Página */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 inline-block">Historial de Cotizaciones</h1>
                    <div className="h-1 bg-red-600 w-24 mt-1 rounded"></div>
                </div>

                {/* Barra de Búsqueda y Filtros */}
                <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-grow w-full">
                        <svg className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Buscar por ID de cotización o producto..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Lista de Cotizaciones */}
                <div>
                    {(quotes.length > 0)? quotes.map((quote: Quote) => (
                        <QuoteCard key={quote.id} quote={quote} />
                    )) : (
                        <div className="text-center py-16 px-4 bg-white rounded-lg shadow-sm border border-gray-200">
                            <Package size={48} className="mx-auto text-gray-400" />
                            <h3 className="mt-4 text-xl font-semibold text-gray-800">No se encontraron pedidos</h3>
                            <p className="mt-2 text-gray-500">Prueba a cambiar los filtros o solicitar una Cotización con un agente de ventas.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default CotizacionLanding
