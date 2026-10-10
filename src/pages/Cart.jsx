import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";

function Cart() {
  const { cart, updateCartQuantity, removeFromCart, cartSubtotal } = useShop();
  const shipping = cartSubtotal > 0 ? 399 : 0;
  const total = cartSubtotal + shipping;

  return (
    <main className="page-shell">
      <div className="container py-5">
        <div className="page-heading mb-4">
          <p className="section-kicker">Your bag</p>
          <h1 className="display-5 fw-light mb-0">Shopping cart</h1>
        </div>

        {cart.length === 0 ? (
          <div className="empty-state text-center py-5">
            <h3>Your cart is empty</h3>
            <p>Add a few signature fragrances to begin your order.</p>
            <Link to="/shop" className="btn premium-btn">Continue shopping</Link>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="cart-list">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item d-flex gap-3 align-items-center">
                    <img src={item.image} alt={item.name} className="cart-item-image" />

                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start gap-3">
                        <div>
                          <h3>{item.name}</h3>
                          <p className="text-secondary mb-2">{item.category} · {item.size}</p>
                        </div>
                        <button type="button" className="btn btn-link text-dark p-0" onClick={() => removeFromCart(item.id)}>
                          Remove
                        </button>
                      </div>

                      <div className="d-flex align-items-center justify-content-between mt-3">
                        <div className="quantity-box d-flex align-items-center">
                          <button type="button" onClick={() => updateCartQuantity(item.id, item.quantity - 1)}>-</button>
                          <span>{item.quantity}</span>
                          <button type="button" onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>+</button>
                        </div>

                        <strong className="text-dark">₹{(item.price * item.quantity).toLocaleString("en-IN")}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-4">
              <aside className="summary-card">
                <h3>Order summary</h3>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <strong>₹{cartSubtotal.toLocaleString("en-IN")}</strong>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <strong>₹{shipping.toLocaleString("en-IN")}</strong>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <strong>₹{total.toLocaleString("en-IN")}</strong>
                </div>

                <Link to="/checkout" className="btn premium-btn w-100 mt-3">
                  Proceed to checkout
                </Link>
              </aside>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Cart;
