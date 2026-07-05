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
    image?: string
}


const ImageCarousel = () => {



    const navigate = useNavigate()

    const [vendor, setVendor] = useState<VendorCarousel[]>([])

    const normalizeVendorName = (value: string) =>
        value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

    const buildVendorCard = (vend: Vendor): VendorCarousel | null => {
        const normalizedName = normalizeVendorName(vend.vendorName)

        switch (normalizedName) {
            case "urrea":
                return { name: vend.vendorName, id: vend.vendorId, image: urrea }
            case "surtek":
                return { name: vend.vendorName, id: vend.vendorId, image: surtex }
            case "lock":
                return { name: vend.vendorName, id: vend.vendorId, image: lock }
            default:
                return { name: vend.vendorName, id: vend.vendorId }
        }
    }

    const fetchVendors = async () => {

        const request = await axios.get<Vendor[]>(`${apiUrl}/rest/api/1/vendor/all`, {
            headers: {
                "Authorization": `Bearer ${getAccessToken()}`
            }
        })


        const vendors = request.data


        const vendorsArray = vendors
            .map(buildVendorCard)
            .filter((vend): vend is VendorCarousel => vend !== null)

        setVendor(vendorsArray.sort((a, b)=> b.name.localeCompare(a.name)))
    }


    useEffect(()=>{
        fetchVendors().catch()
    }, [])

    useEffect(()=>{

    }, [vendor])

    return (
        <section className="py-16 rounded-lg mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-8">
            {/* Contenedor para el texto introductorio y el título */}
            <div className="text-center mb-10">
                {/* Título de la sección, más grande y prominente */}
                <h2 className="text-3xl font-black text-slate-900 sm:text-4xl lg:text-5xl tracking-tight mb-3">
                    Nuestros Proveedores de Confianza
                </h2>
                <div className="w-24 h-1 bg-primary mx-auto mb-10 rounded-full"></div>
                {/* Descripción corta de la sección */}
                <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto">
                    Trabajamos con marcas líderes en el mercado para asegurarte productos de la más alta calidad y durabilidad.
                </p>
            </div>

            {/* Contenedor para los logotipos de los proveedores */}
            {/* Usa 'grid' para un diseño responsivo que se adapta a diferentes tamaños de pantalla.
          'grid-cols-1' para móvil, 'md:grid-cols-2' para tablet, 'lg:grid-cols-3' para escritorio.
          'gap-8' para el espaciado entre los logos.
          'justify-items-center' para centrar cada elemento dentro de su celda de la cuadrícula. */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-stretch">
                {vendor.map((supplier) => (
                    <button
                        type="button"
                        key={supplier.id}
                        onClick={()=>navigate(`/tienda?brand=${supplier.id}`)}// Abre el enlace en una nueva pestaña
                        className="group block h-full overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-6 text-left shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        aria-label={`Visita el sitio web de ${supplier.name}`}
                    >
                        <div className="flex h-44 items-center justify-center rounded-[1.15rem] bg-slate-50 px-4 py-6">
                            {supplier.image ? (
                                <img
                                    src={supplier.image}
                                    alt={`Logo de ${supplier.name}`}
                                    className="max-h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center rounded-[1rem] border border-dashed border-slate-200 bg-white px-4 text-center text-2xl font-black tracking-[0.2em] text-slate-700 transition-colors group-hover:border-primary/30 group-hover:text-primary">
                                    {supplier.name.slice(0, 1).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <p className="mt-5 text-center text-base font-semibold tracking-wide text-slate-700 transition-colors duration-300 group-hover:text-primary">
                            {supplier.name}
                        </p>
                    </button>
                ))}
            </div>
        </section>
    );
};

export default ImageCarousel;
