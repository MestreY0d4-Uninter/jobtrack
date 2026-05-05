import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { buildApp } from '../../app.js';
import { createPrismaClient } from '../../prisma/client.js';
import { createApplicationRepository } from './application.repository.js';

const prisma = createPrismaClient();
const repository = createApplicationRepository(prisma);

describe('applicationRepository', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await prisma.jobApplication.deleteMany();
  });

  afterAll(async () => {
    await prisma.jobApplication.deleteMany();
    await prisma.$disconnect();
  });

  it('creates an application with domain defaults and maps database values', async () => {
    const created = await repository.create({
      company: 'Tech Curitiba',
      role: 'Desenvolvedor Web',
      nextActionDate: '2026-05-08',
      stacks: ['React', 'TypeScript'],
    });

    expect(created).toMatchObject({
      company: 'Tech Curitiba',
      role: 'Desenvolvedor Web',
      status: 'interested',
      workMode: 'unknown',
      nextActionDate: '2026-05-08',
      stacks: ['React', 'TypeScript'],
    });
    expect(created.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
    expect(created.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(created.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('lists applications using the existing domain filters', async () => {
    await repository.create({
      company: 'React Curitiba',
      role: 'Desenvolvedor Front-end',
      status: 'applied',
      workMode: 'hybrid',
      stacks: ['React', 'TypeScript'],
    });
    await repository.create({
      company: 'Node Remote',
      role: 'Desenvolvedor Back-end Node.js',
      status: 'interested',
      workMode: 'remote',
      stacks: ['Node.js', 'SQL'],
    });

    const result = await repository.findMany({
      status: 'applied',
      stack: 'react',
      search: 'front',
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.company).toBe('React Curitiba');
  });

  it('finds, updates and deletes an application by id', async () => {
    const created = await repository.create({
      company: 'Startup Remota',
      role: 'Desenvolvedor Backend',
      status: 'applied',
      notes: 'Enviar projeto público.',
    });

    await expect(repository.findById(created.id)).resolves.toMatchObject({
      id: created.id,
      company: 'Startup Remota',
    });

    const updated = await repository.update(created.id, {
      status: 'interview',
      notes: '',
      nextActionDate: '2026-05-09',
    });

    expect(updated).toMatchObject({
      id: created.id,
      status: 'interview',
      nextActionDate: '2026-05-09',
    });
    expect(updated?.notes).toBeUndefined();

    await expect(repository.update('00000000-0000-4000-8000-000000000999', { status: 'offer' })).resolves.toBeNull();
    await expect(repository.delete(created.id)).resolves.toBe(true);
    await expect(repository.findById(created.id)).resolves.toBeNull();
    await expect(repository.delete(created.id)).resolves.toBe(false);
  });

  it('serves application and dashboard routes against PostgreSQL', async () => {
    const app = buildApp({ logger: false }, { applicationRepository: repository });

    try {
      const createdResponse = await app.inject({
        method: 'POST',
        url: '/applications',
        payload: {
          company: 'Tech Curitiba',
          role: 'Desenvolvedor Full-stack TypeScript',
          status: 'applied',
          workMode: 'hybrid',
          nextActionDate: '2026-05-08',
          stacks: ['React', 'Node.js', 'PostgreSQL'],
        },
      });

      expect(createdResponse.statusCode).toBe(201);
      const created = createdResponse.json<{
        id: string;
        company: string;
        status: string;
        nextActionDate: string;
      }>();
      expect(created).toMatchObject({
        company: 'Tech Curitiba',
        status: 'applied',
        nextActionDate: '2026-05-08',
      });

      const listResponse = await app.inject({
        method: 'GET',
        url: '/applications?status=applied&workMode=hybrid&stack=react&search=full-stack',
      });
      expect(listResponse.statusCode).toBe(200);
      expect(listResponse.json()).toMatchObject({
        data: [{ id: created.id }],
      });

      const updateResponse = await app.inject({
        method: 'PATCH',
        url: `/applications/${created.id}`,
        payload: {
          status: 'interview',
          notes: 'Entrevista técnica marcada.',
        },
      });
      expect(updateResponse.statusCode).toBe(200);
      expect(updateResponse.json()).toMatchObject({
        id: created.id,
        status: 'interview',
        notes: 'Entrevista técnica marcada.',
      });

      const summaryResponse = await app.inject({
        method: 'GET',
        url: '/dashboard/summary?today=2026-05-04',
      });
      expect(summaryResponse.statusCode).toBe(200);
      expect(summaryResponse.json()).toMatchObject({
        total: 1,
        statusCounts: {
          interview: 1,
        },
        upcomingActions: [
          {
            id: created.id,
            company: 'Tech Curitiba',
            isOverdue: false,
            nextActionDate: '2026-05-08',
          },
        ],
      });

      const deleteResponse = await app.inject({
        method: 'DELETE',
        url: `/applications/${created.id}`,
      });
      expect(deleteResponse.statusCode).toBe(204);

      const missingResponse = await app.inject({
        method: 'GET',
        url: `/applications/${created.id}`,
      });
      expect(missingResponse.statusCode).toBe(404);
    } finally {
      await app.close();
    }
  });
});
