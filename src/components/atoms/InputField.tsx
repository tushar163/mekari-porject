import { memo, type InputHTMLAttributes } from 'react';
import './InputField.css';


export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

function InputFieldBase({ label, error, hint, id, className = '', ...rest }: InputFieldProps) {
  const inputId = id ?? `field-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`input-field ${error ? 'input-field--error' : ''} ${className}`}>
      <label htmlFor={inputId} className="input-field__label">
        {label}
      </label>
      <input
        id={inputId}
        className="input-field__control"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...rest}
      />
    
      {error && (
        <p id={`${inputId}-error`} className="input-field__error">
          {error}
        </p>
      )}
      {!error && hint && <p className="input-field__hint">{hint}</p>}
    </div>
  );
}

export const InputField = memo(InputFieldBase);
