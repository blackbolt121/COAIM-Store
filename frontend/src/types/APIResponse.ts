import {Product} from "../store/store.ts";

export interface ApiResponse {
    content: Product[];
    totalPages: number;
    totalElements: number;
    last: boolean;
    first: boolean;
    size: number;
    number?: number;
    numberOfElements: number;
    facets?: {
        category?: Record<string, number>;
        brand?: Record<string, number>;
    };
}
