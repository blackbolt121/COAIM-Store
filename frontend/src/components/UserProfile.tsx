import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store.ts";
import { loadUsuarioFromLocalStorage } from "../store/UserSlice.ts";
import { FC } from "react";


const UserProfile: FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.usuario);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    // Tipamos la referencia para que TypeScript sepa que es un elemento div
    const menuRef = useRef<HTMLDivElement>(null);

    // Tipamos el parámetro 'name' y el valor de retorno
    const getInitials = (name: string): string => {
        if (!name) return '??';
        const names = name.split(' ');
        const initials = names.map(n => n[0]).join('');
        return initials.substring(0, 2).toUpperCase();
    };

    useEffect(() => {
        dispatch(loadUsuarioFromLocalStorage());
    }, [dispatch]);
    // Tipamos el evento del listener
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    return (
        <div className={"relative"} ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                {getInitials(user.name)}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <a onClick={()=>{
                        navigate("/pedidos");
                        setIsOpen(false);
                    }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Pedidos</a>
                    <a onClick={()=>{
                        navigate("/cotizaciones");
                        setIsOpen(false);
                    }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Cotizaciones</a>
                    <div className="border-t border-gray-100 my-1"></div>
                    <a onClick={()=>{
                        navigate("/logout");
                        setIsOpen(false);
                    }} className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Cerrar Sesión</a>
                </div>
            )}
        </div>
    );
};

export default UserProfile;