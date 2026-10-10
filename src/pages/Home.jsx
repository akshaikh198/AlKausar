
import { Link } from "react-router-dom";
import products from "../data/products";
import { ShoppingBag, Heart } from "lucide-react";
import { useShop } from "../context/ShopContext";
import Testimonial from "../components/Testimonial";
import ProductDetailGallery from "../components/productdetailsgallary";
import Featured from "../components/Featured.jsx";


const categories = [
  { name: "Perfume", image: products[0].image, hoverImage: products[0].hoverImage, text: "Signature scent stories" },
  { name: "Attar", image: products[1].image, hoverImage: products[1].hoverImage, text: "Concentrated luxury" },
  { name: "Deo", image: products[5].image, hoverImage: products[5].hoverImage, text: "Daily freshness" },
  { name: "Gift Sets", image: products[4].image, hoverImage: products[4].hoverImage, text: "Elegant gifting" },
];


function Home() {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const featured = products.slice(0, 8);

  return (
    <main className="home-page">

    



      {/* shop by category section */}

      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-end flex-wrap gap-3 mb-4">
          <div>
            <p className="section-kicker mb-2">Shop by category</p>
            <h2 className="display-6 fw-light mb-0">Curated essentials</h2>
          </div>
          <Link to="/shop" className="text-decoration-none text-dark small text-uppercase">View all products</Link>
        </div>

        <div className="row g-3" style={{ maxWidth: 1200, margin: "0 auto" }}>
         {categories.map((category) => (
    <div key={category.name} className="col-12 col-md-6 col-xl-3">
      <div className="category-item">
        
        <div className="category-image">
          <img
            src={category.image}
            alt={category.name}
          />
        </div>

        <img
              src={category.hoverImage || category.image}
              alt={`${category.name} alternate view`}
              className="product-hover-image"
            />

        <div className="category-content">
          <span>{category.name}</span>
          <h3>{category.text}</h3>
        </div>

        <div className="category-arrow">
          →
        </div>

      </div>
    </div>
  ))}
</div>
      </section>


      {/* featured products section */}


      <section className="container py-5">
        <div className="feature-banner d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
          <div>
            <p className="section-kicker mb-2">Featured collection</p>
            <h2 className="display-6 fw-light mb-0">Best sellers</h2>
          </div>
          <Link to="/shop" className="btn premium-btn mb-3">Explore collection</Link>
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
    type="button"
    className="royal-icon-btn"
    aria-label={wishlist.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
    aria-pressed={wishlist.includes(product.id)}
    onClick={() => toggleWishlist(product.id)}
  >
    <Heart size={18} strokeWidth={1.5} fill={wishlist.includes(product.id) ? "currentColor" : "none"} />
  </button>

  <button
    type="button"
    className="royal-icon-btn"
    aria-label="Add to cart"
    onClick={() => addToCart(product)}
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

      <section className="container py-5">
        <div className="row g-4 align-items-center">
          <div className="col-lg-6">
            <div className="story-card position-relative overflow-hidden h-100">
              <img src={products[3].image} alt="Luxury fragrance ritual" className="img-fluid h-100 w-100" />
            </div>
          </div>
          <div className="col-lg-6">
            <p className="section-kicker mb-3">Why we stand apart</p>
            <h2 className="display-6 fw-light mb-4">Crafted for a refined everyday ritual.</h2>
            <div className="benefit-list">
              <div>
                <span className="benefit-icon"><i className="bi bi-check2" /></span>
                <div>
                  <h4>Rare ingredients</h4>
                  <p>Curated blends using woods, resins, florals, and warm amber accords.</p>
                </div>
              </div>
              <div>
                <span className="benefit-icon"><i className="bi bi-check2" /></span>
                <div>
                  <h4>Premium craftsmanship</h4>
                  <p>Every scent is composed for depth, character, and premium staying power.</p>
                </div>
              </div>
              <div>
                <span className="benefit-icon"><i className="bi bi-check2" /></span>
                <div>
                  <h4>Luxury delivery</h4>
                  <p>Complimentary wrapping and fast nationwide delivery for every order.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Testimonial />

      <section className="container py-5 pb-6">
        <div className="newsletter-box text-center">
          <p className="section-kicker mb-2">Stay in the loop</p>
          <h2 className="display-6 fw-light mb-3">Receive private offers and fresh launches.</h2>
          <div className="newsletter-form-wrap mx-auto">
            <input type="email" placeholder="Email address" aria-label="Email address" />
            <button type="button" className="btn premium-btn">Join now</button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
