import React from "react";
import {Product} from "../../../store/store.ts"


interface PedidoDetail {
    id: {
        pedidoId: string,
        productoId: string
    },
    producto: Product,
    quantity: number,
    static_price: number
}

interface PedidosProductListProps {
    products: PedidoDetail[];
}

const PedidosProductList = ( {products} : PedidosProductListProps) => (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Productos en este pedido ({products.length})</h2>
        <div className="space-y-6">
            {products.map((product, index) => (
                <React.Fragment key={product.producto.id}>
                    <div className="flex items-start space-x-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-md flex-shrink-0">
                            <img src={product.producto.imageUrl} alt={product.producto.name} className="w-full h-full object-cover rounded-md" />
                        </div>
                        <div className="flex-grow">
                            <h3 className="font-semibold text-gray-800">{product.producto.name}</h3>
                            <p className="text-sm text-gray-500">SKU: {product.producto.sku}</p>
                            <p className="text-sm text-gray-500">Cantidad: {product.quantity}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-gray-800">${product.static_price.toFixed(2)}</p>
                        </div>
                    </div>
                    {index < products.length - 1 && <hr />}
                </React.Fragment>
            ))}
        </div>
    </div>
);

export default PedidosProductList;