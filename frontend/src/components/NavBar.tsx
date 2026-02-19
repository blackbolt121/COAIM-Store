import { useEffect, useState } from "react";
import { Button, Sheet, IconButton, Badge } from "@mui/joy";
import { Menu, Close, ShoppingCart } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png" //"../assets/smarshop.png"
import { getAccessToken } from "../store/auth";
import { useSelector } from "react-redux";
import { RootState } from '../store/store';
import UserProfile from "./UserProfile.tsx";
import {useLocation} from "react-router-dom";
//const apiUrl = import.meta.env.VITE_API_URL;




const Navbar = () => {
  
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate()
  const [token, setToken] = useState<string>("")
  const [logText, setLogText] = useState<string>("Inicia sesión")

  const location = useLocation()

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const hideMenu = () => {
    setIsMobileMenuOpen(false);
  }

  useEffect(()=>{
    setToken(getAccessToken() || "")
  }, [getAccessToken()])
  
  useEffect(()=>{
    setToken(getAccessToken() || "")
  }, [])

  useEffect(()=>{
    if(token){
      setLogText("Cerrar sesión")
    }else{
      setLogText("Inicia sesión")
    }
  }, [token])

  return (
    <nav className="bg-[#0069DF] shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 py-5 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Link to={"/"}><img alt={"MercadoUrrea.com.mx"} src={logo} width={200} /></Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-black md:items-center md:justify-center">
          <Link to="/" className={`hover:text-gray-100 transition-colors font-bold text-white ${location.pathname == "/"? "border-b-2 border-b-white" : ""}`}>Inicio</Link>
          <Link to="/about" className={`hover:text-gray-100 transition-colors font-bold text-white ${location.pathname == "/about"? "border-b-2 border-b-white" : ""}`}>Acerca</Link>
          <Link to="/contact" className={`hover:text-gray-100 transition-colors font-bold text-white ${location.pathname == "/contact"? "border-b-2 border-b-white" : ""}`}>Contacto</Link>
          <Link to="/tienda" className={`hover:text-gray-100 transition-colors font-bold text-white ${location.pathname == "/tienda"? "border-b-2 border-b-white" : ""}`}>Tienda</Link>
          <Link to="/cart" className={`hover:text-gray-100 transition-colors font-bold text-white ${location.pathname == "/cart"? "border-b-2 border-b-white" : ""}`}><IconButton variant="plain" sx={{color: "white"}}>
                <Badge badgeContent={cartItems.length} variant="solid" color="primary">
                  <ShoppingCart />
                </Badge>
            </IconButton>
          </Link>
          {(getAccessToken())? <UserProfile/> : <Button variant="outlined" color="primary" sx={{ color: "white", hover: { backgroundColor: ""}}} className="" onClick={async () => {
            if (getAccessToken()) {
              localStorage.removeItem("access_token")
              localStorage.removeItem("refresh_token")
              //let request = await axios.post(`${apiUrl}/auth/logout`)
              //console.log(getAccessToken())
              navigate("/logout")
            }else {
              navigate("/login")
            }

          }}>
            {logText}
          </Button>}
        </div>
          
        {/* Mobile Menu Icon */}
        <div className="md:hidden flex gap-2 items-center">
          {(getAccessToken())? <UserProfile/> : <></>}
          <Link to="/cart" className={`hover:text-gray-100 p-2 transition-colors font-bold ${location.pathname == "/cart"? "border-b-2 border-b-white" : ""}`}><IconButton variant="plain" color="neutral">
            <Badge badgeContent={cartItems.length} variant="solid" color="primary">
              <ShoppingCart />
            </Badge>
          </IconButton>
          </Link>
          <IconButton onClick={toggleMenu} color="neutral">
            {isMobileMenuOpen ? <Close /> : <Menu />}
          </IconButton>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (<div>
        <Sheet className="p-4 absolute top-0 left-0 right-0 z-10 md:hidden">
          <div className="flex flex-col text-black">
            <Link to="/" onClick={hideMenu} className={`p-2 transition-colors font-bold text-white ${location.pathname == "/"? "bg-blue-500 text-white" : "hover:text-gray-100"}`}>Inicio</Link>
            <Link to="/about" onClick={hideMenu} className={`p-2 transition-colors font-bold text-white ${location.pathname == "/about"? "bg-blue-500 text-white" : "hover:text-gray-100"}`}>Acerca</Link>
            <Link to="/contact" onClick={hideMenu} className={`p-2 transition-colors font-bold text-white ${location.pathname == "/contact"? "bg-blue-500 text-white" : "hover:text-gray-100"}`}>Contacto</Link>
            <Link to="/tienda" onClick={hideMenu} className={`p-2 transition-colors font-bold text-white ${location.pathname == "/tienda"? "bg-blue-500 text-white" : "hover:text-gray-100"}`}>Tienda</Link>
            {(getAccessToken())? <></> : <Button variant="outlined" color="danger" sx={{ color: "black", mt: 1 }} className="text-white hover:bg-blue-600 hover:text-black" onClick={async () => {
              hideMenu()
              if (getAccessToken()) {
                localStorage.removeItem("access_token")
                localStorage.removeItem("refresh_token")
                //let request = await axios.post(`${apiUrl}/auth/logout`)
                //console.log(getAccessToken())
                navigate("/logout")
              }else {
                navigate("/login")
              }

            }}>
              {logText}
            </Button>}
          </div>
        </Sheet>
      </div>
      )}
    </nav>
  );
};

export default Navbar;
