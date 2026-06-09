import './AuthStatus.css';

const STATUS_MAP = {
  done: { label: '인증완료', color: '#461CC2', bg: '#ede8ff' },
  fail: { label: '인증실패', color: '#e53e3e', bg: '#fff0f0' },
  reviewing: { label: '검수중', color: '#d97706', bg: '#fffbeb' },
  pending: { label: '적립대기', color: '#2563eb', bg: '#eff6ff' },
  mission_fail: { label: '미션실패', color: '#888', bg: '#f5f5f5' },
};

const mockItems = [
  { id: 1, name: '다이슨 에어랩 멀티스타일러', image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=200&h=200&fit=crop', status: 'done', date: '2026.06.01' },
  { id: 2, name: '삼성 갤럭시 버즈2 프로', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop', status: 'reviewing', date: '2026.06.03' },
  { id: 3, name: '나이키 에어맥스 270', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop', status: 'pending', date: '2026.06.05' },
  { id: 4, name: '애플 에어팟 프로 2세대', image: 'https://images.unsplash.com/photo-1606741965326-cb990ae01bb2?w=200&h=200&fit=crop', status: 'fail', date: '2026.05.28' },
  { id: 5, name: '소니 WH-1000XM5', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop', status: 'mission_fail', date: '2026.05.20' },
];

export default function AuthStatus() {
  return (
    <div className="auth-status">
      <p className="auth-status__count">총 {mockItems.length}건의 인증 내역</p>
      <ul className="auth-list">
        {mockItems.map(item => {
          const s = STATUS_MAP[item.status];
          return (
            <li key={item.id} className="auth-item">
              <img src={item.image} alt={item.name} className="auth-item__img" />
              <div className="auth-item__info">
                <p className="auth-item__name">{item.name}</p>
                <p className="auth-item__date">{item.date}</p>
              </div>
              <span
                className="auth-item__badge"
                style={{ color: s.color, background: s.bg }}
              >
                {s.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
