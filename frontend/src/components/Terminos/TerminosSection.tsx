import React from 'react';

// Tailwind CSS debe estar configurado en tu proyecto para que estos estilos funcionen.
// Si no lo tienes, puedes instalarlo o reemplazar las clases con tu propio CSS.

// --- ARCHIVO 1: El contenido que vas a modificar ---
// Puedes mover esto a su propio archivo, por ejemplo: /data/contenidoTerminos.js


// --- ARCHIVO 2: Componente reutilizable para cada sección ---
// Puedes moverlo a: /components/SeccionTerminos.js

// Función para procesar el texto y convertir **texto** a <strong>
const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part: string, index: number) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        // Para manejar saltos de línea y listas
        return part.split('\n').map((line, lineIndex) => (
            <React.Fragment key={`${index}-${lineIndex}`}>
                {line.startsWith('- ') ? <ul><li className="ml-5 list-disc">{line.slice(2)}</li></ul> : line}
                {lineIndex < part.split('\n').length - 1 && <br />}
            </React.Fragment>
        ));
    });
};


export interface SeccionTerminosProps {
    id: number;
    title: string;
    content: string;
    isFirst: boolean;
}

const SeccionTerminos = ({ id, title, content, isFirst } : SeccionTerminosProps) => {
    // Estilo condicional para el título principal
    const titleClass = isFirst
        ? "text-3xl md:text-4xl font-bold text-gray-800 mb-4"
        : "text-2xl md:text-3xl font-semibold text-gray-800 mt-8 mb-4 pb-2 border-b-2 border-red-600";

    return (
        <section key={`terminos-${id}`}>
            <h2 className={titleClass}>{title}</h2>
            <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                {formatText(content)}
            </div>
        </section>
    );
};

export default SeccionTerminos