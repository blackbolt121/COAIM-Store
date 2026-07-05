import { BadgeCheck, Factory, Gauge, Goal, Lightbulb, ListChecks, MapPin, Phone, ShieldCheck, Target, Truck, Users, Wrench } from 'lucide-react';
import logo from "../assets/siscadindustrial-recortado.svg"
const values = [
  { name: 'Honestidad', description: 'Transparencia en cada interacción, pedido y cotización.' },
  { name: 'Compromiso', description: 'Respuesta seria y consistente para clientes y proyectos industriales.' },
  { name: 'Calidad', description: 'Productos y procesos pensados para operación continua.' },
  { name: 'Trabajo en Equipo', description: 'Coordinación ágil para resolver necesidades con precisión.' },
  { name: 'Servicio', description: 'Atención clara, profesional y enfocada en la compra real.' },
  { name: 'Innovación', description: 'Mejora continua para una experiencia más eficiente y moderna.' },
];

const capabilities = [
  { title: 'Herramientas', description: 'Manuales, eléctricas y de alto desempeño.', icon: Wrench },
  { title: 'Automatización', description: 'Control, sensores y productividad.', icon: Gauge },
  { title: 'Seguridad industrial', description: 'EPP y protección para operación segura.', icon: ShieldCheck },
  { title: 'Maquinaria', description: 'Equipos, refacciones y consumibles.', icon: Factory },
  { title: 'Instrumentación', description: 'Medición y control confiables.', icon: Target },
  { title: 'Suministros', description: 'Consumibles para operación continua.', icon: Truck },
];

const stats = [
  { label: 'Atención', value: 'B2B / B2C', icon: Users },
  { label: 'Enfoque', value: 'Industria', icon: Factory },
  { label: 'Compromiso', value: 'Calidad', icon: ShieldCheck },
];

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-primary">
      <div className="h-px w-6 bg-primary" />
      {children}
    </div>
  );
}

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero oscuro con acentos sutiles */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="absolute -top-20 right-0 h-96 w-96 rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute -bottom-20 left-0 h-64 w-64 rounded-full bg-white/[0.03] blur-[80px]" />

        <div className="relative mx-auto max-w-screen-2xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <span className="mb-6 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 backdrop-blur-sm">
              SISCAD Distribuidora Industrial
            </span>
            <h1 className="text-4xl font-black leading-[1.1] text-white sm:text-5xl lg:text-6xl">
              Una distribuidora industrial seria, confiable y enfocada en tu operación.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
              Herramientas, automatización, refacciones, componentes industriales, seguridad, maquinaria e instrumentación con una experiencia comercial clara, eficiente y profesional.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {stats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-xl font-black text-white">{value}</div>
                    <div className="text-sm text-slate-400">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filosofía: Misión y Visión */}
      <section className="mx-auto max-w-screen-2xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-14 text-center">
          <SectionEyebrow>Nuestra filosofía</SectionEyebrow>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Misión y visión alineadas a la industria
          </h2>
        </div>
        <br />
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Misión */}
          <div className="relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 bg-slate-950 px-6 py-4 text-white">
              <Goal className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-[0.2em]">Misión</span>
            </div>
            <div className="p-8 lg:p-10">
              <h3 className="text-2xl font-black text-slate-900">Satisfacer y superar expectativas</h3>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Comercializar y distribuir productos industriales de la más alta calidad, respaldados por un servicio al cliente excepcional y un equipo de profesionales altamente capacitado, con el fin de satisfacer y superar las expectativas de nuestros clientes.
              </p>
            </div>
          </div>

          {/* Visión */}
          <div className="relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 bg-primary px-6 py-4 text-white">
              <Lightbulb className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-[0.2em]">Visión</span>
            </div>
            <div className="p-8 lg:p-10">
              <h3 className="text-2xl font-black text-slate-900">Ser referente industrial</h3>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Consolidarnos como la empresa líder en la industria ferretera a nivel nacional, siendo el referente de calidad, innovación y excelencia en el servicio. Aspiramos a construir relaciones duraderas y de confianza con nuestros clientes y a expandir nuestra presencia en todo el país.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Perfil de empresa */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-screen-2xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mb-12 text-center">
            <SectionEyebrow>Perfil de empresa</SectionEyebrow>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Soporte comercial para compra industrial
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-slate-600">
              Un negocio pensado para acompañar a empresas y profesionales con un catálogo técnico, atención clara y una experiencia confiable desde la primera consulta hasta la entrega.
            </p>
          </div>

          <div className="mx-auto max-w-4xl space-y-4">
            {[
              { label: 'Quiénes somos', text: 'Una empresa orientada a establecer relaciones sólidas, integrales y personalizadas con nuestros clientes, con honestidad y transparencia como base.' },
              { label: 'Qué buscamos', text: 'Ser un aliado clave para nuestros clientes, brindando soluciones prácticas que fomenten el bienestar y contribuyan al progreso.' },
              { label: 'Cómo operamos', text: 'Con un servicio excepcional, capacitados para aplicar una gestión estratégica que se adapte a las dinámicas del mercado.' },
              { label: 'Nuestro valor', text: 'El punto de encuentro entre la industria y los productos que necesita, con precisión, rapidez y respaldo comercial real.' },
            ].map(({ label, text }) => (
              <div key={label} className="flex items-start gap-4 rounded-[1.25rem] border border-slate-200 p-6">
                <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h4 className="text-base font-bold text-slate-900">{label}</h4>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {[
              'Atención ágil para empresas y profesionales',
              'Catálogo pensado para compra y cotización',
              'Marca industrial con enfoque técnico',
              'Experiencia confiable y directa',
            ].map((item) => (
              <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-700">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Capacidades */}
      <section className="mx-auto max-w-screen-2xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-12 text-center">
          <SectionEyebrow>Qué ofrecemos</SectionEyebrow>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Un catálogo pensado para entornos exigentes
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Organizamos nuestra oferta para facilitar la exploración, la comparación y la compra de productos industriales esenciales.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map(({ title, description, icon: Icon }) => (
            <div key={title} className="flex items-start gap-4 rounded-[1.25rem] border border-slate-200 bg-white p-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Valores - lista elegante en 2 columnas, no cards individuales */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-screen-2xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mb-16 text-center">
            <SectionEyebrow>Valores</SectionEyebrow>
            
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Principios que sostienen nuestra operación
            </h2>
          </div>
          <br />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <div key={value.name} className="flex items-start gap-4 rounded-[1.25rem] border border-slate-200 bg-white p-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <BadgeCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{value.name}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Política de calidad */}
      <section className="mx-auto max-w-screen-2xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-12 text-center">
          <SectionEyebrow>Política de calidad</SectionEyebrow>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Compromiso real con la excelencia
          </h2>
        </div>

        <div className="mx-auto max-w-4xl">
          <p className="text-center text-lg leading-8 text-slate-600">
            En <strong className="text-slate-900">SISCAD</strong>, estamos firmemente comprometidos con cumplir y exceder los requerimientos de nuestros clientes. Aseguramos la calidad de nuestros productos y la excelencia en el servicio a través de la mejora continua de nuestros procesos y nuestro Sistema de Gestión de Calidad.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Calidad', desc: 'Productos confiables y probados' },
              { label: 'Stock', desc: 'Disponibilidad para operación continua' },
              { label: 'Respuesta', desc: 'Atención ágil y profesional' },
              { label: 'Cotización', desc: 'Precios claros y competitivos' },
            ].map(({ label, desc }) => (
              <div key={label} className="flex items-start gap-3 rounded-[1.25rem] border border-slate-200 bg-white p-6">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h4 className="text-base font-bold text-slate-900">{label}</h4>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cierre */}
      <section className="border-t border-slate-200 bg-white py-16 flex flex-col items-center justify-center">
        <div className="mx-auto max-w-screen-2xl px-4 text-center sm:px-6 lg:px-8">
          {/* <h3 className="text-2xl font-black text-slate-900">SISCAD</h3> */}
          <img src={logo} alt="SISCAD" className="flex h-20 w-auto" />
          <p className="mt-2 text-xl text-slate-500 font-bold">Industrial</p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-600">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              México
            </span>
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Atención B2B / B2C
            </span>
            <span className="flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-primary" />
              +10,000 productos
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
