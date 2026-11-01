import React, { useState } from 'react';
import { X, MessageSquare, ChevronRight, CheckCircle, Sparkles } from 'lucide-react';
import { SoundButton } from '@/components/common/SoundButton';
import { Badge } from '@/components/common/Badge';
import type { NpcData, DialogueLine } from '@/types/exploration';

interface DialogueModalProps {
  npc: NpcData | null;
  onClose: () => void;
  onAcceptQuest: (questId: string) => void;
  onCompleteQuest: (questId: string) => void;
  onOpenShop: () => void;
}

export const DialogueModal: React.FC<DialogueModalProps> = ({
  npc,
  onClose,
  onAcceptQuest,
  onCompleteQuest,
  onOpenShop,
}) => {
  if (!npc) return null;

  const [currentDialogueId, setCurrentDialogueId] = useState<string>(npc.defaultDialogueId);
  const currentLine: DialogueLine = npc.dialogueTree[currentDialogueId] || {
    id: 'default',
    speakerName: npc.name,
    text: 'Xin chào hiệp sĩ! Chúc bạn một ngày may mắn và an toàn trong khu rừng.',
    options: [{ label: 'Đóng hội thoại', action: 'close' }],
  };

  const handleOptionClick = (option: {
    label: string;
    action: 'next' | 'accept_quest' | 'complete_quest' | 'open_shop' | 'close';
    targetDialogueId?: string;
    questId?: string;
  }) => {
    if (option.action === 'next' && option.targetDialogueId) {
      setCurrentDialogueId(option.targetDialogueId);
    } else if (option.action === 'accept_quest') {
      if (option.questId) onAcceptQuest(option.questId);
      onClose();
    } else if (option.action === 'complete_quest') {
      if (option.questId) onCompleteQuest(option.questId);
      onClose();
    } else if (option.action === 'open_shop') {
      onOpenShop();
      onClose();
    } else {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: '24px',
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(6px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '760px',
          maxWidth: '100%',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(10, 15, 29, 0.98) 100%)',
          border: '2px solid rgba(251, 191, 36, 0.5)',
          borderRadius: '24px',
          padding: '24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(251, 191, 36, 0.25)',
          display: 'flex',
          gap: '20px',
          position: 'relative',
          animation: 'slideUp 0.25s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#cbd5e1',
            cursor: 'pointer',
          }}
        >
          <X size={18} />
        </button>

        {/* NPC Avatar Disc */}
        <div
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(30, 41, 59, 0.8) 100%)',
            border: '2px solid #fbbf24',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '44px',
            flexShrink: 0,
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5)',
          }}
        >
          {npc.avatarIcon}
        </div>

        {/* Dialogue Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Speaker header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Badge variant="gold">{npc.role}</Badge>
            </div>
            <h3
              className="font-cinematic"
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#ffffff',
                marginTop: '4px',
              }}
            >
              {currentLine.speakerName}
            </h3>
          </div>

          {/* Dialogue Text */}
          <p
            style={{
              fontSize: '1rem',
              color: '#f1f5f9',
              lineHeight: '1.6',
              background: 'rgba(30, 41, 59, 0.5)',
              padding: '14px 16px',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            {currentLine.text}
          </p>

          {/* Options / Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '4px' }}>
            {currentLine.options?.map((option, idx) => (
              <SoundButton
                key={idx}
                variant={option.action === 'accept_quest' ? 'gold' : 'primary'}
                size="md"
                onClick={() => handleOptionClick(option)}
                icon={option.action === 'accept_quest' ? <Sparkles size={16} /> : <ChevronRight size={16} />}
              >
                {option.label}
              </SoundButton>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
