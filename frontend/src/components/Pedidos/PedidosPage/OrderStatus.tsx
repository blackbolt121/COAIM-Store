import {useState} from 'react';


interface OrderStatusProps {
    status: string;
    trackingNumber: string;
}


const OrderStatus = ({ status, trackingNumber } : OrderStatusProps) => {
    const [copied, setCopied] = useState<boolean>(false);

    const timelineSteps = ['En proceso', 'Enviado', 'Entregado'];
    const statusIcons: Record<string, string> = { 'En proceso': '📦', 'Enviado': '🚚', 'Entregado': '✅' };

    const isCancelled = status === 'Cancelado';
    const currentStatusIndex = timelineSteps.indexOf(status);

    const handleCopy = () => {
        navigator.clipboard.writeText(trackingNumber).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // El mensaje "Copiado" desaparece después de 2 segundos
        });
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Estado del Pedido {status}</h2>
            <ul>
                {timelineSteps.map((stepName, index) => {
                    const isLastStep = index === timelineSteps.length - 1;

                    let stepState = 'pending'; // pending, current, completed
                    if (index < currentStatusIndex) {
                        stepState = 'completed';
                    } else if (index === currentStatusIndex) {
                        stepState = 'current';
                    }

                    let dotClass, lineClass, textClass;

                    if (isCancelled) {
                        dotClass = 'bg-red-500 border-red-500';
                        lineClass = 'bg-red-500';
                        textClass = 'text-red-500';
                    } else {
                        switch (stepState) {
                            case 'completed':
                                dotClass = 'bg-green-600 border-green-600';
                                lineClass = 'bg-green-600';
                                textClass = 'text-gray-800';
                                break;
                            case 'current':
                                dotClass = 'bg-blue-600 border-blue-600';
                                lineClass = 'bg-gray-200';
                                textClass = 'text-gray-800';
                                break;
                            default: // pending
                                dotClass = 'bg-gray-200 border-gray-200';
                                lineClass = 'bg-gray-200';
                                textClass = 'text-gray-400';
                        }
                    }

                    return (
                        <li key={stepName} className={`relative pl-10 ${isLastStep ? '' : 'pb-8'}`}>
                            {!isLastStep && (
                                <div className={`absolute left-[6.5px] top-5 -bottom-3 w-[3px] ${lineClass}`}></div>
                            )}
                            <div className={`absolute left-0 top-1 h-4 w-4 rounded-full border-2 ${dotClass}`}></div>
                            <p className={`font-semibold ${textClass}`}>
                                <span className="mr-2">{isCancelled ? '❌' : statusIcons[stepName]}</span>
                                {stepName}
                            </p>
                        </li>
                    );
                })}
            </ul>

            {/* Sección de Guía de Envío */}
            {trackingNumber && !isCancelled && (
                <div className="mt-6 pt-4 border-t">
                    <h3 className="font-semibold text-gray-700 mb-2">Guía de Envío</h3>
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                        <span className="font-mono text-gray-800">{trackingNumber}</span>
                        <button onClick={handleCopy} className="text-gray-500 hover:text-blue-600">
                            {copied ? (
                                <span className="text-sm font-semibold text-green-600">¡Copiado!</span>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Mensaje de Estado Final */}
            {(isCancelled || status === 'Entregado') && (
                <div className={`mt-6 p-3 rounded-md text-center ${isCancelled ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    <p className="font-semibold">
                        {isCancelled ? 'El pedido fue cancelado.' : 'El pedido fue entregado.'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default OrderStatus;
