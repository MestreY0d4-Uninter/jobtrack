import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ApplicationList } from './ApplicationList';
import type { JobApplication } from './application.types';

const applications: JobApplication[] = [
  {
    id: '9d2a36a5-4e2b-49fb-8af1-0ef0f87cf447',
    company: 'Acme Tech',
    role: 'Estágio Front-end',
    workMode: 'remote',
    status: 'applied',
    stacks: ['React', 'TypeScript'],
    nextActionDate: '2026-05-08',
    createdAt: '2026-05-04T10:00:00.000Z',
    updatedAt: '2026-05-04T10:00:00.000Z',
  },
];

describe('ApplicationList', () => {
  it('shows an empty state when there are no applications', () => {
    render(<ApplicationList applications={[]} onDelete={vi.fn()} onEdit={vi.fn()} />);

    expect(screen.getByText('Nenhuma candidatura encontrada.')).toBeTruthy();
  });

  it('renders application details and row actions', () => {
    render(<ApplicationList applications={applications} onDelete={vi.fn()} onEdit={vi.fn()} />);

    expect(screen.getByText('Acme Tech')).toBeTruthy();
    expect(screen.getByText('Estágio Front-end')).toBeTruthy();
    expect(screen.getByText('Aplicado')).toBeTruthy();
    expect(screen.getByText('Remoto')).toBeTruthy();
    expect(screen.getByText('React')).toBeTruthy();
    expect(screen.getByText('TypeScript')).toBeTruthy();
    expect(screen.getByText('Próxima ação: 2026-05-08')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Editar candidatura Acme Tech' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Excluir candidatura Acme Tech' })).toBeTruthy();
  });
});
