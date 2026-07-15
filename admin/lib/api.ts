const rawApiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
const API_BASE_URL = rawApiBaseUrl ? rawApiBaseUrl.replace(/\/$/, "") : "";

type JsonObject = Record<string, unknown>;

function getCookie(name: string) {
  if (typeof document === "undefined") return null;

  const prefix = `${name}=`;
  const entry = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  return entry ? decodeURIComponent(entry.slice(prefix.length)) : null;
}

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  telefono?: string | null;
  calle?: string | null;
  ciudad?: string | null;
  estado?: string | null;
  pais?: string | null;
  codigoPostal?: string | null;
  activo?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  roles?: string[] | null;
};

export type AdminOrder = {
  id: number;
  userId?: string | null;
  userName?: string | null;
  userEmail?: string | null;
  guia?: string | null;
  status?: string | null;
  total: number;
  itemsCount: number;
  items?: Array<{
    productId?: string | null;
    productName?: string | null;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }> | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const method = (init?.method ?? "GET").toUpperCase();
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");

  const body = init?.body;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  if (!isFormData) {
    headers.set("Content-Type", "application/json");
  }

  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const csrfToken = getCookie("csrf_token");
    if (csrfToken) {
      headers.set("X-CSRF-Token", csrfToken);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers,
    ...init,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json() as Promise<T>;
  }

  return response.text() as Promise<T>;
}

export type AuthResponse = {
  access_token: string;
  refresh_token?: string;
};

export type TokenValidationResponse = string;

export type UserProfile = {
  id?: string;
  email?: string;
  name?: string;
  roles?: string[];
};

export type ProductCountResponse = {
  count: number;
};

export type DashboardSalesPoint = {
  year: number;
  month: number;
  totalSales: number;
};

export type DashboardCategoryPoint = {
  category: string;
  count: number;
};

export type AdminDashboardResponse = {
  totalUsuarios: number;
  totalProductos: number;
  pedidosNuevos: number;
  ingresosMes: number;
  ultimosPedidos: AdminOrder[];
  salesData: DashboardSalesPoint[];
  categoryData: DashboardCategoryPoint[];
};

export type Product = {
  id: string;
  name: string;
  sku?: string | null;
  description?: string | null;
  price?: number | null;
  imageUrl?: string | null;
  category?: string | null;
  brand?: string | null;
  vendor?: { id?: string | number; name?: string | null; vendorId?: string | null; vendorName?: string | null } | null;
};

export type ProductSearchResponse = {
  content: Product[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  facets?: Record<string, Record<string, number>>;
};

export type Vendor = {
  vendorId: string;
  vendorName: string;
  vendorEmail?: string | null;
  vendorPhone?: string | null;
  vendorAddress?: string | null;
  vendorCity?: string | null;
  vendorState?: string | null;
  vendorZipCode?: string | null;
  vendorPostalCode?: string | null;
  vendorWebsite?: string | null;
  vendorWebsiteUrl?: string | null;
  vendorFaxUrl?: string | null;
};

export type Promotion = {
  id: string;
  title: string;
  image?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  active: boolean;
  displayOrder?: number | null;
};

export async function loginAdmin(email: string, password: string) {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function validateAdminSession() {
  return apiFetch<TokenValidationResponse>("/auth/validate", { method: "POST" });
}

export async function logoutAdmin() {
  return apiFetch<string>("/admin/rest/logout");
}

export async function getCurrentUser() {
  return apiFetch<UserProfile>("/auth/myself", { method: "POST" });
}

export async function getProductCount() {
  return apiFetch<ProductCountResponse>("/rest/api/1/producto/count");
}

export async function getAdminDashboard() {
  return apiFetch<AdminDashboardResponse>("/rest/api/1/admin/dashboard");
}

export async function getProductCategories() {
  return apiFetch<string[]>("/rest/api/1/producto/categorias");
}

export async function getTopProducts() {
  return apiFetch<JsonObject[]>("/rest/api/1/producto/top");
}

export async function getVendors() {
  return apiFetch<Vendor[]>("/rest/api/1/vendor/all");
}

export async function getAllProducts(params: {
  name?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  page?: number;
  size?: number;
}) {
  const query = new URLSearchParams();

  if (params.name) query.set("name", params.name);
  params.categories?.forEach((category) => query.append("categories", category));
  if (params.minPrice !== undefined) query.set("minPrice", String(params.minPrice));
  if (params.maxPrice !== undefined) query.set("maxPrice", String(params.maxPrice));
  if (params.brand) query.set("brand", params.brand);
  query.set("page", String(params.page ?? 0));
  query.set("size", String(params.size ?? 12));

  const suffix = query.toString() ? `?${query.toString()}` : "";
  return apiFetch<ProductSearchResponse>(`/rest/api/1/producto/all${suffix}`);
}

export async function searchProducts(params: {
  q?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  size?: number;
}) {
  const query = new URLSearchParams();

  if (params.q) query.set("q", params.q);
  if (params.category) query.set("category", params.category);
  if (params.brand) query.set("brand", params.brand);
  if (params.minPrice !== undefined) query.set("minPrice", String(params.minPrice));
  if (params.maxPrice !== undefined) query.set("maxPrice", String(params.maxPrice));
  if (params.sort) query.set("sort", params.sort);
  query.set("page", String(params.page ?? 0));
  query.set("size", String(params.size ?? 12));

  const suffix = query.toString() ? `?${query.toString()}` : "";
  return apiFetch<ProductSearchResponse>(`/rest/api/1/producto/search${suffix}`);
}

export async function getProductById(id: string) {
  return apiFetch<Product>(`/rest/api/1/producto?id=${encodeURIComponent(id)}`);
}

export async function updateProduct(id: string, payload: Product & { vendor?: { vendorId?: string | null; vendorName?: string | null } | null }) {
  return apiFetch<Product>(`/rest/api/1/producto?id=${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function getPromotions() {
  return apiFetch<JsonObject[]>("/rest/api/1/promotions");
}

export async function getAdminPromotions() {
  return apiFetch<Promotion[]>("/rest/api/1/admin/promotions");
}

export async function getPromotionById(id: string) {
  return apiFetch<Promotion>(`/rest/api/1/admin/promotions/${encodeURIComponent(id)}`);
}

export async function createPromotion(payload: FormData) {
  return apiFetch<Promotion>("/rest/api/1/admin/promotions", {
    method: "POST",
    body: payload,
  });
}

export async function updatePromotion(id: string, payload: FormData) {
  return apiFetch<Promotion>(`/rest/api/1/admin/promotions/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: payload,
  });
}

export async function updatePromotionImage(id: string, payload: FormData) {
  return apiFetch<Promotion>(`/rest/api/1/admin/promotions/${encodeURIComponent(id)}/image`, {
    method: "PUT",
    body: payload,
  });
}

export async function deletePromotion(id: string) {
  return apiFetch<void>(`/rest/api/1/admin/promotions/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function getAdminUsers() {
  return apiFetch<AdminUser[]>("/rest/api/1/admin/users");
}

export async function getAdminUser(id: string) {
  return apiFetch<AdminUser>(`/rest/api/1/admin/users/${id}`);
}

export async function updateAdminUser(id: string, payload: Partial<AdminUser> & { roles?: string[] }) {
  return apiFetch<AdminUser>(`/rest/api/1/admin/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function getAdminOrders() {
  return apiFetch<AdminOrder[]>("/rest/api/1/admin/orders");
}

export async function getAdminOrder(id: number) {
  return apiFetch<AdminOrder>(`/rest/api/1/admin/orders/${id}`);
}

export async function updateAdminOrder(id: number, payload: { guia?: string; pedidoStatus?: string }) {
  return apiFetch<AdminOrder>(`/rest/api/1/admin/orders/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export { apiFetch, API_BASE_URL };
