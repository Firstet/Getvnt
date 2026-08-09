import React from 'react';
import { AlertTriangle, Trash2, ShieldAlert, X } from 'lucide-react';

export interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const getVariantDetails = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: Trash2,
          iconColor: '#EF4444',
          iconBg: 'rgba(239, 68, 68, 0.15)',
          confirmBg: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
          borderColor: 'rgba(239, 68, 68, 0.3)',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: '#F59E0B',
          iconBg: 'rgba(245, 158, 11, 0.15)',
          confirmBg: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
          borderColor: 'rgba(245, 158, 11, 0.3)',
        };
      case 'info':
      default:
        return {
          icon: ShieldAlert,
          iconColor: '#38BDF8',
          iconBg: 'rgba(56, 189, 248, 0.15)',
          confirmBg: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
          borderColor: 'rgba(56, 189, 248, 0.3)',
        };
    }
  };

  const v = getVariantDetails();
  const IconComponent = v.icon;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(4, 6, 14, 0.85)',
        backdropFilter: 'blur(16px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: 'rgba(13, 18, 34, 0.98)',
          border: `1px solid ${v.borderColor}`,
          borderRadius: '24px',
          maxWidth: '440px',
          width: '100%',
          padding: '28px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon */}
        <button
          onClick={onCancel}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            color: '#9CA3AF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={16} />
        </button>

        {/* Icon & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              background: v.iconBg,
              border: `1px solid ${v.borderColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: v.iconColor,
              flexShrink: 0,
            }}
          >
            <IconComponent size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF', margin: 0, fontFamily: 'var(--font-heading)' }}>
              {title}
            </h3>
          </div>
        </div>

        {/* Message */}
        <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.6, margin: '0 0 24px 0' }}>
          {message}
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#D1D5DB',
              padding: '10px 20px',
              borderRadius: '12px',
              fontSize: '13.5px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              background: v.confirmBg,
              border: 'none',
              color: '#FFFFFF',
              padding: '10px 24px',
              borderRadius: '12px',
              fontSize: '13.5px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
              transition: 'all 0.15s ease',
            }}
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
};
