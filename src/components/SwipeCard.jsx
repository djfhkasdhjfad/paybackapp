import { useState, useRef, useEffect } from 'react';
import './SwipeCard.css';

export default function SwipeCard({ product, onSwipeRight, onSwipeLeft, isTop, isPeeking, triggerSwipe }) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const startXRef = useRef(null);
  const cardRef = useRef(null);

  // 버튼 클릭 시 자동 스와이프 트리거
  useEffect(() => {
    if (!triggerSwipe) return;
    if (triggerSwipe === 'right') {
      setDismissed('right');
      setTimeout(() => onSwipeRight(product.id), 200);
    } else if (triggerSwipe === 'left') {
      setDismissed('left');
      setTimeout(() => onSwipeLeft(product.id), 200);
    }
  }, [triggerSwipe]);

  const THRESHOLD = 80;

  const getOverlayOpacity = () => Math.min(Math.abs(dragX) / THRESHOLD, 1);
  const isRight = dragX > 0;

  const handlePointerDown = (e) => {
    if (!isTop || isPeeking) return;
    startXRef.current = e.clientX ?? e.touches?.[0]?.clientX;
    setIsDragging(true);
    cardRef.current?.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || startXRef.current === null) return;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    setDragX(clientX - startXRef.current);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragX > THRESHOLD) {
      setDismissed('right');
      setTimeout(() => onSwipeRight(product.id), 300);
    } else if (dragX < -THRESHOLD) {
      setDismissed('left');
      setTimeout(() => onSwipeLeft(product.id), 300);
    } else {
      setDragX(0);
    }
  };

  const rotate = dragX * 0.06;
  const translateY = Math.abs(dragX) * 0.03;

  let transform = `translateX(${dragX}px) rotate(${rotate}deg) translateY(-${translateY}px)`;
  if (dismissed === 'right') transform = `translateX(120%) rotate(20deg)`;
  if (dismissed === 'left') transform = `translateX(-120%) rotate(-20deg)`;

  // peek 중엔 인라인 transform 제거 → CSS 애니메이션이 동작
  const cardStyle = isPeeking
    ? { transition: 'none' }
    : { transform, transition: isDragging ? 'none' : 'transform 0.2s ease' };

  return (
    <div
      ref={cardRef}
      className={`swipe-card ${isTop ? 'top' : ''} ${dismissed ? 'dismissed' : ''} ${isPeeking ? 'swipe-card--peek' : ''}`}
      style={cardStyle}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <img src={product.image} alt={product.name} className="swipe-card__img" draggable={false} />

      {/* 참여하기 overlay (right swipe) */}
      <div
        className="swipe-card__overlay overlay--join"
        style={{ opacity: isRight ? getOverlayOpacity() : 0 }}
      >
        <span className="overlay-label">참여하기</span>
      </div>

      {/* 패스할게요 overlay (left swipe) */}
      <div
        className="swipe-card__overlay overlay--pass"
        style={{ opacity: !isRight ? getOverlayOpacity() : 0 }}
      >
        <span className="overlay-label">패스할게요</span>
      </div>

      {/* 하단 상품명 dim 영역 */}
      <div className="swipe-card__bottom-dim">
        <p className="swipe-card__name">{product.name}</p>
      </div>
    </div>
  );
}
