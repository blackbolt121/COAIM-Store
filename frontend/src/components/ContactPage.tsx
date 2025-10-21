// Asegúrate de tener react-icons instalado: npm install react-icons
import { FaEnvelope, FaPhone, FaWhatsapp, FaMapMarkerAlt, FaTicketAlt } from 'react-icons/fa';

// Este es el componente principal para tu página de contacto.
// Puedes importarlo y usarlo en tu sistema de rutas.
export default function ContactPage() {
    return (
        <div className="bg-gray-50 font-sans">
            <div className="container mx-auto px-4 py-16">

                {/* --- Título de la Página --- */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Ponte en Contacto</h1>
                    <p className="text-lg text-gray-600 mt-4">
                        Estamos aquí para ayudarte. Elige tu método de contacto preferido o visita una de nuestras sucursales.
                    </p>
                </div>

                {/* --- Sección Principal: Opciones de Contacto y Mapa --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 rounded-xl shadow-lg">

                    {/* Columna Izquierda: Opciones de Contacto Directo */}
                    <div className="flex flex-col justify-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Contacto Directo</h2>
                        <p className="text-gray-600 mb-8">
                            Para una atención más rápida y especializada, por favor utiliza uno de los siguientes canales:
                        </p>
                        <div className="space-y-6">
                            {/* Opción 1: Soporte Jira */}
                            <div>
                                <a
                                    href="https://rubeemmanuelngarciaordaz.atlassian.net/jira/software/c/form/5e9e4b9d-658c-4545-8f93-24596df593b2" // <-- CAMBIA ESTE ENLACE
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-lg transition-colors text-lg"
                                >
                                    <FaTicketAlt className="mr-3" />
                                    Crear Ticket de Soporte
                                </a>
                                <p className="text-sm text-gray-500 mt-2 text-center">
                                    Ideal para garantías, facturación y seguimiento de incidentes.
                                </p>
                            </div>
                            {/* Opción 2: WhatsApp */}
                            <div>
                                <a
                                    href="https://wa.me/524422711285?text=Hola,%20necesito%20ayuda." // <-- CAMBIA ESTE ENLACE
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center text-center bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-4 rounded-lg transition-colors text-lg"
                                >
                                    <FaWhatsapp className="mr-3" />
                                    Contactar por WhatsApp
                                </a>
                                <p className="text-sm text-gray-500 mt-2 text-center">
                                    Perfecto para cotizaciones, ventas y consultas rápidas.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha: Mapa */}
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Encuéntranos</h2>
                        <div className="w-full h-full min-h-[300px] rounded-lg overflow-hidden shadow-md">
                            {/* Embed de Google Maps. Reemplaza el `src` con el de tu negocio. */}
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3736.369157165001!2d-100.46115682403918!3d20.53207130465124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d34f738802b755%3A0x7081f40636c94721!2sSuferre%20del%20Bajio!5e0!3m2!1ses!2smx!4v1754244899683!5m2!1ses!2smx"
                                width="600"
                                height="450"
                                className="border-0 w-full"
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"></iframe>
                        </div>
                    </div>
                </div>

                {/* --- Sección de Sucursales --- */}
                <div className="mt-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Nuestras Sucursales</h2>
                        <p className="text-lg text-gray-600 mt-2">Visítanos en la ubicación más cercana a ti.</p>
                    </div>

                    {/* Aquí está el código que me proporcionaste, con la mejora responsiva */}
                    {/*<div className= 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 text-black'>*/}
                    <div className= 'flex items-center justify-center flex-col lg:flex-row text-black'>
                        {/* Sucursal 1: Querétaro */}
                        <div className="text-center flex flex-col items-center p-4">
                            <FaMapMarkerAlt className="text-red-600 text-3xl mb-3" />
                            <h3 className="font-bold text-lg mb-2">Querétaro (Balvanera)</h3>
                            <p className="text-sm text-gray-600 mb-3">Fraccionamiento Lomas de Balvanera 5A, Balvanera, 76908 El Pueblito, Qro.</p>
                            <a href="mailto:suferredlbajio@gmail.com" className="flex items-center text-sm text-gray-700 hover:text-red-600 mb-1">
                                <FaEnvelope className="mr-2 text-amber-500" /> suferredlbajio@gmail.com
                            </a>
                            <a href="tel:4421955434" className="flex items-center text-sm text-gray-700 hover:text-red-600 mb-1">
                                <FaPhone className="mr-2" /> TEL: 442 195 54 34 EXT:1500
                            </a>
                            <a href="https://wa.me/4776769031" target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-gray-700 hover:text-red-600">
                                <FaWhatsapp className="mr-2 text-green-500" /> WhatsApp
                            </a>
                        </div>

                        {/* Sucursal 2: Santa Rosa Jauregui */}
                        <div className="text-center flex flex-col items-center p-4">
                            <FaMapMarkerAlt className="text-red-600 text-3xl mb-3" />
                            <h3 className="font-bold text-lg mb-2">Querétaro (Santa Rosa)</h3>
                            <p className="text-sm text-gray-600 mb-3">Prolongación Independencia #84 En Santa Rosa Jauregui.</p>
                            <a href="mailto:ventascoaimsa@gmail.com" className="flex items-center text-sm text-gray-700 hover:text-red-600 mb-1">
                                <FaEnvelope className="mr-2 text-amber-500" /> ventascoaimsa@gmail.com
                            </a>
                            <a href="https://wa.me/4461390550" target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-gray-700 hover:text-red-600">
                                <FaWhatsapp className="mr-2 text-green-500" /> WhatsApp
                            </a>
                        </div>

                        {/* Sucursal 3: León */}
                        {/*<div className="text-center flex flex-col items-center p-4">*/}
                        {/*    <FaMapMarkerAlt className="text-red-600 text-3xl mb-3" />*/}
                        {/*    <h3 className="font-bold text-lg mb-2">León, Gto.</h3>*/}
                        {/*    <p className="text-sm text-gray-600 mb-3">Blvd Fco Villa 1104 Entre Fco Marin y Rio Mayo, Col. Santo Domingo. C.P. 7557</p>*/}
                        {/*    <a href="https://wa.me/4432540653" target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-gray-700 hover:text-red-600">*/}
                        {/*        <FaWhatsapp className="mr-2 text-green-500" /> WhatsApp*/}
                        {/*    </a>*/}
                        {/*</div>*/}

                        {/*/!* Sucursal 4: Morelia *!/*/}
                        {/*<div className="text-center flex flex-col items-center p-4">*/}
                        {/*    <FaMapMarkerAlt className="text-red-600 text-3xl mb-3" />*/}
                        {/*    <h3 className="font-bold text-lg mb-2">Morelia, Mich.</h3>*/}
                        {/*    <p className="text-sm text-gray-600 mb-3">Manuel Muñiz No. 377 A Col. Juarez, Morelia, C.P. 58010</p>*/}
                        {/*    <a href="https://wa.me/4461390547" target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-gray-700 hover:text-red-600">*/}
                        {/*        <FaWhatsapp className="mr-2 text-green-500" /> WhatsApp*/}
                        {/*    </a>*/}
                        {/*</div>*/}
                    </div>
                </div>

            </div>
        </div>
    );
}
