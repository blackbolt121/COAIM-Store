import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { clearCart } from "../store/cartSlice";
import { CartItem } from "../store/cartSlice";
import { getAccessToken, validateToken, removeTokens } from "../store/auth";
import { useNavigate } from "react-router-dom";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import CartItemCard from "./CartItemCard";
const apiUrl = import.meta.env.VITE_API_URL;



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

      let cartId = localStorage.getItem("cartId")

      let flag = false
      
      //console.log(cartId)
      if (cartId === null) {
        //console.log(`Cart id is null`)
        flag = true
      }
      else {
        //console.log('Validando orden de pedido')
        const createCart = await fetch(`${apiUrl}/rest/api/1/cart/order/${cartId}`,
          {
            method: "GET",
            headers: {
              "Accept": "application/json",
              "Authorization": `Bearer ${getAccessToken()}`
            }
          }
        )


        const data = await createCart.json()

        const ordenPago = data.ordenPago

        //console.log(ordenPago)
        //console.log(flag)

        flag = !(ordenPago === null)
        //Si existe una orden de pago registrada se limpia el carrito
        if (flag) {
          dispatch(clearCart())
        }

      }
      //console.log(`The flag is ${flag}`)
      if (flag) {
        //console.log(`Creating cart ${flag}`)
        const response = await fetch(`${apiUrl}/rest/api/1/cart/order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAccessToken()}`
          },
          body: JSON.stringify(
            cartItems.map((item: CartItem) => ({
              productId: item.id,
              quantity: item.quantity
            }))
          )
        });
        if (!response.ok) throw new Error("Error al procesar el carrito");
        const cart = await response.json();
        cartId = cart.cartId;
        localStorage.setItem("cartId", String(cartId))
      } else {
        //console.log("Actualizando carrito")
        //const response =
        await fetch(`${apiUrl}/rest/api/1/cart/order/${cartId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAccessToken()}`
          },
          body: JSON.stringify(
            cartItems.map((item: CartItem) => ({
              productId: item.id,
              quantity: item.quantity
            }))
          )
        });
        //console.log(response)
      }
      //console.log(cartId)
      window.location.href = `http://mercadourrea.com.mx/checkout?cart=${cartId}`

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

  const costoEnvio = useMemo(()=> {
    return (totalPrice > 2000.0)? 0 : 220;
  }, [totalPrice]);

  async function validateCart() {

    const cartId = localStorage.getItem("cartId")

    let flag = false

    if (cartId != null) {
      const createCart = await fetch(`${apiUrl}/rest/api/1/cart/order/${cartId}`,
        {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${getAccessToken()}`
          }
        }
      )


      const data = await createCart.json()

      const ordenPago = data.ordenPago

      flag = !(ordenPago === null)

      //console.log(flag)
      //console.log(ordenPago)
      if (flag) {
        dispatch(clearCart())
        localStorage.removeItem("cartId")
      }
      
    }
  }

  useEffect(() => {
    //console.log(localStorage.getItem("cartId"))
    validateCart().then()
  }, [])


  return (
    <div className="container mx-auto p-4 mb-4">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Tu Carrito</h1>
      <div className="w-10 h-1 bg-red-600 mb-4"></div>
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-gray-500">
          <ShoppingCartOutlinedIcon style={{ fontSize: 80 }} className="text-red-600" />
          <h2 className="mt-4 text-2xl font-semibold">Tu carrito está vacío</h2>
          <p className="text-lg">Agrega productos para verlos aquí.</p>
        </div>
      ) : (

        <div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md divide-slate-200 divide-y">
              {cartItems.map((item: CartItem) => (
                <CartItemCard id={item.id} quantity={item.quantity} sku={item.sku} key={item.id} />
              ))}
            </div>

            <div className="my-4">
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen del Pedido</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal:</span>
                      <span className="font-medium">{(totalPrice).toLocaleString("es-MX",{ style: "currency",
                        currency: "MXN"})} MXN</span>
                    </div>
                    {/*<div className="flex justify-between text-gray-600">*/}
                    {/*  <span>IVA (16%):</span>*/}
                    {/*  <span className="font-medium">{(totalPrice * 0.16).toLocaleString("es-MX",{ style: "currency",*/}
                    {/*    currency: "MXN"})} MXN</span>*/}
                    {/*</div>*/}
                    <div className="flex justify-between text-gray-600">
                      <span>Envío:</span>
                      <span className="font-medium">${(costoEnvio).toFixed(2)} MXN</span>
                    </div>
                    <div className={"border-b border-slate-200"}></div>
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total a pagar:</span>
                      <span>{(totalPrice + costoEnvio).toLocaleString("es-MX",{ style: "currency",
                           currency: "MXN"})} MXN</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <form onSubmit={handleSubmit}>
                      <button type={"submit"} className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors">
                        Continuar Compra
                      </button>
                    </form>
                    <div className="mt-4 flex justify-between text-sm">
                      <a onClick={()=> [
                          navigate("/tienda")
                      ]} className="text-blue-600 hover:underline">Seguir comprando</a>
                      <button onClick={handleClearCart} className="text-gray-500 hover:text-red-600 hover:underline">Vaciar carrito</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
