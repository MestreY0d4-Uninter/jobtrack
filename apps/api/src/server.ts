import { buildApp } from './app.js';
import { createApplicationRepository } from './modules/applications/application.repository.js';
import { createPrismaClient } from './prisma/client.js';

const port = Number(process.env.PORT ?? 3333);
const host = process.env.HOST ?? '0.0.0.0';
const prisma = createPrismaClient();
const applicationRepository = createApplicationRepository(prisma);
const app = buildApp({ logger: true }, { applicationRepository });

app.addHook('onClose', async () => {
  await prisma.$disconnect();
});

try {
  await app.listen({ port, host });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
