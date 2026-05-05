import { describe, expect, it } from 'vitest';

import { createDemoJobTrackApiClient } from './demoClient';
import { emptyApplicationFilters } from '../features/applications/applicationFilters';

describe('createDemoJobTrackApiClient', () => {
  it('starts with fictitious applications and a computed dashboard summary', async () => {
    const client = createDemoJobTrackApiClient();

    const applications = await client.listApplications(emptyApplicationFilters);
    const summary = await client.getDashboardSummary();

    expect(applications).toHaveLength(4);
    expect(applications.every((application) => application.notes?.includes('Dado de exemplo'))).toBe(true);
    expect(summary.total).toBe(4);
    expect(summary.statusCounts.applied).toBeGreaterThan(0);
    expect(summary.frequentStacks[0]?.stack).toBe('React');
  });

  it('filters demo applications by the same filter state used by the API client', async () => {
    const client = createDemoJobTrackApiClient();

    const applications = await client.listApplications({
      status: 'applied',
      workMode: 'all',
      stack: 'react',
      search: 'curitiba',
    });

    expect(applications).toHaveLength(1);
    expect(applications[0]?.company).toBe('Curitiba Web Studio');
  });

  it('keeps create, update and delete interactive during the static demo', async () => {
    const client = createDemoJobTrackApiClient();

    const created = await client.createApplication({
      company: 'Demo Labs',
      role: 'Desenvolvedor Full-stack',
      workMode: 'remote',
      status: 'interested',
      stacks: ['React', 'Node.js'],
      nextActionDate: '2026-05-12',
      notes: 'Dado de exemplo criado durante a demo.',
    });
    const updated = await client.updateApplication(created.id, { status: 'interview' });
    await client.deleteApplication(updated.id);

    const applications = await client.listApplications(emptyApplicationFilters);
    const summary = await client.getDashboardSummary();

    expect(applications.some((application) => application.id === created.id)).toBe(false);
    expect(summary.total).toBe(4);
  });
});
