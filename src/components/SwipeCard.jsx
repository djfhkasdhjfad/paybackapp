import { useState, useRef, useEffect } from 'react';
import './SwipeCard.css';

export default function SwipeCard({ product, onSwipeRight, onSwipeLeft, isTop, isPeeking, triggerSwipe, onDragChange }) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const startXRef = useRef(null);
  const cardRef = useRef(null);

  const THRESHOLD = 80;

  // 버튼 클릭 시 자동 스와이프
  useEffect(() => {
    if (!triggerSwipe) return;
    if (triggerSwipe === 'right') {
      setDismissed('right');
      onDragChange?.(999); // 다음 카드 즉시 풀 사이즈로
      setTimeout(() => { onSwipeRight(product.id); onDragChange?.(0); }, 200);
    } else if (triggerSwipe === 'left') {
      setDismissed('left');
      onDragChange?.(999);
      setTimeout(() => { onSwipeLeft(product.id); onDragChange?.(0); }, 200);
    }
  }, [triggerSwipe]);

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
    const dx = clientX - startXRef.current;
    setDragX(dx);
    onDragChange?.(dx); // 실시간으로 다음 카드 업데이트
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragX > THRESHOLD) {
      setDismissed('right');
      onDragChange?.(999);
      setTimeout(() => { onSwipeRight(product.id); onDragChange?.(0); }, 200);
    } else if (dragX < -THRESHOLD) {
      setDismissed('left');
      onDragChange?.(999);
      setTimeout(() => { onSwipeLeft(product.id); onDragChange?.(0); }, 200);
    } else {
      setDragX(0);
      onDragChange?.(0); // 스냅백 시 다음 카드 원위치
    }
  };

  const rotate = dragX * 0.06;
  const translateY = Math.abs(dragX) * 0.03;

  let transform = `translateX(${dragX}px) rotate(${rotate}deg) translateY(-${translateY}px)`;
  if (dismissed === 'right') transform = `translateX(120%) rotate(20deg)`;
  if (dismissed === 'left') transform = `translateX(-120%) rotate(-20deg)`;

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

      <div className="swipe-card__overlay overlay--join" style={{ opacity: isRight ? getOverlayOpacity() : 0 }}>
        <span className="overlay-label">참여하기</span>
      </div>

      <div className="swipe-card__overlay overlay--pass" style={{ opacity: !isRight ? getOverlayOpacity() : 0 }}>
        <span className="overlay-label">패스할게요</span>
      </div>

      <div className="swipe-card__bottom-dim">
        <p className="swipe-card__name">{product.name}</p>
      </div>
    </div>
  );
}
