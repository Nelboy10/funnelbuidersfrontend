// ============================================================
// Funnel Builders — Input Component
// ============================================================

import { forwardRef, type InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, className = '', id, ...props }, ref) => {
    const generatedId = id || Math.random().toString(36).substr(2, 9);
    
    return (
      <div className={`form-group ${className}`}>
        {label && (
          <label htmlFor={generatedId} className="form-label">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={generatedId}
          className={`form-input ${error ? 'form-input--error' : ''}`}
          {...props}
        />
        {error && <div className="form-error">{error}</div>}
        {helpText && !error && <div className="form-help">{helpText}</div>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
