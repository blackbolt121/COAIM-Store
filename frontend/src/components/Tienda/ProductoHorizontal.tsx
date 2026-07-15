import { Product } from "../../store/store"
import { Link, useLocation } from "react-router-dom"
import { Eye } from "lucide-react"

export const ProductoHorizontal = (producto: Product) => {
    const location = useLocation()

    return (
        <Link
            to={`/producto/${encodeURIComponent(producto.id)}`}
            state={{ from: location.pathname + location.search }}
            className="group relative flex flex-col sm:flex-row bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary/20 transition-all duration-300 ease-out cursor-pointer overflow-hidden"
        >
            <div className="relative flex-shrink-0 w-full sm:w-48 h-48 sm:h-auto bg-slate-50 flex items-center justify-center p-4">
                <img
                    src={producto.imageUrl}
                    alt={producto.name}
                    className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                />
                <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center rounded-full bg-slate-900/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                        {producto.vendor?.vendorName || "Marca"}
                    </span>
                </div>
            </div>

            <div className="flex flex-col flex-grow p-4 sm:p-5 gap-2 justify-between">
                <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        {producto.category || "Categoría"}
                    </p>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">
                        {producto.name}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                        {producto.description}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                        SKU: {producto.sku}
                    </p>
                </div>

                <div className="flex items-end justify-between mt-2 pt-3 border-t border-slate-100">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 mb-0.5">Precio</span>
                        <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                            {producto.price.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                        </span>
                    </div>
                    <span className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition-all duration-200 group-hover:bg-red-700 group-hover:shadow-md group-hover:shadow-primary/30">
                        <Eye className="h-4 w-4" />
                        <span className="hidden sm:inline">Ver</span>
                    </span>
                </div>
            </div>
        </Link>
    )
}
