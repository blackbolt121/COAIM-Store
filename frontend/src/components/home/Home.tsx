import { useEffect } from "react";
import LandingPage from "../LandingPage";
import { setSeo } from "../../lib/seo";
// import { getAccessToken } from "../../store/auth";
// import { useNavigate } from "react-router-dom";
export const Home = () => {
    useEffect(() => {
        setSeo({
            title: 'SISCAD Industrial | Herramientas, Automatización y Refacciones Industriales',
            description: 'SISCAD Industrial es un distribuidor especializado en herramientas, automatización, seguridad industrial, maquinaria, instrumentación y componentes industriales para empresas.',
            canonicalPath: '/',
            image: '/siscadindustrial-recortado.svg',
            jsonLdId: 'product-jsonld',
        });
    }, []);

    // const navigate = useNavigate()
    // useEffect(()=>{

    // }, [])

    // useEffect(() => {
    //     console.log(getAccessToken())
    //     if(getAccessToken() === null){
    //       if(!(location.href.includes("login") || location.href.includes("signup"))){
    //         navigate("/login")
    //       }
    //     }
    
    //   }, [getAccessToken()])

    return <>
        <LandingPage />
    </>
}
