import axios from "axios";
import { getCookie } from "./lib/cookies";

axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  const method = (config.method ?? "get").toUpperCase();

  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const csrfToken = getCookie("csrf_token");
    if (csrfToken) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>)["X-CSRF-Token"] = csrfToken;
    }
  }

  return config;
});
