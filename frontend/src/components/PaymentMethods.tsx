import React from 'react';
import amex from "../assets/amex.svg"
import visa from "../assets/visa.svg"

// --- SVG Icon for MasterCard ---
// MasterCard will remain as an SVG component.
const MasterCardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="40" viewBox="0 0 38 24" fill="none">
        <circle cx="15" cy="12" r="7" fill="#EB001B"/>
        <circle cx="23" cy="12" r="7" fill="#F79E1B"/>
        <path d="M20 12a7.004 7.004 0 01-5 6.708A7.004 7.004 0 0020 12z" fill="#FF5F00"/>
    </svg>
);


// --- Payment Method Card Component ---
// This component represents a single payment option card.
// It can now render either an SVG or an <img> tag.
interface PaymentCardInterface {
    icon: React.ReactNode,
    name: string;
}
const PaymentCard = ({ icon, name } : PaymentCardInterface) => {
    return (
        <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-center h-16 w-full">
                {icon}
            </div>
            <p className="mt-4 text-sm font-semibold tracking-wide text-slate-600">{name}</p>
        </div>
    );
};


// --- Main Payment Section Component ---
// This is the main component that you can export and use in your application.
export default function PaymentMethodsSection() {
    // The paymentMethods array now uses <img> tags for Visa and Amex.
    // **ACTION REQUIRED**: Replace the placeholder URLs in the `src` attributes with your actual image URLs.
    const paymentMethods = [
        {
            name: 'Visa',
            icon: <img
                src={visa}
                alt="Logo de Visa"
                className="h-10 object-contain"
            />
        },
        {
            name: 'MasterCard',
            icon: <MasterCardIcon />
        },
        {
            name: 'American Express',
            icon: <img
                src={amex}
                alt="Logo de American Express"
                className="h-10 object-contain"
            />
        },
    ];

    return (
        <div className="bg-slate-50 py-16 flex items-center justify-center font-sans">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black text-slate-900 sm:text-4xl lg:text-5xl tracking-tight mb-5">
                        Métodos de Pago Aceptados
                    </h2>
                    <div className="w-24 h-1 bg-primary mx-auto mb-5 rounded-full"></div>
                    <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto">Trabajamos con las plataformas de pago más seguras del mundo.</p>
                </div>

                {/* Grid container for payment cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paymentMethods.map((method) => (
                        <PaymentCard key={method.name} icon={method.icon} name={method.name} />
                    ))}
                </div>
            </div>
        </div>
    );
}
