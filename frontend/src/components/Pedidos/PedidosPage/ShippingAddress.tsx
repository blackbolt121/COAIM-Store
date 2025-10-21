// Componente: Detalles de envío y facturación
interface AdditonalDetailsProps {
    shippingAddress: {
        name: string;
        line1: string;
        line2: string;
        zip: string;
    },
    paymentMethod: {
        type: string;
        last4: string;
    }
}


const AdditionalDetails = ({ shippingAddress, paymentMethod } : AdditonalDetailsProps) => (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Detalles Adicionales</h2>
        <div className="space-y-4">
            <div>
                <h3 className="font-semibold text-gray-700">Dirección de Envío</h3>
                <address className="not-italic text-gray-600 text-sm mt-1">
                    {shippingAddress.name}<br />
                    {shippingAddress.line1}<br />
                    {shippingAddress.line2}<br />
                    {shippingAddress.zip}
                </address>
            </div>
            <div>
                <h3 className="font-semibold text-gray-700">Método de Pago</h3>
                <p className="text-gray-600 text-sm mt-1">{paymentMethod.type} terminación **** {paymentMethod.last4}</p>
            </div>
            <div>
                <button className="w-full mt-4 text-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Descargar Factura (PDF)
                </button>
            </div>
        </div>
    </div>
);

export default AdditionalDetails;