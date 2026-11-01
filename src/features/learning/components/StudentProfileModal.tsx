import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2, UserCheck, Shield, GraduationCap } from 'lucide-react';
import type { StudentProfile, CampaignId } from '@/types';
import { SoundButton } from '@/components/common/SoundButton';
import { HeroPortrait } from '@/components/common/HeroPortrait';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  students: StudentProfile[];
  activeStudent: StudentProfile | null;
  onSwitchStudent: (studentId: string) => void;
  onCreateStudent: (name: string, grade: CampaignId, avatar?: string) => void;
  isG2: boolean;
}

export const StudentProfileModal: React.FC<Props> = ({
  isOpen,
  onClose,
  students,
  activeStudent,
  onSwitchStudent,
  onCreateStudent,
  isG2,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<CampaignId>(isG2 ? 'grade-2' : 'grade-3');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateStudent(name.trim(), selectedGrade);
    setName('');
    setIsCreating(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(5, 10, 20, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          background: 'rgba(15, 23, 42, 0.98)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '14px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              QUẢN LÝ HỒ SƠ HỌC SINH
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
              Hỗ trợ nhiều bạn học cùng rèn luyện độc lập trên một thiết bị
            </p>
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

        {/* Existing Students List */}
        {!isCreating ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1' }}>
              DANH SÁCH HIỆP SĨ ĐANG THAM GIA ({students.length}):
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
              {students.map((st) => {
                const isActive = activeStudent?.id === st.id;
                return (
                  <div
                    key={st.id}
                    style={{
                      background: isActive ? 'rgba(56, 189, 248, 0.12)' : 'rgba(30, 41, 59, 0.6)',
                      border: `1px solid ${isActive ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)'}`,
                      borderRadius: '12px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <HeroPortrait
                        campaignId={st.grade}
                        mode="avatar"
                        size={40}
                        glow={isActive}
                        showBadge={false}
                      />
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                          {st.displayName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          {st.grade === 'grade-2' ? 'Khối Lớp 2' : 'Khối Lớp 3'} • Tham gia: {new Date(st.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    </div>

                    {isActive ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: '#38bdf8',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          background: 'rgba(56, 189, 248, 0.15)',
                          padding: '4px 10px',
                          borderRadius: '999px',
                        }}
                      >
                        <UserCheck size={14} /> Đang Học
                      </span>
                    ) : (
                      <SoundButton
                        variant="secondary"
                        size="sm"
                        onClick={() => onSwitchStudent(st.id)}
                      >
                        Chọn Hồ Sơ
                      </SoundButton>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ paddingTop: '8px' }}>
              <SoundButton
                variant={isG2 ? 'grade2' : 'grade3'}
                size="md"
                onClick={() => setIsCreating(true)}
                icon={<UserPlus size={16} />}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                + Thêm Hồ Sơ Học Sinh Mới
              </SoundButton>
            </div>
          </div>
        ) : (
          /* CREATE STUDENT FORM */
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Họ và Tên hoặc Biệt Danh của bé:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Bảo Long, Minh Anh, Tony..."
                autoFocus
                required
                style={{
                  width: '100%',
                  background: 'rgba(30, 41, 59, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#f8fafc',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Khối Lớp Chương Trình Học:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedGrade('grade-2')}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: selectedGrade === 'grade-2' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(30, 41, 59, 0.5)',
                    border: `1px solid ${selectedGrade === 'grade-2' ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)'}`,
                    color: selectedGrade === 'grade-2' ? '#38bdf8' : '#94a3b8',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Lớp 2 (Hiệp Sĩ Nhỏ)
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedGrade('grade-3')}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: selectedGrade === 'grade-3' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(30, 41, 59, 0.5)',
                    border: `1px solid ${selectedGrade === 'grade-3' ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
                    color: selectedGrade === 'grade-3' ? '#ef4444' : '#94a3b8',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Lớp 3 (Đại Hiệp Sĩ)
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <SoundButton
                variant="ghost"
                size="md"
                type="button"
                onClick={() => setIsCreating(false)}
              >
                Hủy Bỏ
              </SoundButton>

              <SoundButton
                variant={selectedGrade === 'grade-2' ? 'grade2' : 'grade3'}
                size="md"
                type="submit"
                icon={<CheckCircle2 size={16} />}
              >
                Tạo Hồ Sơ Mới
              </SoundButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
