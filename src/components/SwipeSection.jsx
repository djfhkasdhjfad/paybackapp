import { useState, useEffect } from 'react';
import SwipeCard from './SwipeCard';
import './SwipeSection.css';

export default function SwipeSection({ products }) {
  const [stack, setStack] = useState([...products].reverse());
  const [joined, setJoined] = useState([]);
  const [passed, setPassed] = useState([]);
  const [isPeeking, setIsPeeking] = useState(false);
  const [triggerSwipe, setTriggerSwipe] = useState(null);

  useEffect(() => {
    const start = setTimeout(() => {
      setIsPeeking(true);
      const end = setTimeout(() => setIsPeeking(false), 1600);
      return () => clearTimeout(end);
    }, 700);
    return () => clearTimeout(start);
  }, []);

  const handleSwipeRight = (id) => {
    setJoined(prev => [...prev, id]);
    setStack(prev => prev.filter(p => p.id !== id));
    setTriggerSwipe(null);
  };

  const handleSwipeLeft = (id) => {
    setPassed(prev => [...prev, id]);
    setStack(prev => prev.filter(p => p.id !== id));
    setTriggerSwipe(null);
  };

  const handlePassBtn = () => setTriggerSwipe('left');
  const handleJoinBtn = () => setTriggerSwipe('right');

  if (stack.length === 0) {
    return (
      <div className="swipe-section swipe-section--empty">
        <p className="swipe-empty-text">모든 상품을 확인했어요!</p>
        <button
          className="swipe-reset-btn"
          onClick={() => {
            setStack([...products].reverse());
            setJoined([]);
            setPassed([]);
          }}
        >
          다시 보기
        </button>
      </div>
    );
  }

  const topIndex = stack.length - 1;

  // 카드별 실제 위치/크기 스타일
  // 현재 카드: 100% 크기로 스택 채움
  // 다음 카드: 명시적으로 80% 너비·높이, top:100% 위치 → padding-bottom:20px 영역에 20px만 노출
  const getItemStyle = (offsetIndex, zIndex) => {
    if (offsetIndex === 0) {
      return {
        position: 'absolute',
        top: 0, right: 0, bottom: 0, left: 0,
        zIndex,
        transition: 'all 0.15s ease',
      };
    }
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex,
      transform: 'translateY(52px) scale(0.8)',
      opacity: 1,
      transition: 'all 0.15s ease',
    };
  };

  return (
    <div className="swipe-section">
      {/* 카드 인디케이터 점 - 이미지 상단 */}
      <div className="swipe-dots">
        {products.map((_, i) => {
          const currentIdx = products.length - stack.length;
          return (
            <span
              key={i}
              className={`swipe-dot${i === currentIdx ? ' swipe-dot--active' : ''}`}
            />
          );
        })}
      </div>

      <div className="swipe-stack-outer">
        <div className="swipe-stack">
          {stack.map((product, i) => {

            const isTop = i === topIndex;
            const offsetIndex = topIndex - i;
            return (
              <div
                key={product.id}
                className="swipe-stack__item"
                style={getItemStyle(offsetIndex, i)}
              >
                <SwipeCard
                  product={product}
                  isTop={isTop}
                  isPeeking={isTop && isPeeking}
                  triggerSwipe={isTop ? triggerSwipe : null}
                  onSwipeRight={handleSwipeRight}
                  onSwipeLeft={handleSwipeLeft}
                />
              </div>
            );
          })}

        </div>
      </div>

      <div className="swipe-hint">
        <button className="hint-btn hint-btn--pass" onClick={handlePassBtn}>패스할게요</button>
        <button className="hint-btn hint-btn--join" onClick={handleJoinBtn}>참여할게요</button>
      </div>
    </div>
  );
}
