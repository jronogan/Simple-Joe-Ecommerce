export const API_URL = import.meta.env.VITE_EXPRESS_SERVER_URL;

export async function apiFetch(endpoint, options = {}) {
  const safeEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  const headers = new Headers(options.headers ?? {});
  if (!headers.has("Content-Type") && options.body != null) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${safeEndpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });
  const contentType = response.headers.get("Content-Type") ?? "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new Error(data?.message ?? "Network response was not ok");
  }

  return data;
}
