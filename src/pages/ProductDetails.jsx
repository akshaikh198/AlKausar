import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import products from "../data/products";
import { useShop } from "../context/ShopContext";
import { ShoppingBag, Heart } from "lucide-react";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const product = products.find((item) => String(item.id) === id) || products[0];
  const productImages = [...new Set([product.image, product.hoverImage].filter(Boolean))];
  const related = products.filter((item) => item.id !== product.id).slice(0, 3);
  const isSaved = wishlist.includes(product.id);
  const featured = products.slice(0, 8);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [product.id]);

  return (
    <main className="page-shell">
      <div className="container py-5">
        <Link to="/shop" className="text-decoration-none text-secondary small text-uppercase d-inline-flex align-items-center gap-2 mb-4">
          <i className="bi bi-arrow-left" /> Back to collection
        </Link>

        <div className="row g-5 align-items-center">
          <div className="col-lg-6">
            <div className="detail-gallery p-3 rounded-4 bg-white">
              <div className="detail-gallery-stage">
                <img
                  src={productImages[activeImageIndex] || product.image}
                  alt={`${product.name} view ${activeImageIndex + 1}`}
                  className="detail-image-main"
                />
              </div>
              {productImages.length > 1 && (
                <div className="detail-gallery-thumbnails" aria-label={`${product.name} images`}>
                  {productImages.map((image, imageIndex) => (
                    <button
                      type="button"
                      key={image}
                      className={`detail-gallery-thumbnail ${activeImageIndex === imageIndex ? "active" : ""}`}
                      onClick={() => setActiveImageIndex(imageIndex)}
                      aria-label={`View ${product.name} image ${imageIndex + 1}`}
                      aria-pressed={activeImageIndex === imageIndex}
                    >
                      <img src={image} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-6">
            <div className="detail-copy-box">
              <p className="section-kicker mb-2">{product.category}</p>
              <h1 className="display-5 fw-light mb-3">{product.name}</h1>
              <div className="d-flex align-items-center gap-3 mb-3 text-secondary">
                <span className="detail-rating"><i className="bi bi-star-fill me-1" /> 4.9</span>
                <span>{product.type}</span>
                <span>{product.size}</span>
              </div>
              <div className="price-large mb-3">₹{product.price.toLocaleString("en-IN")}</div>

              <p className="text-secondary mb-4">
                {product.description}
              </p>

              <div className="d-flex flex-wrap gap-2 mb-4">
                {product.notes.map((note) => (
                  <span key={note} className="feature-pill">{note}</span>
                ))}
              </div>

              <div className="d-flex flex-wrap align-items-center gap-3 mb-5">
                <button type="button" className="btn premium-btn btn-lg" onClick={() => addToCart(product)}>
                  Add to cart
                </button>
                <button
                  type="button"
                  className={`btn btn-outline-dark btn-lg ${isSaved ? "active" : ""}`}
                  onClick={() => toggleWishlist(product.id)}
                >
                  <i className={isSaved ? "bi bi-heart-fill me-2" : "bi bi-heart me-2"} />
                  {isSaved ? "Saved" : "Wishlist"}
                </button>
              </div>

              <div className="detail-meta-grid">
                <div>
                  <span>Shipping</span>
                  <strong>Free over ₹2,999</strong>
                </div>
                <div>
                  <span>Availability</span>
                  <strong>In stock</strong>
                </div>
                <div>
                  <span>Delivery</span>
                  <strong>2–4 days</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-5 pt-3">
          <div className="d-flex align-items-end justify-content-between flex-wrap gap-3 mb-4">
            <div>
              <p className="section-kicker">You may also like</p>
              <h2 className="fw-light mb-0">Complete the set</h2>
            </div>
          </div>

           <div className="row g-4">
  {featured.map((product) => (


      
    <div key={product.id} className="col-12 col-md-6 col-xl-3">
      <div className="royal-product-card" style={{ height:"250px"}}>

        {/* IMAGE AREA */}
        <div className="royal-product-image rounded mx-auto d-block" style={{ height:"200px", position: "relative", overflow: "hidden" }}>
          <Link to={`/product/${product.id}`}>
            <img className="rounded mx-auto d-block"
              src={product.image}
              alt={product.name}
            />
          </Link>

          {/* Hover Image */}
            <img
              src={product.hoverImage || product.image}
              alt={`${product.name} alternate view`}
              className="product-hover-image"
            />

          {/* Hover Overlay */}
          <div className="royal-product-overlay">

            {/* Top Actions */}
            <div className="royal-actions">

  <button
    className="royal-icon-btn"
    aria-label="Add to wishlist"
  >
    <Heart size={18} strokeWidth={1.5} />
  </button>

  <button
    className="royal-icon-btn"
    aria-label="Add to cart"
  >
    <ShoppingBag size={18} strokeWidth={1.5} />
  </button>

</div>

            {/* Bottom Price */}
            <div className="royal-price">
              ₹{product.price.toLocaleString("en-IN")}
            </div>

          </div>
        </div>

        {/* PRODUCT INFO */}
        <div className="royal-product-info" style={{ height:"50px"}}>

          <span className="royal-product-category" style={{ fontSize: "0.8rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em",textAlign: "start", display: "block", marginBottom: "0.25rem" }}>
            {product.category}
          </span>

          <Link
            to={`/product/${product.id}`}
            className="royal-product-name"
          style={{ fontSize: "1rem", fontWeight: "500", color: "#333" }}>
            {product.name}
          </Link>

        </div>

      </div>
    </div>



  ))}
</div>
        </section>
      </div>
    </main>
  );
}

export default ProductDetails;
