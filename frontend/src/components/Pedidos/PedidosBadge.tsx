// Componente para mostrar un badge de estado con color e icono
import { CheckCircle, Truck, XCircle } from 'lucide-react';

export interface StatusBadgeProps {
    estado: "Entregado" | "En proceso" | "Cancelado" | "Enviado"
}

const StatusBadge = ({ estado } : StatusBadgeProps) => {
    const statusInfo = {
        'Entregado': { icon: <CheckCircle size={16} className="text-green-600" />, text: 'text-green-700', bg: 'bg-green-100' },
        'En proceso': { icon: <Truck size={16} className="text-blue-600" />, text: 'text-blue-700', bg: 'bg-blue-100' },
        'Enviado': {icon: <Truck size={16} className="text-yellow-600" />, text: 'text-yellow-700', bg: 'bg-yellow-100' },
        'Cancelado': { icon: <XCircle size={16} className="text-red-600" />, text: 'text-red-700', bg: 'bg-red-100' },
    };

    const { icon, text, bg } = statusInfo[estado] || {};

    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${bg} ${text}`}>
            {icon}
            <span>{estado}</span>
        </div>
    );
};

export default StatusBadge;