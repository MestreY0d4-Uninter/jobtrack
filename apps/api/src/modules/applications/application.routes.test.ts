import { describe, expect, it } from 'vitest';

import { buildApp } from '../../app.js';
import { filterApplications, type ApplicationFilters } from './application.filters.js';
import { createApplicationSchema, type CreateApplicationInput, type JobApplication } from './application.schema.js';

type UpdateApplicationInput = Partial<CreateApplicationInput>;

type MemoryApplicationRepository = {
  create(input: CreateApplicationInput): Promise<JobApplication>;
  findMany(filters?: ApplicationFilters): Promise<JobApplication[]>;
  findById(id: string): Promise<JobApplication | null>;
  update(id: string, input: UpdateApplicationInput): Promise<JobApplication | null>;
  delete(id: string): Promise<boolean>;
};

const fixedNow = '2026-05-04T12:00:00.000Z';

const createApplication = (overrides: Partial<JobApplication> = {}): JobApplication => ({
  id: '00000000-0000-4000-8000-000000000001',
  company: 'Acme Brasil',
  role: 'Desenvolvedor Backend Node.js',
  workMode: 'remote',
  status: 'applied',
  stacks: ['Node.js', 'TypeScript', 'SQL'],
  createdAt: fixedNow,
  updatedAt: fixedNow,
  ...overrides,
});

const createMemoryApplicationRepository = (
  initialApplications: JobApplication[] = [],
): MemoryApplicationRepository => {
  const applications = new Map(initialApplications.map((application) => [application.id, application]));
  let nextId = initialApplications.length + 1;

  return {
    async create(input) {
      const data = createApplicationSchema.parse(input);
      const id = `00000000-0000-4000-8000-${String(nextId).padStart(12, '0')}`;
      nextId += 1;

      const application = createApplication({
        ...data,
        id,
        createdAt: fixedNow,
        updatedAt: fixedNow,
      });

      applications.set(id, application);

      return application;
    },

    async findMany(filters = {}) {
      return filterApplications([...applications.values()], filters);
    },

    async findById(id) {
      return applications.get(id) ?? null;
    },

    async update(id, input) {
      const current = applications.get(id);

      if (current === undefined) {
        return null;
      }

      const updated = {
        ...current,
        ...input,
        updatedAt: '2026-05-04T12:05:00.000Z',
      } as JobApplication;

      applications.set(id, updated);

      return updated;
    },

    async delete(id) {
      return applications.delete(id);
    },
  };
};

type JsonBody = Record<string, unknown>;

const parseJson = (body: string) => JSON.parse(body) as JsonBody;

describe('application REST routes', () => {
  it('creates an application and returns the persisted payload', async () => {
    const repository = createMemoryApplicationRepository();
    const app = buildApp({ logger: false }, { applicationRepository: repository });

    const response = await app.inject({
      method: 'POST',
      url: '/applications',
      payload: {
        company: '  Nubank  ',
        role: 'Desenvolvedor Backend',
        workMode: 'remote',
        stacks: ['Node.js', 'PostgreSQL'],
      },
    });

    expect(response.statusCode).toBe(201);
    expect(parseJson(response.body)).toMatchObject({
      id: '00000000-0000-4000-8000-000000000001',
      company: 'Nubank',
      role: 'Desenvolvedor Backend',
      workMode: 'remote',
      status: 'interested',
      stacks: ['Node.js', 'PostgreSQL'],
    });

    await app.close();
  });

  it('rejects invalid create payloads with a validation error', async () => {
    const repository = createMemoryApplicationRepository();
    const app = buildApp({ logger: false }, { applicationRepository: repository });

    const response = await app.inject({
      method: 'POST',
      url: '/applications',
      payload: {
        company: 'A',
        role: '',
        jobUrl: 'not-a-url',
      },
    });

    expect(response.statusCode).toBe(400);
    expect(parseJson(response.body)).toMatchObject({ error: 'validation_error' });

    await app.close();
  });

  it('lists applications using status, work mode, stack and text filters', async () => {
    const repository = createMemoryApplicationRepository([
      createApplication({
        id: '00000000-0000-4000-8000-000000000101',
        company: 'Acme Brasil',
        role: 'Desenvolvedor Backend Node.js',
        status: 'applied',
        workMode: 'remote',
        stacks: ['Node.js', 'PostgreSQL'],
      }),
      createApplication({
        id: '00000000-0000-4000-8000-000000000102',
        company: 'Contoso',
        role: 'Analista de Suporte TI',
        status: 'interested',
        workMode: 'onsite',
        stacks: ['Windows'],
      }),
    ]);
    const app = buildApp({ logger: false }, { applicationRepository: repository });

    const response = await app.inject({
      method: 'GET',
      url: '/applications?status=applied&workMode=remote&stack=Node.js&search=backend',
    });

    expect(response.statusCode).toBe(200);
    expect(parseJson(response.body)).toMatchObject({
      data: [
        {
          id: '00000000-0000-4000-8000-000000000101',
          company: 'Acme Brasil',
        },
      ],
    });

    await app.close();
  });

  it('returns one application by id or 404 when it does not exist', async () => {
    const repository = createMemoryApplicationRepository([
      createApplication({ id: '00000000-0000-4000-8000-000000000201' }),
    ]);
    const app = buildApp({ logger: false }, { applicationRepository: repository });

    const found = await app.inject({
      method: 'GET',
      url: '/applications/00000000-0000-4000-8000-000000000201',
    });
    const missing = await app.inject({
      method: 'GET',
      url: '/applications/00000000-0000-4000-8000-000000000299',
    });

    expect(found.statusCode).toBe(200);
    expect(parseJson(found.body)).toMatchObject({ id: '00000000-0000-4000-8000-000000000201' });
    expect(missing.statusCode).toBe(404);
    expect(parseJson(missing.body)).toEqual({ error: 'not_found' });

    await app.close();
  });

  it('updates an application by id', async () => {
    const repository = createMemoryApplicationRepository([
      createApplication({ id: '00000000-0000-4000-8000-000000000301', status: 'applied' }),
    ]);
    const app = buildApp({ logger: false }, { applicationRepository: repository });

    const response = await app.inject({
      method: 'PATCH',
      url: '/applications/00000000-0000-4000-8000-000000000301',
      payload: {
        status: 'interview',
        notes: 'Entrevista técnica marcada.',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(parseJson(response.body)).toMatchObject({
      id: '00000000-0000-4000-8000-000000000301',
      status: 'interview',
      notes: 'Entrevista técnica marcada.',
    });

    await app.close();
  });

  it('deletes an application by id', async () => {
    const repository = createMemoryApplicationRepository([
      createApplication({ id: '00000000-0000-4000-8000-000000000401' }),
    ]);
    const app = buildApp({ logger: false }, { applicationRepository: repository });

    const deleted = await app.inject({
      method: 'DELETE',
      url: '/applications/00000000-0000-4000-8000-000000000401',
    });
    const missingAfterDelete = await app.inject({
      method: 'GET',
      url: '/applications/00000000-0000-4000-8000-000000000401',
    });

    expect(deleted.statusCode).toBe(204);
    expect(deleted.body).toBe('');
    expect(missingAfterDelete.statusCode).toBe(404);

    await app.close();
  });
});

describe('dashboard REST routes', () => {
  it('returns a summary built from stored applications', async () => {
    const repository = createMemoryApplicationRepository([
      createApplication({
        id: '00000000-0000-4000-8000-000000000501',
        company: 'Acme Brasil',
        status: 'applied',
        nextActionDate: '2026-05-03',
        stacks: ['TypeScript', 'Node.js'],
      }),
      createApplication({
        id: '00000000-0000-4000-8000-000000000502',
        company: 'Beta Tech',
        status: 'interview',
        nextActionDate: '2026-05-08',
        stacks: ['TypeScript', 'React'],
      }),
    ]);
    const app = buildApp({ logger: false }, { applicationRepository: repository });

    const response = await app.inject({
      method: 'GET',
      url: '/dashboard/summary?today=2026-05-04',
    });

    expect(response.statusCode).toBe(200);
    expect(parseJson(response.body)).toMatchObject({
      total: 2,
      statusCounts: {
        interested: 0,
        applied: 1,
        interview: 1,
        offer: 0,
        rejected: 0,
        archived: 0,
      },
      upcomingActions: [
        {
          id: '00000000-0000-4000-8000-000000000501',
          company: 'Acme Brasil',
          nextActionDate: '2026-05-03',
          isOverdue: true,
        },
        {
          id: '00000000-0000-4000-8000-000000000502',
          company: 'Beta Tech',
          nextActionDate: '2026-05-08',
          isOverdue: false,
        },
      ],
      frequentStacks: [
        { stack: 'TypeScript', count: 2 },
        { stack: 'Node.js', count: 1 },
        { stack: 'React', count: 1 },
      ],
    });

    await app.close();
  });
});
