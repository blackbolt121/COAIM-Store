import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {

    const navigate = useNavigate()
 
    useEffect(()=> {
        localStorage.removeItem("access_token")
        navigate("/login")
    }, [])

    return <>
        <div>
            Loggin out...
        </div>
    </>
}

export default Logout;