import HomeProductShowcase from "./HomeProductShowcase";
import { useShop } from "../context/useShop";

function NewArrivals() {
  const { products } = useShop();
  return (
    <HomeProductShowcase
      kicker="Just arrived"
      title="New arrivals"
      products={products.slice(-6)}
    />
  );
}

export default NewArrivals;
