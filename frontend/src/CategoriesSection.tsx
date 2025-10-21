
import {useNavigate} from "react-router-dom";

interface CategoryCardProps {
    name: string;
    icon: string;
}

interface CategorySectionProps {
    categories: string[];
    title: string;
}
// --- 4. Componente CategoriesSection (ACTUALIZADO) ---
const CategoryCard = ({ name, icon }: CategoryCardProps) => {

    const navigate = useNavigate()

    return <a href="#"
              className="group bg-white rounded-xl shadow-md p-4 flex flex-col items-center justify-center text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              onClick={()=>navigate("/tienda?category="+name)}
    >
        <div className="text-4xl mb-3 text-red-600 group-hover:text-red-700 transition-colors">
            {icon}
        </div>
        <h3 className="font-semibold text-gray-700 group-hover:text-gray-900 text-sm">
            {name}
        </h3>
    </a>
}


const CategoriesSection = ({ title = "Explora Nuestras Categorías", categories = [] }: CategorySectionProps) => {
    // El mapping se mantiene como una referencia interna
    const categoryMapping: { [key: string]: string } = {
        "Protección para la cabeza": "🪖",
        "Corte": "✂️",
        "Herramientas para atornillar": "🔩",
        "Dados y accesorios de impacto": "🛠️",
        "Prensas": "🔧",
        "Escareo": "🌀",
        "Agricultura y jardinería": "🪴",
        "Herramientas para golpear": "🔨",
        "Dados y accesorios de mano": "🔧",
        "Herramientas antichispa": "⚠️",
        "Fijación": "📎",
        "Pinzas y tijeras": "✂️",
        "Levantamiento de carga": "🏗️",
        "Herramientas automotrices": "🚗",
        "Material eléctrico": "🔌",
        "Pintura": "🎨",
        "Juegos de herramientas": "🧰",
        "Protección para extremidades": "🧤",
        "Llaves": "🔑",
        "Medición": "📏",
        "Bisagras bidimensionales": "🧲",
        "Accesorios para mueble": "🪑",
        "": "❓",
        "Señalización": "🚧",
        "Cadenas y accesorios": "⛓️",
        "Candados de acero": "🔒",
        "Perforación": "🛠️",
        "Herramientas aisladas": "🧰",
        "Herramientas para tubo": "🔧",
        "Sujeción de carga": "🪝",
        "Cables y accesorios": "🔌",
        "Ropa de trabajo": "👕",
        "Cerraduras de barra": "🔐",
        "Herramientas para construcción": "🏗️",
        "Iluminación": "💡",
        "Lonas": "🧵",
        "Nivelación": "📐",
        "Pomos": "⚙️",
        "Protección facial": "😷",
        "Abrasivos": "🪓",
        "Manijas": "🛎️",
        "Extractores": "🔧",
        "Equipos eléctricos y gasolina": "⚡",
        "Eléctricas estacionarias": "🛠️",
        "Artículos promocionales": "🎁",
        "Letras y números": "🔠",
        "Textiles": "🧵",
        "Eléctricas portátiles": "🔌",
        "Jaladeras": "🚪",
        "Herramientas de torque": "🛠️",
        "Tijeras y cuchillos": "🔪",
        "Herramientas neumáticas": "🌬️",
        "Herramientas para carpintería": "🪚",
        "Rodajas": "🎡",
        "Cajas portaherramienta": "🧰",
        "Inyectores de grasa": "🛢️",
        "Protección contra caídas": "🧗",
        "Mercadeo": "📈",
        "Pasadores para herrería": "📍",
        "Bisagras de acero": "🧲",
        "Productos químicos": "🧪",
        "Cierrapuertas": "🚪",
        "Protección lumbar": "🏋️",
        "Limpieza": "🧼",
        "Cerraduras para cortina": "🪟",
        "Cerraduras puertas de aluminio": "🚪",
        "Organizadores": "📦",
        "Calentadores": "🔥",
        "Exhibición": "🧾",
        "Gatillos": "🔫",
        "Estuches portaherramienta": "🧰",
        "Gabinetes": "🗄️",
        "Cerraduras de sobreponer": "🔐",
        "Diagnóstico": "🩺",
        "Remolque": "🚛",
        "Pasadores de seguridad": "🛡️",
        "Bombas de aire": "💨",
        "Centros de trabajo": "🏢",
        "Trazo": "✏️",
        "Movimiento de carga": "🚚",
        "Cerrojos": "🔐",
        "Mallas y alambre": "🧵",
        "Prensas hidráulicas": "💪",
        "Bombas de trasvase": "🛢️",
        "Candados laminados": "🔒",
        "Gatos": "🪤",
        "Candados de latón": "🔐",
        "Bisagra para herrería": "🧲",
        "Bombas extractoras": "🛢️",
        "Hogar": "🏠",
        "Manijas con mecanismo embutir": "⚙️",
        "Carros utilitarios": "🛒",
        "Cilindros": "🔩",
        "Aceiteras": "🛢️",
        "Carretillas para puertas": "🛞",
        "Candados combinados": "🔒",
        "Aceites y grasas": "🛢️",
        "Guardapolvos": "🧥",
        "Barras antipánico": "🚨",
        "Porta candados": "🔗",
        "Transporte de carga": "🚛",
        "Organización y almacenamiento": "📦",
        "Maletas portaherramienta": "🎒",
        "Conjuntos": "🧰",
        "Picaportes": "🚪",
        "Candados con alarma": "🔔",
        "Plumas": "✒️",
        "Topes": "🛑",
        "Control de plagas": "🐜",
        "Manija para ventana": "🪟",
        "Elevadores hidráulicos": "🛗",
        "Rafia": "🧶",
        "Equipo para carrocero": "🚗",
        "Cerraduras para mueble": "🪑",
        "Literatura comercial": "📚",
        "Mirillas": "🔭"
    };

    return (
        <div className="bg-white py-12 sm:py-16">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl tracking-tight text-center mb-2">{title}</h1>
                <div className="w-50 h-1 bg-red-600 mx-auto mb-15"></div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-4">
                    {/* Iteramos sobre el array de strings recibido en las props */}
                    {categories.filter(category => category != "")
                        .map((category: string) => (
                        // Corregimos la sintaxis para pasar el ícono como un string
                        <CategoryCard key={category} name={category.charAt(0).toUpperCase() + category.slice(1)} icon={String(categoryMapping[category] || '🔒')} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoriesSection