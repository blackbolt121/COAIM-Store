import axios from "axios";
import {Usuario} from "./UserSlice.ts";
const apiUrl = import.meta.env.VITE_API_URL;

export const getStoredUser = (): Usuario | null => {
  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user) as Usuario;
  } catch {
    return null;
  }
};

export const hasSession = () => Boolean(getStoredUser());

export const removeSession = () => {
  localStorage.removeItem("user");
};

export async function validateToken() {
  try {
    const response = await axios.post<string>(`${apiUrl}/auth/validate`,null,{
      headers: {
        Accept: "application/json",
      },
    });
    console.log(response);
    if (response.status !== 200) {
      removeSession();
      return false;
    }

  } catch {
    removeSession();
    return false;
  }
  
  try{
    const usuarioRequest = await axios.post(`${apiUrl}/auth/myself`, null, {
      headers: {
        Accept: "application/json",
      }
    });
    
    const usuario: Usuario = usuarioRequest.data;
    
    localStorage.setItem("user", JSON.stringify(usuario));
    return true
  }catch {
    console.log("Failed to load user data");
    removeSession();
    return false
  }
}
