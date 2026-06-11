import { useState, useEffect, useRef, useCallback } from 'react';
import SwipeCard from './SwipeCard';
import './SwipeSection.css';

const THRESHOLD = 80;

export default function SwipeSection({ products }) {
  const [stack, setStack] = useState([...products].reverse());
  const [joined, setJoined] = useState([]);
  const [passed, setPassed] = useState([]);
  const [isPeeking, setIsPeeking] = useState(false);
  const [triggerSwipe, setTriggerSwipe] = useState(null);

  const nextCardRef = useRef(null); // 다음 카드 wrapper DOM ref

  useEffect(() => {
    const start = setTimeout(() => {
      setIsPeeking(true);
      const end = setTimeout(() => setIsPeeking(false), 1600);
      return () => clearTimeout(end);
    }, 700);
    return () => clearTimeout(start);
  }, []);

  // 드래그량에 따라 다음 카드 DOM 직접 업데이트 (React 렌더링 우회 → 즉시 반응)
  const handleDragChange = useCallback((dragX) => {
    if (!nextCardRef.current) return;
    const progress = Math.min(Math.abs(dragX) / THRESHOLD, 1);
    const scale = 0.8 + progress * 0.2;
    const ty = 52 * (1 - progress);

    if (dragX === 0) {
      // 스냅백: 트랜지션 O
      nextCardRef.current.style.transition = 'all 0.5s ease';
      nextCardRef.current.style.transform = `translateY(52px) scale(0.8)`;
    } else if (dragX === 999) {
      // 버튼 클릭 dismiss: 트랜지션 O
      nextCardRef.current.style.transition = 'all 0.5s ease';
      nextCardRef.current.style.transform = `translateY(0px) scale(1)`;
    } else {
      // 드래그 중: 트랜지션 X (실시간)
      nextCardRef.current.style.transition = 'none';
      nextCardRef.current.style.transform = `translateY(${ty}px) scale(${scale})`;
    }
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
          onClick={() => { setStack([...products].reverse()); setJoined([]); setPassed([]); }}
        >
          다시 보기
        </button>
      </div>
    );
  }

  const topIndex = stack.length - 1;

  const getItemStyle = (offsetIndex, zIndex) => {
    if (offsetIndex === 0) {
      return { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, zIndex, transition: 'all 0.15s ease' };
    }
    // 다음 카드 초기 스타일 (DOM ref로 덮어씀)
    return {
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      zIndex,
      transform: 'translateY(52px) scale(0.8)',
      transition: 'all 0.2s ease',
    };
  };

  return (
    <div className="swipe-section">
      {/* 인디케이터 점 */}
      <div className="swipe-dots">
        {products.map((_, i) => {
          const currentIdx = products.length - stack.length;
          return (
            <span key={i} className={`swipe-dot${i === currentIdx ? ' swipe-dot--active' : ''}`} />
          );
        })}
      </div>

      <div className="swipe-stack-outer">
        <div className="swipe-stack">
          {stack.map((product, i) => {
            const isTop = i === topIndex;
            const offsetIndex = topIndex - i;
            const isNext = offsetIndex === 1;
            return (
              <div
                key={product.id}
                ref={isNext ? nextCardRef : null}
                className="swipe-stack__item"
                style={getItemStyle(offsetIndex, i)}
              >
                <SwipeCard
                  product={product}
                  isTop={isTop}
                  isPeeking={isTop && isPeeking}
                  triggerSwipe={isTop ? triggerSwipe : null}
                  onDragChange={isTop ? handleDragChange : undefined}
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
