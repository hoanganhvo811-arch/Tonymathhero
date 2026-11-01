import React from 'react';
import { useFractionStore } from '../useFractionStore';
import { FRACTION_BUILDER_PRESETS } from '../data/fractionBuilderPresets';
import type { FractionShape } from '@/types/fractions';

export const InteractiveFractionBuilderView: React.FC = () => {
  const {
    activePreset,
    currentShape,
    totalPartitions,
    shadedIndices,
    builderFeedback,
    setShape,
    setPartitions,
    toggleShadedIndex,
    clearShaded,
    selectPreset,
    checkBuilderMatch,
    campaignId,
  } = useFractionStore();

  const gradePresets = FRACTION_BUILDER_PRESETS.filter(
    (p) => p.gradeLevel === (campaignId === 'grade-3' ? 'grade-3' : 'grade-2')
  );

  const partitionOptions =
    campaignId === 'grade-3' ? [2, 3, 4, 5, 6, 8, 10] : [2, 3, 4, 5];

  // Helper to render SVG Pizza Pie Slices
  const renderPizzaSvg = () => {
    const size = 260;
    const center = size / 2;
    const radius = size * 0.44;
    const slices = [];

    for (let i = 0; i < totalPartitions; i++) {
      const startAngle = (i * 2 * Math.PI) / totalPartitions - Math.PI / 2;
      const endAngle = ((i + 1) * 2 * Math.PI) / totalPartitions - Math.PI / 2;

      const x1 = center + radius * Math.cos(startAngle);
      const y1 = center + radius * Math.sin(startAngle);
      const x2 = center + radius * Math.cos(endAngle);
      const y2 = center + radius * Math.sin(endAngle);

      const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
      const pathData =
        totalPartitions === 1
          ? `M ${center} ${center - radius} A ${radius} ${radius} 0 1 1 ${center} ${
              center + radius
            } A ${radius} ${radius} 0 1 1 ${center} ${center - radius}`
          : `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      const isShaded = shadedIndices.includes(i);

      slices.push(
        <path
          key={i}
          d={pathData}
          fill={isShaded ? '#f59e0b' : '#334155'}
          stroke="#10b981"
          strokeWidth="2.5"
          onClick={() => toggleShadedIndex(i)}
          style={{
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            filter: isShaded ? 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.7))' : 'none',
          }}
        />
      );
    }

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={center} cy={center} r={radius + 4} fill="#1e293b" stroke="#059669" strokeWidth="3" />
        {slices}
        <circle cx={center} cy={center} r="6" fill="#facc15" />
      </svg>
    );
  };

  // Helper to render Rectangular Chocolate / Bar Cake
  const renderBarSvg = () => {
    const width = 280;
    const height = 90;
    const itemWidth = width / totalPartitions;
    const bars = [];

    for (let i = 0; i < totalPartitions; i++) {
      const isShaded = shadedIndices.includes(i);
      bars.push(
        <g
          key={i}
          onClick={() => toggleShadedIndex(i)}
          style={{ cursor: 'pointer', transition: 'all 0.25s ease' }}
        >
          <rect
            x={i * itemWidth + 2}
            y={4}
            width={itemWidth - 4}
            height={height - 8}
            rx={6}
            fill={isShaded ? (currentShape === 'rectangle_chocolate' ? '#b45309' : '#10b981') : '#1e293b'}
            stroke={isShaded ? '#facc15' : '#475569'}
            strokeWidth="2"
            style={{
              filter: isShaded ? 'drop-shadow(0 0 6px rgba(250, 204, 21, 0.6))' : 'none',
            }}
          />
          <text
            x={i * itemWidth + itemWidth / 2}
            y={height / 2 + 5}
            fill="#ffffff"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
          >
            {isShaded ? '★' : `${i + 1}`}
          </text>
        </g>
      );
    }

    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <rect x="0" y="0" width={width} height={height} rx="10" fill="#0f172a" stroke="#334155" strokeWidth="2" />
        {bars}
      </svg>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header & Preset Selector */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.85) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '16px',
          padding: '16px 20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ color: '#34d399', fontSize: '1.25rem', fontWeight: 800 }}>
              🛠️ PHÂN HỆ XÂY DỰNG PHÂN SỐ (INTERACTIVE FRACTION BUILDER)
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px' }}>
              Tự do chia đều vật thể thành các phần bằng nhau và nhấp chuột để tô màu phần được chọn!
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {gradePresets.map((p) => (
              <button
                key={p.id}
                onClick={() => selectPreset(p.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: activePreset.id === p.id ? '2px solid #34d399' : '1px solid #334155',
                  background: activePreset.id === p.id ? 'rgba(16, 185, 129, 0.3)' : 'rgba(30, 41, 59, 0.7)',
                  color: activePreset.id === p.id ? '#34d399' : '#cbd5e1',
                }}
              >
                {p.shapeNameVi}
              </button>
            ))}
          </div>
        </div>

        {/* Story Mission */}
        <div
          style={{
            marginTop: '14px',
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '10px 14px',
            borderRadius: '10px',
            borderLeft: '4px solid #facc15',
          }}
        >
          <div style={{ color: '#facc15', fontSize: '0.85rem', fontWeight: 800 }}>📜 NHIỆM VỤ THỬ THÁCH:</div>
          <div style={{ color: '#f1f5f9', fontSize: '0.92rem', marginTop: '2px' }}>{activePreset.storyVi}</div>
          <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '4px' }}>💡 Gợi ý: {activePreset.hintVi}</div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Left: Interactive Canvas */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '2px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '20px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '340px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div style={{ marginBottom: '16px', color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 600 }}>
            👆 Nhấp chuột trực tiếp vào từng miếng để <strong>Tô Màu / Bỏ Tô</strong>
          </div>

          {currentShape === 'circle_pizza' ? renderPizzaSvg() : renderBarSvg()}

          {/* Interactive Shape Toggles */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
            <button
              onClick={() => setShape('circle_pizza')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                background: currentShape === 'circle_pizza' ? '#10b981' : '#334155',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              🍕 Bánh Pizza
            </button>
            <button
              onClick={() => setShape('rectangle_chocolate')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                background: currentShape === 'rectangle_chocolate' ? '#10b981' : '#334155',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              🍫 Sô-cô-la
            </button>
            <button
              onClick={() => setShape('bar_cake')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                background: currentShape === 'bar_cake' ? '#10b981' : '#334155',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              🎂 Bánh Kem
            </button>
          </div>
        </div>

        {/* Right: Fraction Controller & Live Notation */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '2px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '20px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h4 style={{ color: '#38bdf8', fontSize: '1.1rem', fontWeight: 800, marginBottom: '14px' }}>
              ⚙️ ĐIỀU KHIỂN SỐ PHẦN CHIA ĐỀU
            </h4>

            {/* Partition Selection */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '8px' }}>
                Chọn số phần bằng nhau được chia ra (Mẫu số):
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {partitionOptions.map((n) => (
                  <button
                    key={n}
                    onClick={() => setPartitions(n)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      border: totalPartitions === n ? '2px solid #38bdf8' : '1px solid #475569',
                      background: totalPartitions === n ? 'rgba(56, 189, 248, 0.3)' : 'rgba(30, 41, 59, 0.8)',
                      color: totalPartitions === n ? '#38bdf8' : '#cbd5e1',
                    }}
                  >
                    {n} phần
                  </button>
                ))}
              </div>
            </div>

            {/* Fraction Formula Display */}
            <div
              style={{
                background: 'rgba(2, 132, 199, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                borderRadius: '16px',
                padding: '16px',
                textAlign: 'center',
                margin: '16px 0',
              }}
            >
              <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
                Phân số Tony vừa tạo thành
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', margin: '10px 0' }}>
                <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: '#facc15' }}>
                    {shadedIndices.length}
                  </span>
                  <div style={{ width: '40px', height: '3px', background: '#ffffff', margin: '2px 0' }} />
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: '#38bdf8' }}>
                    {totalPartitions}
                  </span>
                </div>
                <div style={{ textAlign: 'left', fontSize: '0.85rem', color: '#cbd5e1' }}>
                  <div>
                    🔴 Tử số: <strong style={{ color: '#facc15' }}>{shadedIndices.length}</strong> (phần tô màu)
                  </div>
                  <div>
                    🔵 Mẫu số: <strong style={{ color: '#38bdf8' }}>{totalPartitions}</strong> (tổng phần chia đều)
                  </div>
                </div>
              </div>
            </div>

            {/* Live Feedback */}
            {builderFeedback && (
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: builderFeedback.isSuccess ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  border: `1px solid ${builderFeedback.isSuccess ? '#10b981' : '#ef4444'}`,
                  color: builderFeedback.isSuccess ? '#34d399' : '#fca5a5',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  marginBottom: '14px',
                }}
              >
                {builderFeedback.message}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={clearShaded}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '12px',
                background: 'rgba(71, 85, 105, 0.6)',
                border: '1px solid #64748b',
                color: '#cbd5e1',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              🔄 Xóa Tô Màu
            </button>
            <button
              onClick={checkBuilderMatch}
              style={{
                flex: 1.5,
                padding: '12px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: '2px solid #34d399',
                color: '#ffffff',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
              }}
            >
              ✨ Kiểm Tra Kết Quả
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
