import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

import { getRequiredEnv } from '../env.js';

export type AppPrismaClient = PrismaClient;

export function createPrismaClient(databaseUrl = getRequiredEnv('DATABASE_URL')): PrismaClient {
  const adapter = new PrismaPg({ connectionString: databaseUrl });

  return new PrismaClient({ adapter });
}
