import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Dashboard } from './Dashboard';
import type { DashboardSummary } from './dashboard.types';

const summary: DashboardSummary = {
  total: 3,
  statusCounts: {
    interested: 1,
    applied: 1,
    interview: 1,
    offer: 0,
    rejected: 0,
    archived: 0,
  },
  upcomingActions: [
    {
      id: '9d2a36a5-4e2b-49fb-8af1-0ef0f87cf447',
      company: 'Acme Tech',
      role: 'Desenvolvedor Front-end',
      status: 'applied',
      nextActionDate: '2026-05-08',
      isOverdue: false,
    },
  ],
  frequentStacks: [
    { stack: 'React', count: 2 },
    { stack: 'TypeScript', count: 2 },
  ],
};

describe('Dashboard', () => {
  it('renders status counts, upcoming actions and frequent stacks', () => {
    render(<Dashboard summary={summary} />);

    expect(screen.getByText('Total de candidaturas')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.getByText('Aplicado')).toBeTruthy();
    expect(screen.getByText('Entrevista')).toBeTruthy();
    expect(screen.getByText('Acme Tech — Desenvolvedor Front-end')).toBeTruthy();
    expect(screen.getByText('2026-05-08')).toBeTruthy();
    expect(screen.getByText('React')).toBeTruthy();
    expect(screen.getAllByText('2 vagas')).toHaveLength(2);
  });

  it('does not break with empty summary data', () => {
    render(
      <Dashboard
        summary={{
          total: 0,
          statusCounts: {
            interested: 0,
            applied: 0,
            interview: 0,
            offer: 0,
            rejected: 0,
            archived: 0,
          },
          upcomingActions: [],
          frequentStacks: [],
        }}
      />,
    );

    expect(screen.getByText('Nenhuma próxima ação nos próximos 7 dias.')).toBeTruthy();
    expect(screen.getByText('Nenhuma stack registrada ainda.')).toBeTruthy();
  });
});
