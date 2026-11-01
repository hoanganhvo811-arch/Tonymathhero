import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, XCircle, Award, Sparkles, ArrowRight, Shield, Zap } from 'lucide-react';
import type { RecommendedPracticeItem, MathQuestion } from '@/types';
import { GRADE_2_TOPICS } from '@/features/math-engine/data/grade2Curriculum';
import { GRADE_3_TOPICS } from '@/features/math-engine/data/grade3Curriculum';
import { MathEngineService } from '@/features/math-engine/mathEngineService';
import { SoundButton } from '@/components/common/SoundButton';
import { HeroPortrait } from '@/components/common/HeroPortrait';
import { useLearningStore } from '../useLearningStore';

interface Props {
  practiceItem: RecommendedPracticeItem | null;
  onClose: () => void;
  isG2: boolean;
}

export const PracticeQuizModal: React.FC<Props> = ({ practiceItem, onClose, isG2 }) => {
  const { activeStudent } = useLearningStore();
  const [questions, setQuestions] = useState<MathQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  // Generate 5 practice questions
  useEffect(() => {
    if (!practiceItem) return;

    const topicId = practiceItem.topicId;
    const gradeTopics = practiceItem.campaignId === 'grade-2' ? GRADE_2_TOPICS : GRADE_3_TOPICS;
    const generated: MathQuestion[] = [];

    for (let i = 0; i < practiceItem.suggestedQuestionsCount; i++) {
      if (gradeTopics[topicId] && typeof gradeTopics[topicId].generate === 'function') {
        const q = gradeTopics[topicId].generate();
        generated.push(q);
      } else {
        // Fallback generator from any available topic
        const allKeys = Object.keys(gradeTopics);
        const fallbackKey = allKeys[i % allKeys.length];
        generated.push(gradeTopics[fallbackKey].generate());
      }
    }

    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
    setStartTime(Date.now());
  }, [practiceItem]);

  if (!practiceItem || questions.length === 0) return null;

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const timeSpent = Math.max(2, Math.round((Date.now() - startTime) / 1000));
    const evalResult = MathEngineService.evaluateAnswer(currentQ, idx);
    const correct = evalResult.isCorrect;
    setIsCorrect(correct);

    if (correct) {
      setScore((s) => s + 1);
    }

    // Record authentic attempt in Learning Analytics
    const studentId = activeStudent?.id || 'student_tony_hero';
    MathEngineService.recordResult(
      studentId,
      practiceItem.campaignId,
      currentQ,
      correct,
      currentQ.options[idx],
      timeSpent,
      1
    );
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setStartTime(Date.now());
    } else {
      setIsFinished(true);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(5, 10, 20, 0.9)',
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
          maxWidth: '640px',
          background: 'rgba(15, 23, 42, 0.98)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
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
            <HeroPortrait
              campaignId={practiceItem.campaignId}
              mode="avatar"
              size={40}
              glow={true}
              showBadge={false}
            />
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                LUYỆN TẬP: {practiceItem.topicNameVi}
              </h3>
              <p style={{ fontSize: '0.75rem', color: isG2 ? '#38bdf8' : '#ef4444', margin: 0 }}>
                {isFinished ? 'HOÀN THÀNH BÀI TẬP' : `Câu ${currentIndex + 1}/${questions.length}`}
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

        {/* FINISHED CELEBRATION VIEW */}
        {isFinished ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '20px 10px',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'rgba(251, 191, 36, 0.15)',
                border: '2px solid #fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Award size={36} color="#fbbf24" />
            </div>

            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 6px 0' }}>
                HOÀN THÀNH KHÓA RÈN LUYỆN!
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
                Tony đã hoàn thành xuất sắc các câu hỏi thử thách của chuyên đề {practiceItem.topicNameVi}.
              </p>
            </div>

            <div
              style={{
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '16px 24px',
                display: 'flex',
                gap: '24px',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Số câu đúng:</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399' }}>
                  {score}/{questions.length}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Độ chính xác:</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8' }}>
                  {Math.round((score / questions.length) * 100)}%
                </div>
              </div>
            </div>

            <SoundButton
              variant={isG2 ? 'grade2' : 'grade3'}
              size="lg"
              onClick={onClose}
              icon={<Sparkles size={18} />}
              style={{ marginTop: '12px' }}
            >
              Xác Nhận & Cập Nhật Báo Cáo
            </SoundButton>
          </div>
        ) : (
          /* ACTIVE QUESTION VIEW */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Question Text */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '18px',
              }}
            >
              <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f8fafc', lineHeight: 1.5 }}>
                {currentQ.questionText}
              </div>
              {currentQ.visualPrompt && (
                <div
                  style={{
                    marginTop: '10px',
                    padding: '8px 12px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    color: '#38bdf8',
                    fontFamily: 'monospace',
                  }}
                >
                  {currentQ.visualPrompt}
                </div>
              )}
            </div>

            {/* 4 Multiple Choice Options */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {currentQ.options.map((opt, idx) => {
                let btnBg = 'rgba(30, 41, 59, 0.5)';
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

            {/* Answer Explanation & Next Button */}
            {isAnswered && (
              <div
                style={{
                  background: isCorrect ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                  border: `1px solid ${isCorrect ? '#10b981' : '#f59e0b'}`,
                  borderRadius: '10px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  {isCorrect ? (
                    <>
                      <CheckCircle2 size={18} color="#10b981" />
                      <span style={{ color: '#34d399' }}>Chính xác! Tony tấn công trúng đích!</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={18} color="#f59e0b" />
                      <span style={{ color: '#fbbf24' }}>Chưa chính xác! Hãy quan sát lời giải:</span>
                    </>
                  )}
                </div>

                <p style={{ fontSize: '0.84rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
                  {currentQ.explanation}
                </p>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                  <SoundButton
                    variant={isG2 ? 'grade2' : 'grade3'}
                    size="sm"
                    onClick={handleNext}
                    icon={<ArrowRight size={16} />}
                  >
                    {currentIndex + 1 < questions.length ? 'Câu Tiếp Theo' : 'Xem Kết Quả'}
                  </SoundButton>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
