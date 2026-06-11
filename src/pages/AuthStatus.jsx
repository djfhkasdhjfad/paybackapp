import { useState } from 'react';
import { products } from '../data/products';
import './AuthStatus.css';

function getDday(endDateStr) {
  const [y, m, d] = endDateStr.split('.').map(Number);
  const end = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((end - today) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: '마감', color: '#aaa' };
  if (diff === 0) return { label: 'D-day', color: '#E53E3E' };
  return { label: `D-${diff}`, color: diff <= 3 ? '#E53E3E' : '#461CC2' };
}

function getEndDate(period) {
  return period.split(' ~ ')[1];
}

const MISSION_STATUS = {
  done:      { label: '인증완료', color: '#461CC2', bg: '#EDE8FF' },
  reviewing: { label: '검수중',   color: '#D97706', bg: '#FFFBEB' },
  fail:      { label: '인증실패', color: '#E53E3E', bg: '#FFF0F0' },
  pending:   { label: '인증전',   color: '#aaa',    bg: '#F5F5F5' },
};

const mockInProgress = [
  {
    id: 1,
    product: products[0],
    purchasePeriod: '2026.06.01 ~ 2026.06.30',
    certPeriod: '2026.06.01 ~ 2026.07.07',
    missions: [
      { name: '좋아요/찜 인증', status: 'done' },
      { name: '구매확정 인증', status: 'reviewing' },
      { name: '리뷰 인증',     status: 'pending' },
    ],
    bonus: 2000,
  },
  {
    id: 2,
    product: products[1],
    purchasePeriod: '2026.06.05 ~ 2026.06.30',
    certPeriod: '2026.06.05 ~ 2026.06.13',
    missions: [
      { name: '좋아요/찜 인증', status: 'done' },
      { name: '구매확정 인증', status: 'done' },
      { name: '리뷰 인증',     status: 'fail' },
    ],
    bonus: 2000,
  },
  {
    id: 3,
    product: products[3],
    purchasePeriod: '2026.06.08 ~ 2026.06.30',
    certPeriod: '2026.06.08 ~ 2026.07.07',
    missions: [
      { name: '좋아요/찜 인증', status: 'done' },
      { name: '구매확정 인증', status: 'done' },
      { name: '리뷰 인증',     status: 'pending' },
    ],
    bonus: 2000,
  },
];

const mockDone = [
  {
    id: 4,
    product: products[2],
    purchasePeriod: '2026.05.01 ~ 2026.05.31',
    certPeriod: '2026.05.01 ~ 2026.06.07',
    missions: [
      { name: '좋아요/찜 인증', status: 'done' },
      { name: '구매확정 인증', status: 'done' },
      { name: '리뷰 인증',     status: 'done' },
    ],
    bonus: 2000,
    earnedAmount: 38000,
  },
];

// 총 적립 금액
const totalEarned = mockDone.reduce((sum, i) => sum + (i.earnedAmount || 0), 0);

function MissionBadge({ status }) {
  const s = MISSION_STATUS[status];
  return (
    <span className="mission-badge" style={{ color: s.color, background: s.bg }}>
      {s.label}
    </span>
  );
}

function getNudgeMessage(doneCnt, total, missions) {
  const hasFail = missions.some(m => m.status === 'fail');
  const remaining = total - doneCnt;
  if (hasFail) return { text: '실패한 미션이 있어요!', color: '#E53E3E' };
  if (remaining === 0) return null;
  if (remaining === 1) return { text: '마지막 미션 1개만 남았어요! 🎯', color: '#461CC2' };
  if (remaining === 2) return { text: `미션 ${remaining}개 완료하면 페이백 받아요!`, color: '#D97706' };
  return null;
}

function AuthCard({ item, isDone }) {
  const [expanded, setExpanded] = useState(false);
  const doneCnt = item.missions.filter(m => m.status === 'done').length;
  const total = item.missions.length;
  const allDone = doneCnt === total;
  const certDday = getDday(getEndDate(item.certPeriod));
  const isUrgent = !isDone && (certDday.label === 'D-day' || (certDday.label.startsWith('D-') && parseInt(certDday.label.slice(2)) <= 3));
  const nudge = !isDone ? getNudgeMessage(doneCnt, total, item.missions) : null;

  // nudge 메시지가 있는 모든 케이스 → 인증하기 버튼 기본 노출
  const showBtnDefault = !isDone && nudge !== null;

  return (
    <div className="auth-card">
      {/* D-3 이하 긴박감 배너 */}
      {isUrgent && (
        <div className="auth-urgent-banner">
          <span className="auth-urgent-dot" />
          인증 마감이 얼마 남지 않았어요! 지금 바로 인증하세요
        </div>
      )}

      {/* 기본 노출 */}
      <div className="auth-card__header">
        <img src={item.product.image} alt={item.product.name} className="auth-card__img" />

        <div className="auth-card__info">
          <p className="auth-card__name">{item.product.name}</p>

          {!isDone ? (
            <>
              <div className="auth-card__summary">
                <span className="summary-period">인증기간</span>
                <span className="summary-dday" style={{ color: certDday.color }}>
                  {certDday.label}
                </span>
                <span className="summary-mission-badge">
                  {doneCnt}/{total} 완료
                </span>
              </div>
              {nudge && (
                <p className="auth-nudge" style={{ color: nudge.color }}>{nudge.text}</p>
              )}
            </>
          ) : (
            <p className="auth-card__earned">
              적립 완료 <strong>+{item.earnedAmount.toLocaleString()}원</strong>
            </p>
          )}
        </div>

      </div>

      {/* 인증하기 버튼 — 항상 노출 (펼쳐도 유지) */}
      {showBtnDefault && (
        <div className="auth-card__quick-btn">
          <button className="auth-cert-btn">인증하기</button>
        </div>
      )}

      {/* 화살표 토글 + 자세히보기 텍스트 */}
      {!isDone && (
        <button
          className={`auth-card__toggle ${expanded ? 'auth-card__toggle--open' : ''}`}
          onClick={() => setExpanded(v => !v)}
          aria-label="상세보기"
        >
          <span className="auth-card__toggle-label">자세히보기</span>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M5 7.5L10 12.5L15 7.5" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {/* 펼쳐지는 상세 */}
      {!isDone && expanded && (
        <div className="auth-card__detail">
          <div className="detail-period-row">
            <span className="detail-period-label">구매기간</span>
            <span className="detail-period-value">{item.purchasePeriod}</span>
          </div>

          <div className="auth-card__missions">
            {item.missions.map((m, i) => (
              <div key={i} className="mission-row">
                <div className="mission-row__left">
                  <span className="mission-name">{m.name}</span>
                  {/* ② 검수중 예상 완료일 */}
                  {m.status === 'reviewing' && (
                    <span className="mission-reviewing-hint">보통 1~2일 소요돼요</span>
                  )}
                </div>
                <MissionBadge status={m.status} />
              </div>
            ))}
          </div>

          <div className="auth-card__bonus">
            <span className="bonus-label">혜택 · 보너스</span>
            <span className="bonus-desc">
              모든 미션 완료시
              <strong className="bonus-amount"> +{item.bonus.toLocaleString()}원</strong>
            </span>
          </div>

          <button className="auth-cert-btn" disabled={allDone}>
            {allDone ? '인증 완료' : '인증하기'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function AuthStatus() {
  return (
    <div className="auth-status">
      {/* ③ 총 적립 금액 상단 배너 */}
      {totalEarned > 0 && (
        <div className="auth-total-banner">
          <span className="auth-total-banner__label">지금까지 총</span>
          <span className="auth-total-banner__amount">+{totalEarned.toLocaleString()}원</span>
          <span className="auth-total-banner__label">페이백 받았어요 🎉</span>
        </div>
      )}

      <div className="auth-section">
        <h2 className="auth-section__title">
          진행중 <span className="auth-section__count">{mockInProgress.length}</span>
        </h2>
        <div className="auth-list">
          {mockInProgress.map(item => <AuthCard key={item.id} item={item} isDone={false} />)}
        </div>
      </div>

      <div className="auth-section">
        <h2 className="auth-section__title">
          완료 <span className="auth-section__count">{mockDone.length}</span>
        </h2>
        <div className="auth-list">
          {mockDone.map(item => <AuthCard key={item.id} item={item} isDone={true} />)}
        </div>
      </div>
    </div>
  );
}
