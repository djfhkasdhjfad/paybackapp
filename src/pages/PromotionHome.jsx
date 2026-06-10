import SwipeSection from '../components/SwipeSection';
import ProductList from '../components/ProductList';
import { products, swipeProducts } from '../data/products';
import './PromotionHome.css';

export default function PromotionHome() {
  return (
    <div>
      <SwipeSection products={swipeProducts} />

      {/* 배너 */}
      <div className="promo-banner-wrap">
        <img
          src={`${import.meta.env.BASE_URL}banner.png?v=2`}
          alt="어차피 살 거라면, 페이백 받자!"
          className="promo-banner"
        />
      </div>

      <ProductList products={products} />
    </div>
  );
}
