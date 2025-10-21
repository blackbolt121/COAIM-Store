import { useEffect, useState } from "react";
import { Product } from "../../store/store";
import axios from "axios";
import { getAccessToken } from "../../store/auth";
import { ProductoHorizontal } from "./ProductoHorizontal";
// import { Input, Select, Option, FormLabel } from "@mui/joy";
import { useSearchParams } from "react-router-dom";
import { MdSell } from "react-icons/md";
import Pagination from '@mui/material/Pagination';
import useMediaQuery from '@mui/material/useMediaQuery';
// import {ChangeEvent} from "react";
import SearchComponent from "./SearchComponent.tsx";
import FiltersSidebar from "./FiltersSideBar.tsx";

const apiUrl = import.meta.env.VITE_API_URL;


interface AllProductRequest {
    content: Product[],
    pageable: {
        "pageNumber": number,
        "pageSize": number,
        "sort": {
            "empty": boolean,
            "sorted": boolean,
            "unsorted": boolean
        },
        "offset": number,
        "paged": boolean,
        "unpaged": boolean
    },
    "last": boolean,
    "totalPages": number,
    "totalElements": number,
    "first": boolean,
    "size": number,
    "number": number,
    "sort": {
        "empty": boolean,
        "sorted": boolean,
        "unsorted": boolean
    },
    "numberOfElements": number,
    "empty": boolean
}

export interface FiltersInterface {
    category: string;
    minPrice: string;
    maxPrice: string;
    brand: string;
}

export const Tienda = () => {

    const [searchParams, setSearchParams] = useSearchParams();

    const initialFilters = {
        category: searchParams.get("category") || "",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        brand: searchParams.get("brand") || "",
    };

    const isLargeScreen = useMediaQuery("(max-width: 600px)");

    const initialPage = parseInt(searchParams.get("page") || "1");
    const [products, setProducts] = useState<Product[]>([]);
    // const [categories, setCategories] = useState<string[]>([])
    const [filters, setFilters] = useState<FiltersInterface>(initialFilters);

    // const [vendors, setVendors] = useState<Vendor[]>([])

    const [total, setTotal] = useState<number>(0)
    const [numPages, setNumPages] = useState<number>(1)
    const [page, setPage] = useState<number>(initialPage)

    useEffect(() => {
    setFilters({
        category: searchParams.get("category") || "",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        brand: searchParams.get("brand") || "",
    });

    setPage(parseInt(searchParams.get("page") || "1"));
}, []);
    useEffect(() => {
        const newParams : Record<string, string> = {
            page: page.toString(),
        };
        if (filters.category) newParams.category = filters.category;
        if (filters.minPrice) newParams.minPrice = filters.minPrice;
        if (filters.maxPrice) newParams.maxPrice = filters.maxPrice;
        if (filters.brand) newParams.brand = filters.brand;
        setSearchParams(newParams);
    }, [filters, page, setSearchParams]);

    useEffect(() => {
        // loadCategories().then()
        // loadVendors().then()
        async function loadProducts() {
            try {
                const queryParams = new URLSearchParams();
                queryParams.append("page", (page - 1).toString());

                if (filters.category) queryParams.append("categories", filters.category);
                if (filters.minPrice) queryParams.append("minPrice", filters.minPrice);
                if (filters.maxPrice && parseInt(filters.maxPrice) > parseInt(filters.minPrice)) queryParams.append("maxPrice", filters.maxPrice);
                if (filters.brand) queryParams.append("brand", filters.brand);

                const url = `${apiUrl}/rest/api/1/producto/all?${queryParams.toString()}`;
                //console.log(url)

                const productRequest = await axios.get<AllProductRequest>(url, {
                    headers: {
                        Authorization: `Bearer ${getAccessToken()}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                });

                if (productRequest.status !== 200) {
                    //console.log("Error fetching products");
                    return;
                }

                setProducts(productRequest.data.content);
                setTotal(productRequest.data.totalElements);
                setNumPages(productRequest.data.totalPages);
            } catch (error) {
                console.log("Error fetching products", error);
            }
        }
        loadProducts().then()
    }, [filters.maxPrice, filters.brand, filters.minPrice,filters.category, page]);

    useEffect(()=>{

    }, [products])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [page]);

    return (
        <>
            <div className="flex justify-center flex-col">
                <br />
                <div className="flex flex-col gap-3 justify-between items-center my-4 border-b border-gray-200 p-4">
                    <h1 className="text-3xl font-semibold text-gray-800 inline-flex items-center justify-center">
                        <MdSell className="text-amber-300"></MdSell>Todos los productos ({total})
                    </h1>
                    <div className="flex space-x-4 xs:w-full lg:w-50%">
                        <SearchComponent />
                    </div>
                </div>
                <br />
                <div className="flex flex-col lg:flex-row">
                    <FiltersSidebar filters={filters} setFilters={setFilters} />
                    <div className="w-full p-0.5 grid sm:grid-cols-1 xl:grid-cols-2 mx-auto gap-2 mr-6">
                        {products? products.map((product) => (
                            <ProductoHorizontal key={product.id} {...product} />
                        )) : <></>}
                    </div>
                </div>

            </div>

            <div className="my-10">
                <Pagination
                    variant="outlined"
                    shape="rounded"
                    size={isLargeScreen ? 'medium' : 'large'}
                    count={numPages}
                    page={page}
                    onChange={(_, page) => {
                        setPage(page)
                    } }
                    sx={{ display: "flex", justifyContent: "center" }}
                    color="primary"
                />
            </div>
        </>
    );
};

