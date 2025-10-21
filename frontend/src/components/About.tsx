// You can use an icon library like 'lucide-react' for the checkmarks
// To install: npm install lucide-react
// Or you can use a simple SVG or even text like •
import { CheckCircle2 } from 'lucide-react';

// A small component for section titles to keep the code clean
interface SectionTitleProps {
    children: React.ReactNode;
}
const SectionTitle = ({ children } : SectionTitleProps) => (
    <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4 border-b-2 border-red-600 pb-2">
        {children}
    </h3>
);

export default function About() {
    // Data for the values list
    const values = [
        { name: 'Honestidad', description: 'Actuamos con transparencia e integridad en todas nuestras interacciones.' },
        { name: 'Compromiso', description: 'Nos dedicamos por completo a cumplir las promesas que hacemos a nuestros clientes y colaboradores.' },
        { name: 'Calidad', description: 'Buscamos la excelencia en todo lo que hacemos, desde nuestros productos hasta nuestro servicio.' },
        { name: 'Trabajo en Equipo', description: 'Fomentamos la colaboración y el apoyo mutuo para alcanzar nuestros objetivos comunes.' },
        { name: 'Pasión por el Servicio', description: 'La satisfacción de nuestros clientes es el motor que nos impulsa cada día.' },
        { name: 'Innovación', description: 'Estamos en una búsqueda constante de nuevas y mejores maneras de hacer las cosas.' },
    ];

    return (
        // Main container to center the content on the page
        <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto">

                {/* The main content card */}
                <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">

                    <h2 className="text-center text-4xl font-extrabold text-gray-900 mb-8">
                        Acerca de Nosotros
                    </h2>

                    {/* --- Quiénes Somos Section --- */}
                    <section>
                        <SectionTitle>Quiénes Somos</SectionTitle>
                        <p className="text-gray-700 leading-relaxed">
                            Somos una empresa orientada a establecer relaciones sólidas, integrales y personalizadas con nuestros clientes, manteniendo la honestidad y la transparencia como eje primordial de nuestra compañía, con un servicio excepcional, capacitados para aplicar una gestión estratégica que permita adaptarse a las dinámicas del mercado y las necesidades de los clientes.                        </p>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            Convertirnos en un aliado clave para nuestros clientes, brindando a base de transparencia y honestidad soluciones prácticas que fomenten el bienestar y contribuyan al progreso social y económico.
                        </p>
                    </section>

                    {/* --- Nuestra Filosofía Section --- */}
                    <section>
                        <SectionTitle>Nuestra Filosofía</SectionTitle>
                        <div className="grid md:grid-cols-2 gap-8 mt-4">
                            <div>
                                <h4 className="text-xl font-semibold text-gray-800">Misión</h4>
                                <p className="text-gray-700 leading-relaxed mt-2">
                                    Comercializar y distribuir <strong>productos ferreteros</strong> de la más alta calidad, respaldados por un servicio al cliente excepcional y un equipo de profesionales altamente capacitado, con el fin de satisfacer y superar las expectativas de nuestros clientes.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold text-gray-800">Visión</h4>
                                <p className="text-gray-700 leading-relaxed mt-2">
                                    Consolidarnos como la empresa líder en la industria ferretera a nivel nacional, siendo el referente de calidad, innovación y excelencia en el servicio. Aspiramos a construir relaciones duraderas y de confianza con nuestros clientes y a expandir nuestra presencia en todo el país, impulsados por la mejora continua y un crecimiento sólido y sostenible que beneficie a nuestra comunidad y asegure nuestra rentabilidad.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* --- Nuestros Valores Section --- */}
                    <section>
                        <SectionTitle>Nuestros Valores</SectionTitle>
                        <ul className="space-y-4 mt-4">
                            {values.map((value) => (
                                <li key={value.name} className="flex items-start">
                                    <CheckCircle2 className="h-6 w-6 text-red-600 mr-3 flex-shrink-0 mt-1" />
                                    <div>
                                        <strong className="font-semibold text-gray-800">{value.name}:</strong>
                                        <span className="text-gray-700 ml-2">{value.description}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* --- Política de Calidad Section --- */}
                    <section>
                        <SectionTitle>Política de Calidad</SectionTitle>
                        <p className="text-gray-700 leading-relaxed bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                            En <strong>Suferre</strong>, estamos firmemente comprometidos con cumplir y exceder los requerimientos de nuestros clientes. Aseguramos la calidad de nuestros <strong>productos</strong> y la excelencia en el servicio a través de la mejora continua de nuestros procesos y nuestro Sistema de Gestión de Calidad.
                        </p>
                    </section>

                    {/* --- Footer Section --- */}
                    <div className="text-center mt-12 pt-8 border-t border-gray-200">
                        <p className="text-sm text-gray-500 mb-4">Powered by</p>
                        <a href="https://coaim.com.mx" target="_blank" rel="noopener noreferrer" className="inline-block">
                            {/* Coloca la ruta a tu logo en el atributo src */}
                            {/* Por ejemplo: src="/logos/coaim-logo.png" */}
                            <img
                                src="https://res.cloudinary.com/dv0hzntey/image/upload/v1754237277/descarga-removebg-preview_scozrn.png"
                                alt="Logo de COAIM"
                                className="h-20 mx-auto hover:opacity-80 transition-opacity" // Puedes ajustar la altura (h-10) según lo necesites
                            />
                        </a>
                    </div>

                </div>
            </div>
        </div>
    );
}

