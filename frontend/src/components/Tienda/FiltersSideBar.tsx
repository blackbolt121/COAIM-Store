import { ListFilter, ChevronDown, RotateCcw, SlidersHorizontal } from 'lucide-react';
import {useEffect, useState} from "react";
import {Vendor} from "../../store/store.ts";
import axios from "axios";
import {FiltersInterface} from "./Tienda.tsx";

interface FiltersSideBarProps {
    filters: FiltersInterface;
    onFilterChange: (key: keyof FiltersInterface, value: string) => void;
    onPriceFilterApply: (minPrice: string, maxPrice: string) => void;
    onClear: () => void;
}

const apiUrl = import.meta.env.VITE_API_URL;

const FiltersSidebar = ({ filters, onFilterChange, onPriceFilterApply, onClear } : FiltersSideBarProps) => {
    const [categories, setCategories] = useState<string[]>([])
    const [vendors, setVendors] = useState<Vendor[]>([])
    const [mobileOpen, setMobileOpen] = useState(false)
    const [priceDraft, setPriceDraft] = useState({
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
    })

    useEffect(() => {
        setPriceDraft({
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
        })
    }, [filters.minPrice, filters.maxPrice])

    useEffect(() => {
        async function loadCategories() {
            try {
                const response = await axios.get<string[]>(
                    `${apiUrl}/rest/api/1/producto/categorias`,
                    {
                        withCredentials: true,
                    }
                );
                if (response.status === 200) {
                    setCategories(response.data);
                }
            } catch (error) {
                console.log("Error fetching categories", error);
            }
        }
        async function loadVendors() {
            try {
                const response = await axios.get<Vendor[]>(
                    `${apiUrl}/rest/api/1/vendor/all`,
                    {
                        withCredentials: true,
                    }
                );
                if (response.status === 200) {
                    setVendors(response.data);
                }
            } catch (error) {
                console.log("Error fetching vendors", error);
            }
        }
        loadCategories();
        loadVendors();
    }, []);

    const hasActiveFilters = Boolean(filters.category || filters.minPrice || filters.maxPrice || filters.brand || filters.sort !== "relevance")

    const applyPriceFilter = () => {
        onPriceFilterApply(priceDraft.minPrice, priceDraft.maxPrice)
    }

    return (
        <>
            {/* Mobile filter toggle */}
            <div className="lg:hidden mb-4">
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="flex items-center gap-2 w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:border-primary/30 transition-colors"
                >
                    <ListFilter size={18} className="text-primary" />
                    Filtros {hasActiveFilters && <span className="ml-auto inline-flex h-2 w-2 rounded-full bg-primary"/>}
                </button>
                {mobileOpen && (
                    <div className="mt-2 bg-white border border-slate-200 rounded-xl p-4 shadow-lg shadow-slate-900/5">
                        <div className="space-y-6">
                            {/* Encabezado con limpiar */}
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <SlidersHorizontal size={18} className="text-primary"/> Filtros
                                </h2>
                                {hasActiveFilters && (
                                    <button
                                        onClick={onClear}
                                        className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-red-700 transition-colors"
                                    >
                                        <RotateCcw size={14} />
                                        Limpiar
                                    </button>
                                )}
                            </div>

                            {/* Filtro por Categoría */}
                            <div>
                                <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-2">Categoría</label>
                                <div className="relative">
                                    <select
                                        id="category"
                                        className="w-full appearance-none bg-white border border-slate-300 rounded-xl py-2.5 pl-3 pr-10 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer"
                                        value={filters.category}
                                        onChange={e => onFilterChange("category", e.target.value)}
                                    >
                                        <option value="">Todas las categorías</option>
                                        {categories.filter(cat => cat != null && cat != undefined && cat.trim() !== "").map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18}/>
                                </div>
                            </div>

                            {/* Filtro por Precio */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Rango de precio</label>
                                <div className="flex items-center gap-2">
                                    <div className="relative w-full">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">$</span>
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            className="w-full p-2.5 pl-6 border border-slate-300 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                            value={priceDraft.minPrice}
                                            onChange={e => setPriceDraft(prev => ({ ...prev, minPrice: e.target.value }))}
                                            onKeyDown={e => {
                                                if (e.key === "Enter") {
                                                    applyPriceFilter()
                                                }
                                            }}
                                        />
                                    </div>
                                    <span className="text-slate-400 font-medium">—</span>
                                    <div className="relative w-full">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">$</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            className="w-full p-2.5 pl-6 border border-slate-300 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                            value={priceDraft.maxPrice}
                                            onChange={e => setPriceDraft(prev => ({ ...prev, maxPrice: e.target.value }))}
                                            onKeyDown={e => {
                                                if (e.key === "Enter") {
                                                    applyPriceFilter()
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={applyPriceFilter}
                                    className="mt-3 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
                                >
                                    Aplicar
                                </button>
                            </div>

                            {/* Filtro por Marca */}
                            <div>
                                <label htmlFor="brand" className="block text-sm font-semibold text-slate-700 mb-2">Marca</label>
                                <div className="relative">
                                    <select
                                        id="brand"
                                        className="w-full appearance-none bg-white border border-slate-300 rounded-xl py-2.5 pl-3 pr-10 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer"
                                        value={filters.brand}
                                        onChange={e => onFilterChange("brand", e.target.value)}
                                    >
                                        <option value="">Todas las marcas</option>
                                        {vendors.map(b => <option key={b.vendorId} value={b.vendorId}>{b.vendorName}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18}/>
                                </div>
                            </div>

                            {/* Ordenamiento */}
                            <div>
                                <label htmlFor="sort" className="block text-sm font-semibold text-slate-700 mb-2">Ordenar por</label>
                                <div className="relative">
                                    <select
                                        id="sort"
                                        className="w-full appearance-none bg-white border border-slate-300 rounded-xl py-2.5 pl-3 pr-10 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer"
                                        value={filters.sort}
                                        onChange={e => onFilterChange("sort", e.target.value as FiltersInterface["sort"])}
                                    >
                                        <option value="relevance">Relevancia</option>
                                        <option value="price_asc">Precio: menor a mayor</option>
                                        <option value="price_desc">Precio: mayor a menor</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18}/>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Desktop sidebar */}
            <aside className="hidden lg:block w-full lg:w-72 flex-shrink-0">
                <div className="sticky top-24 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                    <div className="space-y-6">
                        {/* Encabezado con limpiar */}
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <SlidersHorizontal size={18} className="text-primary"/> Filtros
                            </h2>
                            {hasActiveFilters && (
                                <button
                                    onClick={onClear}
                                    className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-red-700 transition-colors"
                                >
                                    <RotateCcw size={14} />
                                    Limpiar
                                </button>
                            )}
                        </div>

                        {/* Filtro por Categoría */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-2">Categoría</label>
                            <div className="relative">
                                <select
                                    id="category"
                                    className="w-full appearance-none bg-white border border-slate-300 rounded-xl py-2.5 pl-3 pr-10 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer"
                                    value={filters.category}
                                    onChange={e => onFilterChange("category", e.target.value)}
                                >
                                    <option value="">Todas las categorías</option>
                                    {categories.filter(cat => cat != null && cat != undefined && cat.trim() !== "").map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18}/>
                            </div>
                        </div>

                        {/* Filtro por Precio */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Rango de precio</label>
                            <div className="flex items-center gap-2">
                                <div className="relative w-full">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">$</span>
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        className="w-full p-2.5 pl-6 border border-slate-300 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                        value={priceDraft.minPrice}
                                        onChange={e => setPriceDraft(prev => ({ ...prev, minPrice: e.target.value }))}
                                        onKeyDown={e => {
                                            if (e.key === "Enter") {
                                                applyPriceFilter()
                                            }
                                        }}
                                    />
                                </div>
                                <span className="text-slate-400 font-medium">—</span>
                                <div className="relative w-full">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">$</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        className="w-full p-2.5 pl-6 border border-slate-300 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                        value={priceDraft.maxPrice}
                                        onChange={e => setPriceDraft(prev => ({ ...prev, maxPrice: e.target.value }))}
                                        onKeyDown={e => {
                                            if (e.key === "Enter") {
                                                applyPriceFilter()
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={applyPriceFilter}
                                className="mt-3 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
                            >
                                Aplicar
                            </button>
                        </div>

                        {/* Filtro por Marca */}
                        <div>
                            <label htmlFor="brand" className="block text-sm font-semibold text-slate-700 mb-2">Marca</label>
                            <div className="relative">
                                <select
                                    id="brand"
                                    className="w-full appearance-none bg-white border border-slate-300 rounded-xl py-2.5 pl-3 pr-10 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer"
                                    value={filters.brand}
                                    onChange={e => onFilterChange("brand", e.target.value)}
                                >
                                    <option value="">Todas las marcas</option>
                                    {vendors.map(b => <option key={b.vendorId} value={b.vendorId}>{b.vendorName}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18}/>
                            </div>
                        </div>

                        {/* Ordenamiento */}
                        <div>
                            <label htmlFor="sort" className="block text-sm font-semibold text-slate-700 mb-2">Ordenar por</label>
                            <div className="relative">
                                <select
                                    id="sort"
                                    className="w-full appearance-none bg-white border border-slate-300 rounded-xl py-2.5 pl-3 pr-10 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer"
                                    value={filters.sort}
                                    onChange={e => onFilterChange("sort", e.target.value as FiltersInterface["sort"])}
                                >
                                    <option value="relevance">Relevancia</option>
                                    <option value="price_asc">Precio: menor a mayor</option>
                                    <option value="price_desc">Precio: mayor a menor</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18}/>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
};

export default FiltersSidebar
