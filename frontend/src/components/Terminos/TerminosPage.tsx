import { useEffect, useRef, useState } from "react";
import { ArrowUp, ChevronDown, FileText } from "lucide-react";
import TerminosSection from "./TerminosSection.tsx";

interface Paragraph {
    id: number;
    title: string;
    content: string;
}

const TerminosPage = () => {
    const contenidoTerminos: Paragraph[] = [
        {
            id: 0,
            title: "TÉRMINOS Y CONDICIONES DE USO DE SISCAD INDUSTRIAL C.A. C.V.",
            content: `**Fecha de última actualización:** 26 de julio de 2025.

Al ingresar y utilizar el sitio web siscadindustrial.cloud, propiedad de SISCAD Industrial C.A. C.V., el Usuario acepta en forma expresa y plena estos Términos y Condiciones, así como las políticas y avisos contenidos en el sitio. El uso del sitio implica la aceptación de las presentes condiciones, en conformidad con las leyes vigentes aplicables.

El Usuario reconoce que estos Términos y Condiciones constituyen un acuerdo vinculante entre él y SISCAD Industrial C.A. C.V., y que cualquier modificación futura será publicada en este mismo apartado.`,
        },
        {
            id: 1,
            title: "1. Condiciones de Uso del Sitio Web",
            content: `Para utilizar el sitio web, el Usuario debe contar con al menos 18 años o actuar bajo la supervisión de un tutor legal. Queda prohibido el uso del sitio para fines ilícitos, fraudulentos o que violen derechos de terceros.

Se concede una licencia no exclusiva, intransferible y revocable para acceder y utilizar la plataforma de acuerdo con estos Términos. Queda prohibido copiar, modificar, distribuir, vender, divulgar o usar el contenido del sitio con fines comerciales sin autorización expresa.

El Usuario será responsable de mantener la confidencialidad de sus datos de acceso. Cualquier actividad realizada con su cuenta será de su exclusiva responsabilidad.

La plataforma puede requerir registro o suscripción para acceder a ciertos servicios. La información proporcionada por el Usuario debe ser veraz y actualizada.

SISCAD Industrial C.A. C.V. podrá bloquear o cancelar cuentas que violen estas condiciones o que tengan un comportamiento fraudulento o abusivo.`,
        },
        {
            id: 2,
            title: "2. Compra y Procesamiento de Productos",
            content: `Las compras se realizan mediante el sistema en línea del sitio. El Usuario podrá seleccionar productos, realizar pagos y coordinar envíos, siempre dentro del territorio de México.

Los precios de los productos incluyen impuestos aplicables, pero los gastos de envío serán calculados y mostrados antes de confirmar la compra.

Los productos están sujetos a disponibilidad en inventario. En caso de agotarse, se informará al Usuario y podrá cancelarse o reprogramarse la venta.

La confirmación de compra llegará por correo electrónico. La entrega será realizada por transportistas autorizados, en un plazo estimado. El Usuario acepta que podrá recibir los productos en la dirección proporcionada, en un horario acordado y en las condiciones del servicio de envío.

El Usuario tiene **5 días naturales desde la recepción** para presentar reclamaciones relacionadas con daños o errores en el envío, acompañadas de **fotos** y **ticket de compra**. De no hacerlo en este plazo, no podrá reclamar.`,
        },
        {
            id: 3,
            title: "3. Garantías, Devoluciones y Reclamos",
            content: `La garantía de los productos será aquella ofrecida por el fabricante, y se detallará en la página del producto.

Para hacer efectiva cualquier reclamación o devolución por defectos o vicios ocultos, el Usuario debe solicitarlo dentro de los **5 días** posteriores a la recepción. La reclamación deberá presentarse con **fotos** del producto y **ticket de compra**.

Las devoluciones por productos defectuosos o entregados en mal estado deberán realizarse en las condiciones originales, con empaques y etiquetado intacto, y mediante la misma vía de envío acordada.

Los reembolsos se realizarán siguiendo el método original de pago, en un plazo no mayor a 15 días hábiles, previa revisión y aceptación del estado del producto devuelto.`,
        },
        {
            id: 4,
            title: "4. Propiedad Intelectual",
            content: `Todo el contenido del sitio, incluyendo textos, imágenes, logotipos, marcas y software, es propiedad de SISCAD Industrial C.A. C.V. o de sus respectivos titulares, y está protegido por leyes nacionales e internacionales de propiedad intelectual.

Se prohíbe la reproducción, distribución, modificación o uso comercial sin autorización expresa.`,
        },
        {
            id: 5,
            title: "5. Responsabilidades del Usuario",
            content: `El Usuario se obliga a usar el sitio y los servicios de forma responsable, sin infringir derechos de terceros, ni realizar actividades ilícitas. Queda prohibido:
- Intentar acceder a datos o sistemas sin autorización.
- Transmitir virus, malware o archivos dañinos.
- Violentar la seguridad del sitio o de terceros.
- Realizar spam, acoso u ofensas.
Cualquier violación puede dar lugar a acciones legales y a la suspensión de la cuenta.`,
        },
        {
            id: 6,
            title: "6. Enlaces a Terceros",
            content: "El sitio puede contener vínculos a páginas externas. SISCAD Industrial C.A. C.V. no se responsabiliza por el contenido, disponibilidad o prácticas de dichas páginas.",
        },
        {
            id: 7,
            title: "7. Material Publicitario y Promociones",
            content: `El sitio podrá contener anuncios, promociones y material publicitario de terceros, que son responsabilidad exclusiva de los anunciantes. SISCAD Industrial C.A. C.V. no se hace responsable por errores, inexactitudes o incumplimientos en ese material.

Las promociones y descuentos tendrán términos y condiciones específicos que serán publicados en cada caso en el sitio. Los cupones de descuento no serán acumulables con otras promociones, salvo indicación expresa.`,
        },
        {
            id: 8,
            title: "8. Disponibilidad y Cancelaciones",
            content: `Los productos ofrecidos están sujetos a disponibilidad en inventario. En caso de agotarse, se informará al Usuario para cancelar o reprogramar la compra.

SISCAD Industrial C.A. C.V. podrá cancelar o rechazar cualquier pedido por errores en el precio, falta de mercancía, sospechas de fraude u otras causas justificadas, sin obligación a indemnizar.`,
        },
        {
            id: 9,
            title: "9. Ley Aplicable y Jurisdicción",
            content:
                "Estos Términos y Condiciones de Uso se interpretarán y regirán por las leyes vigentes en México, renunciando expresamente a la aplicación de la Convención de las Naciones Unidas sobre los Contratos de Compraventa Internacional de Mercaderías, en caso de que sea aplicable.",
        },
        {
            id: 10,
            title: "10. Indemnización",
            content: `El Usuario acepta indemnizar y mantener indemne a SISCAD Industrial C.A. C.V., sus afiliados, proveedores, vendedores y asesores, de cualquier reclamación, acción, demanda o procedimiento que surja por incumplimiento de estos Términos, o por hechos que deriven, entre otros, de:
- El uso del Sitio o los servicios ofrecidos.
- La información contenida o disponible en el Sitio.
- La violación de derechos de autor, marcas, patentes o derechos de propiedad intelectual.
- La violación de leyes, reglamentos o tratados internacionales aplicables.`,
        },
        {
            id: 11,
            title: "11. Disposiciones Finales",
            content: `Si alguna cláusula o disposición de estos Términos es ilegal, inválida o de imposible ejecución en alguna jurisdicción, ello no afectará la validez del resto del contrato, que seguirá siendo válido y vinculante en la medida permitida por la ley.

Estos Términos y Condiciones, junto con el Aviso de Privacidad, constituyen el acuerdo total entre el Usuario y SISCAD Industrial C.A. C.V. en relación con la prestación de servicios y el uso del sitio web, sustituyendo cualquier acuerdo previo, ya sea verbal o escrito.`,
        },
    ];

    const [intro, ...clausulas] = contenidoTerminos;
    const [activeSection, setActiveSection] = useState<number | null>(null);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [mobileIndexOpen, setMobileIndexOpen] = useState(false);
    const mainRef = useRef<HTMLElement>(null);

    /* ------------------------------------------------------------------ */
    /*  IntersectionObserver para resaltar sección activa                */
    /* ------------------------------------------------------------------ */
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = Number(entry.target.getAttribute("data-id"));
                        setActiveSection(id);
                    }
                });
            },
            { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
        );

        const sections = document.querySelectorAll("[data-id]");
        sections.forEach((s) => observer.observe(s));

        return () => observer.disconnect();
    }, []);

    /* ------------------------------------------------------------------ */
    /*  Botón volver arriba                                              */
    /* ------------------------------------------------------------------ */
    useEffect(() => {
        const onScroll = () => setShowBackToTop(window.scrollY > 400);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const scrollToSection = (id: number) => {
        const el = document.getElementById(`seccion-${id}`);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            setMobileIndexOpen(false);
        }
    };

    return (
        <main ref={mainRef} className="bg-slate-50 min-h-screen font-sans scroll-smooth">
            {/* ========================================================= */}
            {/*  Header del documento                                       */}
            {/* ========================================================= */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600">
                            <FileText size={12} />
                            Documento Legal
                        </span>
                        <span className="text-xs text-slate-400">
                            Última actualización: 26 de julio de 2025
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                        Términos y Condiciones de Uso
                    </h1>

                    <div className="max-w-3xl">
                        <p className="text-slate-600 leading-relaxed mb-4">
                            {intro.content.split("\n\n")[0]}
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            {intro.content.split("\n\n")[1]}
                        </p>
                    </div>
                </div>
            </div>

            {/* ========================================================= */}
            {/*  Contenido principal + índice                               */}
            {/* ========================================================= */}
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* ----- Índice ----- */}
                    <aside className="lg:col-span-3">
                        {/* Desktop sticky */}
                        <div className="hidden lg:block sticky top-24">
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-900 mb-4">
                                Contenido
                            </h3>
                            <nav className="space-y-1 border-l border-slate-200">
                                {clausulas.map((c) => (
                                    <button
                                        key={c.id}
                                        onClick={() => scrollToSection(c.id)}
                                        className={`block w-full text-left pl-4 pr-2 py-2 text-sm transition-all duration-200 rounded-r-lg ${
                                            activeSection === c.id
                                                ? "border-l-2 border-primary bg-slate-100 text-slate-900 font-semibold"
                                                : "border-l-2 border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                                        }`}
                                    >
                                        {c.title}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Mobile toggle */}
                        <div className="lg:hidden mb-6">
                            <button
                                onClick={() => setMobileIndexOpen(!mobileIndexOpen)}
                                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-slate-300"
                            >
                                <span>Índice del documento</span>
                                <ChevronDown
                                    size={16}
                                    className={`text-slate-400 transition-transform duration-200 ${
                                        mobileIndexOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>
                            {mobileIndexOpen && (
                                <div className="mt-2 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                    {clausulas.map((c) => (
                                        <button
                                            key={c.id}
                                            onClick={() => scrollToSection(c.id)}
                                            className={`block w-full text-left px-4 py-3 text-sm transition-colors border-b border-slate-100 last:border-0 ${
                                                activeSection === c.id
                                                    ? "bg-slate-50 text-slate-900 font-semibold"
                                                    : "text-slate-600 hover:bg-slate-50"
                                            }`}
                                        >
                                            {c.title}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* ----- Cláusulas ----- */}
                    <div className="lg:col-span-9">
                        {clausulas.map((c) => (
                            <div key={c.id} data-id={c.id}>
                                <TerminosSection
                                    id={c.id}
                                    title={c.title}
                                    content={c.content}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ========================================================= */}
            {/*  Botón volver arriba                                        */}
            {/* ========================================================= */}
            {showBackToTop && (
                <button
                    onClick={scrollToTop}
                    aria-label="Volver arriba"
                    className="fixed bottom-6 right-6 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition-all duration-300 hover:bg-primary hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                    <ArrowUp size={18} />
                </button>
            )}
        </main>
    );
};

export default TerminosPage;
