import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const Logout = () => {

    const navigate = useNavigate()

    useEffect(()=> {
        axios.post(`${apiUrl}/auth/logout`, null, { withCredentials: true })
          .catch(() => undefined)
          .finally(() => {
            localStorage.removeItem("user")
            navigate("/login")
          })
    }, [])

    return <>
        <div>
            Loggin out...
        </div>
    </>
}

export default Logout;
