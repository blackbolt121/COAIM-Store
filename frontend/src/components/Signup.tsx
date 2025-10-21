import React, { useEffect, useState } from "react";
import {
    FormControl,
    Input,
    Button,
    Card,
    Typography,
    FormHelperText,
    FormLabel,
    Select,
    Option,
    Snackbar, IconButton
} from "@mui/joy";
import {Link, useNavigate} from "react-router-dom"
import axios from "axios";
import { TokenPayload } from "../types/TokenPayload";
import {saveTokens, getAccessToken} from "../store/auth"
const apiUrl = import.meta.env.VITE_API_URL;
import municipiosPorEstado from "../estados.ts";
import {Close, Warning} from "@mui/icons-material";


const estadosDeMexico = [
    { label: 'Aguascalientes', value: 'AG' },
    { label: 'Baja California', value: 'BC' },
    { label: 'Baja California Sur', value: 'BS' },
    { label: 'Campeche', value: 'CM' },
    { label: 'Chiapas', value: 'CS' },
    { label: 'Chihuahua', value: 'CH' },
    { label: 'Ciudad de México', value: 'CX' },
    { label: 'Coahuila', value: 'CO' },
    { label: 'Colima', value: 'CL' },
    { label: 'Durango', value: 'DG' },
    { label: 'Guanajuato', value: 'GT' },
    { label: 'Guerrero', value: 'GR' },
    { label: 'Hidalgo', value: 'HG' },
    { label: 'Jalisco', value: 'JA' },
    { label: 'México', value: 'EM' },
    { label: 'Michoacán', value: 'MI' },
    { label: 'Morelos', value: 'MO' },
    { label: 'Nayarit', value: 'NA' },
    { label: 'Nuevo León', value: 'NL' },
    { label: 'Oaxaca', value: 'OA' },
    { label: 'Puebla', value: 'PU' },
    { label: 'Querétaro', value: 'QT' },
    { label: 'Quintana Roo', value: 'QR' },
    { label: 'San Luis Potosí', value: 'SL' },
    { label: 'Sinaloa', value: 'SI' },
    { label: 'Sonora', value: 'SO' },
    { label: 'Tabasco', value: 'TB' },
    { label: 'Tamaulipas', value: 'TM' },
    { label: 'Tlaxcala', value: 'TL' },
    { label: 'Veracruz', value: 'VE' },
    { label: 'Yucatán', value: 'YU' },
    { label: 'Zacatecas', value: 'ZA' },
];



const Signup = () => {

    const navigate = useNavigate()
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [telefono, setTelefono] = useState("");
    const [calle, setCalle] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [estadoDir, setEstadoDir] = useState(""); // para evitar conflicto con palabra reservada
    const [pais, setPais] = useState("MX");
    const [codigoPostal, setCodigoPostal] = useState("");
    const [open, setOpen] = useState(false);



    useEffect(()=> {
        const token = getAccessToken()
        if(token){
            navigate("/")
        }
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validar si las contraseñas coinciden
        if (password !== confirmPassword) {
            setError("Las contraseñas no son coinciden");
            return;
        }

        // Validar si todos los campos están completos
        if (!name || !email || !password || !confirmPassword) {
            setError("Todos los campos son requeridos");
            return;
        }

        // Aquí iría el código para crear el usuario (enviar a un backend, etc.)
        setError(null); // Limpiar el error
        //alert("Signup")

        const request  = await axios.post(`${apiUrl}/auth/register`, {
            email,
            password,
            name,
            telefono,
            calle,
            ciudad,
            estado: estadoDir,
            pais,
            codigoPostal
        }, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })

        const tokenAuth: TokenPayload = request.data

        saveTokens(tokenAuth.access_token, tokenAuth.refresh_token)
        setOpen(true)
        //console.log(tokenAuth)

        navigate("/")
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card variant="outlined" className="w-full 2xl:max-w-2xl xl:max-w-2xl lg:max-w-lg md:max-w-md sm:max-w-sm p-8 space-y-6 my-10">
                <Typography level="h4" sx={{ textAlign: "center" }}>
                    Registrarte
                </Typography>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <FormControl required>
                            <FormLabel required>
                                Nombre
                            </FormLabel>
                            <Input
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoComplete="name"
                            />
                            {error && name === "" && (
                                <FormHelperText sx={{ color: "red" }}>Name is required</FormHelperText>
                            )}
                        </FormControl>
                    </div>
                    <div>
                        <FormControl required>
                            <FormLabel htmlFor="email">
                                Correo Electronico
                            </FormLabel>
                            <Input
                                name="email"
                                placeholder="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                            />
                            {error && email === "" && (
                                <FormHelperText sx={{ color: "red" }}>Email is required</FormHelperText>
                            )}
                        </FormControl>
                    </div>
                    <div>
                        <FormControl required>
                            <FormLabel htmlFor="password">
                                Contraseña
                            </FormLabel>
                            <Input
                                name="password"
                                placeholder="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                            />
                            {error && password === "" && (
                                <FormHelperText sx={{ color: "red" }}>Password is required</FormHelperText>
                            )}
                        </FormControl>
                    </div>
                    <div>
                        <FormControl required>
                            <FormLabel htmlFor="confirmpassword">
                                Confirma contraseña
                            </FormLabel>
                            <Input
                                name="confirmpassword"
                                placeholder="Confirm Password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                autoComplete="new-password"
                            />
                            {error && confirmPassword === "" && (
                                <FormHelperText sx={{ color: "red" }}>Confirm Password is required</FormHelperText>
                            )}
                        </FormControl>
                    </div>

                    <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4">
                        <FormControl>
                            <FormLabel>Teléfono</FormLabel>
                            <Input
                            placeholder="Teléfono"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>País</FormLabel>
                            <Select defaultValue={"MX"} onChange={(_,value) => setPais(value?value:"MX")}>
                                <Option value={"MX"} >Mexico</Option>
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Estado</FormLabel>
                            {/*<Input*/}
                            {/*placeholder="Estado"*/}
                            {/*value={estadoDir}*/}
                            {/*onChange={(e) => setEstadoDir(e.target.value)}*/}
                            {/*/>*/}
                            <Select
                                placeholder="Selecciona un estado..."
                                value={estadoDir}
                                onChange={(_, value) => setEstadoDir(value?value:"QT")}
                            >
                                {estadosDeMexico.map((estado) => (
                                    <Option key={estado.value} value={estado.value}>
                                        {estado.label}
                                    </Option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Ciudad</FormLabel>
                            <Select
                                placeholder="Selecciona una ciudad..."
                                value={ciudad}
                                // Deshabilita el dropdown de ciudad si no hay un estado seleccionado
                                disabled={!estadoDir}
                                onChange={(_, nuevaCiudad) => setCiudad(nuevaCiudad?nuevaCiudad:"")}
                            >
                                <Option value={""}>Sin seleccionar</Option>
                                {estadoDir && municipiosPorEstado[`${estadoDir}`].map((ciudad) => (
                                    <Option key={ciudad} value={ciudad}>
                                        {ciudad}
                                    </Option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Calle</FormLabel>
                            <Input
                                placeholder="Calle"
                                value={calle}
                                onChange={(e) => setCalle(e.target.value)}
                            />
                        </FormControl>


                        <FormControl>
                            <FormLabel>Código Postal</FormLabel>
                            <Input
                            placeholder="Código Postal"
                            value={codigoPostal}
                            onChange={(e) => setCodigoPostal(e.target.value)}
                            />
                        </FormControl>
                    </div>

                    {error && password !== confirmPassword && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}
                    <Button type="submit" fullWidth>
                        Registrate
                    </Button>
                </form>
                <div className="text-center">
                    <Typography level="body-lg" color="primary">
                        ¿Ya tienes una cuenta?{" "}
                        <Link to="/login" className="text-indigo-600 hover:underline">
                            Inicia sesión
                        </Link>
                    </Typography>
                </div>
            </Card>
            <Snackbar
                autoHideDuration={3000}
                open={open}
                variant={"solid"}
                color={"danger"}
                onClose={(_, reason) => {
                    if (reason === 'clickaway') {
                        return;
                    }
                    setOpen(false);
                }}
            >
                <Warning color={"warning"}/>
                <Typography level="body-md">
                    Error al registrar, verifica los campos o el correo ya puede haber sido registrado
                </Typography>
                <IconButton
                    variant="plain"
                    sx={{
                        '--IconButton-size': '32px',
                        transform: 'translate(0.5rem, -0.5rem)',
                    }}
                >
                    <Close />
                </IconButton>
            </Snackbar>
        </div>
    );
};

export default Signup;
