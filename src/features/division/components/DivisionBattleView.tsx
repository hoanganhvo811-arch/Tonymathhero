import React, { useState } from 'react';
import { useDivisionStore } from '../useDivisionStore';

export const DivisionBattleView: React.FC = () => {
  const {
    battleActive,
    bossHp,
    bossMaxHp,
    playerHp,
    playerMaxHp,
    battleQuestion,
    battleVictory,
    battleDefeat,
    startBattle,
    submitBattleAnswer,
    resetBattle,
  } = useDivisionStore();

  const [inputVal, setInputVal] = useState<string>('');
  const [lastActionText, setLastActionText] = useState<string | null>(null);

  if (!battleActive) {
    return (
      <div style={{ maxWidth: '720px', margin: '40px auto', textAlign: 'center', color: '#f8fafc' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '2px solid rgba(239, 68, 68, 0.5)',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 30px rgba(239, 68, 68, 0.3)',
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '12px' }}>🗿</div>
          <h2
            style={{
              fontFamily: "var(--font-game, 'Be Vietnam Pro', sans-serif)",
              fontSize: '1.9rem',
              color: '#f87171',
              fontWeight: 900,
              marginBottom: '10px',
            }}
          >
            ĐẤU TRƯỜNG CỰ THẠCH MA VƯƠNG PHÉP CHIA
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '28px' }}>
            Một cự thạch khổng lồ canh giữ hòm ngọc phép chia. Để đánh bại nó, Tony phải giải nhanh và chính xác
            các phép chia để tạo ra những nhát chém kiếm quang đẩy lùi ma thuật cổ!
          </p>
          <button
            onClick={startBattle}
            style={{
              padding: '16px 40px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '1.2rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(239, 68, 68, 0.6)',
            }}
          >
            ⚔️ BẮT ĐẦU KHIÊU CHIẾN BOSS
          </button>
        </div>
      </div>
    );
  }

  const handleChoice = (val: string | number) => {
    const ok = submitBattleAnswer(val);
    setLastActionText(
      ok
        ? `⚔️ Tony tung tuyệt kỹ Kiếm Quang! Gây sát thương nặng nề lên Boss!`
        : `🛡️ Boss phản kích! Tony hãy xem lại gợi ý phép chia nhé!`
    );
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const ok = submitBattleAnswer(inputVal.trim());
    setLastActionText(
      ok
        ? `⚔️ Tony giải đúng phép tính! Boss bị trúng đòn sát thương!`
        : `🛡️ Chưa chính xác! Boss gầm lên phản đòn!`
    );
    setInputVal('');
  };

  const bossPercent = Math.max(0, Math.round((bossHp / bossMaxHp) * 100));
  const playerPercent = Math.max(0, Math.round((playerHp / playerMaxHp) * 100));

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', color: '#f8fafc' }}>
      {/* Arena Stage */}
      <div
        style={{
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(9, 14, 26, 0.98) 100%)',
          border: '2px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '24px',
          padding: '24px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.9)',
          position: 'relative',
        }}
      >
        {/* Boss HP Bar */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontWeight: 800, color: '#f87171', fontSize: '1.1rem' }}>
              🗿 CỰ THẠCH MA VƯƠNG (DIVISION TITAN)
            </span>
            <span style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: 700 }}>
              {bossHp} / {bossMaxHp} HP
            </span>
          </div>
          <div style={{ width: '100%', height: '16px', background: 'rgba(0,0,0,0.6)', borderRadius: '8px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${bossPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #ef4444 0%, #f97316 100%)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Player HP Bar */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontWeight: 800, color: '#38bdf8', fontSize: '1.1rem' }}>
              🛡️ HIỆP SĨ TONY
            </span>
            <span style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: 700 }}>
              {playerHp} / {playerMaxHp} HP
            </span>
          </div>
          <div style={{ width: '100%', height: '16px', background: 'rgba(0,0,0,0.6)', borderRadius: '8px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${playerPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #10b981 0%, #38bdf8 100%)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Combat Status Ticker */}
        {lastActionText && (
          <div
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              background: 'rgba(0,0,0,0.4)',
              textAlign: 'center',
              color: '#fef08a',
              fontSize: '0.95rem',
              fontWeight: 700,
              marginBottom: '20px',
            }}
          >
            {lastActionText}
          </div>
        )}

        {/* Active Combat Question */}
        {battleQuestion && !battleVictory && !battleDefeat && (
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.9)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '20px',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '8px' }}>
              Boss tung câu đố phong ấn! Hãy giải nhanh:
            </div>
            <div
              style={{
                fontFamily: "var(--font-game, 'Be Vietnam Pro', sans-serif)",
                fontSize: '2.2rem',
                fontWeight: 900,
                color: '#facc15',
                marginBottom: '20px',
              }}
            >
              {battleQuestion.formulaDisplay}
            </div>

            {battleQuestion.options ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {battleQuestion.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleChoice(opt)}
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.2)',
                      background: 'rgba(15, 23, 42, 0.8)',
                      color: '#ffffff',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <form onSubmit={handleInputSubmit} style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Nhập kết quả..."
                  style={{
                    width: '160px',
                    padding: '12px',
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
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Tấn Công
                </button>
              </form>
            )}
          </div>
        )}

        {/* Victory Screen */}
        {battleVictory && (
          <div
            style={{
              padding: '30px',
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(15, 23, 42, 0.9) 100%)',
              border: '2px solid #10b981',
              borderRadius: '20px',
            }}
          >
            <div style={{ fontSize: '3.5rem', marginBottom: '8px' }}>🏆</div>
            <h3 style={{ fontSize: '1.8rem', color: '#34d399', fontWeight: 900, marginBottom: '8px' }}>
              CHIẾN THẮNG VANG DỘI!
            </h3>
            <p style={{ color: '#cbd5e1', marginBottom: '20px' }}>
              Tony đã khuất phục thành công Cự Thạch Ma Vương Phép Chia bằng sức mạnh tri thức toán học!
            </p>
            <div style={{ color: '#facc15', fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>
              ⭐ +200 EXP &nbsp;|&nbsp; 🪙 +150 Vàng
            </div>
            <button
              onClick={resetBattle}
              style={{
                padding: '12px 30px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Hoàn Thành Khiêu Chiến
            </button>
          </div>
        )}

        {/* Defeat Screen */}
        {battleDefeat && (
          <div
            style={{
              padding: '30px',
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(15, 23, 42, 0.9) 100%)',
              border: '2px solid #ef4444',
              borderRadius: '20px',
            }}
          >
            <div style={{ fontSize: '3.5rem', marginBottom: '8px' }}>🛡️</div>
            <h3 style={{ fontSize: '1.8rem', color: '#f87171', fontWeight: 900, marginBottom: '8px' }}>
              HIỆP SĨ CẦN RÈN LUYỆN THÊM!
            </h3>
            <p style={{ color: '#cbd5e1', marginBottom: '20px' }}>
              Tony hãy ôn lại bảng chia ở Trung tâm Luyện tập trước khi tái đấu với Cự Thạch Ma Vương nhé!
            </p>
            <button
              onClick={resetBattle}
              style={{
                padding: '12px 30px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                color: '#ffffff',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Thử Lại Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
