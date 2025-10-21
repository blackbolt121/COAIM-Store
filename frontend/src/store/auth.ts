// Guardar los tokens en localStorage
import axios from "axios";
import {Usuario} from "./UserSlice.ts";
const apiUrl = import.meta.env.VITE_API_URL;

export const saveTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
};

// Recuperar los tokens
export const getAccessToken = () => {
  //validateToken().then(token => {console.log(token)})
  //    .catch(error => {console.log(error);});
  return localStorage.getItem('access_token');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refresh_token');
};

// Eliminar los tokens (por ejemplo, cuando el usuario cierre sesión)
export const removeTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};


export async function validateToken() {
  const token = localStorage.getItem('access_token');

  const headers =  {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  }

  try {
    await axios.post(`${apiUrl}/auth/validate`,null,{
      headers: headers,
    });
  } catch {
    return false;
  }
  
  try{
    const usuarioRequest = await axios.post(`${apiUrl}/auth/myself`, null, {
      headers: headers
    });
    
    const usuario: Usuario = usuarioRequest.data;
    
    localStorage.setItem("user", JSON.stringify(usuario));
    return true
  }catch {
    console.log("Failed to load user data");
    return true
  }
}
