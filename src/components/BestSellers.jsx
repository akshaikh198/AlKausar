import HomeProductShowcase from "./HomeProductShowcase";
import { useShop } from "../context/useShop";

function BestSellers() {
  const { products } = useShop();
  return (
    <HomeProductShowcase
      kicker="Customer favourites"
      title="Best sellers"
      products={products.slice(0, 6)}
    />
  );
}

export default BestSellers;
