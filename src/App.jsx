import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ShopProvider } from "./context/ShopContext";

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

function AppShell() {
  const location = useLocation();
  const showHero = location.pathname === "/";

  return (
    <>
      <Navbar />
      <Hero show={showHero} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/collections" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
