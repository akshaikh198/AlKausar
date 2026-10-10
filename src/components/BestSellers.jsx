import products from "../data/products";
import HomeProductShowcase from "./HomeProductShowcase";

function BestSellers() {
  return (
    <HomeProductShowcase
      kicker="Customer favourites"
      title="Best sellers"
      products={products.slice(0, 6)}
    />
  );
}

export default BestSellers;
