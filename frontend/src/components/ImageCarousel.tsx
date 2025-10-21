import urrea from "../assets/urrea.jpg";
import surtex from "../assets/surtex.jpg"
import lock from "../assets/lock.jpg"
import axios from "axios";
import { Vendor } from "../store/store";
import { useEffect, useState } from "react";
import { getAccessToken } from "../store/auth";
import { useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;





interface VendorCarousel {
    name: string,
    id: string,
    image: string
}


const ImageCarousel = () => {



    const navigate = useNavigate()

    const [vendor, setVendor] = useState<VendorCarousel[]>([])

    const fetchVendors = async () => {

        const request = await axios.get<Vendor[]>(`${apiUrl}/rest/api/1/vendor/all`, {
            headers: {
                "Authorization": `Bearer ${getAccessToken()}`
            }
        })


        const vendors = request.data


        const arr: string[] = ["Urrea", "Surtek", "Lock"]

        const vendorsArray = vendors.filter(vend => arr.includes(vend.vendorName)).map<VendorCarousel>(vend => {
            switch (vend.vendorName) {
                case "Urrea":
                    return {
                        "name": vend.vendorName,
                        "id": vend.vendorId,
                        "image": urrea
                    }
                case "Surtek":
                    return {
                        "name": vend.vendorName,
                        "id": vend.vendorId,
                        "image": surtex
                    }
                case "Lock":
                    return {
                        "name": vend.vendorName,
                        "id": vend.vendorId,
                        "image": lock
                    }
                default:
                    return {
                        "name": "Unkown",
                        "id": "",
                        "image": urrea
                    }

            }
        })

        setVendor(vendorsArray.sort((a, b)=> b.name.localeCompare(a.name)))
    }


    useEffect(()=>{
        fetchVendors().catch()
    }, [])

    useEffect(()=>{

    }, [vendor])

    return (
        <section className="py-12 rounded-lg mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 my-8">
            {/* Contenedor para el texto introductorio y el título */}
            <div className="text-center mb-10">
                {/* Título de la sección, más grande y prominente */}
                <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl tracking-tight mb-3">
                    Nuestros Proveedores de Confianza
                </h2>
                <div className="w-50 h-1 bg-red-600 mx-auto mb-10"></div>
                {/* Descripción corta de la sección */}
                <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                    Trabajamos con marcas líderes en el mercado para asegurarte productos de la más alta calidad y durabilidad.
                </p>
            </div>

            {/* Contenedor para los logotipos de los proveedores */}
            {/* Usa 'grid' para un diseño responsivo que se adapta a diferentes tamaños de pantalla.
          'grid-cols-1' para móvil, 'md:grid-cols-2' para tablet, 'lg:grid-cols-3' para escritorio.
          'gap-8' para el espaciado entre los logos.
          'justify-items-center' para centrar cada elemento dentro de su celda de la cuadrícula. */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                {vendor.map((supplier) => (
                    // Cada logo es un enlace para mejorar la interactividad
                    <a
                        key={supplier.id}
                        onClick={()=>navigate(`/tienda?brand=${supplier.id}`)}// Abre el enlace en una nueva pestaña
                        rel="noopener noreferrer" // Mejora la seguridad al abrir nuevas pestañas
                        className="group block p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                        aria-label={`Visita el sitio web de ${supplier.name}`}
                    >
                        {/* Imagen del logo del proveedor */}
                        {/* 'object-contain' asegura que la imagen se escala dentro del contenedor sin ser cortada.
                'max-h-24' y 'w-auto' limitan el tamaño de la imagen. */}
                        <img
                            src={supplier.image}
                            alt={`Logo de ${supplier.name}`}
                            className="mx-auto h-24 object-contain"
                            // Manejo de errores para la imagen, en caso de que no cargue
                        />
                        {/* Nombre del proveedor, visible en hover si es necesario o siempre visible */}
                        <p className="mt-4 text-center text-lg font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                            {supplier.name}
                        </p>
                    </a>
                ))}
            </div>
        </section>
    );
};

export default ImageCarousel;
