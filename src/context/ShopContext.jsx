import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("almas-cart");
    return stored ? JSON.parse(stored) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const stored = localStorage.getItem("almas-wishlist");
    return stored ? JSON.parse(stored) : [];
  });

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

  const addToCart = (product, quantity = 1) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }

      return [...current, { ...product, quantity }];
    });
    showToast(`${product.name} added to your cart`);
  };

  const updateCartQuantity = (id, quantity) => {
    const item = cart.find((cartItem) => cartItem.id === id);
    if (item && quantity > item.quantity) {
      showToast(`${item.name} quantity increased`);
    } else if (item && quantity <= 0) {
      showToast(`${item.name} removed from your cart`);
    }

    setCart((current) =>
      current
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (id) => {
    const item = cart.find((cartItem) => cartItem.id === id);
    setCart((current) => current.filter((item) => item.id !== id));
    if (item) showToast(`${item.name} removed from your cart`);
  };

  const toggleWishlist = (productId) => {
    const isSaved = wishlist.includes(productId);
    setWishlist((current) => current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId]);
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
    searchTerm,
    selectedCategory,
    setSearchTerm,
    setSelectedCategory,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    toggleWishlist,
    cartCount,
    wishlistCount,
    cartSubtotal,
    toast,
    dismissToast,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);

  if (!context) {
    throw new Error("useShop must be used inside ShopProvider");
  }

  return context;
}
