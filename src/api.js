import localProducts from "./data/products";

const apiBase = import.meta.env.VITE_API_BASE_URL || "";

export async function apiRequest(path, { token, ...options } = {}) {
  const headers = new Headers(options.headers || {});
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response;
  try {
    response = await fetch(`${apiBase}${path}`, { ...options, headers });
  } catch {
    throw new Error("Could not reach the Al-Kausar API. Check that the .NET backend is running.");
  }
  if (!response.ok) {
    const problem = await response.json().catch(() => null);
    const message = response.status === 502
      ? "The API is unavailable. Start SQL Server and the .NET backend, then retry."
      : problem?.message || problem?.title || `Request failed (${response.status}).`;
    throw new Error(message);
  }
  if (response.status === 204) return null;
  return response.json();
}

export function mapProduct(product) {
  const localProduct = localProducts.find((item) => item.id === product.id);
  const image = product.image?.startsWith("src/")
    ? localProduct?.image
    : product.image;
  const hoverImage = product.hoverImage?.startsWith("src/")
    ? localProduct?.hoverImage
    : product.hoverImage;
  return {
    ...product,
    image: image || "",
    hoverImage: hoverImage || image || "",
    notes: Array.isArray(product.notes) ? product.notes : [],
  };
}
