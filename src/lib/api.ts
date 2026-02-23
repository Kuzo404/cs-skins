const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;

  let url = `${API_BASE}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const res = await fetch(url, {
    ...fetchOptions,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `API error: ${res.status}`);
  }

  return res.json();
}

// Auth
export const authAPI = {
  getMe: () => apiFetch<any>("/auth/me"),
  loginUrl: () => `${API_BASE}/auth/steam`,
  logout: () => apiFetch<any>("/auth/logout", { method: "POST" }),
};

// Skins
export const skinsAPI = {
  list: (params?: Record<string, any>) =>
    apiFetch<{ skins: any[]; total: number }>("/skins", { params }),
  get: (id: string) => apiFetch<any>(`/skins/${id}`),
  create: (data: any) =>
    apiFetch<any>("/skins", { method: "POST", body: JSON.stringify(data) }),
  cancel: (id: string) =>
    apiFetch<any>(`/skins/${id}`, { method: "DELETE" }),
};

// Cart
export const cartAPI = {
  get: () => apiFetch<any[]>("/cart"),
  add: (skinId: string) =>
    apiFetch<any>("/cart", { method: "POST", body: JSON.stringify({ skinId }) }),
  remove: (skinId: string) =>
    apiFetch<any>(`/cart/${skinId}`, { method: "DELETE" }),
  clear: () => apiFetch<any>("/cart", { method: "DELETE" }),
};

// Users
export const usersAPI = {
  profile: () => apiFetch<any>("/users/profile"),
  listings: (status?: string) =>
    apiFetch<any[]>("/users/listings", { params: { status } }),
  transactions: (params?: Record<string, any>) =>
    apiFetch<any[]>("/users/transactions", { params }),
  purchase: () =>
    apiFetch<any>("/users/purchase", { method: "POST" }),
};

// Inventory
export const inventoryAPI = {
  get: () => apiFetch<any[]>("/inventory"),
};