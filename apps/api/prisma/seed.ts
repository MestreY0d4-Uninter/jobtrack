import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { config as loadEnv } from 'dotenv';
import { fileURLToPath } from 'node:url';

loadEnv({ path: fileURLToPath(new URL('../../../.env', import.meta.url)) });

const databaseUrl = process.env.DATABASE_URL;

if (databaseUrl === undefined || databaseUrl.trim() === '') {
  throw new Error('DATABASE_URL is required to seed the database.');
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

const toDate = (value: string) => new Date(`${value}T00:00:00.000Z`);

async function main() {
  await prisma.jobApplication.deleteMany();

  await prisma.jobApplication.createMany({
    data: [
      {
        company: 'Curitiba Web Studio',
        role: 'Desenvolvedor Front-end',
        jobUrl: 'https://example.com/jobs/frontend-developer',
        source: 'LinkedIn',
        location: 'Curitiba, PR',
        workMode: 'hybrid',
        status: 'applied',
        dateApplied: toDate('2026-05-01'),
        nextActionDate: toDate('2026-05-08'),
        stacks: ['React', 'TypeScript', 'CSS'],
        notes: 'Revisar retorno e registrar próximos passos após o contato inicial.',
      },
      {
        company: 'Remote Systems Brasil',
        role: 'Desenvolvedor Back-end Node.js',
        jobUrl: 'https://example.com/jobs/backend-developer',
        source: 'Programathor',
        location: 'Remoto Brasil',
        workMode: 'remote',
        status: 'interested',
        nextActionDate: toDate('2026-05-10'),
        stacks: ['Node.js', 'Fastify', 'PostgreSQL'],
        notes: 'Conferir requisitos de API, banco de dados e rotina de deploy.',
      },
      {
        company: 'Office Tech Solutions',
        role: 'Analista de Sistemas Internos',
        source: 'Site da empresa',
        location: 'Curitiba, PR',
        workMode: 'onsite',
        status: 'interview',
        dateApplied: toDate('2026-04-28'),
        nextActionDate: toDate('2026-05-05'),
        stacks: ['JavaScript', 'SQL'],
        notes: 'Preparar perguntas sobre sustentação, prioridades e fluxo da equipe.',
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
