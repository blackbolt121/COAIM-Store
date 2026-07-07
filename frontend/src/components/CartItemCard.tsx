import { useEffect, useState } from "react";
import { Skeleton } from "@mui/joy";
import { useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../store/cartSlice";
import { getAccessToken } from "../store/auth";
import { Minus, Plus, Trash2 } from "lucide-react";

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

const CartItemCard = ({ id, quantity, sku }: CartItemCardProps) => {
  const dispatch = useDispatch();
  const [producto, setProducto] = useState<ProductoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [productQuantity, setProductQuantity] = useState(quantity);

  useEffect(() => {
    setProductQuantity(quantity);
  }, [quantity]);

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
  }, [sku]);

  const handleRemove = () => {
    dispatch(removeFromCart(id));
  };

  useEffect(() => {
    if (!isNaN(productQuantity) && productQuantity >= 1) {
      dispatch(updateQuantity({ id, quantity: productQuantity }));
    }
  }, [productQuantity, dispatch, id]);

  const handleIncrease = () => {
    setProductQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setProductQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  if (loading) {
    return (
      <div className="p-5 flex gap-4 items-center">
        <Skeleton variant="rectangular" width={96} height={96} sx={{ borderRadius: "0.75rem" }} />
        <div className="flex-1 space-y-2.5">
          <Skeleton width="40%" height={16} />
          <Skeleton width="70%" height={20} />
          <Skeleton width="30%" height={20} />
        </div>
        <div className="flex flex-col items-end gap-2">
          <Skeleton width={80} height={36} sx={{ borderRadius: "0.75rem" }} />
          <Skeleton width={60} height={16} />
        </div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="p-5 flex items-center gap-4 text-red-600 bg-red-50/50">
        <div className="w-24 h-24 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-xs text-center p-2">
          Sin imagen
        </div>
        <div>
          <p className="text-sm font-semibold">Error cargando producto</p>
          <p className="text-xs text-slate-500">Código: {sku}</p>
          <button onClick={handleRemove} className="mt-2 text-xs font-medium underline hover:text-red-700">
            Eliminar del carrito
          </button>
        </div>
      </div>
    );
  }

  const itemTotal = producto.precio * productQuantity;

  return (
    <div className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center group hover:bg-slate-50/60 transition-colors duration-200">
      {/* Imagen */}
      <div className="w-24 h-24 flex-shrink-0 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center p-2">
        <img
          src={producto.fotografia}
          alt={producto.nombreLargo}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>

      {/* Info del producto */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2">
          {producto.nombreLargo}
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Código: <span className="font-mono text-slate-600">{producto.codigo}</span>
        </p>
        <p className="mt-1 text-sm font-bold text-slate-900">
          {producto.precio.toLocaleString("es-MX", {
            style: "currency",
            currency: "MXN",
          })}{" "}
          <span className="text-xs font-normal text-slate-400">/ unidad</span>
        </p>
      </div>

      {/* Controles */}
      <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-2 w-full sm:w-auto">
        {/* Selector de cantidad */}
        <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-sm">
          <button
            onClick={handleDecrease}
            className="px-3 py-2 text-slate-500 hover:bg-slate-50 rounded-l-xl transition disabled:opacity-40"
            disabled={productQuantity <= 1}
            aria-label="Disminuir cantidad"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-4 py-2 text-center font-bold text-slate-800 min-w-[2.5rem] text-sm">
            {productQuantity}
          </span>
          <button
            onClick={handleIncrease}
            className="px-3 py-2 text-slate-500 hover:bg-slate-50 rounded-r-xl transition"
            aria-label="Aumentar cantidad"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 ml-auto sm:ml-0">
          <span className="text-sm font-bold text-slate-900">
            {itemTotal.toLocaleString("es-MX", {
              style: "currency",
              currency: "MXN",
            })}
          </span>
          <button
            onClick={handleRemove}
            className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-red-600 transition-colors"
            aria-label="Eliminar producto del carrito"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
