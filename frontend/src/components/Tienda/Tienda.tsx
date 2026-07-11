import { useEffect, useState, useMemo } from "react";
import type { ElementType } from "react";
import { Product } from "../../store/store";
import axios from "axios";
import { ProductoHorizontal } from "./ProductoHorizontal";
import { useSearchParams } from "react-router-dom";
import { Package, Truck, ShieldCheck, Clock, SearchX } from "lucide-react";
import Pagination from "@mui/material/Pagination";
import useMediaQuery from "@mui/material/useMediaQuery";
import SearchComponent from "./SearchComponent.tsx";
import FiltersSidebar from "./FiltersSideBar.tsx";
import { ApiResponse } from "../../types/APIResponse.ts";

const apiUrl = import.meta.env.VITE_API_URL;

export interface FiltersInterface {
    category: string;
    minPrice: string;
    maxPrice: string;
    brand: string;
    sort: "relevance" | "price_asc" | "price_desc";
}

const TrustBadge = ({ icon: Icon, label, sub }: { icon: ElementType; label: string; sub: string }) => (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-sm">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shadow-lg shadow-primary/20">
            <Icon className="h-4 w-4" />
        </div>
        <div>
            <p className="text-sm font-bold text-white">{label}</p>
            <p className="text-xs text-slate-300">{sub}</p>
        </div>
    </div>
);

const getFiltersFromParams = (params: URLSearchParams): FiltersInterface => ({
    category: params.get("category") || "",
    minPrice: params.get("minPrice") || "",
    maxPrice: params.get("maxPrice") || "",
    brand: params.get("brand") || "",
    sort: (params.get("sort") as FiltersInterface["sort"]) || "relevance",
});

export const Tienda = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [numPages, setNumPages] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const isLargeScreen = useMediaQuery("(max-width: 600px)");

    // Fuente única de verdad: la URL
    const page = parseInt(searchParams.get("page") || "1");
    const initialQuery = searchParams.get("q") || "";
    const isSearchMode = initialQuery.trim().length > 0;
    const filters = useMemo(() => getFiltersFromParams(searchParams), [searchParams]);

    useEffect(() => {
        async function loadProducts() {
            setIsLoading(true);
            try {
                const currentPage = parseInt(searchParams.get("page") || "1");
                const query = searchParams.get("q") || "";
                const category = searchParams.get("category") || "";
                const brand = searchParams.get("brand") || "";
                const minPrice = searchParams.get("minPrice") || "";
                const maxPrice = searchParams.get("maxPrice") || "";
                const sort = searchParams.get("sort") || "relevance";
                const isSearch = query.trim().length > 0;

                const queryParams = new URLSearchParams();
                queryParams.append("page", Math.max(currentPage - 1, 0).toString());
                queryParams.append("size", "12");

                if (isSearch) {
                    queryParams.append("q", query.trim());
                    if (category) queryParams.append("category", category);
                    if (brand) queryParams.append("brand", brand);
                    if (minPrice) queryParams.append("minPrice", minPrice);
                    if (maxPrice) queryParams.append("maxPrice", maxPrice);
                    if (sort !== "relevance") queryParams.append("sort", sort);

                    const productRequest = await axios.get<ApiResponse>(
                        `${apiUrl}/rest/api/1/producto/search?${queryParams.toString()}`,
                        {
                            withCredentials: true,
                        }
                    );

                    if (productRequest.status !== 200) {
                        setProducts([]);
                        setTotal(0);
                        setNumPages(1);
                        return;
                    }

                    setProducts(productRequest.data.content);
                    setTotal(productRequest.data.totalElements);
                    setNumPages(productRequest.data.totalPages || 1);
                } else {
                    if (category) queryParams.append("categories", category);
                    if (minPrice) queryParams.append("minPrice", minPrice);
                    if (maxPrice && parseInt(maxPrice) > parseInt(minPrice || "0")) queryParams.append("maxPrice", maxPrice);
                    if (brand) queryParams.append("brand", brand);

                    const productRequest = await axios.get<ApiResponse>(
                        `${apiUrl}/rest/api/1/producto/all?${queryParams.toString()}`,
                        {
                            withCredentials: true,
                        }
                    );

                    if (productRequest.status !== 200) {
                        setProducts([]);
                        setTotal(0);
                        setNumPages(1);
                        return;
                    }

                    setProducts(productRequest.data.content);
                    setTotal(productRequest.data.totalElements);
                    setNumPages(productRequest.data.totalPages || 1);
                }
            } catch (error) {
                console.log("Error fetching products", error);
                setProducts([]);
                setTotal(0);
                setNumPages(1);
            } finally {
                setIsLoading(false);
            }
        }

        loadProducts();
    }, [searchParams]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [searchParams]);

    const hasActiveFilters = Boolean(
        searchParams.get("category") ||
        searchParams.get("minPrice") ||
        searchParams.get("maxPrice") ||
        searchParams.get("brand") ||
        (isSearchMode && searchParams.get("sort") !== "relevance")
    );

    const clearSearch = () => {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("q");
        newParams.set("page", "1");
        setSearchParams(newParams, { replace: true });
    };

    const handleFilterChange = (key: keyof FiltersInterface, value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        if (key !== "sort") {
            newParams.set("page", "1");
        }
        setSearchParams(newParams, { replace: true });
    };

    const handleClearFilters = () => {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("category");
        newParams.delete("minPrice");
        newParams.delete("maxPrice");
        newParams.delete("brand");
        newParams.delete("sort");
        newParams.set("page", "1");
        setSearchParams(newParams, { replace: true });
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("page", String(newPage));
        setSearchParams(newParams, { replace: true });
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),rgba(248,250,252,1)_40%,rgba(226,232,240,1)_100%)]">
            <div className="relative overflow-hidden border-b border-red-900/20 bg-gradient-to-br from-red-950 via-red-900 to-red-800 text-white">
                <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:48px_48px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.10),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_24%)]" />
                <div className="relative mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-200 backdrop-blur">
                                Catálogo industrial
                            </div>
                            <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                                Encuentra productos industriales para mantener tu operación en marcha.
                            </h1>
                            <p className="mt-3 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                                Herramientas, seguridad, maquinaria, refacciones y suministros especializados para empresas y profesionales.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                            <TrustBadge icon={Package} label="+10,000" sub="productos" />
                            <TrustBadge icon={Truck} label="Envíos" sub="a todo México" />
                            <TrustBadge icon={ShieldCheck} label="Atención" sub="B2B / B2C" />
                            <TrustBadge icon={Clock} label="Stock" sub="disponible" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border-b border-slate-200/70 shadow-sm">
                <div className="mx-auto max-w-screen-2xl px-4 py-5 sm:px-6 lg:px-8">
                    <SearchComponent />
                </div>
            </div>

            <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                {isSearchMode && (
                    <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Modo búsqueda</p>
                            <p className="text-sm text-slate-700">
                                Resultados para <span className="font-semibold text-slate-900">"{initialQuery}"</span>
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-primary/30 hover:text-primary"
                        >
                            Limpiar búsqueda
                        </button>
                    </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            {isSearchMode ? "Resultados de búsqueda" : "Todos los productos"}
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5">
                            {isLoading ? "Cargando..." : `${total.toLocaleString("es-MX")} resultado${total !== 1 ? "s" : ""} encontrado${total !== 1 ? "s" : ""}`}
                            {hasActiveFilters && !isLoading && (
                                <span className="text-primary font-medium"> con filtros aplicados</span>
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    <FiltersSidebar filters={filters} onFilterChange={handleFilterChange} onClear={handleClearFilters} />

                    <div className="flex-1 min-w-0">
                        {isLoading ? (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row bg-white border border-slate-100 rounded-2xl p-4 gap-4 animate-pulse">
                                        <div className="w-full sm:w-48 h-40 bg-slate-100 rounded-xl" />
                                        <div className="flex-1 space-y-3 py-2">
                                            <div className="h-3 w-20 bg-slate-100 rounded" />
                                            <div className="h-5 w-3/4 bg-slate-100 rounded" />
                                            <div className="h-4 w-full bg-slate-100 rounded" />
                                            <div className="h-4 w-2/3 bg-slate-100 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200/80 rounded-2xl">
                                <SearchX className="h-12 w-12 text-slate-300 mb-4" />
                                <h3 className="text-lg font-bold text-slate-800">No se encontraron productos</h3>
                                <p className="text-sm text-slate-500 mt-1 max-w-xs text-center">
                                    Intenta ajustar los filtros o realizar una nueva búsqueda.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                {products.map((product) => (
                                    <ProductoHorizontal key={product.id} {...product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {numPages > 1 && !isLoading && (
                <div className="pb-10 pt-4">
                    <Pagination
                        variant="outlined"
                        shape="rounded"
                        size={isLargeScreen ? "medium" : "large"}
                        count={numPages}
                        page={page}
                        onChange={handlePageChange}
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            '& .MuiPaginationItem-root': {
                                borderRadius: '0.75rem',
                                fontWeight: 600,
                                borderColor: 'rgba(203, 213, 225, 0.7)',
                                color: '#475569',
                            },
                            '& .Mui-selected': {
                                backgroundColor: '#D32F2F !important',
                                color: '#fff !important',
                                borderColor: '#D32F2F !important',
                                boxShadow: '0 4px 14px rgba(211,47,47,0.25)',
                            },
                            '& .MuiPaginationItem-root:hover': {
                                backgroundColor: 'rgba(211,47,47,0.06)',
                                borderColor: 'rgba(211,47,47,0.3)',
                            },
                        }}
                    />
                </div>
            )}
        </div>
    );
};
