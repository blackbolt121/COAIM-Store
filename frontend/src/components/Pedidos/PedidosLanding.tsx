import {useState, useMemo, useEffect} from "react";
import {Search, ChevronDown} from 'lucide-react'
import {Pedido} from "../../store/store.ts"
import PedidoCard, {PedidoCardDetail} from "./PedidosCard.tsx";
import {Package} from "lucide-react"
import {getAccessToken} from "../../store/auth.ts";
const apiUrl = import.meta.env.VITE_API_URL


const transformStatus = (status : string) => {

    switch (status) {
        case "EN_PROCESO":
            return "En proceso"
        case "ENTREGADO":
            return "Entregado"
        case "CANCELADO":
            return "Cancelado"
        case "ENVIADO":
            return "Enviado"
        default:
            return "Cancelado"
    }
}


function PedidosLanding() {


    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [pedidos, setPedidos] = useState<Pedido[]>([]);


    useEffect(() => {
        //console.log(`${apiUrl}/rest/api/1/pedidos`)
        fetch(`${apiUrl}/rest/api/1/pedidos`, {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
            }
        })
            .then(res => res.json())
            .then(res => setPedidos(res.content)).catch(err => console.log(err));
    }, [setPedidos])

    // useEffect(()=>{
    //     console.log("Pedidos")
    //     console.log(pedidos);
    // }, [pedidos]);


    // Lógica para filtrar los pedidos
    const pedidosFiltrados = useMemo(() => {

        if(!pedidos) {
            return [];
        }

        return pedidos.filter(pedido => {
            const searchMatch = searchTerm === '' ||
                `MX-${1000+pedido.id}`.includes(searchTerm.toLowerCase()) ||
                pedido.pedidoDetails.some(p => p.producto.name.toLowerCase().includes(searchTerm.toLowerCase()));

            const statusMatch = statusFilter === 'Todos' || pedido.pedidoStatus === statusFilter;

            return searchMatch && statusMatch;
        });
    }, [searchTerm, statusFilter, pedidos]);

    return (
        // Este contenedor simula el área de contenido principal de tu página
        <div className="bg-gray-50 min-h-screen font-sans">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Título de la sección */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Historial de Pedidos</h1>
                    <div className="mt-2 h-1.5 w-24 bg-red-600 rounded-full"></div>
                </div>

                {/* Barra de filtros y búsqueda */}
                <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-1/2 lg:w-1/3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por ID de pedido o producto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                    </div>
                    <div className="relative w-full md:w-auto">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none w-full md:w-48 bg-white border border-gray-300 text-gray-700 py-2 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500"
                        >
                            <option>Todos</option>
                            <option>Entregado</option>
                            <option>En proceso</option>
                            <option>Cancelado</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <ChevronDown size={20} />
                        </div>
                    </div>
                </div>

                {/* Lista de pedidos */}
                <div className="space-y-6">
                    {pedidosFiltrados.length > 0 ? (
                        pedidosFiltrados
                            .map(pedido => {

                                const transform : PedidoCardDetail = {
                                    "id": `${pedido.id}`,
                                    "fecha": pedido.createdAt? pedido.createdAt : "2024-12-31",
                                    "estado": transformStatus(pedido.pedidoStatus),
                                    "total": pedido.total,
                                    "productos": pedido.pedidoDetails.map(item => {
                                        return {
                                            "producto": item.producto,
                                            "quantity": item.quantity
                                        }
                                    }),
                                }
                                return transform
                            })
                            .map(pedido => (
                                <PedidoCard key={pedido.id} pedido={pedido} />
                                // <div>{JSON.stringify(pedido)}</div>
                        ))
                    ) : (
                        <div className="text-center py-16 px-4 bg-white rounded-lg shadow-sm border border-gray-200">
                            <Package size={48} className="mx-auto text-gray-400" />
                            <h3 className="mt-4 text-xl font-semibold text-gray-800">No se encontraron pedidos</h3>
                            <p className="mt-2 text-gray-500">Prueba a cambiar los filtros o el término de búsqueda.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default PedidosLanding;