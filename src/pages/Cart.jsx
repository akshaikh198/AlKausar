import { Link } from "react-router-dom";
import { useShop } from "../context/useShop";

function Cart() {
  const { cart, updateCartQuantity, removeFromCart, cartSubtotal } = useShop();
  const shipping = cartSubtotal > 0 ? 399 : 0;
  const total = cartSubtotal + shipping;
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <main className="page-shell cart-page">
      <div className="container cart-container py-5">
        <div className="page-heading cart-heading mb-4">
          <p className="section-kicker">Your bag</p>
          <h1 className="display-5 fw-light mb-0">Shopping cart</h1>
          {cart.length > 0 && (
            <p className="cart-item-count">
              {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
            </p>
          )}
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
                  <article key={item.id} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item-image" />

                    <div className="cart-item-content">
                      <div className="cart-item-heading">
                        <div className="cart-item-description">
                          <span className="cart-item-category">{item.category} · {item.size}</span>
                          <h2>{item.name}</h2>
                        </div>
                        <button
                          type="button"
                          className="cart-remove-button"
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          Remove
                        </button>
                      </div>

                      <div className="cart-item-footer">
                        <div className="quantity-box">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            aria-label={`Decrease ${item.name} quantity`}
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            aria-label={`Increase ${item.name} quantity`}
                          >
                            +
                          </button>
                        </div>
                        <strong className="cart-item-price">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </strong>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="col-lg-4">
              <aside className="summary-card cart-summary">
                <h2>Order summary</h2>
                <div className="summary-row">
                  <span>Items ({itemCount})</span>
                  <strong>₹{cartSubtotal.toLocaleString("en-IN")}</strong>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <strong>{shipping === 0 ? "Free" : `₹${shipping.toLocaleString("en-IN")}`}</strong>
                </div>
                <div className="summary-row total cart-total">
                  <span>Total</span>
                  <strong>₹{total.toLocaleString("en-IN")}</strong>
                </div>

                <Link to="/checkout" className="btn premium-btn cart-checkout-button">
                  Proceed to checkout
                </Link>
                <Link to="/shop" className="cart-continue-link">Continue shopping</Link>
              </aside>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Cart;
