import { createSlice } from '@reduxjs/toolkit';

export interface Usuario {
    /**
     * Identificador único del usuario (UUID).
     * @example "903de909-d840-4b45-9c18-1341f289d7e6"
     */
    id: string;

    /**
     * Nombre completo del usuario.
     * @example "Ruben Garcia"
     */
    name: string;

    /**
     * Correo electrónico del usuario, debe ser único.
     * @example "test@test.com"
     */
    email: string;

    /**
     * Número de teléfono del usuario. Puede ser nulo.
     */
    telefono: string | null;

    // --- Datos de Dirección ---
    /**
     * Calle y número de la dirección. Puede ser nulo.
     */
    calle: string | null;

    /**
     * Ciudad de la dirección. Puede ser nula.
     */
    ciudad: string | null;

    /**
     * Estado o provincia de la dirección. Puede ser nulo.
     */
    estado: string | null;

    /**
     * País de la dirección. Puede ser nulo.
     */
    pais: string | null;

    /**
     * Código postal de la dirección. Puede ser nulo.
     */
    codigoPostal: string | null;

    /**
     * Indica si la cuenta del usuario está activa.
     */
    activo: boolean;

    /**
     * Fecha y hora de creación del usuario en formato ISO 8601.
     * @example "2025-06-28T01:16:59.727725"
     */
    createdAt: string;

    /**
     * Fecha y hora de la última actualización del usuario en formato ISO 8601.
     * @example "2025-06-28T01:16:59.727725"
     */
    updatedAt: string;

    /**
     * Lista de los nombres de roles asignados al usuario.
     * @example ["ROLE_USER", "ROLE_ADMIN"]
     */
    roles: string[];
}


interface UserInitialState {
    usuario: Usuario;
}

// Cargar el carrito desde localStorage, si existe

const usuario: Usuario = {id: "", name: "", email: "", activo: false, ciudad: "", estado: "", pais: "", codigoPostal: "", telefono: "", calle: "", createdAt: "", updatedAt: "", roles: ["user"]}
const initialState: UserInitialState = {
    usuario: usuario
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loadUsuarioFromLocalStorage: (state) =>{
            const user = localStorage.getItem('user');
            const defaultUsuario: Usuario = {id: "", name: "", email: "", activo: false, ciudad: "", estado: "", pais: "", codigoPostal: "", telefono: "", calle: "", createdAt: "", updatedAt: "", roles: ["user"]}
            const userLoaded : Usuario = user ? JSON.parse(user) : defaultUsuario;
            state.usuario = userLoaded
        }
    }
});

export const { loadUsuarioFromLocalStorage } = userSlice.actions;
export default userSlice.reducer;
