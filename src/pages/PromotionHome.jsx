import SwipeSection from '../components/SwipeSection';
import ProductList from '../components/ProductList';
import { products, swipeProducts } from '../data/products';

export default function PromotionHome() {
  return (
    <div>
      <SwipeSection products={swipeProducts} />
      <ProductList products={products} />
    </div>
  );
}
