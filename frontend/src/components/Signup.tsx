import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { TokenPayload } from "../types/TokenPayload";
import { saveTokens, getAccessToken } from "../store/auth";
import municipiosPorEstado from "../estados.ts";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaPhone,
  FaMapMarkerAlt,
  FaGlobeAmericas,
  FaCity,
  FaRoad,
  FaMapPin,
  FaArrowRight,
  FaExclamationCircle,
  FaIndustry,
  FaTools,
  FaTruck,
  FaHeadset,
  FaChevronDown,
} from "react-icons/fa";
import logo from "../assets/coaim-transparent.png";

const apiUrl = import.meta.env.VITE_API_URL;

const estadosDeMexico = [
  { label: "Aguascalientes", value: "AG" },
  { label: "Baja California", value: "BC" },
  { label: "Baja California Sur", value: "BS" },
  { label: "Campeche", value: "CM" },
  { label: "Chiapas", value: "CS" },
  { label: "Chihuahua", value: "CH" },
  { label: "Ciudad de México", value: "CX" },
  { label: "Coahuila", value: "CO" },
  { label: "Colima", value: "CL" },
  { label: "Durango", value: "DG" },
  { label: "Guanajuato", value: "GT" },
  { label: "Guerrero", value: "GR" },
  { label: "Hidalgo", value: "HG" },
  { label: "Jalisco", value: "JA" },
  { label: "México", value: "EM" },
  { label: "Michoacán", value: "MI" },
  { label: "Morelos", value: "MO" },
  { label: "Nayarit", value: "NA" },
  { label: "Nuevo León", value: "NL" },
  { label: "Oaxaca", value: "OA" },
  { label: "Puebla", value: "PU" },
  { label: "Querétaro", value: "QT" },
  { label: "Quintana Roo", value: "QR" },
  { label: "San Luis Potosí", value: "SL" },
  { label: "Sinaloa", value: "SI" },
  { label: "Sonora", value: "SO" },
  { label: "Tabasco", value: "TB" },
  { label: "Tamaulipas", value: "TM" },
  { label: "Tlaxcala", value: "TL" },
  { label: "Veracruz", value: "VE" },
  { label: "Yucatán", value: "YU" },
  { label: "Zacatecas", value: "ZA" },
];

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

const FieldWrapper = ({ label, children }: FieldProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
    </label>
    <div className="relative">{children}</div>
  </div>
);

const InputWithIcon = ({
  icon,
  type = "text",
  placeholder,
  value,
  onChange,
  autoComplete,
  required = false,
  maxLength,
}: {
  icon: React.ReactNode;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  required?: boolean;
  maxLength?: number;
}) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
      {icon}
    </div>
    <input
      type={type}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      required={required}
      maxLength={maxLength}
      placeholder={placeholder}
      className="block w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 text-sm"
    />
  </div>
);

const PasswordInput = ({
  placeholder,
  value,
  onChange,
  show,
  toggle,
  autoComplete,
  required = false,
}: {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  show: boolean;
  toggle: () => void;
  autoComplete?: string;
  required?: boolean;
}) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
      <FaLock />
    </div>
    <input
      type={show ? "text" : "password"}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      required={required}
      placeholder={placeholder}
      className="block w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 text-sm"
    />
    <button
      type="button"
      onClick={toggle}
      tabIndex={-1}
      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
    >
      {show ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
    </button>
  </div>
);

const SelectWithIcon = ({
  icon,
  value,
  onChange,
  required = false,
  disabled = false,
  children,
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
      {icon}
    </div>
    <select
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className="block w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 text-sm appearance-none bg-white disabled:bg-gray-100 disabled:text-gray-500"
    >
      {children}
    </select>
    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
      <FaChevronDown className="h-3 w-3" />
    </div>
  </div>
);

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [telefono, setTelefono] = useState("");
  const [calle, setCalle] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [estadoDir, setEstadoDir] = useState("");
  const [pais, setPais] = useState("MX");
  const [codigoPostal, setCodigoPostal] = useState("");

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      navigate("/");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password || !confirmPassword) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setIsLoading(true);

    try {
      const request = await axios.post(
        `${apiUrl}/auth/register`,
        {
          email,
          password,
          name,
          telefono,
          calle,
          ciudad,
          estado: estadoDir,
          pais,
          codigoPostal,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const tokenAuth: TokenPayload = request.data;
      saveTokens(tokenAuth.access_token, tokenAuth.refresh_token);
      navigate("/");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Error al registrar. Verifica los campos o intenta con otro correo.";
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* --- Columna Izquierda: Branding --- */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/3 bg-neutral-900 text-white flex-col justify-between relative overflow-hidden">
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
              Únete al portal industrial
            </h2>
            <p className="text-neutral-400 text-base xl:text-lg leading-relaxed mb-10 max-w-md">
              Crea tu cuenta para acceder a precios B2B, cotizaciones
              personalizadas y seguimiento de pedidos en tiempo real.
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
                  <p className="font-semibold text-sm">
                    Atención especializada
                  </p>
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
      <div className="flex-1 flex items-start justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 py-10 md:py-12 overflow-y-auto">
        <div className="w-full max-w-2xl">
          {/* Logo mobile */}
          <div className="flex justify-center lg:hidden mb-6">
            <img
              src={logo}
              alt="SISCAD"
              className="h-12 w-auto object-contain"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 lg:p-10">
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Crear cuenta
              </h1>
              <p className="text-sm text-gray-500">
                Completa tus datos para comenzar a comprar y cotizar.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error general */}
              {error && (
                <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-100 p-3">
                  <FaExclamationCircle className="text-red-500 mt-0.5 flex-shrink-0 text-sm" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Sección: Cuenta */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                  Información de la cuenta
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FieldWrapper label="Nombre completo">
                    <InputWithIcon
                      icon={<FaUser />}
                      placeholder="Nombre completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      required
                    />
                  </FieldWrapper>

                  <FieldWrapper
                    label="Correo electrónico"
                  >
                    <InputWithIcon
                      icon={<FaEnvelope />}
                      type="email"
                      placeholder="tu@empresa.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </FieldWrapper>

                  <FieldWrapper label="Contraseña">
                    <PasswordInput
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      show={showPassword}
                      toggle={() => setShowPassword(!showPassword)}
                      autoComplete="new-password"
                      required
                    />
                  </FieldWrapper>

                  <FieldWrapper
                    label="Confirmar contraseña"
                  >
                    <PasswordInput
                      placeholder="Repite tu contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      show={showConfirmPassword}
                      toggle={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      autoComplete="new-password"
                      required
                    />
                  </FieldWrapper>
                </div>
              </div>

              {/* Sección: Dirección */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                  Dirección de envío
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  <FieldWrapper label="Teléfono">
                    <InputWithIcon
                      icon={<FaPhone />}
                      type="tel"
                      placeholder="Teléfono de contacto"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      autoComplete="tel"
                    />
                  </FieldWrapper>

                  
                  <FieldWrapper label="País">
                    <SelectWithIcon
                      icon={<FaGlobeAmericas />}
                      value={pais}
                      onChange={(e) => setPais(e.target.value)}
                    >
                      <option value="MX">México</option>
                    </SelectWithIcon>
                  </FieldWrapper>

                  
                  <FieldWrapper label="Estado">
                    <SelectWithIcon
                      icon={<FaMapMarkerAlt />}
                      value={estadoDir}
                      onChange={(e) => {
                        setEstadoDir(e.target.value);
                        setCiudad("");
                      }}
                    >
                      <option value="">Selecciona un estado…</option>
                      {estadosDeMexico.map((estado) => (
                        <option key={estado.value} value={estado.value}>
                          {estado.label}
                        </option>
                      ))}
                    </SelectWithIcon>
                  </FieldWrapper>

                  
                  <FieldWrapper label="Ciudad / Municipio">
                    <SelectWithIcon
                      icon={<FaCity />}
                      value={ciudad}
                      onChange={(e) => setCiudad(e.target.value)}
                      disabled={!estadoDir}
                    >
                      <option value="">
                        {estadoDir
                          ? "Selecciona una ciudad…"
                          : "Primero selecciona un estado"}
                      </option>
                      {estadoDir &&
                        municipiosPorEstado[estadoDir]?.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                    </SelectWithIcon>
                  </FieldWrapper>

                  
                  <FieldWrapper label="Calle y número">
                    <InputWithIcon
                      icon={<FaRoad />}
                      placeholder="Calle, número exterior e interior"
                      value={calle}
                      onChange={(e) => setCalle(e.target.value)}
                      autoComplete="street-address"
                    />
                  </FieldWrapper>

                  
                  <FieldWrapper label="Código postal">
                    <InputWithIcon
                      icon={<FaMapPin />}
                      type="text"
                      placeholder="Código postal"
                      value={codigoPostal}
                      onChange={(e) => setCodigoPostal(e.target.value)}
                      autoComplete="postal-code"
                      maxLength={10}
                    />
                  </FieldWrapper>
                </div>
              </div>

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
                    Creando cuenta...
                  </span>
                ) : (
                  <>
                    Crear cuenta
                    <FaArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-primary hover:text-red-700 transition-colors duration-200 inline-flex items-center gap-1"
                >
                  Inicia sesión
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

export default Signup;
