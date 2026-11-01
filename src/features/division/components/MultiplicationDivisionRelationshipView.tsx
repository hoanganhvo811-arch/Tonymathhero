import React, { useState } from 'react';

export const MultiplicationDivisionRelationshipView: React.FC = () => {
  const [factorA, setFactorA] = useState<number>(4);
  const [factorB, setFactorB] = useState<number>(3);
  const product = factorA * factorB;

  // Mini quiz state
  const [quizInput, setQuizInput] = useState<string>('');
  const [quizResult, setQuizResult] = useState<'correct' | 'wrong' | null>(null);

  const testDividend = 40;
  const testDivisor = 5;
  const testCorrectQuotient = 8;

  const handleCheckQuiz = () => {
    if (parseInt(quizInput, 10) === testCorrectQuotient) {
      setQuizResult('correct');
    } else {
      setQuizResult('wrong');
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', color: '#f8fafc' }}>
      {/* Intro Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid rgba(250, 204, 21, 0.3)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-game, 'Be Vietnam Pro', sans-serif)",
            fontSize: '1.6rem',
            color: '#facc15',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span>🔄</span>
          <span>QUAN HỆ NGHỊCH ĐẢO: PHÉP NHÂN & PHÉP CHIA</span>
        </h2>
        <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Phép nhân và phép chia là hai người bạn song sinh ngược chiều nhau!
          Nếu Tony biết <strong>{factorA} × {factorB} = {product}</strong>,
          thì Tony đã biết ngay hai phép chia tương ứng mà không cần phải tính lại!
        </p>
      </div>

      {/* Interactive Fact Family Explorer */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.9)',
          border: '2px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '24px',
          padding: '28px',
          marginBottom: '28px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Chọn 2 thừa số để xem gia đình phép tính (Fact Family)
          </span>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#38bdf8' }}>Thừa số 1: </span>
              <select
                value={factorA}
                onChange={(e) => setFactorA(Number(e.target.value))}
                style={{
                  background: 'rgba(30, 41, 59, 0.9)',
                  color: '#ffffff',
                  border: '1px solid #38bdf8',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {[2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <span style={{ fontSize: '1.4rem', color: '#facc15', fontWeight: 900 }}>×</span>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#a855f7' }}>Thừa số 2: </span>
              <select
                value={factorB}
                onChange={(e) => setFactorB(Number(e.target.value))}
                style={{
                  background: 'rgba(30, 41, 59, 0.9)',
                  color: '#ffffff',
                  border: '1px solid #a855f7',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 3 Interlocking Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
          }}
        >
          {/* Card 1: Multiplication */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)',
              border: '2px solid #eab308',
              borderRadius: '20px',
              padding: '24px',
              textAlign: 'center',
              boxShadow: '0 0 20px rgba(234, 179, 8, 0.2)',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✖️</div>
            <div style={{ fontSize: '0.85rem', color: '#fef08a', fontWeight: 800, marginBottom: '6px' }}>
              PHÉP NHÂN CỐT LÕI
            </div>
            <div
              style={{
                fontFamily: "var(--font-game, 'Be Vietnam Pro', sans-serif)",
                fontSize: '1.8rem',
                fontWeight: 900,
                color: '#ffffff',
              }}
            >
              <span style={{ color: '#38bdf8' }}>{factorA}</span> × <span style={{ color: '#c084fc' }}>{factorB}</span> = <span style={{ color: '#facc15' }}>{product}</span>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.8rem', marginTop: '10px' }}>
              {factorA} nhóm, mỗi nhóm có {factorB} vật phẩm
            </p>
          </div>

          {/* Card 2: Division 1 */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)',
              border: '2px solid #38bdf8',
              borderRadius: '20px',
              padding: '24px',
              textAlign: 'center',
              boxShadow: '0 0 20px rgba(56, 189, 248, 0.2)',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>➗</div>
            <div style={{ fontSize: '0.85rem', color: '#7dd3fc', fontWeight: 800, marginBottom: '6px' }}>
              PHÉP CHIA 1 (CHIA CHO THỪA SỐ 1)
            </div>
            <div
              style={{
                fontFamily: "var(--font-game, 'Be Vietnam Pro', sans-serif)",
                fontSize: '1.8rem',
                fontWeight: 900,
                color: '#ffffff',
              }}
            >
              <span style={{ color: '#facc15' }}>{product}</span> ÷ <span style={{ color: '#38bdf8' }}>{factorA}</span> = <span style={{ color: '#c084fc' }}>{factorB}</span>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.8rem', marginTop: '10px' }}>
              Lấy tích chia cho thừa số thứ nhất được thừa số thứ hai
            </p>
          </div>

          {/* Card 3: Division 2 */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)',
              border: '2px solid #a855f7',
              borderRadius: '20px',
              padding: '24px',
              textAlign: 'center',
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.2)',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>➗</div>
            <div style={{ fontSize: '0.85rem', color: '#d8b4fe', fontWeight: 800, marginBottom: '6px' }}>
              PHÉP CHIA 2 (CHIA CHO THỪA SỐ 2)
            </div>
            <div
              style={{
                fontFamily: "var(--font-game, 'Be Vietnam Pro', sans-serif)",
                fontSize: '1.8rem',
                fontWeight: 900,
                color: '#ffffff',
              }}
            >
              <span style={{ color: '#facc15' }}>{product}</span> ÷ <span style={{ color: '#c084fc' }}>{factorB}</span> = <span style={{ color: '#38bdf8' }}>{factorA}</span>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.8rem', marginTop: '10px' }}>
              Lấy tích chia cho thừa số thứ hai được thừa số thứ nhất
            </p>
          </div>
        </div>
      </div>

      {/* Mini Interactive Puzzle */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '20px',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-game, 'Be Vietnam Pro', sans-serif)",
            fontSize: '1.25rem',
            color: '#facc15',
            marginBottom: '10px',
          }}
        >
          🧩 THỬ THÁCH NHANH: TÌM KẾT QUẢ TỪ PHÉP NHÂN
        </h3>
        <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '16px' }}>
          Biết rằng: <strong>8 × 5 = 40</strong>. Hỏi: <strong>40 ÷ 5 = ?</strong>
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
          <input
            type="number"
            value={quizInput}
            onChange={(e) => {
              setQuizInput(e.target.value);
              setQuizResult(null);
            }}
            placeholder="?"
            style={{
              width: '80px',
              padding: '10px',
              borderRadius: '12px',
              border: '2px solid #38bdf8',
              background: 'rgba(15, 23, 42, 0.9)',
              color: '#ffffff',
              fontSize: '1.3rem',
              fontWeight: 900,
              textAlign: 'center',
            }}
          />
          <button
            onClick={handleCheckQuiz}
            style={{
              padding: '10px 24px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Kiểm Tra
          </button>
        </div>

        {quizResult === 'correct' && (
          <div style={{ marginTop: '14px', color: '#4ade80', fontWeight: 800, fontSize: '1rem' }}>
            🎉 Chính xác tuyệt đối! Vì 8 × 5 = 40 nên 40 ÷ 5 = 8!
          </div>
        )}
        {quizResult === 'wrong' && (
          <div style={{ marginTop: '14px', color: '#f87171', fontWeight: 700, fontSize: '0.95rem' }}>
            ❌ Chưa đúng rồi! Tony hãy nhìn vào phép nhân 8 × 5 = 40 xem số còn lại là mấy nhé!
          </div>
        )}
      </div>
    </div>
  );
};
