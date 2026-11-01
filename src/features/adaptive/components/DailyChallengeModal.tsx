import React, { useState, useEffect } from 'react';
import { X, Calendar, Award, CheckCircle2, XCircle, ArrowRight, Sparkles, Trophy } from 'lucide-react';
import type { DailyMathChallenge, CampaignId, MathQuestion } from '@/types';
import { DailyChallengeService } from '../services/dailyChallengeService';
import { MathEngineService } from '@/features/math-engine/mathEngineService';
import { SoundButton } from '@/components/common/SoundButton';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  campaignId: CampaignId;
  isG2: boolean;
}

export const DailyChallengeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  studentId,
  campaignId,
  isG2,
}) => {
  const [challenge, setChallenge] = useState<DailyMathChallenge | null>(null);
  const [allQuestions, setAllQuestions] = useState<MathQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    if (!isOpen) return;

    DailyChallengeService.getTodayChallenge(studentId, campaignId).then((ch) => {
      setChallenge(ch);
      const combined = [
        ...ch.warmupQuestions,
        ...ch.practiceQuestions,
        ...ch.challengeQuestions,
      ];
      setAllQuestions(combined);
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setJustCompleted(ch.isCompleted);
      setStartTime(Date.now());
    });
  }, [isOpen, studentId, campaignId]);

  if (!isOpen || !challenge || allQuestions.length === 0) return null;

  const currentQ = allQuestions[currentIndex];
  const isFinished = challenge.isCompleted || currentIndex >= allQuestions.length;

  const getSectionTitle = (index: number) => {
    if (index < 3) return 'PHẦN 1: KHỞI ĐỘNG (DỄ)';
    if (index < 8) return 'PHẦN 2: LUYỆN TẬP PHẢN XẠ (VỪA)';
    return 'PHẦN 3: THỬ THÁCH VƯƠN CAO (KHÓ)';
  };

  const handleSelectOption = async (idx: number) => {
    if (isAnswered || !currentQ) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const timeSpent = Math.max(2, Math.round((Date.now() - startTime) / 1000));
    const evalResult = MathEngineService.evaluateAnswer(currentQ, idx);
    const correct = evalResult.isCorrect;
    setIsCorrect(correct);

    // Record authentic attempt in Math Engine
    MathEngineService.recordResult(
      studentId,
      campaignId,
      currentQ,
      correct,
      currentQ.options[idx],
      timeSpent,
      1
    );

    // Record in Daily Challenge
    const res = await DailyChallengeService.recordChallengeAnswer(
      studentId,
      campaignId,
      currentQ.id,
      correct
    );

    setChallenge(res.challenge);
    if (res.justCompleted) {
      setJustCompleted(true);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < allQuestions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setStartTime(Date.now());
    } else {
      setJustCompleted(true);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 10, 20, 0.88)',
        backdropFilter: 'blur(12px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          background: 'rgba(15, 23, 42, 0.98)',
          border: '1px solid rgba(251, 191, 36, 0.35)',
          borderRadius: '20px',
          padding: '26px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(251, 191, 36, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Calendar size={22} color="#fbbf24" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                THỬ THÁCH TOÁN MỖI NGÀY (DAILY QUEST)
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#fbbf24', margin: '2px 0 0 0' }}>
                {challenge.date} • {challenge.completedQuestionIds.length}/{challenge.totalQuestions} câu hoàn thành
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Finished View */}
        {isFinished ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '24px 10px',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                background: 'rgba(251, 191, 36, 0.15)',
                border: '2px solid #fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Trophy size={40} color="#fbbf24" />
            </div>

            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#f8fafc', margin: '0 0 6px 0' }}>
                XUẤT SẮC HOÀN THÀNH THỬ THÁCH HÔM NAY!
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#cbd5e1', margin: 0 }}>
                Tony đã hoàn thành trọn vẹn 10 câu hỏi thử thách. Tính kiên trì chính là bí quyết của mọi Đại Hiệp Sĩ!
              </p>
            </div>

            <div
              style={{
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '14px',
                padding: '16px 28px',
                display: 'flex',
                gap: '28px',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Điểm số đạt được:</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399' }}>
                  {challenge.score}/{challenge.totalQuestions}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Phần thưởng đã nhận:</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fbbf24' }}>
                  +{challenge.rewards.exp} EXP • +{challenge.rewards.gold} Vàng
                </div>
              </div>
            </div>

            <SoundButton variant="gold" size="lg" onClick={onClose} icon={<Sparkles size={18} />}>
              Nhận Thưởng &amp; Đóng
            </SoundButton>
          </div>
        ) : (
          /* Active Question View */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Section badge & progress */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span
                style={{
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                }}
              >
                {getSectionTitle(currentIndex)}
              </span>

              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Câu {currentIndex + 1}/{allQuestions.length}
              </span>
            </div>

            {/* Question Text */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '14px',
                padding: '18px',
              }}
            >
              <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f8fafc', lineHeight: 1.5 }}>
                {currentQ.questionText}
              </div>
              {currentQ.visualPrompt && (
                <div
                  style={{
                    marginTop: '8px',
                    padding: '8px 12px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    color: '#38bdf8',
                    fontFamily: 'monospace',
                  }}
                >
                  {currentQ.visualPrompt}
                </div>
              )}
            </div>

            {/* 4 Options */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {currentQ.options.map((opt, idx) => {
                let btnBg = 'rgba(30, 41, 59, 0.55)';
                let btnBorder = 'rgba(255, 255, 255, 0.12)';
                let btnColor = '#f1f5f9';

                if (isAnswered) {
                  if (idx === currentQ.correctOptionIndex) {
                    btnBg = 'rgba(16, 185, 129, 0.25)';
                    btnBorder = '#10b981';
                    btnColor = '#34d399';
                  } else if (idx === selectedOption) {
                    btnBg = 'rgba(239, 68, 68, 0.25)';
                    btnBorder = '#ef4444';
                    btnColor = '#f87171';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    style={{
                      background: btnBg,
                      border: `1px solid ${btnBorder}`,
                      color: btnColor,
                      padding: '14px 16px',
                      borderRadius: '10px',
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      cursor: isAnswered ? 'default' : 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span style={{ opacity: 0.6, marginRight: '8px' }}>
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Answer Feedback & Advance Button */}
            {isAnswered && (
              <div
                style={{
                  background: isCorrect ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                  border: `1px solid ${isCorrect ? '#10b981' : '#f59e0b'}`,
                  borderRadius: '10px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700 }}>
                  {isCorrect ? (
                    <>
                      <CheckCircle2 size={18} color="#10b981" />
                      <span style={{ color: '#34d399' }}>Chính xác! Bé tính rất giỏi!</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={18} color="#f59e0b" />
                      <span style={{ color: '#fbbf24' }}>Đáp án đúng là: {currentQ.options[currentQ.correctOptionIndex]}</span>
                    </>
                  )}
                </div>

                <SoundButton
                  variant={isG2 ? 'grade2' : 'grade3'}
                  size="sm"
                  onClick={handleNext}
                  icon={<ArrowRight size={14} />}
                >
                  {currentIndex + 1 < allQuestions.length ? 'Câu Tiếp Theo' : 'Xem Kết Quả'}
                </SoundButton>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
