
import { ListFilter, ChevronDown } from 'lucide-react';
import {useEffect, useState} from "react";
import {Vendor} from "../../store/store.ts";
import axios from "axios";
import {getAccessToken} from "../../store/auth.ts";
import React from "react"
import {FiltersInterface} from "./Tienda.tsx";



interface FiltersSideBarProps {
    filters: FiltersInterface,
    setFilters: React.Dispatch<React.SetStateAction<FiltersInterface>>;
}

const apiUrl = import.meta.env.VITE_API_URL;

const FiltersSidebar = ({ filters, setFilters  } : FiltersSideBarProps) => {
    // Se eliminó el tag <aside> para mayor flexibilidad y se movieron los anchos al div contenedor en App.
    const [categories, setCategories] = useState<string[]>([])
    const [vendors, setVendors] = useState<Vendor[]>([])





    useEffect(() => {
        async function loadCategories() {
            try {
                const response = await axios.get<string[]>(
                    `${apiUrl}/rest/api/1/producto/categorias`,
                    {
                        headers: {
                            Authorization: `Bearer ${getAccessToken()}`,
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
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
                        headers: {
                            Authorization: `Bearer ${getAccessToken()}`,
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                    }
                );

                if (response.status === 200) {
                    setVendors(response.data);
                }
            } catch (error) {
                console.log("Error fetching categories", error);
            }
        }

        loadCategories();
        loadVendors();
    }, []);

    return <div className="w-full p-2 lg:w-1/3">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><ListFilter size={20}/> Filtros
        </h2>
        <div className="space-y-6">
            {/* Filtro por Categoría */}
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <div className="relative">
                    <select
                        id="category"
                        className="w-full appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={filters.category}
                        onChange={e => setFilters({...filters, category: e.target.value})}
                    >
                        <option value="">Todas</option>
                        {categories.filter(cat => cat != "").map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                 size={18}/>
                </div>
            </div>
            {/* Filtro por Precio */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={filters.minPrice}
                        onChange={e => setFilters({...filters, minPrice: e.target.value})}
                    />
                    <span className="text-gray-500">-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={filters.maxPrice}
                        onChange={e => setFilters({...filters, maxPrice: e.target.value})}
                    />
                </div>
            </div>
            {/* Filtro por Marca */}
            <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                <div className="relative">
                    <select
                        id="brand"
                        className="w-full appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={filters.brand}
                        onChange={e => setFilters({...filters, brand: e.target.value})}
                    >
                        <option value="">Todas</option>
                        {vendors.map(b => <option key={b.vendorId} value={b.vendorId}>{b.vendorName}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                 size={18}/>
                </div>
            </div>
        </div>
    </div>
};

export default FiltersSidebar