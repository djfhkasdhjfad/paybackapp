import './PointStatus.css';

const mockPoints = [
  { id: 1, name: '다이슨 에어랩 멀티스타일러', image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=200&h=200&fit=crop', amount: 699000, date: '2026.06.01' },
  { id: 2, name: '삼성 갤럭시 버즈2 프로', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop', amount: 224100, date: '2026.05.15' },
  { id: 3, name: '나이키 에어맥스 270', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop', amount: 151200, date: '2026.05.02' },
];

const total = mockPoints.reduce((sum, p) => sum + p.amount, 0);

export default function PointStatus() {
  return (
    <div className="point-status">
      <div className="point-status__summary">
        <p className="point-summary__label">총 적립 완료 머니</p>
        <p className="point-summary__amount">{total.toLocaleString('ko-KR')}원</p>
      </div>

      <p className="point-status__list-label">적립 내역</p>
      <ul className="point-list">
        {mockPoints.map(item => (
          <li key={item.id} className="point-item">
            <img src={item.image} alt={item.name} className="point-item__img" />
            <div className="point-item__info">
              <p className="point-item__name">{item.name}</p>
              <p className="point-item__date">{item.date}</p>
            </div>
            <span className="point-item__amount">+{item.amount.toLocaleString('ko-KR')}원</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
