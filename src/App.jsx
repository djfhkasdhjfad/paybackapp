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
