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
        <div className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <div className="flex items-center justify-center h-16 w-full">
                {icon}
            </div>
            <p className="mt-4 text-sm font-medium text-gray-600">{name}</p>
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
        <div className="bg-white py-10 flex items-center justify-center font-sans">
            <div className="w-full max-w-4xl mx-auto p-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl tracking-tight mb-5">
                        Métodos de Pago Aceptados
                    </h2>
                    <div className="w-50 h-1 bg-red-600 mx-auto mb-5"></div>
                    <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">Trabajamos con las plataformas de pago más seguras del mundo.</p>
                </div>

                {/* Grid container for payment cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {paymentMethods.map((method) => (
                        <PaymentCard key={method.name} icon={method.icon} name={method.name} />
                    ))}
                </div>
            </div>
        </div>
    );
}