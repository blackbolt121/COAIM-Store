import {Product} from "../store/store.ts";

export interface ApiResponse {
    content: Product[];
    totalPages: number;
    totalElements: number;
    last: boolean;
    first: boolean;
    size: number;
    numberOfElements: number;
}