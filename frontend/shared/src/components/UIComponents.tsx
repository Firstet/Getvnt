import React from 'react';
import { Loader2, Check, AlertCircle, ChevronDown } from 'lucide-react';

// ─── 0. CONTAINERIZED MODULE ICON TREATMENT ──────────────────────────────────
export interface IconContainerProps {
  icon: React.ElementType;
  color?: string;
  bg?: string;
  size?: number;
  containerSize?: number;
  style?: React.CSSProperties;
}

export const IconContainer: React.FC<IconContainerProps> = ({
  icon: Icon,
  color = '#38BDF8',
  bg = 'rgba(37, 99, 235, 0.12)',
  size = 18,
  containerSize = 36,
  style,
}) => {
  return (
    <div
      style={{
        width: `${containerSize}px`,
        height: `${containerSize}px`,
        borderRadius: '10px',
        background: bg,
        border: `1px solid ${color}33`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color,
        flexShrink: 0,
        ...style,
      }}
    >
      <Icon size={size} color={color} />
    </div>
  );
};

// ─── 0.1 ENTERPRISE UNIFIED CARD CONTAINER ──────────────────────────────────
export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  id?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  action,
  style,
  className = '',
  id,
}) => {
  return (
    <div
      id={id}
      style={{
        background: 'rgba(13, 18, 34, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        transition: 'all 0.2s ease',
        ...style,
      }}
      className={`getvnt-card ${className}`}
    >
      {(title || action) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: subtitle ? '6px' : '16px' }}>
          {title && <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>{title}</h3>}
          {action}
        </div>
      )}
      {subtitle && <p style={{ color: '#94A3B8', fontSize: '13px', marginBottom: '16px', fontWeight: 600 }}>{subtitle}</p>}
      {children}
    </div>
  );
};

// ─── 0.2 ENTERPRISE UNIFIED STAT CARD ──────────────────────────────────────
export interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendColor?: string;
  icon: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend,
  trendColor = '#34D399',
  icon,
  iconBg = 'rgba(37, 99, 235, 0.12)',
  iconColor = '#38BDF8',
}) => {
  return (
    <div
      style={{
        background: 'rgba(13, 18, 34, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        transition: 'all 0.2s ease',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '14px',
          background: iconBg,
          border: `1px solid ${iconColor}33`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: iconColor,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </div>
        <div style={{ fontSize: '22px', fontWeight: 900, color: '#F8FAFC', marginTop: '2px', lineHeight: 1.2 }}>
          {value}
        </div>
        {trend && (
          <div style={{ fontSize: '12px', fontWeight: 700, color: trendColor, marginTop: '4px' }}>
            {trend}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── 1. ENTERPRISE BUTTON COMPONENT ──────────────────────────────────────────
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning' | 'link';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  disabled,
  style,
  className = '',
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
          color: '#FFFFFF',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
        };
      case 'secondary':
        return {
          background: 'rgba(255, 255, 255, 0.05)',
          color: '#FFFFFF',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        };
      case 'outline':
        return {
          background: 'transparent',
          color: '#60A5FA',
          border: '1px solid rgba(37, 99, 235, 0.4)',
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: '#94A3B8',
          border: '1px solid transparent',
        };
      case 'danger':
        return {
          background: 'rgba(239, 68, 68, 0.15)',
          color: '#F87171',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        };
      case 'success':
        return {
          background: 'rgba(16, 185, 129, 0.15)',
          color: '#34D399',
          border: '1px solid rgba(16, 185, 129, 0.3)',
        };
      case 'warning':
        return {
          background: 'rgba(245, 158, 11, 0.15)',
          color: '#FBBF24',
          border: '1px solid rgba(245, 158, 11, 0.3)',
        };
      case 'link':
        return {
          background: 'transparent',
          color: '#60A5FA',
          border: 'none',
          padding: 0,
        };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return { height: '32px', padding: '0 12px', fontSize: '12px' };
      case 'lg':
        return { height: '48px', padding: '0 24px', fontSize: '15px' };
      case 'md':
      default:
        return { height: '40px', padding: '0 18px', fontSize: '13.5px' };
    }
  };

  return (
    <button
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontWeight: 800,
        borderRadius: '12px',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.6 : 1,
        transition: 'all 0.15s ease',
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style,
      }}
      className={`getvnt-btn ${className}`}
      {...props}
    >
      {loading ? <Loader2 size={15} className="animate-spin" /> : icon}
      {children}
    </button>
  );
};

// ─── 2. ENTERPRISE FORM INPUT COMPONENT ───────────────────────────────────────
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  helperText,
  error,
  success,
  icon,
  style,
  className = '',
  ...props
}, ref) => {
  return (
    <div style={{ width: '100%', marginBottom: '16px' }}>
      {label && (
        <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#94A3B8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative', width: '100%' }}>
        {icon && (
          <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', display: 'flex', alignItems: 'center' }}>
            {icon}
          </div>
        )}
        <input
          ref={ref}
          style={{
            width: '100%',
            height: '42px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: `1px solid ${error ? '#EF4444' : success ? '#10B981' : 'rgba(255, 255, 255, 0.08)'}`,
            borderRadius: '12px',
            padding: icon ? '0 14px 0 40px' : '0 14px',
            color: '#FFFFFF',
            fontSize: '13.5px',
            outline: 'none',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            ...style,
          }}
          className={`getvnt-input ${className}`}
          {...props}
        />
        {error && (
          <AlertCircle size={16} color="#EF4444" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }} />
        )}
        {success && !error && (
          <Check size={16} color="#10B981" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }} />
        )}
      </div>
      {error && <div style={{ color: '#F87171', fontSize: '12px', marginTop: '4px', fontWeight: 600 }}>{error}</div>}
      {helperText && !error && <div style={{ color: '#64748B', fontSize: '12px', marginTop: '4px' }}>{helperText}</div>}
    </div>
  );
});

// ─── 3. ENTERPRISE SELECT DROPDOWN ───────────────────────────────────────────
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({ label, error, children, style, className = '', ...props }) => {
  return (
    <div style={{ width: '100%', marginBottom: '16px' }}>
      {label && (
        <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#94A3B8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative', width: '100%' }}>
        <select
          style={{
            width: '100%',
            height: '42px',
            background: '#0D1120',
            border: `1px solid ${error ? '#EF4444' : 'rgba(255, 255, 255, 0.08)'}`,
            borderRadius: '12px',
            padding: '0 36px 0 14px',
            color: '#FFFFFF',
            fontSize: '13.5px',
            outline: 'none',
            appearance: 'none',
            cursor: 'pointer',
            ...style,
          }}
          className={`getvnt-select ${className}`}
          {...props}
        >
          {children}
        </select>
        <ChevronDown size={16} color="#94A3B8" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      </div>
      {error && <div style={{ color: '#F87171', fontSize: '12px', marginTop: '4px', fontWeight: 600 }}>{error}</div>}
    </div>
  );
};

// ─── 4. ENTERPRISE STATUS BADGE ──────────────────────────────────────────────
export interface BadgeProps {
  status: 'active' | 'pending' | 'locked' | 'draft' | 'published' | 'custom';
  label?: string;
  color?: string;
  bg?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, label, color, bg }) => {
  const getBadgeStyle = () => {
    if (color && bg) return { color, bg, border: `1px solid ${color}40`, dot: color };
    switch (status) {
      case 'active':
      case 'published':
        return { color: '#34D399', bg: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', dot: '#10B981' };
      case 'locked':
        return { color: '#F87171', bg: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', dot: '#EF4444' };
      case 'pending':
      case 'draft':
        return { color: '#FBBF24', bg: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', dot: '#F59E0B' };
      default:
        return { color: '#60A5FA', bg: 'rgba(37, 99, 235, 0.15)', border: '1px solid rgba(37, 99, 235, 0.3)', dot: '#2563EB' };
    }
  };

  const style = getBadgeStyle();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: style.bg,
        color: style.color,
        border: style.border,
        padding: '3px 10px',
        borderRadius: '99px',
        fontSize: '11.5px',
        fontWeight: 800,
        textTransform: 'capitalize',
      }}
    >
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: style.dot }} />
      {label || status}
    </span>
  );
};
