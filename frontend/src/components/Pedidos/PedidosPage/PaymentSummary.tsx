
interface PaymentSummaryProps {
    summary: {
        subtotal: number;
        shipping: number;
        tax: number;
        total: number;
    }
}

const PaymentSummary = ({ summary } :PaymentSummaryProps) => (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Resumen del pago</h2>
        <div className="space-y-3 text-gray-600">
            <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-gray-800">${summary.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span>Envío</span>
                <span className="font-medium text-gray-800">${summary.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span>IVA (16%)</span>
                <span className="font-medium text-gray-800">${summary.tax.toFixed(2)}</span>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>${summary.total.toFixed(2)}</span>
            </div>
        </div>
    </div>
);

export default PaymentSummary;