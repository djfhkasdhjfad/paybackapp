import { PLATFORMS } from '../data/products';
import './ProductList.css';

function formatPrice(price) {
  return price.toLocaleString('ko-KR');
}

function PlatformTag({ platform }) {
  const p = PLATFORMS[platform];
  if (!p) return null;
  return (
    <span
      className="platform-tag"
      style={{ color: p.color, background: p.bg }}
    >
      {p.name}
    </span>
  );
}

function ProductCard({ product, onClick }) {
  const isSoon = product.status === 'coming_soon';

  return (
    <div className={`product-card ${isSoon ? 'product-card--soon' : ''}`} onClick={() => onClick(product)} style={{ cursor: 'pointer' }}>
      <div className="product-card__thumb-wrap">
        <img src={product.image} alt={product.name} className="product-card__thumb" />
        {product.platform && (
          <PlatformTag platform={product.platform} />
        )}
        {isSoon && (
          <div className="product-card__soon-badge">{product.openDate}</div>
        )}
      </div>
      <div className="product-card__info">
        <p className="product-card__name">{product.name}</p>
        <p className="product-card__original">
          {formatPrice(product.originalPrice)}원
        </p>
        <div className="product-card__price-row">
          <span className="product-card__discount">{product.discountRate}%</span>
          <span className="product-card__sale">
            {product.salePrice === 0 ? '무료' : `${formatPrice(product.salePrice)}원`}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ProductList({ products, onProductClick }) {
  const onSale = products.filter(p => p.status === 'on_sale');
  const comingSoon = products.filter(p => p.status === 'coming_soon');

  return (
    <div className="product-list">
      <div className="product-list__section-label">판매중</div>
      <div className="product-list__grid">
        {onSale.map(p => <ProductCard key={p.id} product={p} onClick={onProductClick} />)}
      </div>

      <div className="product-list__section-label product-list__section-label--soon">
        오픈 예정
      </div>
      <div className="product-list__grid">
        {comingSoon.map(p => <ProductCard key={p.id} product={p} onClick={onProductClick} />)}
      </div>
    </div>
  );
}
