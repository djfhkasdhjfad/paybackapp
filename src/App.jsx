import { useState } from 'react';
import PromotionHome from './pages/PromotionHome';
import AuthStatus from './pages/AuthStatus';
import PointStatus from './pages/PointStatus';
import './App.css';

const TABS = [
  { id: 'home', label: '프로모션 홈' },
  { id: 'auth', label: '인증현황' },
  { id: 'point', label: '적립현황' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="app">
      {/* 상단 헤더 */}
      <div className="app-header">
        <button className="app-header__back" aria-label="뒤로가기">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 19L8 12L15 5" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="app-header__title">페이백 쇼핑</h1>
      </div>

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

      <main className="app-content">
        {activeTab === 'home' && <PromotionHome />}
        {activeTab === 'auth' && <AuthStatus />}
        {activeTab === 'point' && <PointStatus />}
      </main>
    </div>
  );
}
