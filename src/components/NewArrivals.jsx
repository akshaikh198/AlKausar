import products from "../data/products";
import HomeProductShowcase from "./HomeProductShowcase";

function NewArrivals() {
  return (
    <HomeProductShowcase
      kicker="Just arrived"
      title="New arrivals"
      products={products.slice(-6)}
    />
  );
}

export default NewArrivals;
