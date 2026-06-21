import { MISSION_STATUS } from './AuthStatus';
import './CertDetail.css';

const MISSION_LABELS = {
  '좋아요/찜 인증': '좋아요/찜 인증하고',
  '구매확정 인증': '구매 확정하고',
  '리뷰 인증': '리뷰 남기고',
};

// 6번: 다음으로 할 미션 인덱스 (첫 번째 pending/fail)
function getNextMissionIdx(missions) {
  return missions.findIndex(m => m.status === 'pending' || m.status === 'fail');
}

function getNudgeMessage(missions, totalBonus) {
  const doneCnt = missions.filter(m => m.status === 'done').length;
  const total = missions.length;
  const hasFail = missions.some(m => m.status === 'fail');
  const remaining = total - doneCnt;
  if (hasFail) return { text: '실패한 미션이 있어요!', color: '#E53E3E' };
  if (remaining === 0) return null;
  if (remaining === 1) return { text: `${remaining}개만 더 하면 +${totalBonus.toLocaleString()}P! 🎯`, color: '#461CC2' };
  return { text: `${remaining}개만 더 하면 +${totalBonus.toLocaleString()}P 받아요!`, color: '#D97706' };
}

export default function CertDetail({ item, onBack, onMissionClick }) {
  const { product, missions, bonus } = item;
  const doneCnt = missions.filter(m => m.status === 'done').length;
  const total = missions.length;
  const totalBonus = missions.reduce((sum, m) => sum + (m.bonus || 0), 0) + bonus;
  const nudge = getNudgeMessage(missions, totalBonus);
  const nextIdx = getNextMissionIdx(missions);

  return (
    <div className="cert-detail">
      {/* 상품 정보 */}
      <div className="cd-product">
        <img src={product.image} alt={product.name} className="cd-product__img" />
        <p className="cd-product__name">{product.name}</p>
      </div>

      <div className="cd-divider" />

      {/* 2번: 프로그레스바 + 넛지 + 총 금액 */}
      <div className="cd-summary">
        {nudge && (
          <p className="cd-nudge" style={{ color: nudge.color }}>{nudge.text}</p>
        )}
        <p className="cd-total">모두 완료하면 <strong>+{totalBonus.toLocaleString()}P</strong> 받아요!</p>
      </div>

      {/* 미션 리스트 */}
      <div className="cd-mission-list">
        {missions.map((m, i) => {
          const s = MISSION_STATUS[m.status];
          const isPending = m.status === 'pending' || m.status === 'fail';
          const isNext = i === nextIdx; // 6번: 다음 추천 미션
          const missionBonus = m.bonus || bonus;

          return (
            <div key={i} className={`cd-mission-row ${isNext ? 'cd-mission-row--next' : ''}`}>
              {/* 6번: 다음 미션 라벨 */}
              {isNext && (
                <div className="cd-next-badge">다음 미션 👆</div>
              )}
              <div className="cd-mission-row-inner">
                <div className="cd-mission-left">
                  <span className="cd-mission-label">{MISSION_LABELS[m.name] || m.name}</span>
                  <div className="cd-mission-meta">
                    <span className="cd-mission-badge" style={{ color: s.color, background: s.bg }}>
                      {s.label}
                    </span>
                    {/* 4번: 미션별 혜택 배지 */}
                    {missionBonus > 0 && (
                      <span className="cd-mission-bonus-tag">+{missionBonus.toLocaleString()}P</span>
                    )}
                  </div>
                </div>
                {isPending || m.status === 'reviewing' ? (
                  <button
                    className="cd-mission-btn"
                    disabled={m.status === 'reviewing'}
                    onClick={() => isPending && onMissionClick?.({ ...m, label: MISSION_LABELS[m.name] || m.name, bonus: missionBonus })}
                  >
                    +{missionBonus.toLocaleString()}P 받기
                  </button>
                ) : (
                  <span className="cd-mission-done-text">+{missionBonus.toLocaleString()}P 적립 완료</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
