import React, { forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, id, className = '', disabled, ...props }, ref) => {
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-text select-none">
            {label}
            {props.required && <span className="text-danger ml-1">*</span>}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          disabled={disabled}
          className={`w-full px-3.5 py-2 text-sm rounded-lg border transition-colors outline-none bg-surface text-text disabled:opacity-50 disabled:cursor-not-allowed ${
            error
              ? 'border-danger focus:border-danger focus:ring-1 focus:ring-danger'
              : 'border-border focus:border-accent focus:ring-1 focus:ring-accent'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-surface text-text">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-xs text-danger font-medium">{error}</span>}
        {!error && helperText && (
          <span className="text-xs text-text-muted">{helperText}</span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
