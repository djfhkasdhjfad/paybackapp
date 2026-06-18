import { MISSION_STATUS } from './AuthStatus';
import './CertDetail.css';

const MISSION_LABELS = {
  '좋아요/찜 인증': '좋아요/찜 인증하고',
  '구매확정 인증': '구매 확정하고',
  '리뷰 인증': '리뷰 남기고',
};

function getNudgeMessage(missions) {
  const doneCnt = missions.filter(m => m.status === 'done').length;
  const total = missions.length;
  const hasFail = missions.some(m => m.status === 'fail');
  const remaining = total - doneCnt;
  if (hasFail) return { text: '실패한 미션이 있어요!', color: '#E53E3E' };
  if (remaining === 0) return null;
  if (remaining === 1) return { text: '마지막 미션 1개만 남았어요! 🎯', color: '#461CC2' };
  return { text: `미션 ${remaining}개 완료하면 페이백 받아요!`, color: '#D97706' };
}

export default function CertDetail({ item, onBack }) {
  const { product, missions, bonus } = item;
  const nudge = getNudgeMessage(missions);
  const totalBonus = missions.reduce((sum, m) => sum + (m.bonus || 0), 0) + bonus;

  return (
    <div className="cert-detail">
      {/* 상품 정보 */}
      <div className="cd-product">
        <img src={product.image} alt={product.name} className="cd-product__img" />
        <p className="cd-product__name">{product.name}</p>
      </div>

      <div className="cd-divider" />

      {/* 넛지 + 총 금액 */}
      <div className="cd-summary">
        {nudge && (
          <p className="cd-nudge" style={{ color: nudge.color }}>{nudge.text}</p>
        )}
        <p className="cd-total">모두 완료하면 <strong>+{totalBonus.toLocaleString()}원</strong> 받아요!</p>
      </div>

      {/* 미션 리스트 */}
      <div className="cd-mission-list">
        {missions.map((m, i) => {
          const s = MISSION_STATUS[m.status];
          const isPending = m.status === 'pending' || m.status === 'fail';
          return (
            <div key={i} className="cd-mission-row">
              <div className="cd-mission-left">
                <span className="cd-mission-label">{MISSION_LABELS[m.name] || m.name}</span>
                <span className="cd-mission-badge" style={{ color: s.color, background: s.bg }}>
                  {s.label}
                </span>
              </div>
              {isPending || m.status === 'reviewing' ? (
                <button className="cd-mission-btn" disabled={m.status === 'reviewing'}>
                  {m.status === 'reviewing' ? '검수중' : `+${(m.bonus || bonus).toLocaleString()}원 받기`}
                </button>
              ) : (
                <span className="cd-mission-done-text">+{(m.bonus || bonus).toLocaleString()}원 적립 완료</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
