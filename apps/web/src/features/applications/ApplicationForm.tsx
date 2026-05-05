import { useEffect, useState, type FormEvent } from 'react';

import type { CreateApplicationPayload, JobApplication } from './application.types';
import { applicationStatuses, statusLabels, workModeLabels, workModes } from './application.types';

type ApplicationFormProps = {
  initialApplication?: JobApplication | null;
  isSubmitting?: boolean;
  submitError?: string | null;
  onCancel?: () => void;
  onSubmit: (payload: CreateApplicationPayload) => Promise<void> | void;
};

type FormState = {
  company: string;
  role: string;
  jobUrl: string;
  source: string;
  location: string;
  workMode: string;
  status: string;
  dateApplied: string;
  nextActionDate: string;
  stacks: string;
  notes: string;
};

const emptyFormState: FormState = {
  company: '',
  role: '',
  jobUrl: '',
  source: '',
  location: '',
  workMode: 'unknown',
  status: 'interested',
  dateApplied: '',
  nextActionDate: '',
  stacks: '',
  notes: '',
};

const toFormState = (application: JobApplication | null | undefined): FormState => {
  if (application === null || application === undefined) {
    return emptyFormState;
  }

  return {
    company: application.company,
    role: application.role,
    jobUrl: application.jobUrl ?? '',
    source: application.source ?? '',
    location: application.location ?? '',
    workMode: application.workMode,
    status: application.status,
    dateApplied: application.dateApplied ?? '',
    nextActionDate: application.nextActionDate ?? '',
    stacks: application.stacks.join(', '),
    notes: application.notes ?? '',
  };
};

const normalizeStacks = (value: string) => {
  const seen = new Set<string>();
  const stacks: string[] = [];

  for (const rawStack of value.split(',')) {
    const stack = rawStack.trim();
    const key = stack.toLocaleLowerCase('pt-BR');

    if (stack !== '' && !seen.has(key)) {
      seen.add(key);
      stacks.push(stack);
    }
  }

  return stacks;
};

const toPayload = (form: FormState): CreateApplicationPayload => ({
  company: form.company.trim(),
  role: form.role.trim(),
  jobUrl: form.jobUrl.trim(),
  source: form.source.trim(),
  location: form.location.trim(),
  workMode: form.workMode as CreateApplicationPayload['workMode'],
  status: form.status as CreateApplicationPayload['status'],
  dateApplied: form.dateApplied,
  nextActionDate: form.nextActionDate,
  stacks: normalizeStacks(form.stacks),
  notes: form.notes.trim(),
});

export function ApplicationForm({
  initialApplication = null,
  isSubmitting = false,
  onCancel,
  onSubmit,
  submitError = null,
}: ApplicationFormProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(initialApplication));
  const [validationError, setValidationError] = useState<string | null>(null);
  const isEditing = initialApplication !== null;

  useEffect(() => {
    setForm(toFormState(initialApplication));
    setValidationError(null);
  }, [initialApplication]);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.company.trim() === '' || form.role.trim() === '') {
      setValidationError('Informe empresa e vaga para salvar.');
      return;
    }

    setValidationError(null);

    try {
      await onSubmit(toPayload(form));

      if (!isEditing) {
        setForm(emptyFormState);
      }
    } catch {
      // Parent component owns the API error message.
    }
  };

  return (
    <form className="application-form" onSubmit={handleSubmit}>
      <div className="section-heading">
        <p className="eyebrow">Cadastro</p>
        <h2>{isEditing ? 'Editar candidatura' : 'Nova candidatura'}</h2>
      </div>

      <div className="form-grid">
        <label>
          Empresa
          <input
            autoComplete="organization"
            onChange={(event) => updateField('company', event.target.value)}
            placeholder="Ex.: Acme Tech"
            type="text"
            value={form.company}
          />
        </label>

        <label>
          Vaga
          <input
            autoComplete="off"
            onChange={(event) => updateField('role', event.target.value)}
            placeholder="Ex.: Desenvolvedor Front-end"
            type="text"
            value={form.role}
          />
        </label>

        <label>
          Modalidade
          <select onChange={(event) => updateField('workMode', event.target.value)} value={form.workMode}>
            {workModes.map((workMode) => (
              <option key={workMode} value={workMode}>
                {workModeLabels[workMode]}
              </option>
            ))}
          </select>
        </label>

        <label>
          Status
          <select onChange={(event) => updateField('status', event.target.value)} value={form.status}>
            {applicationStatuses.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        </label>

        <label>
          URL da vaga
          <input
            onChange={(event) => updateField('jobUrl', event.target.value)}
            placeholder="https://..."
            type="url"
            value={form.jobUrl}
          />
        </label>

        <label>
          Fonte
          <input
            onChange={(event) => updateField('source', event.target.value)}
            placeholder="LinkedIn, Gupy, indicação..."
            type="text"
            value={form.source}
          />
        </label>

        <label>
          Localidade
          <input
            onChange={(event) => updateField('location', event.target.value)}
            placeholder="Curitiba, remoto..."
            type="text"
            value={form.location}
          />
        </label>

        <label>
          Data da candidatura
          <input onChange={(event) => updateField('dateApplied', event.target.value)} type="date" value={form.dateApplied} />
        </label>

        <label>
          Próxima ação
          <input
            onChange={(event) => updateField('nextActionDate', event.target.value)}
            type="date"
            value={form.nextActionDate}
          />
        </label>

        <label className="form-grid__wide">
          Stacks
          <input
            onChange={(event) => updateField('stacks', event.target.value)}
            placeholder="React, TypeScript, SQL"
            type="text"
            value={form.stacks}
          />
        </label>

        <label className="form-grid__wide">
          Observações
          <textarea
            onChange={(event) => updateField('notes', event.target.value)}
            placeholder="Requisitos, próximos passos, contato..."
            rows={4}
            value={form.notes}
          />
        </label>
      </div>

      {validationError !== null ? <p className="form-error">{validationError}</p> : null}
      {submitError !== null ? <p className="form-error">{submitError}</p> : null}

      <div className="form-actions">
        {isEditing ? (
          <button className="button-secondary" onClick={onCancel} type="button">
            Cancelar edição
          </button>
        ) : null}
        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Salvando...' : 'Salvar candidatura'}
        </button>
      </div>
    </form>
  );
}
