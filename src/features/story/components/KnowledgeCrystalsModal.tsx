import React, { useState } from 'react';
import { Gem, Sparkles, CheckCircle2, Lock, Shield, Award, Info, X } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { SoundButton } from '@/components/common/SoundButton';
import { SEVEN_KNOWLEDGE_CRYSTALS } from '../data/sevenCrystalsConfig';
import { useProgressStore } from '@/game/state/useProgressStore';
import { useAudio } from '@/hooks/useAudio';
import type { KnowledgeCrystalItem } from '@/types/story';

interface KnowledgeCrystalsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KnowledgeCrystalsModal: React.FC<KnowledgeCrystalsModalProps> = ({ isOpen, onClose }) => {
  const { playSelect } = useAudio();
  const currentProgress = useProgressStore((state) => state.currentProgress);
  const collectedGemIds = currentProgress?.collectedGemIds || [];

  const [selectedCrystal, setSelectedCrystal] = useState<KnowledgeCrystalItem>(SEVEN_KNOWLEDGE_CRYSTALS[0]);

  if (!isOpen) return null;

  const collectedCount = SEVEN_KNOWLEDGE_CRYSTALS.filter((c) =>
    collectedGemIds.some((id) => id === c.id || id === `gem-g2-${c.order}` || id === `gem-g3-${c.order}`)
  ).length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="BỘ SƯU TẬP BẢY VIÊN NGỌC TRI THỨC" maxWidth="860px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Header Summary Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(251, 191, 36, 0.2)',
                border: '1px solid #fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fbbf24',
              }}
            >
              <Gem size={26} />
            </div>
            <div>
              <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '1.1rem', fontWeight: 800 }}>
                Ngọc Đài Khải Huyền Tri Thức
              </h4>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>
                Thu hồi đủ 7 viên ngọc để xóa bỏ bóng tối của Lord Zero và giải cứu thế giới.
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '8px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Sparkles size={16} color="#fbbf24" />
            <span style={{ color: '#fbbf24', fontWeight: 800, fontSize: '1.1rem' }}>
              {collectedCount} / 7
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Đã thu thập</span>
          </div>
        </div>

        {/* 7 Crystal Slots Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '10px',
          }}
        >
          {SEVEN_KNOWLEDGE_CRYSTALS.map((crystal) => {
            const isCollected = collectedGemIds.some(
              (id) => id === crystal.id || id === `gem-g2-${crystal.order}` || id === `gem-g3-${crystal.order}`
            );
            const isSelected = selectedCrystal.id === crystal.id;

            return (
              <div
                key={crystal.id}
                onClick={() => {
                  playSelect();
                  setSelectedCrystal(crystal);
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '14px 6px',
                  borderRadius: '16px',
                  background: isSelected
                    ? 'rgba(251, 191, 36, 0.15)'
                    : isCollected
                    ? 'rgba(15, 23, 42, 0.7)'
                    : 'rgba(15, 23, 42, 0.4)',
                  border: isSelected
                    ? '2px solid #fbbf24'
                    : isCollected
                    ? `1px solid ${crystal.color}`
                    : '1px dashed rgba(255, 255, 255, 0.15)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isCollected && isSelected ? `0 0 16px ${crystal.glowColor}` : 'none',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: isCollected
                      ? `radial-gradient(circle, ${crystal.color} 0%, rgba(0,0,0,0.6) 80%)`
                      : 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isCollected ? '#ffffff' : '#64748b',
                    boxShadow: isCollected ? `0 0 12px ${crystal.glowColor}` : 'none',
                    marginBottom: '8px',
                  }}
                >
                  {isCollected ? <Gem size={22} /> : <Lock size={18} />}
                </div>

                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: isCollected ? '#f8fafc' : '#64748b',
                    textAlign: 'center',
                    lineHeight: 1.2,
                  }}
                >
                  #{crystal.order}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    color: isCollected ? crystal.color : '#475569',
                    textAlign: 'center',
                    marginTop: '2px',
                  }}
                >
                  {isCollected ? 'Đã Có' : 'Khóa'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Selected Crystal Detailed Card */}
        {selectedCrystal && (
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: `1px solid ${selectedCrystal.color}`,
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              gap: '20px',
              boxShadow: `0 4px 20px ${selectedCrystal.glowColor}`,
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                background: `radial-gradient(circle, ${selectedCrystal.color} 20%, rgba(15, 23, 42, 0.9) 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: `0 0 24px ${selectedCrystal.glowColor}`,
                flexShrink: 0,
              }}
            >
              <Gem size={44} />
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.25rem', fontWeight: 800 }}>
                  {selectedCrystal.vietnameseName}
                </h3>
                <span
                  style={{
                    color: selectedCrystal.color,
                    background: 'rgba(255, 255, 255, 0.08)',
                    padding: '3px 10px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  Vương Quốc #{selectedCrystal.order}
                </span>
              </div>

              <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.5 }}>
                {selectedCrystal.description}
              </p>

              <div
                style={{
                  marginTop: '6px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Award size={18} color="#fbbf24" />
                <span style={{ color: '#facc15', fontSize: '0.85rem', fontWeight: 700 }}>
                  Quyền năng: {selectedCrystal.powerGranted}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Close Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
          <SoundButton
            onClick={onClose}
            style={{
              background: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              padding: '10px 24px',
              borderRadius: '12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Đóng
          </SoundButton>
        </div>
      </div>
    </Modal>
  );
};
