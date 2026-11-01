import React, { useState } from 'react';
import { Volume2, RotateCcw, ZoomIn, ZoomOut, CheckCircle2, Eye } from 'lucide-react';
import type { ShapePropertyInfo } from '../../../types/geometryMeasurement';

interface Shape3DViewerProps {
  shape: ShapePropertyInfo;
  onSpeak: (text: string) => void;
  onExplored?: (shapeId: string) => void;
}

export const Shape3DViewer: React.FC<Shape3DViewerProps> = ({ shape, onSpeak, onExplored }) => {
  const [rotX, setRotX] = useState<number>(20);
  const [rotY, setRotY] = useState<number>(-25);
  const [zoom, setZoom] = useState<number>(1);
  const [showVertices, setShowVertices] = useState<boolean>(true);
  const [showEdges, setShowEdges] = useState<boolean>(true);

  const resetView = () => {
    setRotX(20);
    setRotY(-25);
    setZoom(1);
  };

  const renderShapeGraphic = () => {
    const is3D = shape.dimension === '3D';
    const scale = zoom;

    if (shape.id === 'shape_square') {
      return (
        <svg width="220" height="220" viewBox="0 0 200 200" style={{ transform: `scale(${scale})` }}>
          <rect
            x="30"
            y="30"
            width="140"
            height="140"
            fill="rgba(56, 189, 248, 0.25)"
            stroke={showEdges ? '#38bdf8' : 'rgba(56, 189, 248, 0.4)'}
            strokeWidth="5"
            rx="4"
          />
          {showVertices && (
            <>
              <circle cx="30" cy="30" r="7" fill="#facc15" />
              <circle cx="170" cy="30" r="7" fill="#facc15" />
              <circle cx="170" cy="170" r="7" fill="#facc15" />
              <circle cx="30" cy="170" r="7" fill="#facc15" />
            </>
          )}
          {/* Right angle markings */}
          <path d="M 30 50 L 50 50 L 50 30" fill="none" stroke="#facc15" strokeWidth="2" />
          <path d="M 150 30 L 150 50 L 170 50" fill="none" stroke="#facc15" strokeWidth="2" />
          <path d="M 170 150 L 150 150 L 150 170" fill="none" stroke="#facc15" strokeWidth="2" />
          <path d="M 50 170 L 50 150 L 30 150" fill="none" stroke="#facc15" strokeWidth="2" />
        </svg>
      );
    }

    if (shape.id === 'shape_rectangle') {
      return (
        <svg width="240" height="200" viewBox="0 0 240 180" style={{ transform: `scale(${scale})` }}>
          <rect
            x="20"
            y="35"
            width="200"
            height="110"
            fill="rgba(52, 211, 153, 0.25)"
            stroke={showEdges ? '#34d399' : 'rgba(52, 211, 153, 0.4)'}
            strokeWidth="5"
            rx="4"
          />
          {showVertices && (
            <>
              <circle cx="20" cy="35" r="7" fill="#facc15" />
              <circle cx="220" cy="35" r="7" fill="#facc15" />
              <circle cx="220" cy="145" r="7" fill="#facc15" />
              <circle cx="20" cy="145" r="7" fill="#facc15" />
            </>
          )}
          <path d="M 20 55 L 40 55 L 40 35" fill="none" stroke="#facc15" strokeWidth="2" />
          <path d="M 200 35 L 200 55 L 220 55" fill="none" stroke="#facc15" strokeWidth="2" />
        </svg>
      );
    }

    if (shape.id === 'shape_triangle') {
      return (
        <svg width="220" height="200" viewBox="0 0 200 200" style={{ transform: `scale(${scale})` }}>
          <polygon
            points="100,25 180,175 20,175"
            fill="rgba(245, 158, 11, 0.25)"
            stroke={showEdges ? '#f59e0b' : 'rgba(245, 158, 11, 0.4)'}
            strokeWidth="5"
          />
          {showVertices && (
            <>
              <circle cx="100" cy="25" r="7" fill="#38bdf8" />
              <circle cx="180" cy="175" r="7" fill="#38bdf8" />
              <circle cx="20" cy="175" r="7" fill="#38bdf8" />
            </>
          )}
        </svg>
      );
    }

    if (shape.id === 'shape_circle') {
      return (
        <svg width="220" height="200" viewBox="0 0 200 200" style={{ transform: `scale(${scale})` }}>
          <circle
            cx="100"
            cy="100"
            r="75"
            fill="rgba(236, 72, 153, 0.25)"
            stroke="#ec4899"
            strokeWidth="5"
          />
          {/* Center O */}
          <circle cx="100" cy="100" r="5" fill="#facc15" />
          <text x="94" y="90" fill="#facc15" fontSize="14" fontWeight="bold">O</text>
          {/* Radius R */}
          <line x1="100" y1="100" x2="175" y2="100" stroke="#facc15" strokeWidth="2.5" strokeDasharray="4" />
          <text x="130" y="93" fill="#facc15" fontSize="13" fontWeight="bold">R</text>
        </svg>
      );
    }

    // 3D Shapes via CSS 3D transforms
    if (shape.id === 'shape_cube') {
      return (
        <div
          style={{
            width: '120px',
            height: '120px',
            transformStyle: 'preserve-3d',
            transform: `scale(${scale}) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            transition: 'transform 0.15s ease-out',
            margin: '40px auto',
          }}
        >
          {/* 6 faces of Cube */}
          <div style={{ position: 'absolute', width: '120px', height: '120px', background: 'rgba(139, 92, 246, 0.4)', border: '2px solid #8b5cf6', transform: 'translateZ(60px)' }} />
          <div style={{ position: 'absolute', width: '120px', height: '120px', background: 'rgba(139, 92, 246, 0.3)', border: '2px solid #8b5cf6', transform: 'rotateY(180deg) translateZ(60px)' }} />
          <div style={{ position: 'absolute', width: '120px', height: '120px', background: 'rgba(139, 92, 246, 0.35)', border: '2px solid #8b5cf6', transform: 'rotateY(-90deg) translateZ(60px)' }} />
          <div style={{ position: 'absolute', width: '120px', height: '120px', background: 'rgba(139, 92, 246, 0.35)', border: '2px solid #8b5cf6', transform: 'rotateY(90deg) translateZ(60px)' }} />
          <div style={{ position: 'absolute', width: '120px', height: '120px', background: 'rgba(139, 92, 246, 0.5)', border: '2px solid #8b5cf6', transform: 'rotateX(90deg) translateZ(60px)' }} />
          <div style={{ position: 'absolute', width: '120px', height: '120px', background: 'rgba(139, 92, 246, 0.25)', border: '2px solid #8b5cf6', transform: 'rotateX(-90deg) translateZ(60px)' }} />
        </div>
      );
    }

    if (shape.id === 'shape_cuboid') {
      return (
        <div
          style={{
            width: '160px',
            height: '90px',
            transformStyle: 'preserve-3d',
            transform: `scale(${scale}) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            transition: 'transform 0.15s ease-out',
            margin: '45px auto',
          }}
        >
          {/* Faces of Cuboid */}
          <div style={{ position: 'absolute', width: '160px', height: '90px', background: 'rgba(6, 182, 212, 0.4)', border: '2px solid #06b6d4', transform: 'translateZ(45px)' }} />
          <div style={{ position: 'absolute', width: '160px', height: '90px', background: 'rgba(6, 182, 212, 0.3)', border: '2px solid #06b6d4', transform: 'rotateY(180deg) translateZ(45px)' }} />
          <div style={{ position: 'absolute', width: '90px', height: '90px', background: 'rgba(6, 182, 212, 0.35)', border: '2px solid #06b6d4', transform: 'rotateY(-90deg) translateZ(80px)' }} />
          <div style={{ position: 'absolute', width: '90px', height: '90px', background: 'rgba(6, 182, 212, 0.35)', border: '2px solid #06b6d4', transform: 'rotateY(90deg) translateZ(80px)' }} />
          <div style={{ position: 'absolute', width: '160px', height: '90px', background: 'rgba(6, 182, 212, 0.5)', border: '2px solid #06b6d4', transform: 'rotateX(90deg) translateZ(45px)' }} />
          <div style={{ position: 'absolute', width: '160px', height: '90px', background: 'rgba(6, 182, 212, 0.25)', border: '2px solid #06b6d4', transform: 'rotateX(-90deg) translateZ(45px)' }} />
        </div>
      );
    }

    if (shape.id === 'shape_cylinder') {
      return (
        <svg width="200" height="200" viewBox="0 0 160 180" style={{ transform: `scale(${scale})` }}>
          <ellipse cx="80" cy="40" rx="55" ry="20" fill="rgba(16, 185, 129, 0.4)" stroke="#10b981" strokeWidth="3" />
          <path d="M 25 40 L 25 140 A 55 20 0 0 0 135 140 L 135 40 Z" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="3" />
          <ellipse cx="80" cy="140" rx="55" ry="20" fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" strokeWidth="3" />
        </svg>
      );
    }

    // Sphere
    return (
      <svg width="200" height="200" viewBox="0 0 160 160" style={{ transform: `scale(${scale})` }}>
        <defs>
          <radialGradient id="sphereGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fda4af" />
            <stop offset="50%" stopColor="#e11d48" />
            <stop offset="100%" stopColor="#4c0519" />
          </radialGradient>
        </defs>
        <circle cx="80" cy="80" r="65" fill="url(#sphereGrad)" stroke="#fda4af" strokeWidth="2" />
        <ellipse cx="80" cy="80" rx="65" ry="22" fill="none" stroke="rgba(255,255,255,0.4)" strokeDasharray="4" />
      </svg>
    );
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
        border: `2px solid ${shape.color}`,
        borderRadius: '24px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        boxShadow: `0 12px 40px rgba(0, 0, 0, 0.6), 0 0 24px ${shape.color}40`,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: shape.color }}>{shape.nameVi}</h2>
            <span
              style={{
                background: shape.dimension === '3D' ? '#8b5cf6' : '#38bdf8',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '6px',
              }}
            >
              {shape.dimension}
            </span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>{shape.descriptionVi}</p>
        </div>

        <button
          onClick={() => onSpeak(shape.speechIntroVi)}
          style={{
            background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
            border: 'none',
            borderRadius: '12px',
            color: '#fff',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(56, 189, 248, 0.4)',
          }}
        >
          <Volume2 size={20} /> Nghe Giới Thiệu
        </button>
      </div>

      {/* Main 3D Stage & Properties Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'center' }}>
        {/* Stage Container */}
        <div
          style={{
            background: 'radial-gradient(circle at center, rgba(30, 41, 59, 0.8) 0%, rgba(10, 15, 29, 0.95) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '18px',
            minHeight: '260px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            perspective: '800px',
            overflow: 'hidden',
          }}
        >
          {renderShapeGraphic()}

          {/* 3D Manipulation Controls (for 3D shapes) */}
          {shape.dimension === '3D' && (
            <div style={{ position: 'absolute', bottom: '12px', display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.6)', padding: '6px 12px', borderRadius: '12px' }}>
              <button
                onClick={() => setRotY((y) => y - 30)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}
              >
                ◀ Xoay Trái
              </button>
              <button
                onClick={() => setRotY((y) => y + 30)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}
              >
                Xoay Phải ▶
              </button>
              <button
                onClick={resetView}
                style={{ background: 'transparent', border: 'none', color: '#facc15', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                title="Đặt lại góc nhìn"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          )}

          {/* Zoom controls */}
          <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setZoom((z) => Math.min(1.4, z + 0.15))}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ZoomOut size={16} />
            </button>
          </div>
        </div>

        {/* Properties Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>SỐ ĐỈNH</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#facc15' }}>{shape.verticesCount}</div>
            </div>
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>SỐ CẠNH</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#38bdf8' }}>{shape.edgesCount}</div>
            </div>
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>SỐ MẶT (3D)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#34d399' }}>{shape.facesCount || 1}</div>
            </div>
          </div>

          <div style={{ background: 'rgba(30, 41, 59, 0.5)', borderRadius: '14px', padding: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ color: '#e2e8f0', fontSize: '0.85rem', fontWeight: 800, marginBottom: '8px' }}>
              🔍 Đặc Điểm Nhận Biết:
            </div>
            <ul style={{ paddingLeft: '20px', color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.6' }}>
              {shape.characteristicsVi.map((charac, idx) => (
                <li key={idx}>{charac}</li>
              ))}
            </ul>
          </div>

          {/* Real-world Examples */}
          <div>
            <div style={{ color: '#e2e8f0', fontSize: '0.85rem', fontWeight: 800, marginBottom: '8px' }}>
              🌍 Đồ Vật Thực Tế Có Dạng Này:
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {shape.realWorldExamples.map((ex, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    padding: '8px',
                    textAlign: 'center',
                  }}
                  title={ex.descriptionVi}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '2px' }}>{ex.emoji}</div>
                  <div style={{ color: '#f8fafc', fontSize: '0.72rem', fontWeight: 700 }}>{ex.nameVi}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
