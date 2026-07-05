import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAccessToken, saveTokens } from "../store/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TokenPayload } from "../types/TokenPayload";
import {
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaIndustry,
  FaTools,
  FaTruck,
  FaHeadset,
  FaEye,
  FaEyeSlash,
  FaExclamationCircle,
} from "react-icons/fa";
import logo from "../assets/coaim-transparent.png";

const apiUrl = import.meta.env.VITE_API_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(function validateAccess() {
    const token = getAccessToken();
    if (token) {
      navigate("/");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const auth = await axios.post(
        `${apiUrl}/auth/login`,
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (auth.status !== 200) {
        setError("Correo o contraseña incorrectos.");
        setIsLoading(false);
        return;
      }
      const credentials: TokenPayload = auth.data;
      saveTokens(credentials.access_token, credentials.refresh_token);
      navigate("/");
    } catch (error) {
      setError("Correo o contraseña incorrectos.");
      console.log(error);
      setIsLoading(false);
      return;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* --- Columna Izquierda: Branding y valor (solo desktop) --- */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 bg-neutral-900 text-white flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="relative z-10 p-12 flex flex-col h-full">
          <div className="mb-10">
            <img
              src={logo}
              alt="SISCAD"
              className="h-14 w-auto object-contain"
            />
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-3xl xl:text-4xl font-extrabold leading-tight mb-5">
              Accede a tu portal industrial
            </h2>
            <p className="text-neutral-400 text-base xl:text-lg leading-relaxed mb-10 max-w-md">
              Gestiona tus pedidos, cotizaciones y facturación desde un solo
              lugar. Diseñado para empresas y profesionales.
            </p>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <FaIndustry className="text-primary text-lg" />
                </div>
                <div>
                  <p className="font-semibold text-sm">+10,000 productos</p>
                  <p className="text-xs text-neutral-400">
                    Catálogo industrial actualizado
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <FaTools className="text-primary text-lg" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Cotizaciones B2B</p>
                  <p className="text-xs text-neutral-400">
                    Precios especiales por volumen
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <FaTruck className="text-primary text-lg" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Envíos a todo México</p>
                  <p className="text-xs text-neutral-400">
                    Logística confiable y segura
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <FaHeadset className="text-primary text-lg" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Atención especializada</p>
                  <p className="text-xs text-neutral-400">
                    Asesoría técnica personalizada
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} COAIM DEL BAJIO. Todos los
            derechos reservados.
          </div>
        </div>
      </div>

      {/* --- Columna Derecha: Formulario --- */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Logo en mobile */}
          <div className="flex justify-center lg:hidden mb-8">
            <img
              src={logo}
              alt="SISCAD"
              className="h-12 w-auto object-contain"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Iniciar sesión
              </h1>
              <p className="text-sm text-gray-500">
                Ingresa tus credenciales para acceder a tu cuenta.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 text-sm"
                    placeholder="tu@empresa.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-4 w-4" />
                    ) : (
                      <FaEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-100 p-3">
                  <FaExclamationCircle className="text-red-500 mt-0.5 flex-shrink-0 text-sm" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Ingresando...
                  </span>
                ) : (
                  <>
                    Iniciar sesión
                    <FaArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes una cuenta?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-primary hover:text-red-700 transition-colors duration-200 inline-flex items-center gap-1"
                >
                  Regístrate
                  <FaArrowRight className="h-3 w-3" />
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center lg:hidden">
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} COAIM DEL BAJIO. Todos los
              derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
