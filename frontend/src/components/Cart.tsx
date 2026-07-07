import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { clearCart } from "../store/cartSlice";
import { CartItem } from "../store/cartSlice";
import { getAccessToken, validateToken, removeTokens } from "../store/auth";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Truck, ShieldCheck, MessageCircle, CheckCircle, ChevronRight } from "lucide-react";
import CartItemCard from "./CartItemCard";

const apiUrl = import.meta.env.VITE_API_URL;

const TrustPill = ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
    <div className="flex items-center gap-2 text-slate-500">
        <Icon className="h-4 w-4 text-primary flex-shrink-0" />
        <span className="text-xs font-medium">{text}</span>
    </div>
);

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    const path = location.pathname;

    const checkAuth = async () => {
      const token = getAccessToken();
      if (!token && path.startsWith("/cart")) {
        navigate("/login");
        return;
      }

      const isValid = await validateToken();
      if (!isValid) {
        removeTokens();
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      let cartId = localStorage.getItem("cartId");
      let flag = false;

      if (cartId === null) {
        flag = true;
      } else {
        const createCart = await fetch(`${apiUrl}/rest/api/1/cart/order/${cartId}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${getAccessToken()}`,
          },
        });

        const data = await createCart.json();
        const ordenPago = data.ordenPago;
        flag = !(ordenPago === null);

        if (flag) {
          dispatch(clearCart());
        }
      }

      if (flag) {
        const response = await fetch(`${apiUrl}/rest/api/1/cart/order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAccessToken()}`,
          },
          body: JSON.stringify(
            cartItems.map((item: CartItem) => ({
              productId: item.id,
              quantity: item.quantity,
            }))
          ),
        });
        if (!response.ok) throw new Error("Error al procesar el carrito");
        const cart = await response.json();
        cartId = cart.cartId;
        localStorage.setItem("cartId", String(cartId));
      } else {
        await fetch(`${apiUrl}/rest/api/1/cart/order/${cartId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAccessToken()}`,
          },
          body: JSON.stringify(
            cartItems.map((item: CartItem) => ({
              productId: item.id,
              quantity: item.quantity,
            }))
          ),
        });
      }

      window.location.href = `http://mercadourrea.com.mx/checkout?cart=${cartId}`;
    } catch (error) {
      console.error("Error al enviar el carrito:", error);
      alert("No se pudo procesar el carrito");
    }
  };

  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (total: number, item: CartItem) => total + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  const costoEnvio = useMemo(() => {
    return totalPrice > 2000.0 ? 0 : 220;
  }, [totalPrice]);

  const itemCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  async function validateCart() {
    const cartId = localStorage.getItem("cartId");
    let flag = false;

    if (cartId != null) {
      const createCart = await fetch(`${apiUrl}/rest/api/1/cart/order/${cartId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });

      const data = await createCart.json();
      const ordenPago = data.ordenPago;
      flag = !(ordenPago === null);

      if (flag) {
        dispatch(clearCart());
        localStorage.removeItem("cartId");
      }
    }
  }

  useEffect(() => {
    validateCart().then();
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),rgba(248,250,252,1)_40%,rgba(226,232,240,1)_100%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6 lg:mb-8" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary transition-colors font-medium">Inicio</Link>
          <ChevronRight className="h-4 w-4 text-slate-300" />
          <span className="text-slate-800 font-semibold">Carrito</span>
        </nav>

        {/* Título */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tu Carrito</h1>
          <p className="mt-1 text-slate-500 text-sm">
            {cartItems.length > 0
              ? `${itemCount} artículo${itemCount !== 1 ? "s" : ""} en tu carrito`
              : "Revisa tus productos antes de continuar"}
          </p>
          <div className="w-12 h-1 bg-primary mt-3 rounded-full" />
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 lg:py-28">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 mb-6">
              <ShoppingCart className="h-10 w-10 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Tu carrito está vacío</h2>
            <p className="mt-2 text-slate-500 max-w-sm text-center">
              Aún no has agregado productos. Explora nuestro catálogo industrial y encuentra lo que necesitas.
            </p>
            <Link
              to="/tienda"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-red-700 hover:shadow-xl transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Explorar catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Productos</h2>
                  <span className="text-sm text-slate-500">{itemCount} artículo{itemCount !== 1 ? "s" : ""}</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {cartItems.map((item: CartItem) => (
                    <CartItemCard
                      id={item.id}
                      quantity={item.quantity}
                      sku={item.sku}
                      key={item.id}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <Link
                  to="/tienda"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Seguir comprando
                </Link>
              </div>
            </div>

            {/* Resumen del pedido */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 lg:sticky lg:top-28">
                <h2 className="text-lg font-bold text-slate-800 mb-5">Resumen del Pedido</h2>
                <div className="space-y-3 text-slate-600">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({itemCount} artículo{itemCount !== 1 ? "s" : ""})</span>
                    <span className="font-medium text-slate-800">
                      {totalPrice.toLocaleString("es-MX", {
                        style: "currency",
                        currency: "MXN",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Envío</span>
                    <span className="font-medium text-slate-800">
                      {costoEnvio === 0
                        ? "Gratis"
                        : costoEnvio.toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })}
                    </span>
                  </div>
                  {costoEnvio === 0 && totalPrice > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-2.5 py-1.5 rounded-lg">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>¡Envío gratis por compra mayor a $2,000!</span>
                    </div>
                  )}
                  <div className="border-t border-slate-200 pt-3 mt-3">
                    <div className="flex justify-between text-lg font-black text-slate-900">
                      <span>Total</span>
                      <span>
                        {(totalPrice + costoEnvio).toLocaleString("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">IVA incluido</p>
                  </div>
                </div>

                <div className="mt-6">
                  <form onSubmit={handleSubmit}>
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-primary/20 hover:bg-red-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                    >
                      Continuar Compra
                    </button>
                  </form>

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                    <TrustPill icon={Truck} text="Envíos a todo México" />
                    <TrustPill icon={ShieldCheck} text="Pago seguro garantizado" />
                    <TrustPill icon={MessageCircle} text="Atención B2B / B2C" />
                    <TrustPill icon={CheckCircle} text="Stock verificado" />
                  </div>

                  <button
                    onClick={handleClearCart}
                    className="mt-5 w-full text-center text-sm text-slate-500 hover:text-red-600 transition-colors"
                  >
                    Vaciar carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
