import './App.css'
import {Route, Routes, useNavigate} from "react-router-dom";
import { Home } from './components/home/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Navbar from './components/NavBar';
import About from './components/About';
import ContactPage from './components/ContactPage';
import {getAccessToken, removeTokens, validateToken} from './store/auth';
import { useEffect } from 'react';
import { Tienda } from './components/Tienda/Tienda';
import Footer from './components/Footer';
import { ProductPage } from './components/Product/ProductPage';
import Cart from './components/Cart';
import { useLocation } from 'react-router-dom';
import Logout from './components/Logout';
import { useDispatch } from "react-redux";
import { clearCart } from "./store/cartSlice";
import ScrollTop from "./components/ScrollTop.tsx";
import PedidosLanding from "./components/Pedidos/PedidosLanding.tsx";
import PedidosPage from "./components/Pedidos/PedidosPage/PedidosPage.tsx";
import PageNotFound from "./components/PageNotFound";
import CotizacionLanding from "./components/Cotizaciones/CotizacionLanding.tsx";
import QuotePage from "./components/Cotizaciones/QuotePage/QuotePage.tsx";
import TerminosPage from "./components/Terminos/TerminosPage.tsx";
const apiUrl = import.meta.env.VITE_API_URL;
import Help from "./components/Help";

function App() {

  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch();


  useEffect(() => {
      async function validateCart() {

          const cartId = localStorage.getItem("cartId")

          let flag = false

          if (cartId != null) {

              //console.log(cartId)

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
          }else{
              //console.log("No cart assigned")
          }
      }
      validateCart().catch()
  }, [dispatch])

  useEffect(() => {
    
    //const path = location.pathname

    //console.log(path);

    validateToken().then( (validation: boolean) => {
        if(!validation){
            // console.log('Token is invalid')
            removeTokens()
        }
    }).catch((error)=>{
        console.log(error)
        // console.log("Failed to validate");
        removeTokens();
    });

    if(getAccessToken() === null){
      if(location.pathname.startsWith("/cart")
          || location.pathname.startsWith("/pedidos")
          || location.pathname.startsWith("/pedido/")
          || location.pathname.startsWith("/cotizaciones")){
        navigate(`/login?`)
      }
    }

  }, [location, navigate])

  return (
    <>
      <div className='min-h-screen'>
          <Navbar />
          <ScrollTop />
        <Routes>
            <Route path={"/"} element={<Home/>} />
            <Route path={"/explorar"} element={<>Catalogo de Productos</>} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/logout' element={<Logout/>} />
            <Route path='/about' element={<div><About /></div>} />
            <Route path='/contact' element={<div><ContactPage /></div>} />
            <Route path='/tienda' element={<Tienda />} />
            <Route path='/producto/:id' element={<ProductPage />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='*' element={<PageNotFound/>} />
            <Route path={"/pedidos"} element={<PedidosLanding/>} />
            <Route path={"/pedido/:id"} element={<PedidosPage />} />
            <Route path={"/cotizaciones"} element={<CotizacionLanding />} />
            <Route path={"/cotizacion/:id"} element={<QuotePage />} />
            <Route path={"/terminos_y_condiciones"} element={<TerminosPage/>} />
        </Routes>
      </div>
      <Footer />
        <Help />
    </>
  )
}

export default App
