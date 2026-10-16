import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import localProducts from "../data/products";
import { apiRequest, mapProduct } from "../api";
import { ShopContext } from "./ShopContextBase";

function readStoredJson(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => readStoredJson("almas-cart", []));
  const [wishlist, setWishlist] = useState(() => readStoredJson("almas-wishlist", []));
  const [products, setProducts] = useState(localProducts);
  const [catalogError, setCatalogError] = useState("");
  const [session, setSession] = useState(() => readStoredJson("alkausar-session", null));

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [toast, setToast] = useState(null);
  const nextToastId = useRef(0);

  const showToast = (message) => {
    nextToastId.current += 1;
    setToast({ id: nextToastId.current, message });
  };
  const dismissToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    localStorage.setItem("almas-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("almas-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const request = useCallback((path, options = {}) =>
    apiRequest(path, { ...options, token: session?.token }), [session?.token]);

  const refreshProducts = useCallback(async () => {
    try {
      const result = await apiRequest("/api/products");
      const mappedProducts = result.map(mapProduct);
      setProducts(mappedProducts);
      setCart((current) => current.map((item) => {
        const latest = mappedProducts.find((product) => product.id === item.id);
        return latest ? { ...latest, quantity: item.quantity } : item;
      }));
      setCatalogError("");
    } catch (error) {
      setCatalogError(error.message);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(refreshProducts);
  }, [refreshProducts]);

  useEffect(() => {
    if (!session?.token) return;
    request("/api/account/wishlist")
      .then((items) => setWishlist(items.map((item) => item.id)))
      .catch((error) => setCatalogError(error.message));
  }, [request, session?.token]);

  const saveSession = useCallback(async (credentials, path) => {
    const response = await apiRequest(path, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    const guestWishlist = readStoredJson("almas-wishlist", []);
    let wishlistSyncFailed = false;
    for (const productId of guestWishlist) {
      try {
        await apiRequest(`/api/account/wishlist/${productId}`, {
          method: "POST",
          token: response.token,
        });
      } catch {
        wishlistSyncFailed = true;
      }
    }
    const nextSession = {
      token: response.token,
      role: response.role,
      fullName: response.fullName,
      email: response.email,
    };
    localStorage.setItem("alkausar-session", JSON.stringify(nextSession));
    setSession(nextSession);
    showToast("You're signed in");
    if (wishlistSyncFailed) showToast("Some saved items could not be synced. Check your wishlist.");
    return nextSession;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("alkausar-session");
    setSession(null);
    setWishlist(readStoredJson("almas-wishlist", []));
  }, []);

  const addToCart = (product, quantity = 1) => {
    if (product.stock === 0) {
      showToast(`${product.name} is currently out of stock`);
      return;
    }
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        return current.map((item) => item.id === product.id
          ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock || 100) }
          : item);
      }

      return [...current, { ...product, quantity: Math.min(quantity, product.stock || 100) }];
    });
    showToast(`${product.name} added to your cart`);
  };

  const updateCartQuantity = (id, quantity) => {
    const item = cart.find((cartItem) => cartItem.id === id);
    const stockLimit = item?.stock ?? 100;
    const nextQuantity = Math.min(Math.max(0, quantity), stockLimit);
    if (item && quantity > stockLimit) {
      showToast(`Only ${stockLimit} units of ${item.name} are currently available`);
    } else if (item && nextQuantity > item.quantity) {
      showToast(`${item.name} quantity increased`);
    } else if (item && nextQuantity === 0) {
      showToast(`${item.name} removed from your cart`);
    }

    setCart((current) =>
      current
        .map((item) => (item.id === id ? { ...item, quantity: nextQuantity } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (id) => {
    const item = cart.find((cartItem) => cartItem.id === id);
    setCart((current) => current.filter((item) => item.id !== id));
    if (item) showToast(`${item.name} removed from your cart`);
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId) => {
    const isSaved = wishlist.includes(productId);
    setWishlist((current) => current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId]);
    if (session?.token) {
      request(`/api/account/wishlist/${productId}`, {
        method: isSaved ? "DELETE" : "POST",
      }).catch((error) => {
        setWishlist((current) => isSaved
          ? [...new Set([...current, productId])]
          : current.filter((id) => id !== productId));
        showToast(error.message);
      });
    }
    showToast(
      isSaved ? "Removed from your wishlist" : "Added to your wishlist",
    );
  };

  const cartCount = useMemo(
    () => cart.reduce((count, item) => count + item.quantity, 0),
    [cart],
  );

  const cartSubtotal = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart],
  );
  const wishlistCount = wishlist.length;

  const value = {
    cart,
    wishlist,
    products,
    catalogError,
    refreshProducts,
    session,
    request,
    login: (credentials) => saveSession(credentials, "/api/auth/login"),
    register: (credentials) => saveSession(credentials, "/api/auth/register"),
    logout,
    searchTerm,
    selectedCategory,
    setSearchTerm,
    setSelectedCategory,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    cartCount,
    wishlistCount,
    cartSubtotal,
    toast,
    dismissToast,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
