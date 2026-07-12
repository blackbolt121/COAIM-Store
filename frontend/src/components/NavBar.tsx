import { useEffect, useState } from "react";
import { Button, Sheet, IconButton, Badge } from "@mui/joy";
import { Menu, Close, ShoppingCart } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/siscadindustrial-recortado.svg" //"../assets/smarshop.png"
import { useSelector } from "react-redux";
import { RootState } from '../store/store';
import UserProfile from "./UserProfile.tsx";
import {useLocation} from "react-router-dom";
//const apiUrl = import.meta.env.VITE_API_URL;




const Navbar = () => {
  
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.user.usuario);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate()

  const location = useLocation()

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const hideMenu = () => {
    setIsMobileMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinkClass = (path: string) =>
    `relative px-1 py-2 text-sm font-semibold tracking-wide transition-colors duration-200 hover:text-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-sm ${location.pathname === path ? "text-primary after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-primary" : "text-slate-700"}`;

  return (
    <nav className={`sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl transition-shadow duration-300 ${isScrolled ? "shadow-[0_8px_30px_rgba(15,23,42,0.08)]" : "shadow-none"}`}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center min-w-0">
          <Link to={"/"} className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-md">
            <img alt={"SISCAD"} src={logo} width={170} className="h-12 w-auto object-contain" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          <Link to="/" className={navLinkClass("/")}>Inicio</Link>
          <Link to="/about" className={navLinkClass("/about")}>Acerca</Link>
          <Link to="/contact" className={navLinkClass("/contact")}>Contacto</Link>
          <Link to="/tienda" className={navLinkClass("/tienda")}>Tienda</Link>
          <Link to="/cart" className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-md">
                <Badge badgeContent={cartItems.length} variant="solid" color="danger" size="sm">
                  <ShoppingCart />
                </Badge>
          </Link>
           {user?.email ? <UserProfile/> : <Button variant="solid" className="!rounded-full !px-5 !py-2.5 !text-sm !font-semibold !shadow-sm hover:!shadow-md !bg-primary !text-white hover:!bg-red-700 active:!bg-red-800" onClick={async () => {
             navigate(user?.email ? "/logout" : "/login")
           }}>
            {user?.email ? "Cerrar sesión" : "Inicia sesión"}
           </Button>}
        </div>
          
        {/* Mobile Menu Icon */}
        <div className="md:hidden flex gap-2 items-center">
          {user?.email ? <UserProfile/> : <></>}
          <Link to="/cart" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-md"><IconButton variant="plain" color="neutral">
            <Badge badgeContent={cartItems.length} variant="solid" color="danger" size="sm">
              <ShoppingCart />
            </Badge>
          </IconButton>
          </Link>
          <IconButton onClick={toggleMenu} color="neutral" variant="soft" className="!rounded-full !bg-slate-100">
            {isMobileMenuOpen ? <Close /> : <Menu />}
          </IconButton>
        </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (<div>
        <Sheet className="p-4 absolute top-20 left-0 right-0 z-10 md:hidden border-t border-slate-200 bg-white/98 backdrop-blur-xl shadow-[0_12px_40px_rgba(15,23,42,0.12)]">
          <div className="flex flex-col text-black gap-1">
            <Link to="/" onClick={hideMenu} className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${location.pathname == "/"? "bg-primary text-white" : "text-slate-700 hover:bg-slate-100 hover:text-primary"}`}>Inicio</Link>
            <Link to="/about" onClick={hideMenu} className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${location.pathname == "/about"? "bg-primary text-white" : "text-slate-700 hover:bg-slate-100 hover:text-primary"}`}>Acerca</Link>
            <Link to="/contact" onClick={hideMenu} className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${location.pathname == "/contact"? "bg-primary text-white" : "text-slate-700 hover:bg-slate-100 hover:text-primary"}`}>Contacto</Link>
            <Link to="/tienda" onClick={hideMenu} className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${location.pathname == "/tienda"? "bg-primary text-white" : "text-slate-700 hover:bg-slate-100 hover:text-primary"}`}>Tienda</Link>
            {user?.email ? <></> : <Button variant="solid" className="mt-3 !rounded-full !py-3 !font-semibold !bg-primary !text-white hover:!bg-red-700 active:!bg-red-800" onClick={async () => {
              hideMenu()
              navigate("/login")

            }}>
              Inicia sesión
            </Button>}
          </div>
        </Sheet>
      </div>
      )}
    </nav>
  );
};

export default Navbar;
