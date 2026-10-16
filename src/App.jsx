import { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ShopProvider } from "./context/ShopContext";
import { useShop } from "./context/useShop";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import About from "./pages/About.jsx";
import Journal from "./pages/Journal";
import Contact from "./pages/Contact";
import JournalList from "./pages/JournalList";
import Hero from "./components/Hero.jsx";
import AccountDashboard from "./pages/AccountDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function AppShell() {
  const location = useLocation();
  const { toast, dismissToast, catalogError, refreshProducts } = useShop();
  const showHero = location.pathname === "/";

  useEffect(() => {
    if (!toast) return undefined;

    const timeout = window.setTimeout(dismissToast, 3000);
    return () => window.clearTimeout(timeout);
  }, [toast, dismissToast]);

  return (
    <>
      <Navbar />
      <Hero show={showHero} />
      {catalogError && (
        <div className="backend-status-banner" role="alert">
          <span>Store connection issue: {catalogError}</span>
          <button type="button" onClick={refreshProducts}>Retry</button>
        </div>
      )}
      <div className="shop-toast-region" aria-live="polite" aria-atomic="true">
        {toast && (
          <div className="shop-toast" role="status" key={toast.id}>
            <span>{toast.message}</span>
            <button type="button" onClick={dismissToast} aria-label="Dismiss notification">
              <i className="bi bi-x-lg" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/collections" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<AccountDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<About />} />
        <Route path="/pages/about" element={<Navigate to="/about" replace />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/journal" element={<JournalList />} />
        <Route path="/journal/:slug" element={<Journal />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <ShopProvider>
      <AppShell />
    </ShopProvider>
  );
}

export default App;
