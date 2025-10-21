import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Este componente se encarga de hacer scroll hasta la parte superior de la página
 * cada vez que la ruta (la URL) cambia.
 */
function ScrollToTop() {
    // Extraemos el "pathname" del objeto de ubicación.
    // El pathname es la parte de la URL que viene después del dominio (ej. "/nosotros", "/contacto")
    const { pathname } = useLocation();

    // Usamos el hook useEffect para ejecutar una acción cuando el pathname cambia.
    useEffect(() => {
        // La acción que ejecutamos es "window.scrollTo(0, 0)",
        // que le dice al navegador que haga scroll a las coordenadas X=0, Y=0.
        window.scrollTo(0, 0);
    }, [pathname]); // El array de dependencias asegura que el efecto se ejecute SOLO si el pathname cambia.

    // Este componente no renderiza ningún elemento visual en la página.
    return null;
}

export default ScrollToTop;