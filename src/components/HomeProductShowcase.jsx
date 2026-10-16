import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { useShop } from "../context/useShop";

function HomeProductShowcase({ kicker, title, products }) {
  const { addToCart, toggleWishlist, wishlist } = useShop();

  return (
    <section className="container py-5">
      <div className="feature-banner d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
        <div>
          <p className="section-kicker mb-2">{kicker}</p>
          <h2 className="display-6 fw-light mb-0">{title}</h2>
        </div>
        <Link to="/shop" className="btn premium-btn mb-3">
          Explore collection
        </Link>
      </div>

      <div className="row g-4">
        {products.map((product) => (
          <div key={product.id} className="col-6 col-md-4 col-xl-2">
            <article className="shop-product-card">
              <div className="shop-product-image">
                <Link to={`/product/${product.id}`}>
                  <img src={product.image} alt={product.name} />
                </Link>
                <img
                  src={product.hoverImage || product.image}
                  alt=""
                  aria-hidden="true"
                  className="shop-product-hover-image"
                />
                <div className="shop-product-actions">
                  <button
                    type="button"
                    className="shop-product-action"
                    aria-label={
                      wishlist.includes(product.id)
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                    aria-pressed={wishlist.includes(product.id)}
                    onClick={() => toggleWishlist(product.id)}
                  >
                    <Heart
                      size={17}
                      strokeWidth={1.7}
                      fill={wishlist.includes(product.id) ? "currentColor" : "none"}
                    />
                  </button>
                  <button
                    type="button"
                    className="shop-product-action"
                    aria-label={`Add ${product.name} to cart`}
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingBag size={17} strokeWidth={1.7} />
                  </button>
                </div>
              </div>

              <div className="shop-product-info">
                <span className="shop-product-category">
                  {product.category} · {product.size}
                </span>
                <Link
                  to={`/product/${product.id}`}
                  className="shop-product-name"
                >
                  {product.name}
                </Link>
                <strong className="shop-product-price">
                  ₹{product.price.toLocaleString("en-IN")}
                </strong>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HomeProductShowcase;
