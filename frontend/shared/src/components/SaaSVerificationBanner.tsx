import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';

interface SaaSVerificationBannerProps {
  emailVerified?: boolean;
  identityVerified?: boolean;
  bankVerified?: boolean;
  onContinueVerification?: () => void;
}

export const SaaSVerificationBanner: React.FC<SaaSVerificationBannerProps> = ({
  emailVerified = true,
  identityVerified = true,
  bankVerified = true,
  onContinueVerification,
}) => {
  const completedCount = (emailVerified ? 1 : 0) + (identityVerified ? 1 : 0) + (bankVerified ? 1 : 0);
  const isFullyVerified = completedCount === 3;

  return (
    <div
      style={{
        background: isFullyVerified ? 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(6,182,212,0.08) 100%)' : 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(239,68,68,0.08) 100%)',
        border: `1px solid ${isFullyVerified ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
        borderRadius: '20px',
        padding: '18px 24px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      }}
    >
      {/* Left Badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={20} color={isFullyVerified ? '#34D399' : '#FBBF24'} />
          <span style={{ fontSize: '14px', fontWeight: 900, color: '#FFFFFF' }}>Organizer Status:</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 800, color: emailVerified ? '#34D399' : '#9CA3AF', background: emailVerified ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '99px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: emailVerified ? '#22C55E' : '#6B7280' }} />
            Email {emailVerified ? 'Verified' : 'Pending'}
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 800, color: identityVerified ? '#34D399' : '#FBBF24', background: identityVerified ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)', padding: '4px 10px', borderRadius: '99px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: identityVerified ? '#22C55E' : '#F59E0B' }} />
            Identity {identityVerified ? 'Verified' : 'Pending'}
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 800, color: bankVerified ? '#34D399' : '#FBBF24', background: bankVerified ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)', padding: '4px 10px', borderRadius: '99px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: bankVerified ? '#22C55E' : '#F59E0B' }} />
            Bank {bankVerified ? 'Verified' : 'Pending'}
          </div>
        </div>
      </div>

      {/* Right Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {isFullyVerified ? (
          <span style={{ fontSize: '12px', fontWeight: 900, background: 'rgba(34,197,94,0.2)', color: '#4ADE80', border: '1px solid rgba(34,197,94,0.4)', padding: '6px 14px', borderRadius: '99px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            🟢 Verified Organizer Account
          </span>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '12.5px', color: '#FCD34D', fontWeight: 700 }}>
              {completedCount} of 3 completed — Verify identity to create events
            </span>
            {onContinueVerification && (
              <button
                className="tixup-btn-primary"
                onClick={onContinueVerification}
                style={{ padding: '10px 20px', fontSize: '13px', borderRadius: '12px', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', color: '#FFF', fontWeight: 900, boxShadow: '0 4px 20px rgba(37,99,235,0.4)' }}
              >
                Become an Organizer <ArrowRight size={15} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
