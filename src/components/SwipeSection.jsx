import { useState } from 'react';
import SwipeCard from './SwipeCard';
import './SwipeSection.css';

export default function SwipeSection({ products }) {
  const [stack, setStack] = useState([...products].reverse());
  const [joined, setJoined] = useState([]);
  const [passed, setPassed] = useState([]);

  const handleSwipeRight = (id) => {
    setJoined(prev => [...prev, id]);
    setStack(prev => prev.filter(p => p.id !== id));
  };

  const handleSwipeLeft = (id) => {
    setPassed(prev => [...prev, id]);
    setStack(prev => prev.filter(p => p.id !== id));
  };

  if (stack.length === 0) {
    return (
      <div className="swipe-section swipe-section--empty">
        <p className="swipe-empty-text">모든 상품을 확인했어요!</p>
        <button
          className="swipe-reset-btn"
          onClick={() => { setStack([...products].reverse()); setJoined([]); setPassed([]); }}
        >
          다시 보기
        </button>
      </div>
    );
  }

  return (
    <div className="swipe-section">
      <div className="swipe-stack">
        {stack.map((product, i) => {
          const isTop = i === stack.length - 1;
          const offsetIndex = stack.length - 1 - i;
          return (
            <div
              key={product.id}
              className="swipe-stack__item"
              style={{
                zIndex: i,
                transform: `scale(${1 - offsetIndex * 0.04}) translateY(${offsetIndex * 12}px)`,
                transition: 'transform 0.3s ease',
              }}
            >
              <SwipeCard
                product={product}
                isTop={isTop}
                onSwipeRight={handleSwipeRight}
                onSwipeLeft={handleSwipeLeft}
              />
            </div>
          );
        })}
      </div>

      <div className="swipe-hint">
        <span className="hint-pass">← 패스</span>
        <span className="hint-join">참여 →</span>
      </div>
    </div>
  );
}
