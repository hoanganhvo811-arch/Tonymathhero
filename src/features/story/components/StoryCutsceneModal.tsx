import React, { useEffect, useState } from 'react';
import { FastForward, Play, Pause, ChevronRight, ChevronLeft, Sparkles, X } from 'lucide-react';
import { SoundButton } from '@/components/common/SoundButton';
import { useStoryStore } from '../useStoryStore';
import { useAudio } from '@/hooks/useAudio';

export const StoryCutsceneModal: React.FC = () => {
  const {
    activeCutscene,
    activeSlideIndex,
    nextSlide,
    prevSlide,
    skipCutscene,
    isAutoPlay,
    toggleAutoPlay,
  } = useStoryStore();

  const { playClick, playSelect } = useAudio();

  // Auto play timer
  useEffect(() => {
    if (!activeCutscene || !isAutoPlay) return;

    const timer = setTimeout(() => {
      nextSlide();
    }, 4500);

    return () => clearTimeout(timer);
  }, [activeCutscene, activeSlideIndex, isAutoPlay, nextSlide]);

  if (!activeCutscene) return null;

  const currentSlide = activeCutscene.slides[activeSlideIndex];
  const isFirstSlide = activeSlideIndex === 0;
  const isLastSlide = activeSlideIndex === activeCutscene.slides.length - 1;

  // Mood colors
  const moodGradients: Record<string, string> = {
    normal: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 100%)',
    heroic: 'linear-gradient(180deg, rgba(14, 30, 50, 0.95) 0%, rgba(20, 60, 100, 0.98) 100%)',
    dramatic: 'linear-gradient(180deg, rgba(40, 20, 10, 0.95) 0%, rgba(60, 30, 15, 0.98) 100%)',
    dark: 'linear-gradient(180deg, rgba(20, 5, 25, 0.95) 0%, rgba(40, 10, 50, 0.98) 100%)',
    celebrate: 'linear-gradient(180deg, rgba(10, 40, 25, 0.95) 0%, rgba(20, 70, 45, 0.98) 100%)',
  };

  const bgGradient = moodGradients[currentSlide.mood || 'normal'];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '820px',
          background: bgGradient,
          borderRadius: '24px',
          border: '2px solid rgba(251, 191, 36, 0.35)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(251, 191, 36, 0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Top Header */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(0, 0, 0, 0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={20} color="#fbbf24" />
            <h3 style={{ margin: 0, color: '#fef08a', fontSize: '1.15rem', fontWeight: 800 }}>
              {activeCutscene.title}
            </h3>
            <span
              style={{
                background: 'rgba(251, 191, 36, 0.2)',
                color: '#facc15',
                padding: '2px 8px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              {activeSlideIndex + 1}/{activeCutscene.slides.length}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Auto-Play Toggle */}
            <SoundButton
              onClick={toggleAutoPlay}
              style={{
                background: isAutoPlay ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                border: isAutoPlay ? '1px solid #4ade80' : '1px solid rgba(255, 255, 255, 0.2)',
                color: isAutoPlay ? '#4ade80' : '#cbd5e1',
                padding: '6px 12px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              {isAutoPlay ? <Pause size={14} /> : <Play size={14} />}
              <span>{isAutoPlay ? 'Đang Tự Phát' : 'Tự Phát'}</span>
            </SoundButton>

            {/* Skip Button */}
            <SoundButton
              onClick={() => {
                playClick();
                skipCutscene();
              }}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                padding: '6px 12px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <FastForward size={14} />
              <span>Bỏ Qua</span>
            </SoundButton>
          </div>
        </div>

        {/* Cinematic Scene Body */}
        <div
          style={{
            padding: '36px 32px',
            minHeight: '220px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Speaker Badge */}
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span
              style={{
                color: '#38bdf8',
                fontSize: '1.25rem',
                fontWeight: 800,
                letterSpacing: '0.5px',
                textShadow: '0 0 10px rgba(56, 189, 248, 0.5)',
              }}
            >
              {currentSlide.speaker}
            </span>
            {currentSlide.speakerTitle && (
              <span
                style={{
                  color: '#94a3b8',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  fontStyle: 'italic',
                }}
              >
                ({currentSlide.speakerTitle})
              </span>
            )}
          </div>

          {/* Dialogue Box */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.45)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '16px',
              padding: '24px 28px',
              color: '#f8fafc',
              fontSize: '1.2rem',
              lineHeight: 1.6,
              fontWeight: 500,
              boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.5)',
            }}
          >
            "{currentSlide.dialogue}"
          </div>
        </div>

        {/* Bottom Controls & Slide Progress */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(0, 0, 0, 0.4)',
          }}
        >
          <SoundButton
            onClick={() => {
              playSelect();
              prevSlide();
            }}
            disabled={isFirstSlide}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: isFirstSlide ? '#64748b' : '#cbd5e1',
              padding: '8px 16px',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: isFirstSlide ? 'not-allowed' : 'pointer',
              opacity: isFirstSlide ? 0.4 : 1,
            }}
          >
            <ChevronLeft size={16} />
            <span>Lùi lại</span>
          </SoundButton>

          {/* Dots Indicator */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {activeCutscene.slides.map((_, idx) => (
              <div
                key={idx}
                style={{
                  width: idx === activeSlideIndex ? '20px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: idx === activeSlideIndex ? '#fbbf24' : 'rgba(255, 255, 255, 0.25)',
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>

          <SoundButton
            onClick={() => {
              playSelect();
              nextSlide();
            }}
            style={{
              background: isLastSlide
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              border: 'none',
              color: '#ffffff',
              padding: '8px 20px',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
            }}
          >
            <span>{isLastSlide ? 'Hoàn Thành' : 'Tiếp Tục'}</span>
            <ChevronRight size={16} />
          </SoundButton>
        </div>
      </div>
    </div>
  );
};
