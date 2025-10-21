import React, { useEffect, useState } from "react";
import { Skeleton } from "@mui/joy";
import { useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../store/cartSlice";
import { getAccessToken } from "../store/auth";

const apiUrl = import.meta.env.VITE_API_URL;
interface CartItemCardProps {
  id: string;
  quantity: number;
  sku: string;
}

interface ProductoResponse {
  codigo: string;
  nombreLargo: string;
  precio: number;
  moneda: string;
  fotografia: string;
  sku: string;
}

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onDecrease: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const QuantitySelector = ({ quantity, onDecrease, onIncrease }: QuantitySelectorProps) => (
    <div className="flex items-center border border-gray-300 rounded-md">
      <button onClick={onDecrease} className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-md">-</button>
      <span className="px-4 py-1 text-gray-800 font-medium">{quantity}</span>
      <button onClick={onIncrease} className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-md">+</button>
    </div>
);

const CartItemCard = ({ id, quantity, sku }: CartItemCardProps) => {
  const dispatch = useDispatch();
  const [producto, setProducto] = useState<ProductoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [productQuantity, setQuantity] = useState(quantity);
  useEffect(() => {
    fetch(`${apiUrl}/rest/api/1/urrea/producto?codigo=${sku}`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })
      .then((res) => res.json())
      .then((data: ProductoResponse) => {
        setProducto(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching producto:", err);
        setLoading(false);
      });
    //console.log(producto)
  }, [id]);

  const handleRemove = () => {
    dispatch(removeFromCart(id));
  };

  useEffect(() => {
    if (!isNaN(productQuantity) && productQuantity >= 0) {
      dispatch(updateQuantity({ id, quantity: productQuantity }));
    }
  }, [productQuantity, dispatch, id]);

  if (loading) {
    return (
      <div className="p-4 border-b flex gap-4 items-center">
        <Skeleton variant="rectangular" width={80} height={80} />
        <div className="flex-1">
          <Skeleton width="60%" />
          <Skeleton width="40%" />
        </div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="p-4 border-b text-red-500">
        Error cargando producto con código: {id}
      </div>
    );
  }

  return (
    <div className="flex items-center py-4">
      {/* Imagen */}
          <img src={producto.fotografia} alt={producto.nombreLargo} className="w-20 h-20 object-cover rounded-md" />
          <div className="flex-grow ml-4">
            <h3 className="font-semibold text-gray-800">{producto.nombreLargo}</h3>
            <p className="text-sm text-gray-500">Código: {producto.codigo}</p>
            <p className="text-lg font-bold text-gray-900 mt-1">${producto.precio.toFixed(2)}</p>
          </div>
        <div className="flex flex-col items-end space-y-2">
          <QuantitySelector
              quantity={quantity}
              onIncrease={() => {
                setQuantity((prev) => prev + 1);
              }}
              onDecrease={() => {
                setQuantity((prev) => (prev > 2)? prev - 1 : 1);
              }}
          />
          <button onClick={handleRemove} className="text-sm text-red-600 hover:underline">
            Eliminar
          </button>
        </div>

      {/*<div className="w-24 h-24 flex-shrink-0 rounded overflow-hidden border p-1 border-gray-200">*/}
      {/*  <img*/}
      {/*    src={producto.fotografia}*/}
      {/*    alt={`Imagen de ${producto.nombreLargo}`}*/}
      {/*    className="w-full h-full object-contain"*/}
      {/*  />*/}
      {/*</div>*/}

      {/*/!* Detalles *!/*/}
      {/*<div className="flex-1 w-full md:px-4">*/}
      {/*  <Typography level="h4" className="text-gray-800 font-semibold">*/}
      {/*    {producto.nombreLargo}*/}
      {/*  </Typography>*/}
      {/*  <Typography level="body-md" className="text-green-700 font-bold mt-1">*/}
      {/*    {producto.precio.toLocaleString("es-MX", {*/}
      {/*      style: "currency",*/}
      {/*      currency: "MXN",*/}
      {/*    })}*/}
      {/*  </Typography>*/}
      {/*  <Typography level="body-sm" className="text-gray-500">*/}
      {/*    Código: {producto.codigo}*/}
      {/*  </Typography>*/}
      {/*</div>*/}

      {/*/!* Controles *!/*/}
      {/*<div className="flex items-center gap-3 mt-2 md:mt-0">*/}
      {/*  <Input*/}
      {/*    type="number"*/}
      {/*    size="sm"*/}
      {/*    variant="soft"*/}
      {/*    value={quantity}*/}
      {/*    sx={{ width: 80, color: "black", display: "flex", justifyContent: "center" }}*/}
      {/*    onChange={(e) => handleQuantityChange(parseInt(e.target.value))}*/}
      {/*  />*/}
      {/*  <IconButton*/}
      {/*    color="danger"*/}
      {/*    variant="soft"*/}
      {/*    onClick={handleRemove}*/}
      {/*    size="sm"*/}
      {/*    title="Eliminar del carrito"*/}
      {/*  >*/}
      {/*    <FaTrashCan />*/}
      {/*  </IconButton>*/}
      {/*</div>*/}
    </div>
  );
};

export default CartItemCard;
