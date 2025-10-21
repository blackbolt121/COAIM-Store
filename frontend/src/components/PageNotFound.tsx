import {useNavigate} from "react-router-dom";

export default function NotFoundPage() {
    const navigate = useNavigate();
    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            {/* Contenido Principal */}
            <main className="flex-grow flex items-center justify-center">
                <div className="text-center p-8">
                    <span className="text-7xl" role="img" aria-label="mapa perdido">🗺️</span>
                    <h1 className="mt-4 text-6xl font-bold text-red-600">404</h1>
                    <h2 className="mt-2 text-3xl font-semibold text-gray-800">Página No Encontrada</h2>
                    <p className="mt-4 text-gray-500 max-w-md mx-auto">
                        Lo sentimos, no pudimos encontrar la página que estás buscando.
                        Es posible que haya sido eliminada o que la dirección URL sea incorrecta.
                    </p>
                    <div className="mt-8">
                        <a
                            onClick={()=>{
                                navigate("/")
                            }}
                            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                        >
                            Volver al Inicio
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}