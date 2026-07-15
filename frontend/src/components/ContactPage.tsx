import {
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaClock,
  FaHeadset,
  FaTruck,
  FaIndustry,
  FaArrowRight,
} from "react-icons/fa";
import { useEffect } from "react";
import { setSeo } from "../lib/seo";

interface ContactMethodProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
  variant: "primary" | "whatsapp" | "outline";
  external?: boolean;
}

const ContactMethod = ({
  href,
  icon,
  title,
  description,
  cta,
  variant,
  external = true,
}: ContactMethodProps) => {
  const baseClasses =
    "group flex flex-col items-start p-6 rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1";

  const variantClasses = {
    primary:
      "bg-primary text-white border-primary hover:bg-red-700 hover:border-red-700",
    whatsapp:
      "bg-white text-gray-900 border-gray-200 hover:border-green-600 hover:shadow-green-900/10",
    outline:
      "bg-white text-gray-900 border-gray-200 hover:border-primary hover:shadow-red-900/5",
  };

  const ctaClasses = {
    primary: "text-white",
    whatsapp: "text-green-700 group-hover:text-green-800",
    outline: "text-primary group-hover:text-red-700",
  };

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      <div
        className={`mb-4 text-2xl ${
          variant === "primary" ? "text-white" : "text-primary"
        }`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p
        className={`text-sm mb-4 leading-relaxed ${
          variant === "primary" ? "text-white/90" : "text-gray-600"
        }`}
      >
        {description}
      </p>
      <span
        className={`inline-flex items-center text-sm font-semibold mt-auto ${ctaClasses[variant]}`}
      >
        {cta}
        <FaArrowRight className="ml-2 text-xs transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </a>
  );
};

interface BranchCardProps {
  name: string;
  address: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  whatsappLabel?: string;
}

const BranchCard = ({
  name,
  address,
  email,
  phone,
  whatsapp,
  whatsappLabel = "WhatsApp",
}: BranchCardProps) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <FaMapMarkerAlt className="text-primary text-lg" />
      </div>
      <h3 className="font-bold text-gray-900">{name}</h3>
    </div>

    <p className="text-sm text-gray-600 leading-relaxed mb-4">{address}</p>

    <div className="space-y-2.5">
      {email && (
        <a
          href={`mailto:${email}`}
          className="flex items-center text-sm text-gray-700 hover:text-primary transition-colors duration-200"
        >
          <FaEnvelope className="mr-2.5 text-amber-500 shrink-0" />
          <span className="truncate">{email}</span>
        </a>
      )}
      {phone && (
        <a
          href={`tel:${phone.replace(/\s/g, "")}`}
          className="flex items-center text-sm text-gray-700 hover:text-primary transition-colors duration-200"
        >
          <FaPhone className="mr-2.5 text-primary/70 shrink-0" />
          <span>{phone}</span>
        </a>
      )}
      {whatsapp && (
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm text-gray-700 hover:text-green-700 transition-colors duration-200"
        >
          <FaWhatsapp className="mr-2.5 text-green-600 shrink-0" />
          <span>{whatsappLabel}</span>
        </a>
      )}
    </div>
  </div>
);

export default function ContactPage() {
  useEffect(() => {
    setSeo({
      title: 'Contacto SISCAD Industrial | Cotizaciones y Atención B2B',
      description: 'Contacta a SISCAD Industrial para cotizaciones, asesoría técnica y atención comercial en herramientas, automatización, seguridad industrial, maquinaria e instrumentación.',
      canonicalPath: '/contact',
      image: '/siscadindustrial-recortado.svg',
      jsonLdId: 'product-jsonld',
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* --- Hero --- */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-gray-50 via-white to-red-50/30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-red-50/20 to-transparent pointer-events-none" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-6">
              <FaHeadset className="text-sm" />
              Atención especializada
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
              Ponte en contacto con nosotros
            </h1>

            <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mb-8">
              ¿Necesitas una cotización, asesoría técnica o seguimiento de pedido?
              Nuestro equipo está listo para atenderte por el canal que prefieras.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
                <FaIndustry className="text-primary" />
                <span className="font-medium">Atención B2B / B2C</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
                <FaTruck className="text-primary" />
                <span className="font-medium">Envíos a todo México</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
                <FaClock className="text-primary" />
                <span className="font-medium">Respuesta rápida</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Métodos de Contacto --- */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ContactMethod
            href="https://wa.me/524422711285?text=Hola,%20necesito%20ayuda."
            icon={<FaWhatsapp className="text-green-600" />}
            title="WhatsApp Ventas"
            description="Cotizaciones, disponibilidad de stock, precios y asesoría de productos en minutos."
            cta="Iniciar chat"
            variant="whatsapp"
          />

          <ContactMethod
            href="https://rubeemmanuelngarciaordaz.atlassian.net/jira/software/c/form/5e9e4b9d-658c-4545-8f93-24596df593b2"
            icon={<FaTicketAlt />}
            title="Ticket de Soporte"
            description="Garantías, facturación, devoluciones y seguimiento formal de incidentes."
            cta="Crear ticket"
            variant="primary"
          />

          <ContactMethod
            href="tel:4421955434"
            icon={<FaPhone />}
            title="Llamada Directa"
            description="Habla con un asesor. Ext. 1500 para atención inmediata en sucursal Balvanera."
            cta="Llamar ahora"
            variant="outline"
            external={false}
          />
        </div>
      </section>

      {/* --- Mapa + Sucursales --- */}
      <section className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Mapa */}
            <div className="lg:col-span-3">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FaMapMarkerAlt className="text-primary text-lg" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Encuéntranos
                </h2>
              </div>

              <div className="w-full h-80 md:h-96 rounded-xl overflow-hidden border border-gray-200 shadow-md bg-gray-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3736.369157165001!2d-100.46115682403918!3d20.53207130465124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d34f738802b755%3A0x7081f40636c94721!2sSuferre%20del%20Bajio!5e0!3m2!1ses!2smx!4v1754244899683!5m2!1ses!2smx"
                  width="100%"
                  height="100%"
                  className="border-0"
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación SISCAD - Balvanera"
                />
              </div>

              <p className="text-sm text-gray-500 mt-4 flex items-start gap-2">
                <FaMapMarkerAlt className="text-primary mt-0.5 shrink-0" />
                Sucursal principal referenciada en el mapa: Fraccionamiento
                Lomas de Balvanera 5A, Balvanera, 76908 El Pueblito, Qro.
              </p>
            </div>

            {/* Lista rápida de sucursales (sidebar) */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Nuestras sucursales
              </h2>
              <div className="space-y-4">
                <div className="p-5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:shadow-md hover:border-primary/20 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <FaMapMarkerAlt className="text-primary" />
                    <h3 className="font-bold text-gray-900 text-sm">
                      Querétaro (Balvanera)
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Fraccionamiento Lomas de Balvanera 5A, Balvanera, 76908 El
                    Pueblito, Qro.
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                    <a
                      href="mailto:suferredlbajio@gmail.com"
                      className="text-gray-700 hover:text-primary transition-colors"
                    >
                      <FaEnvelope className="inline mr-1.5 text-amber-500" />
                      Email
                    </a>
                    <a
                      href="tel:4421955434"
                      className="text-gray-700 hover:text-primary transition-colors"
                    >
                      <FaPhone className="inline mr-1.5 text-primary/70" />
                      442 195 5434
                    </a>
                    <a
                      href="https://wa.me/4776769031"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-green-700 transition-colors"
                    >
                      <FaWhatsapp className="inline mr-1.5 text-green-600" />
                      WhatsApp
                    </a>
                  </div>
                </div>

                <div className="p-5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:shadow-md hover:border-primary/20 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <FaMapMarkerAlt className="text-primary" />
                    <h3 className="font-bold text-gray-900 text-sm">
                      Querétaro (Santa Rosa)
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Prolongación Independencia #84, Santa Rosa Jauregui, Qro.
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                    <a
                      href="mailto:ventascoaimsa@gmail.com"
                      className="text-gray-700 hover:text-primary transition-colors"
                    >
                      <FaEnvelope className="inline mr-1.5 text-amber-500" />
                      Email
                    </a>
                    <a
                      href="https://wa.me/4461390550"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-green-700 transition-colors"
                    >
                      <FaWhatsapp className="inline mr-1.5 text-green-600" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Grid completo de Sucursales (cards premium) --- */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Visítanos en nuestras sucursales
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Atención personalizada, mostrador de productos y asesoría técnica
            presencial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <BranchCard
            name="Querétaro — Balvanera"
            address="Fraccionamiento Lomas de Balvanera 5A, Balvanera, 76908 El Pueblito, Qro."
            email="suferredlbajio@gmail.com"
            phone="442 195 5434 EXT: 1500"
            whatsapp="4776769031"
            whatsappLabel="WhatsApp Ventas"
          />

          <BranchCard
            name="Querétaro — Santa Rosa Jauregui"
            address="Prolongación Independencia #84, Santa Rosa Jauregui, Qro."
            email="ventascoaimsa@gmail.com"
            whatsapp="4461390550"
            whatsappLabel="WhatsApp Ventas"
          />
        </div>
      </section>
    </div>
  );
}
