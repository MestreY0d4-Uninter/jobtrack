import { describe, expect, it } from 'vitest';

import { filterApplications } from './application.filters.js';
import type { JobApplication } from './application.schema.js';

const applications: JobApplication[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    company: 'Tech Curitiba',
    role: 'Desenvolvedor Front-end React',
    status: 'applied',
    workMode: 'hybrid',
    stacks: ['React', 'TypeScript'],
    createdAt: '2026-05-04T00:00:00.000Z',
    updatedAt: '2026-05-04T00:00:00.000Z',
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    company: 'Remote Labs',
    role: 'Desenvolvedor Back-end Node.js',
    status: 'interested',
    workMode: 'remote',
    stacks: ['Node.js', 'SQL'],
    createdAt: '2026-05-04T00:00:00.000Z',
    updatedAt: '2026-05-04T00:00:00.000Z',
  },
  {
    id: '33333333-3333-4333-8333-333333333333',
    company: 'Office Systems',
    role: 'Suporte e Desenvolvimento Interno',
    status: 'interview',
    workMode: 'onsite',
    stacks: ['JavaScript', 'SQL'],
    createdAt: '2026-05-04T00:00:00.000Z',
    updatedAt: '2026-05-04T00:00:00.000Z',
  },
];

const ids = (items: JobApplication[]) => items.map((item) => item.id);

describe('filterApplications', () => {
  it('filters by status', () => {
    const result = filterApplications(applications, { status: 'applied' });

    expect(ids(result)).toEqual(['11111111-1111-4111-8111-111111111111']);
  });

  it('filters by work mode', () => {
    const result = filterApplications(applications, { workMode: 'remote' });

    expect(ids(result)).toEqual(['22222222-2222-4222-8222-222222222222']);
  });

  it('filters by stack case-insensitively', () => {
    const result = filterApplications(applications, { stack: 'react' });

    expect(ids(result)).toEqual(['11111111-1111-4111-8111-111111111111']);
  });

  it('filters by text in company or role case-insensitively', () => {
    const result = filterApplications(applications, { search: 'node' });

    expect(ids(result)).toEqual(['22222222-2222-4222-8222-222222222222']);
  });

  it('returns an empty list when no application matches', () => {
    const result = filterApplications(applications, { search: 'python' });

    expect(result).toEqual([]);
  });
});
