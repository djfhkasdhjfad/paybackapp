import { useState } from 'react';
import PromotionHome from './pages/PromotionHome';
import AuthStatus from './pages/AuthStatus';
import PointStatus from './pages/PointStatus';
import ProductDetail from './pages/ProductDetail';
import CertDetail from './pages/CertDetail';
import './App.css';

const TABS = [
  { id: 'home', label: '프로모션 홈' },
  { id: 'auth', label: '인증현황' },
  { id: 'point', label: '적립현황' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [certItem, setCertItem] = useState(null);

  return (
    <div className="app">
      {/* 상단 헤더 */}
      <div className="app-header">
        <button className="app-header__back" aria-label="뒤로가기" onClick={() => {
          if (certItem) { setCertItem(null); return; }
          setSelectedProduct(null);
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 19L8 12L15 5" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="app-header__title">
          {certItem ? '상품 인증 현황' : selectedProduct ? '상품 상세' : '페이백 쇼핑'}
        </h1>
      </div>

      {!selectedProduct && !certItem && (
        <header className="tab-header">
          <nav className="tab-nav">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'tab-btn--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </header>
      )}

      <main className="app-content">
        {certItem ? (
          <CertDetail item={certItem} onBack={() => setCertItem(null)} />
        ) : selectedProduct ? (
          <ProductDetail product={selectedProduct} onBack={() => setSelectedProduct(null)} onCertClick={setCertItem} />
        ) : (
          <>
            {activeTab === 'home' && <PromotionHome onProductClick={setSelectedProduct} />}
            {activeTab === 'auth' && <AuthStatus onCertClick={setCertItem} />}
            {activeTab === 'point' && <PointStatus />}
          </>
        )}
      </main>
    </div>
  );
}
