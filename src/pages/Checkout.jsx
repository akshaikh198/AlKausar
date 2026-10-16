import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useShop } from "../context/useShop";

const blankAddress = {
  recipient: "", phone: "", addressLine: "", city: "", state: "", country: "", postalCode: "",
};

function Checkout() {
  const { cart, cartSubtotal, clearCart, refreshProducts, request, session } = useShop();
  const [address, setAddress] = useState(blankAddress);
  const [loadingAddress, setLoadingAddress] = useState(Boolean(session));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);
  const shipping = cartSubtotal > 0 ? 399 : 0;
  const total = cartSubtotal + shipping;

  useEffect(() => {
    if (!session) return;
    let active = true;
    Promise.all([request("/api/account"), request("/api/account/addresses")])
      .then(([profile, addresses]) => {
        if (!active) return;
        const selected = addresses.find((item) => item.isDefault) || addresses[0];
        setAddress(selected ? {
          recipient: selected.recipient,
          phone: selected.phone,
          addressLine: selected.addressLine,
          city: selected.city,
          state: selected.state || "",
          country: selected.country,
          postalCode: selected.postalCode || "",
        } : {
          ...blankAddress,
          recipient: profile.fullName,
          phone: profile.phone || "",
        });
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoadingAddress(false);
      });
    return () => { active = false; };
  }, [request, session]);

  if (!session) {
    return <main className="page-shell"><div className="container py-5 empty-state text-center"><h1>Sign in to place your order</h1><p>Your order history and delivery details are saved with your account.</p><Link className="btn premium-btn" to="/login" state={{ from: "/checkout" }}>Sign in</Link></div></main>;
  }

  if (!cart.length && !placedOrder) return <Navigate to="/cart" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const order = await request("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          items: cart.map((item) => ({ productId: item.id, quantity: item.quantity })),
          ...address,
        }),
      });
      setPlacedOrder(order);
      clearCart();
      refreshProducts();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateAddress = (field) => (event) =>
    setAddress((current) => ({ ...current, [field]: event.target.value }));

  return (
    <main className="page-shell">
      <div className="container py-5">
        <div className="page-heading mb-4">
          <p className="section-kicker">Checkout</p>
          <h1 className="display-5 fw-light mb-0">Secure your order</h1>
        </div>

        {placedOrder ? (
          <div className="empty-state text-center py-5">
            <p className="section-kicker">Order confirmed</p>
            <h2>Thank you for your order.</h2>
            <p>Order <strong>{placedOrder.number}</strong> · Cash on delivery · ₹{placedOrder.total.toLocaleString("en-IN")}</p>
            <Link to="/account" className="btn premium-btn me-2">View my orders</Link>
            <Link to="/shop" className="btn btn-outline-dark">Continue shopping</Link>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8">
              {error && <div className="dashboard-alert error" role="alert">{error}</div>}
              <form id="checkout-form" className="checkout-form" onSubmit={handleSubmit}>
                <div className="mb-4">
                  <h3>Shipping details</h3>
                  <p className="text-secondary">Signed in as {session.email}</p>
                  {loadingAddress ? <p>Loading your saved details...</p> : (
                    <div className="row g-3 mt-2">
                      <div className="col-md-6"><label className="form-label" htmlFor="checkout-recipient">Full name</label><input id="checkout-recipient" className="form-control" maxLength="120" value={address.recipient} onChange={updateAddress("recipient")} required /></div>
                      <div className="col-md-6"><label className="form-label" htmlFor="checkout-phone">Phone</label><input id="checkout-phone" className="form-control" maxLength="32" value={address.phone} onChange={updateAddress("phone")} required /></div>
                      <div className="col-12"><label className="form-label" htmlFor="checkout-address">Address</label><input id="checkout-address" className="form-control" maxLength="240" value={address.addressLine} onChange={updateAddress("addressLine")} required /></div>
                      <div className="col-md-6"><label className="form-label" htmlFor="checkout-city">City</label><input id="checkout-city" className="form-control" maxLength="80" value={address.city} onChange={updateAddress("city")} required /></div>
                      <div className="col-md-6"><label className="form-label" htmlFor="checkout-state">State / region</label><input id="checkout-state" className="form-control" maxLength="80" value={address.state} onChange={updateAddress("state")} /></div>
                      <div className="col-md-6"><label className="form-label" htmlFor="checkout-country">Country</label><input id="checkout-country" className="form-control" maxLength="80" value={address.country} onChange={updateAddress("country")} required /></div>
                      <div className="col-md-6"><label className="form-label" htmlFor="checkout-postal">Postal code</label><input id="checkout-postal" className="form-control" maxLength="20" value={address.postalCode} onChange={updateAddress("postalCode")} /></div>
                    </div>
                  )}
                </div>
                <div className="cod-notice"><strong>Payment method</strong><span>Cash on delivery. Payment integrations can be added when a provider is selected.</span></div>
              </form>
            </div>

            <div className="col-lg-4">
              <aside className="summary-card">
                <h3>Order summary</h3>
                {cart.map((item) => (
                  <div key={item.id} className="summary-row">
                    <span>{item.name} × {item.quantity}</span>
                    <strong>₹{(item.price * item.quantity).toLocaleString("en-IN")}</strong>
                  </div>
                ))}
                <div className="summary-row"><span>Shipping</span><strong>₹{shipping.toLocaleString("en-IN")}</strong></div>
                <div className="summary-row total"><span>Total</span><strong>₹{total.toLocaleString("en-IN")}</strong></div>
                <button form="checkout-form" type="submit" className="btn premium-btn w-100 mt-3" disabled={submitting || loadingAddress}>
                  {submitting ? "Placing order..." : "Place order"}
                </button>
                <Link to="/cart" className="btn btn-outline-dark w-100 mt-2">Return to cart</Link>
              </aside>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Checkout;
