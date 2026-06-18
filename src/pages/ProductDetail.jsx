import { useState } from 'react';
import { PLATFORMS } from '../data/products';
import './ProductDetail.css';

function getDday(dateStr) {
  const [y, m, d] = dateStr.split('.').map(Number);
  const end = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((end - today) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: '마감', color: '#aaa' };
  if (diff === 0) return { label: 'D-day', color: '#E53E3E' };
  return { label: `D-${diff}`, color: diff <= 3 ? '#E53E3E' : '#461CC2' };
}

export default function ProductDetail({ product, onBack, onCertClick }) {
  const [activeTab, setActiveTab] = useState('mission');
  const platform = PLATFORMS[product.platform];
  const paybackAmount = product.originalPrice - product.salePrice;
  const paybackRate = product.discountRate;
  const purchaseDday = getDday(product.purchaseEnd);
  const certDday = getDday(product.certEnd);

  return (
    <div className="product-detail">
      {/* 상품 이미지 */}
      <div className="pd-image-wrap">
        <img src={product.image} alt={product.name} className="pd-image" />
      </div>

      {/* 상품 정보 */}
      <div className="pd-info">
        <span className="pd-platform-tag" style={{ color: platform.color, background: platform.bg }}>
          {platform.name}
        </span>
        <h2 className="pd-name">{product.name}</h2>

        <div className="pd-price-block">
          <div className="pd-price-row">
            <span className="pd-price-label">구매가</span>
            <span className="pd-price-value">{product.originalPrice.toLocaleString()}원</span>
          </div>
          <div className="pd-price-row highlight">
            <span className="pd-price-label">페이백</span>
            <span className="pd-price-rate">{paybackRate}%</span>
            <span className="pd-price-value payback">-{paybackAmount.toLocaleString()}원</span>
          </div>
          <div className="pd-divider" />
          <div className="pd-price-row total">
            <span className="pd-price-label">실구매가</span>
            <span className="pd-price-value total">
              {product.salePrice === 0 ? '무료' : `${product.salePrice.toLocaleString()}원`}
            </span>
          </div>
        </div>
      </div>

      {/* 미션 기간 */}
      <div className="pd-period-block">
        <p className="pd-period-title">미션기간</p>
        <div className="pd-period-row">
          <span className="pd-period-label">구매 기간</span>
          <span className="pd-period-dday" style={{ color: purchaseDday.color }}>{purchaseDday.label}</span>
        </div>
        <div className="pd-period-row">
          <span className="pd-period-label">인증 기간</span>
          <span className="pd-period-dday" style={{ color: certDday.color }}>{certDday.label}</span>
        </div>
      </div>

      {/* 탭 */}
      <div className="pd-tab-header">
        <button
          className={`pd-tab-btn ${activeTab === 'mission' ? 'pd-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('mission')}
        >
          미션 정보
        </button>
        <button
          className={`pd-tab-btn ${activeTab === 'detail' ? 'pd-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('detail')}
        >
          상품 상세
        </button>
      </div>

      <div className="pd-tab-content">
        {activeTab === 'mission' && (
          <div className="pd-mission-list">
            {product.missions.map((m, i) => (
              <div key={i} className="pd-mission-item">
                <div className="pd-mission-num">{i + 1}</div>
                <div className="pd-mission-info">
                  <p className="pd-mission-name">{m.name}</p>
                  {m.desc && <p className="pd-mission-desc">{m.desc}</p>}
                </div>
                <span className="pd-mission-bonus">+{m.bonus.toLocaleString()}원</span>
              </div>
            ))}
            <img
              src={`${import.meta.env.BASE_URL}misson_detail.png`}
              alt="미션 상세 안내"
              style={{ width: '100%', borderRadius: 12, marginTop: 16 }}
            />
          </div>
        )}
        {activeTab === 'detail' && (
          <div className="pd-detail-content">
            <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: 12 }} />
          </div>
        )}
      </div>
      {/* 바텀 시트 */}
      <div className="pd-bottom-sheet">
        <button className="pd-btn-goto">상품 바로가기</button>
        <button className="pd-btn-join" onClick={() => onCertClick?.({
          id: product.id,
          product,
          missions: product.missions.map(m => ({ ...m, status: 'pending' })),
          bonus: product.missions.find(m => m.bonus > 0)?.bonus || 0,
        })}>참가하기</button>
      </div>
    </div>
  );
}
