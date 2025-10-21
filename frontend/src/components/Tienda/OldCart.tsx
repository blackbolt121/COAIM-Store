/*

const PromotionsCarousel = () => {
  const [promotions, setPromotions] = useState([]);

  const loadImages = async () => {
    const images_request = await axios.get('http://localhost:8080/rest/api/1/promotions', {
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`
      }
    })

    const images = await images_request.data

    setPromotions(images)
  }


  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    lazyLoad: 'ondemand' as const,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
  };

  return (
    <div className='max-w-[90%] mx-auto my-2'>
      <Slider {...settings}>
        {promotions.map(({ title, id, image }) => {
          const imageSrc = `data:image/jpeg;base64,${image}`;
          // Suponiendo que la imagen es JPEG en base64 sin prefijo
          console.log("iMAGE IN ARRAY")
          return <div key={id}><img src={imageSrc} alt={title} /></div>
        })}
      </Slider>
    </div>
  );
};

export default PromotionsCarousel;
*/