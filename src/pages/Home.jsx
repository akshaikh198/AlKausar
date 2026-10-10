
import { Link } from "react-router-dom";
import products from "../data/products";
import Testimonial from "../components/Testimonial";
import BestSellers from "../components/BestSellers";
import NewArrivals from "../components/NewArrivals";
import Sales from "../components/Sales";

const categories = [
  { name: "Perfume", image: products[0].image, hoverImage: products[0].hoverImage, text: "Signature scent stories" },
  { name: "Attar", image: products[1].image, hoverImage: products[1].hoverImage, text: "Concentrated luxury" },
  { name: "Deo", image: products[5].image, hoverImage: products[5].hoverImage, text: "Daily freshness" },
  { name: "Gift Sets", image: products[4].image, hoverImage: products[4].hoverImage, text: "Elegant gifting" },
];


function Home() {
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


      <BestSellers />
      <NewArrivals />
      <Sales />

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
