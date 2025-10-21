
import {useState} from "react";

interface HelpModalProps {
    isOpen: boolean,
    onClose: () => void,
}

const HelpModal = ({ isOpen, onClose } : HelpModalProps) => {
    if (!isOpen) return null;

    return (<>

            <div
            className="fixed inset-0 bg-black/75 flex items-center justify-center z-10"
            onClick={onClose} // Cierra el modal al hacer clic en el fondo
            >
                <div
                    className="bg-white rounded-lg shadow-xl p-6 md:p-8 w-11/12 max-w-md relative"
                    onClick={e => e.stopPropagation()} // Evita que el clic se propague al fondo
                >
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 hover:cursor-pointer"
                        aria-label="Cerrar modal"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Centro de Ayuda</h3>
                    <p className="text-gray-600 mb-6 text-center">¿Cómo podemos ayudarte? Elige una opción:</p>
                    <div className="flex flex-col space-y-4">
                        <a
                            href="https://rubeemmanuelngarciaordaz.atlassian.net/jira/software/c/form/5e9e4b9d-658c-4545-8f93-24596df593b2" // <-- CAMBIA ESTE ENLACE
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                        >
                            Crear un ticket de soporte
                        </a>
                        <a
                            href="https://api.whatsapp.com/send/?phone=%2B524422711285&text=Hola,%20necesito%20ayuda.&app_absent=0" // <-- CAMBIA ESTE ENLACE
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full text-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                        >
                            Hablar por WhatsApp
                        </a>
                    </div>
                </div>
            </div>
    </>

    );
};


const Help = ()=> {

    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    return <>
        <button
            onClick={() => setModalOpen(true)}
            className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white h-16 w-16 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 z-30"
            aria-label="Abrir centro de ayuda"
        >
            {/* Icono de Ayuda (SVG) */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
        </button>
        {/* --- FIN: Botón Fijo de Ayuda --- */}

        {/* Renderizar el Modal */}
        <HelpModal isOpen={isModalOpen} onClose={() => setModalOpen(false)}/>
    </>
}
export default Help