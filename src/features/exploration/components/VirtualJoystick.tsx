import React, { useRef, useState, useEffect } from 'react';

interface VirtualJoystickProps {
  onMove: (vector: { x: number; y: number }) => void;
}

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({ onMove }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const touchId = useRef<number | null>(null);

  const radius = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (touchId.current === null && e.changedTouches.length > 0) {
      const touch = e.changedTouches[0];
      touchId.current = touch.identifier;
      setActive(true);
      updatePosition(touch.clientX, touch.clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchId.current !== null) {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === touchId.current) {
          updatePosition(touch.clientX, touch.clientY);
          break;
        }
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchId.current !== null) {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchId.current) {
          touchId.current = null;
          setActive(false);
          setKnobPos({ x: 0, y: 0 });
          onMove({ x: 0, y: 0 });
          break;
        }
      }
    }
  };

  const updatePosition = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let deltaX = clientX - centerX;
    let deltaY = clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > radius) {
      deltaX = (deltaX / distance) * radius;
      deltaY = (deltaY / distance) * radius;
    }

    setKnobPos({ x: deltaX, y: deltaY });
    onMove({
      x: deltaX / radius,
      y: -deltaY / radius, // inverted Y for forward
    });
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{
        position: 'absolute',
        bottom: '30px',
        left: '30px',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'rgba(15, 23, 42, 0.65)',
        border: '2px solid rgba(251, 191, 36, 0.4)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7), 0 0 15px rgba(251, 191, 36, 0.2)',
        backdropFilter: 'blur(8px)',
        zIndex: 25,
        touchAction: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Center Knob */}
      <div
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: active
            ? 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)'
            : 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
          boxShadow: '0 4px 14px rgba(0,0,0,0.8)',
          border: '2px solid #ffffff',
          transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
          transition: active ? 'none' : 'transform 0.15s ease-out',
        }}
      />
    </div>
  );
};
