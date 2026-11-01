import React, { useState, useEffect } from 'react';
import {
  Compass,
  Zap,
  TrendingUp,
  AlertTriangle,
  Award,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Brain,
  RotateCcw,
} from 'lucide-react';
import type {
  CampaignId,
  LearningPathNode,
  AdaptiveDifficultyLevel,
  MistakeCategory,
  LearningBadge,
  TopicLearningState,
} from '@/types';
import { PersonalizedLearningPathService } from '../services/personalizedLearningPathService';
import { AdaptiveDifficultyEngine } from '../services/adaptiveDifficultyEngine';
import { MistakeAnalysisService } from '../services/mistakeAnalysisService';
import { LearningRewardService } from '../services/learningRewardService';
import { SoundButton } from '@/components/common/SoundButton';

interface Props {
  studentId: string;
  campaignId: CampaignId;
  isG2: boolean;
  onLaunchPractice: (topicId: string, topicNameVi: string) => void;
  onOpenDailyChallenge: () => void;
  onOpenParentSummary: () => void;
}

export const TonyLearningJourneyTab: React.FC<Props> = ({
  studentId,
  campaignId,
  isG2,
  onLaunchPractice,
  onOpenDailyChallenge,
  onOpenParentSummary,
}) => {
  const [nodes, setNodes] = useState<LearningPathNode[]>([]);
  const [activeNode, setActiveNode] = useState<LearningPathNode | null>(null);
  const [overallLevel, setOverallLevel] = useState<AdaptiveDifficultyLevel>('LEVEL_2_NORMAL');
  const [mistakes, setMistakes] = useState<
    {
      category: MistakeCategory;
      count: number;
      nameVi: string;
      descriptionVi: string;
      advice: string;
      icon: string;
    }[]
  >([]);
  const [badges, setBadges] = useState<LearningBadge[]>([]);
  const [reviewTopics, setReviewTopics] = useState<TopicLearningState[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAdaptiveData() {
      setIsLoading(true);
      try {
        const pathData = await PersonalizedLearningPathService.evaluatePath(studentId, campaignId);
        setNodes(pathData.nodes);
        setActiveNode(pathData.activeNode);

        const level = await AdaptiveDifficultyEngine.getOverallDifficulty(studentId, campaignId);
        setOverallLevel(level);

        const mistakeList = await MistakeAnalysisService.getMistakeInsights(studentId, campaignId);
        setMistakes(mistakeList);

        const badgeList = await LearningRewardService.getBadges(studentId, campaignId);
        setBadges(badgeList);

        const reviews = await AdaptiveDifficultyEngine.getTopicsNeedingReview(studentId, campaignId);
        setReviewTopics(reviews);
      } catch (e) {
        console.error('Failed to load adaptive learning data:', e);
      } finally {
        setIsLoading(false);
      }
    }

    loadAdaptiveData();
  }, [studentId, campaignId]);

  const getLevelBadgeInfo = (level: AdaptiveDifficultyLevel) => {
    switch (level) {
      case 'LEVEL_1_EASY':
        return { label: 'CẤP ĐỘ 1: TẬP SỰ (EASY)', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)' };
      case 'LEVEL_2_NORMAL':
        return { label: 'CẤP ĐỘ 2: CHIẾN BINH (NORMAL)', color: '#34d399', bg: 'rgba(52, 211, 153, 0.15)' };
      case 'LEVEL_3_CHALLENGING':
        return { label: 'CẤP ĐỘ 3: THỬ THÁCH (CHALLENGING)', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)' };
      case 'LEVEL_4_ADVANCED':
        return { label: 'CẤP ĐỘ 4: ĐẠI HIỆP SĨ (ADVANCED)', color: '#f87171', bg: 'rgba(248, 113, 113, 0.15)' };
    }
  };

  const levelInfo = getLevelBadgeInfo(overallLevel);

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
        Đang phân tích dữ liệu học tập thích ứng của Tony...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner: Adaptive Level Gauge & Quick Actions */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: levelInfo.bg,
              border: `1.5px solid ${levelInfo.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Brain size={30} color={levelInfo.color} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
                HỆ THỐNG THÍCH ỨNG NĂNG LỰC TOÁN HỌC:
              </span>
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  background: levelInfo.bg,
                  color: levelInfo.color,
                  border: `1px solid ${levelInfo.color}`,
                }}
              >
                {levelInfo.label}
              </span>
            </div>

            <h3 style={{ margin: '4px 0 0 0', fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
              LỘ TRÌNH RÈN LUYỆN THÔNG MINH CỦA TONY
            </h3>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <SoundButton
            variant="gold"
            size="md"
            onClick={onOpenDailyChallenge}
            icon={<Calendar size={16} />}
          >
            Thử Thách Toán Mỗi Ngày (10 Câu)
          </SoundButton>

          <SoundButton
            variant="secondary"
            size="md"
            onClick={onOpenParentSummary}
            icon={<ShieldCheck size={16} />}
          >
            Bản Tóm Tắt Cho Phụ Huynh
          </SoundButton>
        </div>
      </div>

      {/* Spaced Repetition Alert if any topics unpracticed for >= 5 days */}
      {reviewTopics.length > 0 && (
        <div
          style={{
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            borderRadius: '12px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <RotateCcw size={22} color="#fbbf24" />
            <div>
              <div style={{ color: '#fbbf24', fontSize: '0.9rem', fontWeight: 700 }}>
                Nhắc Nhở Ôn Tập Định Kỳ (Spaced Repetition)
              </div>
              <div style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>
                Tony chưa ôn tập chuyên đề: <strong>{reviewTopics[0].topicNameVi}</strong> ({reviewTopics[0].daysSinceLastPractice} ngày qua). Hãy giải vài câu để duy trì trí nhớ dài hạn!
              </div>
            </div>
          </div>

          <SoundButton
            variant="gold"
            size="sm"
            onClick={() => onLaunchPractice(reviewTopics[0].topicId, reviewTopics[0].topicNameVi)}
          >
            Ôn Tập Ngay
          </SoundButton>
        </div>
      )}

      {/* Visual Learning Path (Roadmap of Nodes with Prerequisites) */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={20} color="#38bdf8" /> CÂY TIẾN TRÌNH HỌC TẬP TUẦN TỰ (PEDAGOGICAL ROADMAP)
            </h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
              Hệ thống tự động mở khóa các kiến thức tiếp theo dựa trên kiến thức tiên quyết mà Tony đã nắm vững
            </p>
          </div>
        </div>

        {/* Nodes Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {nodes.map((n, idx) => {
            const isMastered = n.status === 'MASTERED';
            const isDeveloping = n.status === 'DEVELOPING';
            const isLearning = n.status === 'LEARNING';
            const isActive = activeNode?.topicId === n.topicId;

            let cardBorder = 'rgba(255, 255, 255, 0.08)';
            let cardBg = 'rgba(30, 41, 59, 0.5)';
            if (isMastered) {
              cardBorder = 'rgba(16, 185, 129, 0.4)';
              cardBg = 'rgba(16, 185, 129, 0.06)';
            } else if (isActive) {
              cardBorder = isG2 ? 'rgba(56, 189, 248, 0.6)' : 'rgba(239, 68, 68, 0.6)';
              cardBg = isG2 ? 'rgba(56, 189, 248, 0.12)' : 'rgba(239, 68, 68, 0.12)';
            }

            return (
              <div
                key={n.topicId}
                style={{
                  background: cardBg,
                  border: `1.5px solid ${cardBorder}`,
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Active recommended node tag */}
                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      background: isG2 ? '#0284c7' : '#b91c1c',
                      color: '#ffffff',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderBottomLeftRadius: '8px',
                    }}
                  >
                    ĐỀ XUẤT TIẾP THEO
                  </div>
                )}

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        color: '#cbd5e1',
                      }}
                    >
                      {idx + 1}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                      {n.category}
                    </span>
                  </div>

                  <h5 style={{ margin: '0 0 6px 0', fontSize: '0.94rem', fontWeight: 700, color: '#f8fafc' }}>
                    {n.topicNameVi}
                  </h5>

                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                    {n.descriptionVi}
                  </p>
                </div>

                <div>
                  {/* Status & Accuracy */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        background: isMastered
                          ? 'rgba(16, 185, 129, 0.2)'
                          : isDeveloping
                          ? 'rgba(56, 189, 248, 0.2)'
                          : 'rgba(148, 163, 184, 0.2)',
                        color: isMastered ? '#34d399' : isDeveloping ? '#38bdf8' : '#cbd5e1',
                      }}
                    >
                      {n.status}
                    </span>

                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {n.completedQuestionsCount > 0 ? `${n.accuracy}% đúng` : 'Chưa luyện'}
                    </span>
                  </div>

                  <SoundButton
                    variant={isMastered ? 'secondary' : isG2 ? 'grade2' : 'grade3'}
                    size="sm"
                    onClick={() => onLaunchPractice(n.topicId, n.topicNameVi)}
                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.78rem' }}
                  >
                    {isMastered ? 'Luyện Tập Nâng Cao' : 'Bắt Đầu Bài Học'}
                  </SoundButton>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mistake Pattern Insights & Learning Badges */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Mistake Insights */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="#f59e0b" />
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#fbbf24' }}>
              CHẨN ĐOÁN DẠNG LỖI SAI &amp; LỜI KHUYÊN SƯ PHẠM
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {mistakes.slice(0, 3).map((m) => (
              <div
                key={m.category}
                style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px',
                  padding: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f1f5f9' }}>
                    {m.icon} {m.nameVi}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: m.count > 0 ? '#f59e0b' : '#94a3b8' }}>
                    {m.count} lần
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                  💡 {m.advice}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Badges & Achievements */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} color="#34d399" />
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#34d399' }}>
              HUÂN CHƯƠNG TIẾN BỘ &amp; NỖ LỰC
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
            {badges.map((b) => (
              <div
                key={b.id}
                style={{
                  background: b.isUnlocked ? 'rgba(16, 185, 129, 0.1)' : 'rgba(30, 41, 59, 0.4)',
                  border: `1px solid ${b.isUnlocked ? '#10b981' : 'rgba(255, 255, 255, 0.08)'}`,
                  borderRadius: '10px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div style={{ fontSize: '1.6rem' }}>{b.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.86rem', fontWeight: 700, color: b.isUnlocked ? '#34d399' : '#f8fafc' }}>
                      {b.title}
                    </span>
                    {b.isUnlocked ? (
                      <span style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 700 }}>
                        ✓ ĐÃ ĐẠT
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        {b.progress}/{b.maxProgress}
                      </span>
                    )}
                  </div>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.76rem', color: '#94a3b8' }}>
                    {b.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
