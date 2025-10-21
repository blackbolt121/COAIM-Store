import React, { useState, useEffect, useRef, useCallback } from 'react';
import {ApiResponse} from "../../types/APIResponse.ts";
import {Product} from "../../store/store.ts";
import axios from "axios";
import {getAccessToken} from "../../store/auth.ts";
import {Link} from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;


// Icono de Lupa (puedes usar una librería como react-icons o un SVG)
const SearchIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
);

const SearchComponent: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [debouncedQuery, setDebouncedQuery] = useState<string>(query);
    const [results, setResults] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showResults, setShowResults] = useState<boolean>(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Efecto para debounce: actualiza debouncedQuery 500ms después de que query cambia
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);
        // Limpia el timeout si el componente se desmonta o query cambia
        return () => {
            clearTimeout(handler);
        };
    }, [query]);

    // Hook para cerrar el dropdown si se hace clic afuera
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

    // useCallback para memorizar la función de fetch
    const fetchResults = useCallback(async (searchQuery: string) => {
        if (searchQuery.length < 3) {
            setResults([]);
            setShowResults(false);
            return;
        }
        setIsLoading(true);
        setShowResults(true);

        try {
            // Reemplaza esta URL con la tuya
            const url = `${apiUrl}/rest/api/1/producto/search?query=${encodeURIComponent(searchQuery)}`;
            //console.log(url);
            const response = await axios(url, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${getAccessToken()}`
                }
            });

            if (response.status >= 401) throw new Error("Network response was not ok");

            const data: ApiResponse = response.data;
            setResults(data.content);
        } catch (error) {
            console.error("Failed to fetch search results:", error);
            setResults([]); // Limpiar resultados en caso de error
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Efecto para llamar a la API cuando debouncedQuery cambia
    useEffect(() => {
        fetchResults(debouncedQuery);
    }, [debouncedQuery, fetchResults]);

    return (
        <div className="w-full max-w-2xl mx-auto" ref={searchRef}>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShowResults(true)}
                    placeholder="Busca un producto..."
                    className="w-full sm:w-full md:w-full lg:w-[600px] pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {isLoading && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <div className="w-5 h-5 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            {showResults && query.length >= 3 && (
                <div className="absolute z-10 left-1/3 w-full max-w-2xl mt-1 bg-white border border-gray-200 rounded-lg shadow-xl">
                    <ul className="max-h-96 overflow-y-auto">
                        {!isLoading && results.length > 0 && results.map((product) => (
                            <li key={product.id}>
                                <Link to={`/producto/${product.id}`} className="flex items-center p-3 hover:bg-gray-100 transition-colors duration-150">
                                    <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded-md mr-4" />
                                    <div className="flex-grow">
                                        <p className="font-semibold text-gray-800">{product.name}</p>
                                        <p className="text-sm text-gray-500">{product.category}</p>
                                        <p className="font-semibold text-gray-800">{product.id}</p>
                                    </div>
                                    <p className="text-lg font-bold text-blue-600">${product.price}</p>
                                </Link>
                            </li>
                        ))}

                        {!isLoading && results.length === 0 && (
                            <li className="p-4 text-center text-gray-500">No se encontraron resultados.</li>
                        )}

                        {/*{!isLoading && results.length > 0 && (*/}
                        {/*    <li>*/}
                        {/*        <a*/}
                        {/*            href={`/buscar?q=${encodeURIComponent(query)}`}*/}
                        {/*            className="block w-full text-center p-4 bg-blue-500 text-white font-bold rounded-b-lg hover:bg-blue-600 transition-colors duration-150"*/}
                        {/*        >*/}
                        {/*            Ver todos los resultados*/}
                        {/*        </a>*/}
                        {/*    </li>*/}
                        {/*)}*/}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchComponent;