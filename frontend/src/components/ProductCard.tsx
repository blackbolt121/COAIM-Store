import { useNavigate } from "react-router-dom"

interface ProductCardProps {
  id: string
  name?: string
  price?: number
  description?: string
  imageUrl?: string,
  sku?: string
}

const ProductCard = ({ id, name, sku, price, description, imageUrl } : ProductCardProps) => {
  // const navigate = useNavigate(); // Esto funcionaría en tu app con React Router configurado.
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate(`/producto/${encodeURIComponent(id)}`)
    // navigate(`/producto/${encodeURIComponent(id)}`); // Esta sería la llamada real.
  };

  return (
      // Reemplazamos <Card> por <div>, manteniendo tus clases exactas.
      <div
          className="w-72 h-[28rem] bg-white shadow-lg hover:cursor-pointer flex flex-col justify-between p-4 rounded-lg transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-in-out"
          onClick={handleCardClick}
          key={id}
      >
        <img
            src={imageUrl || 'https://placehold.co/400x400/e2e8f0/333?text=Producto'}
            alt={`Imagen de ${name}`}
            className="w-full h-48 object-cover rounded-md mb-4"
            loading="lazy"
        />

        <div className="flex flex-col flex-grow">
          {/* Reemplazamos <Typography> por elementos semánticos de HTML */}
          <h3 className="font-bold text-lg">
            {name || "Product Name"}
          </h3>

          <p className="text-gray-600 text-sm my-2 line-clamp-3">
            {description || "Product Description"}
          </p>
          <p className="text-gray-600 text-sm mb-4">
            <strong>SKU: </strong>{ sku || "Product SKU"}
          </p>
          <div className="mt-auto">
            <p className="font-bold text-xl text-black">
              {price ? price.toLocaleString("es-MX", { style: "currency", currency: "MXN" }) : '$0.00'}
            </p>
          </div>
        </div>
      </div>
  );
};

export default ProductCard;

/*
export const ProductCard = (ProductCardProps: ProductCardProps) => {

  const navigate = useNavigate()


  return <Card
    variant="outlined"
    className="w-72 h-[28rem] bg-white shadow-lg hover:cursor-pointer flex flex-col justify-between p-4"
    onClick={() => navigate(`/producto/${encodeURIComponent(ProductCardProps.id)}`)}
    key={ProductCardProps.id}
    >
      <img
        src={ProductCardProps.imageUrl}
        alt="Product"
        className="w-full h-48 object-cover rounded-md mb-4"
      />

      <div className="flex flex-col flex-grow">
        <Typography level="h3" className="font-bold">
          {ProductCardProps.name || "Product Name"}
        </Typography>

        <Typography level="body-md" className="text-gray-600 mb-4 line-clamp-3">
          {ProductCardProps.description?.substring(0,15)+"..." || "Product Description"}
        </Typography>
        <Typography level="body-md" className="text-gray-600 mb-4 line-clamp-3">
          <strong>SKU: </strong>{ProductCardProps.id || "Product SKU"}
        </Typography>
        <div className="mt-auto">
          <Typography level="body-md" className="font-bold text-xl text-blue-600">
            {ProductCardProps.price?.toLocaleString("es-MX", {style:"currency", currency:"MXN"})}
          </Typography>
        </div>
      </div>
    </Card>
}
*/