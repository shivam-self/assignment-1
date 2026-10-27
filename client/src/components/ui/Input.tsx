import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, className = '', disabled, ...props }, ref) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text select-none">
            {label}
            {props.required && <span className="text-danger ml-1">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          disabled={disabled}
          className={`w-full px-3.5 py-2 text-sm rounded-lg border transition-colors outline-none bg-surface text-text disabled:opacity-50 disabled:cursor-not-allowed ${
            error
              ? 'border-danger focus:border-danger focus:ring-1 focus:ring-danger'
              : 'border-border focus:border-accent focus:ring-1 focus:ring-accent'
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-danger font-medium">{error}</span>}
        {!error && helperText && (
          <span className="text-xs text-text-muted">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
