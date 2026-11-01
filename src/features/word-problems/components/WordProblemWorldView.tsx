import React from 'react';
import { useWordProblemStore } from '../useWordProblemStore';
import { WORD_PROBLEMS_CATALOG } from '../data/wordProblemsCatalog';
import type { WordProblemStoryContext } from '../../../types/wordProblem';

export const WordProblemWorldView: React.FC = () => {
  const { selectProblem, progress } = useWordProblemStore();

  const zones: {
    context: WordProblemStoryContext;
    name: string;
    icon: string;
    desc: string;
    color: string;
  }[] = [
    {
      context: 'village',
      name: 'Làng Nhiệm Vụ',
      icon: '🏡',
      desc: 'Giúp dân làng phân chia bánh mì, sách thư viện và tiếp tế nước ngọt.',
      color: '#38bdf8',
    },
    {
      context: 'farm',
      name: 'Nông Trại Cỏ Xanh',
      icon: '🌾',
      desc: 'Đếm đàn cừu, tính số trứng thu hoạch và phân phối cỏ tươi cho vật nuôi.',
      color: '#4ade80',
    },
    {
      context: 'market',
      name: 'Khu Thương Mại',
      icon: '⚖️',
      desc: 'Tính toán giá tiền mua dụng cụ hiệp sĩ, thuốc giải độc và trao đổi tiền vàng.',
      color: '#facc15',
    },
    {
      context: 'treasure',
      name: 'Kho Báu Cổ Tích',
      icon: '👑',
      desc: 'Phân loại các túi đá quý ma thuật, mở khóa rương thần linh bí ẩn.',
      color: '#f472b6',
    },
    {
      context: 'construction',
      name: 'Khu Xây Dựng & Sửa Cầu',
      icon: '🏗️',
      desc: 'Tính số thanh gỗ dựng hàng rào và độ dài dây thừng bắc cầu treo qua vực.',
      color: '#fb923c',
    },
    {
      context: 'forest',
      name: 'Rừng Rậm Thám Hiểm',
      icon: '🌲',
      desc: 'Thu hoạch táo vàng mật, hái nấm tiên cảnh và giải cứu sinh vật kỳ diệu.',
      color: '#a78bfa',
    },
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', color: '#f8fafc' }}>
      {/* Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '24px',
          padding: '28px',
          textAlign: 'center',
          marginBottom: '28px',
          boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ fontSize: '3.5rem', marginBottom: '8px' }}>🗺️</div>
        <h2
          style={{
            fontFamily: "var(--font-game, 'Be Vietnam Pro', sans-serif)",
            fontSize: '1.9rem',
            fontWeight: 900,
            color: '#38bdf8',
            marginBottom: '8px',
          }}
        >
          THẾ GIỚI TOÁN CÓ LỜI VĂN • WORD PROBLEM ADVENTURE
        </h2>
        <p style={{ color: '#cbd5e1', fontSize: '0.95rem', maxWidth: '750px', margin: '0 auto', lineHeight: 1.6 }}>
          Mỗi bài toán không chỉ là một phép tính khô khan, mà là một **nhiệm vụ giải cứu thực sự**!
          Tony hãy chọn một khu vực phiêu lưu để lắng nghe câu chuyện và dùng trí tuệ giải quyết tình huống nhé!
        </p>
      </div>

      {/* 6 Adventure Zones Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '20px',
        }}
      >
        {zones.map((zone) => {
          const zoneProblems = WORD_PROBLEMS_CATALOG.filter((p) => p.storyContext === zone.context);
          const solvedInZone = zoneProblems.filter((p) => progress?.solvedProblemIds.includes(p.id)).length;

          return (
            <div
              key={zone.context}
              style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '20px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = zone.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '2.5rem' }}>{zone.icon}</span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: zone.color,
                    }}
                  >
                    Đã hoàn thành: {solvedInZone} / {zoneProblems.length}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: "var(--font-game, 'Be Vietnam Pro', sans-serif)",
                    fontSize: '1.25rem',
                    fontWeight: 900,
                    color: zone.color,
                    marginBottom: '8px',
                  }}
                >
                  {zone.name}
                </h3>
                <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '16px' }}>
                  {zone.desc}
                </p>
              </div>

              {/* Action Buttons for problems in this zone */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {zoneProblems.map((p) => {
                  const isSolved = progress?.solvedProblemIds.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => selectProblem(p.id)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '12px',
                        background: isSolved ? 'rgba(16, 185, 129, 0.15)' : 'rgba(30, 41, 59, 0.8)',
                        border: isSolved ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.15)',
                        color: isSolved ? '#34d399' : '#ffffff',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span>{p.title}</span>
                      <span>{isSolved ? '✓ Xong' : 'Chơi ➔'}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
