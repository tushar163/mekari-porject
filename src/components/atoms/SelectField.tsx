import { memo, type SelectHTMLAttributes } from 'react';
import '../atoms/InputField.css';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
}

function SelectFieldBase({ label, options, error, id, className = '', ...rest }: SelectFieldProps) {
  const selectId = id ?? `select-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`input-field ${error ? 'input-field--error' : ''} ${className}`}>
      <label htmlFor={selectId} className="input-field__label">
        {label}
      </label>
      <select id={selectId} className="input-field__control" {...rest}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="input-field__error">{error}</p>}
    </div>
  );
}

export const SelectField = memo(SelectFieldBase);
