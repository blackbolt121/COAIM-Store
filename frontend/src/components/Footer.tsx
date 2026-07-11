import { Link } from "react-router-dom";
import {
    MapPin,
    Mail,
    Phone,
    MessageCircle,
    Facebook,
    Instagram,
    Truck,
    ShieldCheck,
    ChevronRight,
} from "lucide-react";
import logo from "../assets/siscadindustrial-recortado.svg";

/* ------------------------------------------------------------------ */
/*  Tipos auxiliares                                                    */
/* ------------------------------------------------------------------ */

interface FooterLinkProps {
    to: string;
    children: React.ReactNode;
}

interface SocialLinkProps {
    href: string;
    icon: React.ReactNode;
    label: string;
}

interface LocationProps {
    title: string;
    address: string;
    email: string;
    phone?: string;
    whatsapp?: string;
}

/* ------------------------------------------------------------------ */
/*  Componentes atómicos                                              */
/* ------------------------------------------------------------------ */

const FooterLink = ({ to, children }: FooterLinkProps) => (
    <li>
        <Link
            to={to}
            className="group inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors duration-200"
        >
            <ChevronRight
                size={12}
                className="text-slate-600 group-hover:text-primary transition-colors duration-200"
            />
            {children}
        </Link>
    </li>
);

const SocialLink = ({ href, icon, label }: SocialLinkProps) => (
    <a
        href={href}
        aria-label={label}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-primary hover:text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
    >
        {icon}
    </a>
);

const LocationBlock = ({ title, address, email, phone, whatsapp }: LocationProps) => (
    <div className="space-y-3">
        <p className="text-sm font-semibold text-white tracking-wide">{title}</p>
        <div className="space-y-2">
            <p className="flex items-start gap-2 text-sm text-slate-400 leading-relaxed">
                <MapPin size={14} className="shrink-0 mt-0.5 text-slate-500" />
                <span>{address}</span>
            </p>
            <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary transition-colors duration-200"
            >
                <Mail size={14} className="shrink-0 text-slate-500" />
                <span>{email}</span>
            </a>
            {phone && (
                <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary transition-colors duration-200"
                >
                    <Phone size={14} className="shrink-0 text-slate-500" />
                    <span>{phone}</span>
                </a>
            )}
            {whatsapp && (
                <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary transition-colors duration-200"
                >
                    <MessageCircle size={14} className="shrink-0 text-slate-500" />
                    <span>WhatsApp</span>
                </a>
            )}
        </div>
    </div>
);

/* ------------------------------------------------------------------ */
/*  Componente principal                                              */
/* ------------------------------------------------------------------ */

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-950 border-t border-slate-800 font-sans">
            {/* ========================================================= */}
            {/*  Sección principal                                          */}
            {/* ========================================================= */}
            <div className="max-w-7xl mx-auto py-14 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

                    {/* ----- Columna 1: Marca (4 cols) ----- */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link to="/" className="inline-block rounded-2xl bg-white p-4 shadow-sm">
                            <img
                                src={logo}
                                alt="Siscad Industrial"
                                className="h-10 w-auto"
                            />
                        </Link>

                        <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                            Distribuidora industrial especializada en herramientas,
                            automatización, seguridad industrial y suministros para
                            operación continua.
                        </p>

                        <div className="flex items-center gap-3 pt-1">
                            <SocialLink
                                href="https://www.facebook.com/profile.php?id=100094409316272"
                                label="Visita nuestro Facebook"
                                icon={<Facebook size={18} />}
                            />
                            <SocialLink
                                href="https://www.instagram.com/coaimindustria/"
                                label="Visita nuestro Instagram"
                                icon={<Instagram size={18} />}
                            />
                        </div>
                    </div>

                    {/* ----- Columna 2: Navegación (2 cols) ----- */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-4">
                            Navegación
                        </h3>
                        <ul className="space-y-3">
                            <FooterLink to="/">Inicio</FooterLink>
                            <FooterLink to="/tienda">Catálogo</FooterLink>
                            <FooterLink to="/about">Nosotros</FooterLink>
                            <FooterLink to="/contact">Contacto</FooterLink>
                        </ul>
                    </div>

                    {/* ----- Columna 3: Legal (2 cols) ----- */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-4">
                            Legal
                        </h3>
                        <ul className="space-y-3">
                            <FooterLink to="/terminos_y_condiciones">
                                Términos y condiciones
                            </FooterLink>
                            <FooterLink to="/contact">
                                Política de privacidad
                            </FooterLink>
                            <li>
                                <a
                                    href="mailto:suferred@gmail.com"
                                    className="group inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors duration-200"
                                >
                                    <ChevronRight
                                        size={12}
                                        className="text-slate-600 group-hover:text-primary transition-colors duration-200"
                                    />
                                    Soporte
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* ----- Columna 4: Sucursales (4 cols) ----- */}
                    <div className="lg:col-span-4 space-y-6">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-4">
                            Sucursales
                        </h3>

                        <LocationBlock
                            title="Querétaro (El Pueblito)"
                            address="Fracc. Lomas de Balvanera 5A, Balvanera, 76900"
                            email="suferred@gmail.com"
                            whatsapp="https://api.whatsapp.com/send/?phone=%2B524422711285&text&type=phone_number&app_absent=0"
                        />

                        <div className="h-px bg-slate-800" />

                        {/* <LocationBlock
                            title="Querétaro (Santa Rosa Jáuregui)"
                            address="Prolongación Independencia #84, Santa Rosa Jáuregui"
                            email="ventascoaimsa@gmail.com"
                            whatsapp="https://api.whatsapp.com/send/?phone=4461390550&text&type=phone_number&app_absent=0"
                        /> */}
                    </div>
                </div>
            </div>

            {/* ========================================================= */}
            {/*  Barra de confianza (Trust badges)                        */}
            {/* ========================================================= */}
            <div className="border-t border-slate-800/60 bg-slate-900/30">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                        <div className="flex items-center gap-4">
                            <div className="h-11 w-11 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                                <Phone size={18} className="text-primary" />
                            </div>
                            <div>
                                <p className="text-[11px] text-slate-500 uppercase tracking-[0.15em] font-semibold leading-tight">
                                    Atención B2B / B2C
                                </p>
                                <p className="text-sm text-white font-medium mt-0.5">
                                    442 195 54 34 EXT:1500
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="h-11 w-11 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                                <Truck size={18} className="text-primary" />
                            </div>
                            <div>
                                <p className="text-[11px] text-slate-500 uppercase tracking-[0.15em] font-semibold leading-tight">
                                    Envíos a todo México
                                </p>
                                <p className="text-sm text-white font-medium mt-0.5">
                                    Cotización en 24h
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="h-11 w-11 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                                <ShieldCheck size={18} className="text-primary" />
                            </div>
                            <div>
                                <p className="text-[11px] text-slate-500 uppercase tracking-[0.15em] font-semibold leading-tight">
                                    +10,000 productos
                                </p>
                                <p className="text-sm text-white font-medium mt-0.5">
                                    Marcas industriales certificadas
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ========================================================= */}
            {/*  Barra inferior — Copyright                                 */}
            {/* ========================================================= */}
            <div className="border-t border-slate-800 bg-black">
                <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <p className="text-xs text-slate-500">
                        &copy; {currentYear} SISCAD Industrial C.A. C.V.. Todos los derechos reservados.
                    </p>
                    <p className="text-xs text-slate-600 tracking-wide">
                        Siscad Industrial
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
