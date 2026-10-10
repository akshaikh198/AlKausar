import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`}>
        <div className="product-image">
          <img src={product.image} alt={product.name} />

          <span className="quick-view">View</span>
        </div>
      </Link>

      <div className="product-info">
        <div className="product-meta">
          <span>{product.category}</span>
          <span>{product.size}</span>
        </div>

        <h3>{product.name}</h3>

        <p className="notes">
          {product.notes.join(" · ")}
        </p>

        <p className="price">
          ₹{product.price.toLocaleString("en-IN")}
        </p>
      </div>
    </article>
  );
}

export default ProductCard;
