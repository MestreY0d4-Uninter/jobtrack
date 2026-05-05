import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { App } from './App';
import type { JobTrackApi } from './api/client';
import type { JobApplication } from './features/applications/application.types';
import type { DashboardSummary } from './features/dashboard/dashboard.types';

const application: JobApplication = {
  id: '9d2a36a5-4e2b-49fb-8af1-0ef0f87cf447',
  company: 'Acme Tech',
  role: 'Estágio Front-end',
  workMode: 'remote',
  status: 'applied',
  stacks: ['React', 'TypeScript'],
  nextActionDate: '2026-05-08',
  createdAt: '2026-05-04T10:00:00.000Z',
  updatedAt: '2026-05-04T10:00:00.000Z',
};

const dashboardSummary: DashboardSummary = {
  total: 1,
  statusCounts: {
    interested: 0,
    applied: 1,
    interview: 0,
    offer: 0,
    rejected: 0,
    archived: 0,
  },
  upcomingActions: [
    {
      id: application.id,
      company: application.company,
      role: application.role,
      status: application.status,
      nextActionDate: '2026-05-08',
      isOverdue: false,
    },
  ],
  frequentStacks: [{ stack: 'React', count: 1 }],
};

describe('App', () => {
  it('loads dashboard and applications from the configured API client on startup', async () => {
    const api: JobTrackApi = {
      listApplications: vi.fn(async () => [application]),
      getDashboardSummary: vi.fn(async () => dashboardSummary),
      createApplication: vi.fn(),
      updateApplication: vi.fn(),
      deleteApplication: vi.fn(),
    };

    render(<App api={api} />);

    expect(await screen.findByText('Acme Tech')).toBeTruthy();
    expect(screen.getByText('Total de candidaturas')).toBeTruthy();
    expect(screen.getByText('Estágio Front-end')).toBeTruthy();
    expect(api.listApplications).toHaveBeenCalled();
    expect(api.getDashboardSummary).toHaveBeenCalled();
  });
});
