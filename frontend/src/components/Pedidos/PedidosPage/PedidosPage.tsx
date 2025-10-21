import {useEffect, useState} from 'react';
import PaymentSummary from './PaymentSummary';
import PedidosProductList from "./PedidosProductList.tsx";
import OrderStatus from './OrderStatus';
import {Product} from "../../../store/store.ts";
import {Link, useParams} from "react-router-dom";
import {getAccessToken} from "../../../store/auth.ts";
import PedidosBadge from "../PedidosBadge.tsx";

// --- DATOS DE EJEMPLO ---
// En una aplicación real, estos datos vendrían de una API.

interface PedidoDetail {
    id: {
        pedidoId: string,
        productoId: string
    },
    producto: Product,
    quantity: number,
    static_price: number
}

interface Pedido {
    id: number,
    guia: string,
    pedidoStatus: string,
    pedidoDetails: PedidoDetail[]
    total: number;
    createdAt: string,
    updatedAt: string
}

const apiUrl = import.meta.env.VITE_API_URL;

const translateStatus = (status: string) => {
    switch (status) {
        case "EN_PROCESO":
            return "En proceso";
        case "ENVIADO":
            return "Enviado";
        case "ENTREGADO":
            return "Entregado";
        case "CANCELADO":
            return "Cancelado"
        default:
            return "En proceso"
    }
}

// --- COMPONENTE PRINCIPAL DE LA APLICACIÓN ---
export default function PedidosPage() {

    const { id } = useParams();

    const [order, setOrder] = useState<Pedido>();

    useEffect(() => {
        fetch(`${apiUrl}/rest/api/1/pedidos/${id}`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${getAccessToken()}`,
            }
        })
            .then(res => res.json())
            .then(res => setOrder(res))
            .catch(err => console.error(err));

    }, [id]);

    // useEffect(() => {
    //     //console.log(order)
    // }, [order]);

    return  (!order)?   <div>Cargando pedido...</div> :
        <div className="bg-gray-50 min-h-screen">
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="mb-8">
                    <Link to={"/pedidos"} className="text-blue-600 hover:text-blue-800 font-medium">&larr; Volver al Historial de Pedidos</Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
                        Detalles del Pedido <span className="text-red-600">{`MX-${order.id}`}</span>
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Realizado el {order.createdAt} &bull; <PedidosBadge key={order.id} estado={translateStatus(order.pedidoStatus)}/>
                        {/*<span className="font-semibold text-blue-600">{translateStatus(order.pedidoStatus)}</span>*/}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna Principal */}
                    <div className="lg:col-span-2 space-y-8">
                        <PedidosProductList products={order.pedidoDetails} />
                        <PaymentSummary summary={{
                            shipping: 500,
                            tax: order.pedidoDetails.reduce((previousValue: number, currentValue: PedidoDetail)=> previousValue + currentValue.static_price, 0) * 0.16,
                            subtotal: order.pedidoDetails.reduce((previousValue: number, currentValue: PedidoDetail)=> previousValue + currentValue.static_price, 0),
                            total: order.pedidoDetails.reduce((previousValue: number, currentValue: PedidoDetail)=> previousValue + currentValue.static_price, 0) * 1.16 + 500
                        }} />
                    </div>

                    {/* Columna Lateral */}
                    <div className="space-y-8">
                        <OrderStatus status={translateStatus(order.pedidoStatus)} trackingNumber={order.guia} />
                        {/*<AdditionalDetails shippingAddress={order.shippingAddress} paymentMethod={order.paymentMethod} />*/}
                    </div>
                </div>
            </main>
        </div>
}
