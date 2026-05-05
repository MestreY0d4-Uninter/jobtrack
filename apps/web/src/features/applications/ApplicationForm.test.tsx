import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ApplicationForm } from './ApplicationForm';

describe('ApplicationForm', () => {
  it('validates required fields before submitting', async () => {
    const onSubmit = vi.fn();
    render(<ApplicationForm onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: 'Salvar candidatura' }));

    expect(await screen.findByText('Informe empresa e vaga para salvar.')).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('normalizes form values before submitting a new application', async () => {
    const onSubmit = vi.fn();
    render(<ApplicationForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText('Empresa'), { target: { value: ' Acme Tech ' } });
    fireEvent.change(screen.getByLabelText('Vaga'), { target: { value: ' Desenvolvedor Front-end ' } });
    fireEvent.change(screen.getByLabelText('Modalidade'), { target: { value: 'remote' } });
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'applied' } });
    fireEvent.change(screen.getByLabelText('Stacks'), {
      target: { value: 'React, TypeScript, React' },
    });
    fireEvent.change(screen.getByLabelText('Próxima ação'), { target: { value: '2026-05-08' } });

    fireEvent.click(screen.getByRole('button', { name: 'Salvar candidatura' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        company: 'Acme Tech',
        role: 'Desenvolvedor Front-end',
        jobUrl: '',
        source: '',
        location: '',
        workMode: 'remote',
        status: 'applied',
        dateApplied: '',
        nextActionDate: '2026-05-08',
        stacks: ['React', 'TypeScript'],
        notes: '',
      });
    });
  });
});
