import { afterEach, describe, expect, it, vi } from 'vitest';

import { createJobTrackApiClient } from './client';
import type { JobApplication } from '../features/applications/application.types';

const application: JobApplication = {
  id: '9d2a36a5-4e2b-49fb-8af1-0ef0f87cf447',
  company: 'Acme Tech',
  role: 'Desenvolvedor Front-end',
  workMode: 'remote',
  status: 'applied',
  stacks: ['React', 'TypeScript'],
  nextActionDate: '2026-05-08',
  createdAt: '2026-05-04T10:00:00.000Z',
  updatedAt: '2026-05-04T10:00:00.000Z',
};

const jsonResponse = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: { 'content-type': 'application/json' },
  });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('createJobTrackApiClient', () => {
  it('lists applications with only the active filters in the query string', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ data: [application] }));
    vi.stubGlobal('fetch', fetchMock);

    const client = createJobTrackApiClient({ baseUrl: 'https://api.example.test' });
    const result = await client.listApplications({
      status: 'applied',
      workMode: 'remote',
      stack: 'React',
      search: 'front',
    });

    expect(result).toEqual([application]);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.test/applications?status=applied&workMode=remote&stack=React&search=front',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('creates an application with JSON headers and body', async () => {
    const fetchMock = vi.fn(async () => jsonResponse(application, { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);

    const client = createJobTrackApiClient({ baseUrl: 'https://api.example.test/' });
    const result = await client.createApplication({
      company: 'Acme Tech',
      role: 'Desenvolvedor Front-end',
      workMode: 'remote',
      status: 'applied',
      stacks: ['React', 'TypeScript'],
    });

    expect(result).toEqual(application);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.test/applications',
      expect.objectContaining({
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          company: 'Acme Tech',
          role: 'Desenvolvedor Front-end',
          workMode: 'remote',
          status: 'applied',
          stacks: ['React', 'TypeScript'],
        }),
      }),
    );
  });

  it('turns API validation errors into readable messages', async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse(
        {
          error: 'validation_error',
          issues: [{ path: 'company', message: 'Company is required' }],
        },
        { status: 400 },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const client = createJobTrackApiClient({ baseUrl: 'https://api.example.test' });

    await expect(
      client.createApplication({ company: '', role: 'Desenvolvedor Front-end' }),
    ).rejects.toThrow('company: Company is required');
  });
});
