import { useRef, useState, useEffect } from 'react';
import './MissionCert.css';

const MAX_IMAGES = 3;

export default function MissionCert({ mission, bonus, onBack }) {
  const [images, setImages] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef(null);

  // 5번: 제출 후 1.8초 뒤 뒤로가기
  useEffect(() => {
    if (submitted) {
      const t = setTimeout(() => onBack?.(), 1800);
      return () => clearTimeout(t);
    }
  }, [submitted]);

  const handleFiles = (files) => {
    const remaining = MAX_IMAGES - images.length;
    const selected = Array.from(files).slice(0, remaining);
    const urls = selected.map(f => ({ url: URL.createObjectURL(f), file: f }));
    setImages(prev => [...prev, ...urls]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mission-cert">
      {/* 5번: 제출 완료 토스트 */}
      {submitted && (
        <div className="mc-toast">
          🎉 인증 완료! +{bonus.toLocaleString()}P 적립 예정이에요
        </div>
      )}
      <div className="mc-body">
        {/* 미션명 */}
        <h2 className="mc-title">{mission.label}</h2>

        {/* 예시 이미지 */}
        <div className="mc-section">
          <p className="mc-section-label">예시 화면</p>
          <img
            src={`${import.meta.env.BASE_URL}sample.png`}
            alt="예시 화면"
            className="mc-sample-img"
          />
        </div>

        {/* 이미지 업로드 */}
        <div className="mc-section">
          <p className="mc-section-label">캡처 첨부 <span className="mc-count">{images.length}/{MAX_IMAGES}</span></p>

          {/* 썸네일 그리드 */}
          {images.length > 0 && (
            <div className="mc-thumbnail-grid">
              {images.map((img, i) => (
                <div key={i} className="mc-thumbnail">
                  <img src={img.url} alt={`첨부 ${i + 1}`} className="mc-thumbnail-img" />
                  <button className="mc-thumbnail-delete" onClick={() => removeImage(i)} aria-label="삭제">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 2L10 10M10 2L2 10" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              ))}
              {images.length < MAX_IMAGES && (
                <button className="mc-add-btn" onClick={() => inputRef.current?.click()}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5V19M5 12H19" stroke="#bbb" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>{images.length}/{MAX_IMAGES}</span>
                </button>
              )}
            </div>
          )}

          {/* 업로드 영역 (이미지 없을 때) */}
          {images.length === 0 && (
            <div
              className="mc-upload-area"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <div className="mc-upload-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 16V8M12 8L9 11M12 8L15 11" stroke="#bbb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="3" y="3" width="18" height="18" rx="4" stroke="#bbb" strokeWidth="1.5"/>
                </svg>
              </div>
              <p className="mc-upload-text">사진을 첨부해주세요</p>
              <p className="mc-upload-hint">최대 3장 · 탭하거나 드래그하여 업로드</p>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}
          />
        </div>
      </div>

      {/* 바텀시트 */}
      <div className="mc-bottom-sheet">
        <button
          className="mc-btn-submit"
          disabled={images.length === 0 || submitted}
          onClick={() => setSubmitted(true)}
        >
          인증하고 +{bonus.toLocaleString()}P 받기
        </button>
      </div>
    </div>
  );
}
