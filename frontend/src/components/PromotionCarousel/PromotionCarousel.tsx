import { useEffect, useState } from 'react';
//import Slider from "react-slick"
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import "./Carousel.css"
import axios from 'axios';
import { getAccessToken } from '../../store/auth';
const apiUrl = import.meta.env.VITE_API_URL;

interface Promotion {
  id: number;
  title: string;
  image: string;
}

const PromotionsCarousel = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0); // Para controlar el slide actual
  const [image, setImage] = useState<string>("")
  const loadImages = async () => {
    const images_request = await axios.get(`${apiUrl}/rest/api/1/promotions`, {
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`
      }
    })

    try{
      const images = await images_request.data
      setPromotions(images)
      //console.log("Images rendered!!!")
      //console.log(images)
    }catch(error: unknown){
      setError(String(error));
    }



  }
  useEffect(() => {
    setLoading(true);
    loadImages().catch(error => setError(error));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (promotions.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % promotions.length);
      }, 4000); // 4 segundos de autoplay
      return () => clearInterval(interval); // Limpiar el intervalo al desmontar
    }
  }, [promotions]);

  useEffect(() => {

  }, [loading]);

  // useEffect(()=>{
  //   //console.log("Carousel cargando...")
  //   //console.log(promotions)
  // }, [promotions])
  // Función para cargar datos (ahora simulados)


  useEffect(() => {
    if (promotions.length > 0) {
      //console.log("Interval")
      const interval = setInterval(() => {
        const index = (currentIndex + 1) % promotions.length;
        setCurrentIndex(index);
      }, 2000); // 4 segundos de autoplay
      return () => clearInterval(interval); // Limpiar el intervalo al desmontar
    }else{
      //console.log("No interval")
    }
  }, [promotions, currentIndex]);

  useEffect(() => {
    //console.log(currentIndex)
    if(promotions[currentIndex]){
      setImage(`data:image/jpeg;base64,${promotions[currentIndex].image}`)
    }
  }, [promotions,currentIndex]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % promotions.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + promotions.length) % promotions.length);
  };

  const goToSlide = (index:number) => {
    setCurrentIndex(index);
  };


  if (loading) {
    return <div className="text-center py-8 text-lg font-semibold">Cargando promociones...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600 font-semibold">{String(error)}</div>;
  }

  if (promotions.length === 0) {
    return <div className="text-center py-8 text-gray-600">No hay promociones disponibles.</div>;
  }


  return (
      <div className='lg:max-w-[90%] sm:max-w-full mx-auto my-4 relative rounded-lg shadow-xl overflow-hidden'>
        {/* Contenedor del slide */}
        <div className="flex items-center justify-center w-full h-full">
          <div
              key={"carousel-" + promotions.length}
              className={`p-10 relative z-10`}
          >
            {image && <img
                src={image}
                alt={promotions[currentIndex].title}
                className="max-w-full h-auto object-contain rounded-lg flex justify-center items-center p-1"
                style={{maxHeight: '500px'}}
            />}
          </div>
        </div>

        {/* Navegación (flechas) */}
        <button
            onClick={goToPrevious}
            className="absolute top-1/2 z-30 left-4 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-opacity duration-700 ease-in-out"
            aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
            onClick={goToNext}
            className="absolute top-1/2 z-30 right-4 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all duration-300 focus:outline-none"
            aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Puntos de navegación */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {promotions.map((_, index) => (
              <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      index === currentIndex ? 'bg-white' : 'bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
              ></button>
          ))}
        </div>
      </div>
  );
};

export default PromotionsCarousel
