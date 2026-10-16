import { Link } from "react-router-dom";
import { useShop } from "../context/useShop";

function Sales() {
  const { products } = useShop();
  const featuredProduct = products[4];

  return (
    <section className="container py-5">
      <div className="sales-promo">
        <div className="sales-promo-copy">
          <p className="section-kicker mb-2">The Al-Kausar edit</p>
          <h2 className="display-6 fw-light mb-3">
            A little luxury for every day.
          </h2>
          <p className="mb-4">
            Explore signature fragrances, concentrated attars, and thoughtful
            gift sets.
          </p>
          <Link to="/shop" className="btn premium-btn">
            Explore the collection
          </Link>
        </div>
        {featuredProduct && <div className="sales-promo-image">
          <img src={featuredProduct.image} alt={featuredProduct.name} />
        </div>}
      </div>
    </section>
  );
}

export default Sales;
