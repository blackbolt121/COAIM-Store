import React, { useState, useEffect, useRef, useCallback } from 'react';
import {ApiResponse} from "../../types/APIResponse.ts";
import {Product} from "../../store/store.ts";
import axios from "axios";
import {Link, useNavigate, useLocation} from "react-router-dom";
import { Search, Loader2 } from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL;

const SearchComponent: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [debouncedQuery, setDebouncedQuery] = useState<string>(query);
    const [results, setResults] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showResults, setShowResults] = useState<boolean>(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);
        return () => {
            clearTimeout(handler);
        };
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const fetchResults = useCallback(async (searchQuery: string) => {
        if (searchQuery.length < 3) {
            setResults([]);
            setShowResults(false);
            return;
        }
        setIsLoading(true);
        setShowResults(true);

        try {
            const url = `${apiUrl}/rest/api/1/producto/search?q=${encodeURIComponent(searchQuery)}&page=0&size=6`;
            const response = await axios(url, {
              method: "GET",
              headers: {
                Accept: "application/json",
              },
              withCredentials: true
            });

            if (response.status >= 401) throw new Error("Network response was not ok");
            console.log(response.data);
            const data: ApiResponse = response.data;
            setResults(data.content);
        } catch (error) {
            console.error("Failed to fetch search results:", error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchResults(debouncedQuery);
    }, [debouncedQuery, fetchResults]);

    const goToSearchResults = () => {
        const normalized = query.trim();
        if (!normalized) {
            return;
        }
        const params = new URLSearchParams(location.search);
        params.set("q", normalized);
        params.set("page", "1");
        navigate(`/tienda?${params.toString()}`);
        setShowResults(false);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        goToSearchResults();
    };

    return (
        <div className="w-full max-w-2xl mx-auto relative" ref={searchRef}>
            <form className="relative" onSubmit={handleSubmit}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShowResults(true)}
                    placeholder="Buscar herramientas, marcas o número de parte..."
                    className="w-full pl-11 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                />
                {isLoading && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    </div>
                )}
            </form>

            {showResults && query.length >= 3 && (
                <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl shadow-slate-900/10 overflow-hidden">
                    <ul className="max-h-96 overflow-y-auto">
                        {!isLoading && results.length > 0 && results.map((product) => (
                            <li key={product.id}>
                                <Link
                                    to={`/producto/${product.id}`}
                                    state={{ from: location.pathname + location.search }}
                                    onClick={() => setShowResults(false)}
                                    className="flex items-center gap-4 p-3 hover:bg-slate-50 transition-colors duration-150 border-b border-slate-100 last:border-b-0"
                                >
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-12 h-12 object-contain rounded-lg bg-slate-50 border border-slate-100 flex-shrink-0"
                                        loading="lazy"
                                    />
                                    <div className="flex-grow min-w-0">
                                        <p className="font-semibold text-slate-800 text-sm truncate">{product.name}</p>
                                        <p className="text-xs text-slate-500">{product.category}</p>
                                    </div>
                                    <p className="text-sm font-bold text-primary whitespace-nowrap">
                                        {product.price.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                                    </p>
                                </Link>
                            </li>
                        ))}

                        {!isLoading && results.length === 0 && (
                            <li className="p-6 text-center text-slate-500">
                                <Search className="h-6 w-6 mx-auto mb-2 text-slate-300" />
                                <p className="text-sm">No se encontraron resultados.</p>
                                <button
                                    type="button"
                                    onClick={goToSearchResults}
                                    className="mt-3 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 transition-colors"
                                >
                                    Ver resultados en tienda
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchComponent;
