import { useState } from "react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";

function Checkout() {
  const { cart, cartSubtotal } = useShop();
  const shipping = cartSubtotal > 0 ? 399 : 0;
  const total = cartSubtotal + shipping;
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setOrderPlaced(true);
  };

  return (
    <main className="page-shell">
      <div className="container py-5">
        <div className="page-heading mb-4">
          <p className="section-kicker">Checkout</p>
          <h1 className="display-5 fw-light mb-0">Secure your order</h1>
        </div>

        {orderPlaced ? (
          <div className="empty-state text-center py-5">
            <h3>Order placed successfully</h3>
            <p>Your premium fragrance order has been confirmed.</p>
            <Link to="/shop" className="btn premium-btn">Continue shopping</Link>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8">
              <form className="checkout-form" onSubmit={handleSubmit}>
                <div className="mb-4">
                  <h3>Shipping details</h3>
                  <div className="row g-3 mt-2">
                    <div className="col-md-6">
                      <label className="form-label">Full name</label>
                      <input type="text" className="form-control" placeholder="Your name" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" placeholder="your@email.com" required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Address</label>
                      <textarea className="form-control" rows="4" placeholder="Street, city, country" required />
                    </div>
                  </div>
                </div>

                <div>
                  <h3>Payment</h3>
                  <div className="row g-3 mt-2">
                    <div className="col-12">
                      <label className="form-label">Card number</label>
                      <input type="text" className="form-control" placeholder="1234 5678 9012 3456" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Expiry</label>
                      <input type="text" className="form-control" placeholder="MM/YY" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">CVV</label>
                      <input type="text" className="form-control" placeholder="***" required />
                    </div>
                  </div>
                </div>
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
                <div className="summary-row">
                  <span>Shipping</span>
                  <strong>₹{shipping.toLocaleString("en-IN")}</strong>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <strong>₹{total.toLocaleString("en-IN")}</strong>
                </div>
                <button type="submit" className="btn premium-btn w-100 mt-3" onClick={handleSubmit}>
                  Place order
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
