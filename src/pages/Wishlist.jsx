import { Link } from "react-router-dom";
import products from "../data/products";
import { useShop } from "../context/ShopContext";

function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useShop();
  const savedItems = products.filter((product) => wishlist.includes(product.id));

  return (
    <main className="page-shell">
      <div className="container py-5">
        <div className="page-heading mb-4">
          <p className="section-kicker">Saved favorites</p>
          <h1 className="display-5 fw-light mb-0">Your wishlist</h1>
        </div>

        {savedItems.length === 0 ? (
          <div className="empty-state text-center py-5">
            <h3>No saved products yet</h3>
            <p>Tap the heart on any fragrance to save it for later.</p>
            <Link to="/shop" className="btn premium-btn">Browse collection</Link>
          </div>
        ) : (
          <div className="row g-4">
            {savedItems.map((product) => (
              <div key={product.id} className="col-12 col-sm-6 col-lg-4">
                <div className="wishlist-card h-100">
                  <img src={product.image} alt={product.name} className="img-fluid" />
                  <div className="wishlist-body">
                    <span className="text-gold small text-uppercase">{product.category}</span>
                    <h3>{product.name}</h3>
                    <p className="text-secondary">{product.notes.join(" · ")}</p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <strong>₹{product.price.toLocaleString("en-IN")}</strong>
                      <div className="d-flex gap-2">
                        <button type="button" className="btn premium-btn btn-sm" onClick={() => addToCart(product)}>
                          Add
                        </button>
                        <button type="button" className="btn btn-outline-dark btn-sm" onClick={() => toggleWishlist(product.id)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Wishlist;
