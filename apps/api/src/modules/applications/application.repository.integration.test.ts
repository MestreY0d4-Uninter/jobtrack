import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

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
      role: 'Estágio em Desenvolvimento Web',
      nextActionDate: '2026-05-08',
      stacks: ['React', 'TypeScript'],
    });

    expect(created).toMatchObject({
      company: 'Tech Curitiba',
      role: 'Estágio em Desenvolvimento Web',
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
      role: 'Estágio Front-end',
      status: 'applied',
      workMode: 'hybrid',
      stacks: ['React', 'TypeScript'],
    });
    await repository.create({
      company: 'Node Remote',
      role: 'Estágio Back-end Node.js',
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
});
