import React, { useState, useRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface PasswordFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  containerStyle?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  iconColor?: string;
  iconSize?: number;
}

export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(({
  containerStyle,
  inputStyle,
  className = 'search-field',
  iconColor = '#9CA3AF',
  iconSize = 18,
  disabled,
  value,
  onChange,
  placeholder = '••••••••••••',
  ...restProps
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const internalRef = useRef<HTMLInputElement | null>(null);

  const setRefs = (element: HTMLInputElement | null) => {
    internalRef.current = element;
    if (typeof ref === 'function') {
      ref(element);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLInputElement | null>).current = element;
    }
  };

  const toggleVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const input = internalRef.current;

    if (input) {
      const start = input.selectionStart;
      const end = input.selectionEnd;
      setShowPassword((prev) => !prev);

      requestAnimationFrame(() => {
        input.focus();
        if (start !== null && end !== null) {
          try {
            input.setSelectionRange(start, end);
          } catch {
            // Browsers that don't support selection on text/password
          }
        }
      });
    } else {
      setShowPassword((prev) => !prev);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', ...containerStyle }}>
      <input
        ref={setRefs}
        type={showPassword ? 'text' : 'password'}
        disabled={disabled}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
        style={{
          width: '100%',
          paddingRight: `${iconSize + 24}px`,
          ...inputStyle,
        }}
        {...restProps}
      />
      <button
        type="button"
        tabIndex={0}
        disabled={disabled}
        onClick={toggleVisibility}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        title={showPassword ? 'Hide password' : 'Show password'}
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          padding: 0,
          margin: 0,
          color: iconColor,
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {showPassword ? <EyeOff size={iconSize} /> : <Eye size={iconSize} />}
      </button>
    </div>
  );
});

PasswordField.displayName = 'PasswordField';
