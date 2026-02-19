// import { Typography, IconButton } from '@mui/joy';
// import { Link } from "react-router-dom"
// import { FaFacebook, FaInstagram, FaEnvelope, FaWhatsapp, FaPhone } from 'react-icons/fa';
// import { FaXTwitter } from "react-icons/fa6";
import {ReactNode} from "react";
import logo from "../assets/logo.png"
import {Link} from "react-router-dom";




interface FooterLinkProps {
    href: string,
    children: string
}

interface SocialLinkProps {
    href: string,
    children: ReactNode,
    ariaLabel: string,
}
const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 20l-4.95-6.05a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);

const EnvelopeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2.003 5.884L10 11.884l7.997-6M2 18h16V5l-8 5-8-5v13z" />
    </svg>
);

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01s-.521.074-.794.372c-.272.296-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
);

// --- Componentes Reutilizables ---

// Componente para un enlace del footer
const FooterLink = ({ href, children }: FooterLinkProps) => {
    return <li>
        <Link to={href} onClick={()=>{
            //console.log(href);
        }} className="text-white hover:text-gray-200 hover:underline transition-colors duration-300">
            {children}
        </Link>
    </li>
};

// Componente para un icono de red social
const SocialIcon = ({ href, children, ariaLabel }: SocialLinkProps) => (
    <a
        href={href}
        aria-label={ariaLabel}
        className="text-white hover:gray-100 transform hover:scale-110 transition-transform duration-300"
        target="_blank"
        rel="noopener noreferrer"
    >
        {children}
    </a>
);

// --- Componente Principal ---
const Footer = () => {
    // Define tus colores aquí para fácil personalización
    const colors = {
        background: "bg-[#0069DF]",
        text: "text-white",
        title: "text-white",
        border: "border-blue-400",
    };

    return (
        <footer className={`${colors.background} ${colors.text} font-sans`}>
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Columna 1: Marca y Redes Sociales */}
                    <div className="space-y-4">
                        {/* Puedes reemplazar esto con tu logo SVG o un <img> */}
                        <img alt={"MercadoUrrea.com.mx"} src={logo}/>
                        <p className="text-sm">
                            Tu proveedor de confianza en herramientas y soluciones industriales.
                        </p>
                        <div className="flex space-x-4">
                            <SocialIcon href="#" ariaLabel="Facebook">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                            </SocialIcon>
                            <SocialIcon href="#" ariaLabel="Instagram">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm6.406-11.845a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z" clipRule="evenodd" /></svg>
                            </SocialIcon>
                        </div>
                    </div>

                    {/* Columna 2: Tienda */}
                    <div>
                        <h3 className={`text-sm font-semibold ${colors.title} tracking-wider uppercase border-b-2 ${colors.border} pb-2 mb-4`}>Tienda</h3>
                        <ul className="space-y-3">
                            <FooterLink href="/">Home</FooterLink>
                            <FooterLink href="/about">Acerca</FooterLink>
                            <FooterLink href="/contact">Contacto</FooterLink>
                            <FooterLink href="/tienda">Tienda</FooterLink>
                        </ul>
                    </div>

                    {/* Columna 3: Ayuda */}
                    <div>
                        <h3 className={`text-sm font-semibold ${colors.title} tracking-wider uppercase border-b-2 ${colors.border} pb-2 mb-4`}>Ayuda</h3>
                        <ul className="space-y-3">
                            <FooterLink href="/contact">Contacto</FooterLink>
                            <FooterLink href="/terminos_y_condiciones">Terminos y Condiciones</FooterLink>
                            {/*<FooterLink href="#">Aviso de Privacidad</FooterLink>*/}
                            {/*<FooterLink href="/contact">Contacto</FooterLink>*/}
                        </ul>
                    </div>

                    {/* Columna 4: Sucursales */}
                    <div>
                        <h3 className={`text-sm font-semibold ${colors.title} tracking-wider uppercase border-b-2 ${colors.border} pb-2 mb-4`}>Sucursales</h3>
                        <div className="space-y-5">

                            <div className="location-item">
                                <p className="font-semibold text-white">Querétaro (El Pueblito)</p>
                                <div className="mt-2 space-y-2 text-sm">
                                    <p className="flex items-start"><MapPinIcon /><span>Fracc. Lomas de Balvanera 5A, Balvanera, 76900</span></p>
                                    <a href="mailto:suferred@gmail.com" className="flex items-center text-white hover:text-gray-200 transition-colors duration-300"><EnvelopeIcon /><span>suferred@gmail.com</span></a>
                                    <a href="https://api.whatsapp.com/send/?phone=%2B524422711285&text&type=phone_number&app_absent=0" className="flex items-center text-white hover:text-gray-200 transition-colors duration-300"><WhatsAppIcon /><span>WhatsApp</span></a>
                                </div>
                            </div>

                            <div className="location-item">
                                <p className="font-semibold text-white">Querétaro (Santa Rosa)</p>
                                <div className="mt-2 space-y-2 text-sm">
                                    <p className="flex items-start"><MapPinIcon /><span>Prolongación Independencia #84 En Santa Rosa Jauregui.</span></p>
                                    <a href="mailto:ventascoaimsa@gmail.com" className="flex items-center text-white hover:text-gray-200 transition-colors duration-300"><EnvelopeIcon /><span>ventascoaimsa@gmail.com</span></a>
                                    <a href="https://api.whatsapp.com/send/?phone=4461390550&text&type=phone_number&app_absent=0" className="flex items-center text-gray-200 hover:text-white transition-colors duration-300"><WhatsAppIcon /><span>WhatsApp</span></a>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            {/* Barra Inferior de Copyright */}
            <div className="bg-blue-900 bg-opacity-75 mt-8 py-4 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center text-xs text-white">
                    &copy; {new Date().getFullYear()} COAIM DEL BAJIO. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
/*
export const Footer = () => {
    return (
        <footer className="bg-white text-white py-8 px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="">
                <div className='flex flex-row justify-around'>
                    <div>
                        <Link to="/" className="mb-4">
                            <img
                                src={logo}
                                alt="Logo de la tienda"
                                className="h-16"
                            />
                        </Link>
                    </div>

                    <div className="flex gap-2   space-x-4 mb-4 ">
                        <IconButton href="https://www.facebook.com/profile.php?id=100094409316272&mibextid=ZbWKwL" target="_blank" color="primary">
                            <FaFacebook className='text-2xl text-black' />
                        </IconButton>
                        <IconButton href="https://twitter.com/i/flow/login?redirect_after_login=%2FCoaimB" target="_blank" color="primary">
                            <FaXTwitter className='text-black text-2xl' />
                        </IconButton>
                        <IconButton href="https://www.instagram.com/coaimindustria/?igshid=MzRlODBiNWFlZA%3D%3D" target="_blank" color="primary">
                            <FaInstagram className='text-2xl text-black' />
                        </IconButton>
                    </div>

                </div>

                <div className='grid grid-cols-4 text-black items-baseline mt-4'>
                    <Typography level="body-sm" className="text-left mb-1" sx={{ color: "black", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", "textAlign": "center" }}>
                        Fraccionamiento Lomas de Balvanera 5A, Balvanera, 76908 El Pueblito, Qro
                        <Link to="mailto:suferredlbajio@gmail.com" className="flex items-center">
                            <FaEnvelope className="mr-2 text-amber-500" />
                            suferredlbajio@gmail.com
                        </Link>
                        <Link to="tel:4421955434" className="flex items-center">
                            <FaPhone className="mr-2" />
                            TEL: 442 195 54 34 EXT:1500
                        </Link>
                        <Link to="https://wa.me/4776769031" target="_blank" className="flex items-center">
                            <FaWhatsapp className="mr-2 text-green-500" />
                            WhatsApp
                        </Link>
                    </Typography>

                    <Typography level="body-sm" className="text-left mb-1" sx={{ color: "black", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", "textAlign": "center" }}>
                        Prolongación Independencia #84 En Santa Rosa Jauregui
                        <Link to="mailto:ventascoaimsa@gmail.com" className="flex items-center">
                            <FaEnvelope className="mr-2 text-amber-500" />
                            ventascoaimsa@gmail.com
                        </Link>
                        <Link to="https://wa.me/4461390550" target="_blank" className="flex items-center">
                            <FaWhatsapp className="mr-2 text-green-500" />
                            WhatsApp
                        </Link>
                    </Typography>

                    <Typography level="body-sm" className="text-left mb-1" sx={{ color: "black", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", "textAlign": "center" }}>
                        Blvd Fco Villa 1104 Entre Fco Marin y Rio Mayo,Col. Santo Domingo. C.P. 7557   Leon, Gto
                        <Link to="https://wa.me/4432540653" target="_blank" className="flex items-center">
                            <FaWhatsapp className="mr-2 text-green-500" />
                            WhatsApp
                        </Link>
                    </Typography>

                    <Typography level="body-sm" className="text-left mb-1" sx={{ color: "black", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", "textAlign": "center" }}>
                        Manuel Muñiz No. 377 A Col. Juarez, Morelia, Morelia, Michoacán de Ocampo C.P. 58010
                        <Link to="https://wa.me/4461390547" target="_blank" className="flex items-center">
                            <FaWhatsapp className="mr-2 text-green-500" />
                            WhatsApp
                        </Link>
                    </Typography>
                </div>

                <div className="flex flex-col items-center space-y-2">



                </div>
            </div>
        </footer>
    );
};

*/