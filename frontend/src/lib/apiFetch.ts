import { getCookie } from "./cookies";

const unsafeMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export const apiFetch = (input: RequestInfo | URL, init: RequestInit = {}) => {
  const method = (init.method ?? "GET").toUpperCase();
  const headers = new Headers(init.headers ?? {});

  if (unsafeMethods.has(method)) {
    const csrfToken = getCookie("csrf_token");
    if (csrfToken) {
      headers.set("X-CSRF-Token", csrfToken);
    }
  }

  return fetch(input, {
    ...init,
    headers,
    credentials: init.credentials ?? "include",
  });
};
