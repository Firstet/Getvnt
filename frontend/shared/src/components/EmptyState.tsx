import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  aiShortcutLabel?: string;
  onAiShortcut?: () => void;
  accentColor?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  aiShortcutLabel,
  onAiShortcut,
  accentColor = '#2563EB',
}) => {
  return (
    <div
      style={{
        background: 'rgba(13, 17, 32, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '48px 32px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '20px 0',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          background: `${accentColor}1F`,
          border: `1px solid ${accentColor}44`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          boxShadow: `0 10px 25px ${accentColor}22`,
        }}
      >
        <Icon size={32} color={accentColor} />
      </div>

      <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#FFF', marginBottom: '8px' }}>
        {title}
      </h3>

      <p style={{ color: '#D1D5DB', fontSize: '14.5px', maxWidth: '520px', lineHeight: '1.6', marginBottom: '28px' }}>
        {description}
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="btn-cta"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, #7C3AED)`,
              color: '#FFF',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '13.5px',
              fontWeight: 900,
            }}
          >
            {actionLabel} <ArrowRight size={16} />
          </button>
        )}

        {aiShortcutLabel && onAiShortcut && (
          <button
            onClick={onAiShortcut}
            className="btn-cta btn-cta-ghost"
            style={{
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38BDF8',
              padding: '12px 20px',
              borderRadius: '12px',
              fontSize: '13.5px',
              fontWeight: 800,
            }}
          >
            <Sparkles size={15} color="#38BDF8" /> {aiShortcutLabel}
          </button>
        )}
      </div>
    </div>
  );
};
