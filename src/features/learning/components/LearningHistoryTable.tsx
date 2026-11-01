import React from 'react';
import { Search, CheckCircle2, XCircle, Eye, Filter } from 'lucide-react';
import type { QuestionAttemptRecord, HistoryFilterOptions, QuestionDifficulty } from '@/types';
import { SoundButton } from '@/components/common/SoundButton';

interface Props {
  attempts: QuestionAttemptRecord[];
  filters: HistoryFilterOptions;
  availableTopics: { id: string; nameVi: string }[];
  onFilterChange: (filters: Partial<HistoryFilterOptions>) => void;
  onSelectAttempt: (attempt: QuestionAttemptRecord) => void;
  isG2: boolean;
}

export const LearningHistoryTable: React.FC<Props> = ({
  attempts,
  filters,
  availableTopics,
  onFilterChange,
  onSelectAttempt,
  isG2,
}) => {
  return (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Title & Filter Bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <h3
            style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              color: '#f8fafc',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            📝 NHẬT KÝ BÀI LÀM CHI TIẾT ({attempts.length} lượt)
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Toàn bộ lịch sử các câu hỏi bé đã tư duy và giải quyết trong game
          </span>
        </div>

        {/* Filter controls row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
          }}
        >
          {/* Search box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              padding: '6px 12px',
              flex: '1 1 200px',
              minWidth: '180px',
            }}
          >
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              placeholder="Tìm kiếm nội dung câu hỏi..."
              value={filters.searchQuery || ''}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#f8fafc',
                fontSize: '0.82rem',
                outline: 'none',
                width: '100%',
              }}
            />
          </div>

          {/* Topic Select */}
          <select
            value={filters.topic || 'all'}
            onChange={(e) => onFilterChange({ topic: e.target.value })}
            style={{
              background: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#f8fafc',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.82rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">Tất cả chuyên đề</option>
            {availableTopics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nameVi}
              </option>
            ))}
          </select>

          {/* Difficulty Select */}
          <select
            value={filters.difficulty || 'all'}
            onChange={(e) =>
              onFilterChange({
                difficulty: e.target.value === 'all' ? undefined : (e.target.value as QuestionDifficulty),
              })
            }
            style={{
              background: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#f8fafc',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.82rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">Mọi độ khó</option>
            <option value="easy">Dễ</option>
            <option value="normal">Vừa</option>
            <option value="hard">Khó</option>
            <option value="boss">Boss Challenge</option>
          </select>

          {/* Result Select */}
          <select
            value={filters.result || 'all'}
            onChange={(e) =>
              onFilterChange({ result: e.target.value as 'all' | 'correct' | 'incorrect' })
            }
            style={{
              background: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#f8fafc',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.82rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">Tất cả kết quả</option>
            <option value="correct">Đúng ngay lần 1</option>
            <option value="incorrect">Cần làm lại / Sửa</option>
          </select>

          {/* Time Range Select */}
          <select
            value={filters.timeRange || 'all'}
            onChange={(e) =>
              onFilterChange({ timeRange: e.target.value as '7_days' | '30_days' | 'all' })
            }
            style={{
              background: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#f8fafc',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.82rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">Toàn bộ thời gian</option>
            <option value="7_days">7 ngày gần đây</option>
            <option value="30_days">30 ngày gần đây</option>
          </select>
        </div>
      </div>

      {/* History List / Table */}
      {attempts.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#94a3b8',
            fontSize: '0.9rem',
          }}
        >
          Không tìm thấy bài làm nào phù hợp với bộ lọc hiện tại.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.82rem',
              color: '#e2e8f0',
              textAlign: 'left',
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#94a3b8',
                }}
              >
                <th style={{ padding: '10px 12px' }}>Thời Gian</th>
                <th style={{ padding: '10px 12px' }}>Câu Hỏi</th>
                <th style={{ padding: '10px 12px' }}>Chuyên Đề</th>
                <th style={{ padding: '10px 12px' }}>Độ Khó</th>
                <th style={{ padding: '10px 12px' }}>Kết Quả</th>
                <th style={{ padding: '10px 12px' }}>Thời Gian</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((att) => {
                const isCorrect = att.firstAttemptResult;
                const timeStr = new Date(att.timestamp).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: '2-digit',
                  month: '2-digit',
                });

                return (
                  <tr
                    key={att.attemptId}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'background 0.2s ease',
                    }}
                  >
                    <td style={{ padding: '12px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                      {timeStr}
                    </td>

                    <td
                      style={{
                        padding: '12px',
                        maxWidth: '280px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontWeight: 600,
                        color: '#f8fafc',
                      }}
                      title={att.questionText}
                    >
                      {att.questionText}
                    </td>

                    <td style={{ padding: '12px', color: '#cbd5e1' }}>
                      {att.topicNameVi}
                    </td>

                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          background:
                            att.difficulty === 'boss'
                              ? 'rgba(239, 68, 68, 0.2)'
                              : att.difficulty === 'hard'
                              ? 'rgba(245, 158, 11, 0.2)'
                              : 'rgba(56, 189, 248, 0.2)',
                          color:
                            att.difficulty === 'boss'
                              ? '#fca5a5'
                              : att.difficulty === 'hard'
                              ? '#fde68a'
                              : '#7dd3fc',
                        }}
                      >
                        {att.difficulty.toUpperCase()}
                      </span>
                    </td>

                    <td style={{ padding: '12px' }}>
                      {isCorrect ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: '#34d399',
                            fontWeight: 600,
                          }}
                        >
                          <CheckCircle2 size={14} /> Đúng ngay
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: '#fbbf24',
                            fontWeight: 600,
                          }}
                        >
                          <XCircle size={14} /> Cần củng cố
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '12px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                      {att.timeSpentSeconds}s
                    </td>

                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <SoundButton
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelectAttempt(att)}
                        icon={<Eye size={14} />}
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                      >
                        Chi Tiết
                      </SoundButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
