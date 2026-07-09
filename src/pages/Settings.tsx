import { useState, type FormEvent } from 'react';
import { WorkspaceCard } from '../components/WorkspaceCard';
import { InputField } from '../components/atoms/InputField';
import { SelectField } from '../components/atoms/SelectField';
import { Button } from '../components/atoms/Button';
import './Settings.css';

interface SettingsFormState {
  workspaceName: string;
  contactEmail: string;
  timezone: string;
}

type FieldErrors = Partial<Record<keyof SettingsFormState, string>>;

const INITIAL_STATE: SettingsFormState = {
  workspaceName: '',
  contactEmail: '',
  timezone: 'UTC',
};

const TIMEZONE_OPTIONS = [
  { value: 'UTC', label: 'UTC' },
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
  { value: 'America/New_York', label: 'America/New York (ET)' },
  { value: 'Europe/London', label: 'Europe/London (GMT)' },
];

function sanitizeValue(value: string): string {
  return value.replace(/</g, '').trimStart();
}

function validateField(name: keyof SettingsFormState, value: string): string {
  switch (name) {
    case 'workspaceName':
      if (!value.trim()) return 'Workspace name is required.';
      if (value.trim().length < 3) return 'Must be at least 3 characters.';
      return '';
    case 'contactEmail':
      if (!value.trim()) return 'Contact email is required.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address.';
      return '';
    case 'timezone':
      if (!value) return 'Select a timezone.';
      return '';
    default:
      return '';
  }
}

function validateAll(form: SettingsFormState): FieldErrors {
  const errors: FieldErrors = {};
  (Object.keys(form) as (keyof SettingsFormState)[]).forEach((key) => {
    errors[key] = validateField(key, form[key]);
  });
  return errors;
}

export default function SettingsPage() {
  const [form, setForm] = useState<SettingsFormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(name: keyof SettingsFormState, rawValue: string) {
    const value = sanitizeValue(rawValue);
    setForm((prev) => ({ ...prev, [name]: value }));
    if (hasAttemptedSubmit) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    const nextErrors = validateAll(form);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setIsSubmitting(true);
    setSubmitted(false);

    window.setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 700);
  }

  return (
    <WorkspaceCard title="Workspace Settings">
      <form className="settings-form" onSubmit={handleSubmit} noValidate>
        <InputField
          label="Workspace name"
          value={form.workspaceName}
          error={errors.workspaceName}
          onChange={(e) => handleChange('workspaceName', e.target.value)}
          placeholder="e.g. Horizon Core"
        />
        <InputField
          label="Contact email"
          type="email"
          value={form.contactEmail}
          error={errors.contactEmail}
          onChange={(e) => handleChange('contactEmail', e.target.value)}
          placeholder="you@company.com"
        />
        <SelectField
          label="Timezone"
          options={TIMEZONE_OPTIONS}
          value={form.timezone}
          error={errors.timezone}
          onChange={(e) => handleChange('timezone', e.target.value)}
        />

        <div className="settings-form__footer">
          <Button type="submit" isLoading={isSubmitting}>
            Save changes
          </Button>
          {submitted && <span className="settings-form__success">Saved successfully</span>}
        </div>
      </form>
    </WorkspaceCard>
  );
}