import { describe, expect, it } from 'vitest';

import { buildDashboardSummary } from './dashboard.summary.js';
import type { JobApplication } from '../applications/application.schema.js';

const application = (overrides: Partial<JobApplication>): JobApplication => ({
  id: '11111111-1111-4111-8111-111111111111',
  company: 'Tech Curitiba',
  role: 'Desenvolvedor Web',
  status: 'interested',
  workMode: 'unknown',
  stacks: [],
  createdAt: '2026-05-04T00:00:00.000Z',
  updatedAt: '2026-05-04T00:00:00.000Z',
  ...overrides,
});

describe('buildDashboardSummary', () => {
  it('counts applications by status with zeroes for missing statuses', () => {
    const summary = buildDashboardSummary([
      application({ id: '11111111-1111-4111-8111-111111111111', status: 'interested' }),
      application({ id: '22222222-2222-4222-8222-222222222222', status: 'applied' }),
      application({ id: '33333333-3333-4333-8333-333333333333', status: 'applied' }),
    ]);

    expect(summary.total).toBe(3);
    expect(summary.statusCounts).toEqual({
      interested: 1,
      applied: 2,
      interview: 0,
      offer: 0,
      rejected: 0,
      archived: 0,
    });
  });

  it('returns overdue and next 7 days actions sorted by date', () => {
    const summary = buildDashboardSummary(
      [
        application({
          id: '11111111-1111-4111-8111-111111111111',
          company: 'Vaga vencida',
          nextActionDate: '2026-05-03',
        }),
        application({
          id: '22222222-2222-4222-8222-222222222222',
          company: 'Vaga próxima',
          nextActionDate: '2026-05-11',
        }),
        application({
          id: '33333333-3333-4333-8333-333333333333',
          company: 'Vaga futura',
          nextActionDate: '2026-05-12',
        }),
      ],
      { today: '2026-05-04' },
    );

    expect(summary.upcomingActions).toEqual([
      {
        id: '11111111-1111-4111-8111-111111111111',
        company: 'Vaga vencida',
        role: 'Desenvolvedor Web',
        status: 'interested',
        nextActionDate: '2026-05-03',
        isOverdue: true,
      },
      {
        id: '22222222-2222-4222-8222-222222222222',
        company: 'Vaga próxima',
        role: 'Desenvolvedor Web',
        status: 'interested',
        nextActionDate: '2026-05-11',
        isOverdue: false,
      },
    ]);
  });

  it('counts frequent stacks case-insensitively', () => {
    const summary = buildDashboardSummary([
      application({ stacks: ['React', 'TypeScript'] }),
      application({ id: '22222222-2222-4222-8222-222222222222', stacks: ['react', 'SQL'] }),
      application({ id: '33333333-3333-4333-8333-333333333333', stacks: ['SQL'] }),
    ]);

    expect(summary.frequentStacks).toEqual([
      { stack: 'React', count: 2 },
      { stack: 'SQL', count: 2 },
      { stack: 'TypeScript', count: 1 },
    ]);
  });
});
