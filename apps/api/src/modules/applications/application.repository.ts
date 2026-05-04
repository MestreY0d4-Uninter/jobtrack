import type { Prisma, JobApplication as PrismaJobApplication } from '@prisma/client';

import { filterApplications, type ApplicationFilters } from './application.filters.js';
import {
  createApplicationSchema,
  type CreateApplicationInput,
  type JobApplication,
} from './application.schema.js';
import type { AppPrismaClient } from '../../prisma/client.js';

type ApplicationModel = AppPrismaClient['jobApplication'];

type ApplicationRepositoryPrismaClient = {
  jobApplication: Pick<ApplicationModel, 'create' | 'findMany'>;
};

const toDate = (value: string | undefined) => {
  if (value === undefined) {
    return undefined;
  }

  return new Date(`${value}T00:00:00.000Z`);
};

const toDateOnly = (value: Date | null) => value?.toISOString().slice(0, 10) ?? undefined;

const toDomainApplication = (application: PrismaJobApplication): JobApplication => ({
  id: application.id,
  company: application.company,
  role: application.role,
  jobUrl: application.jobUrl ?? undefined,
  source: application.source ?? undefined,
  location: application.location ?? undefined,
  workMode: application.workMode,
  status: application.status,
  dateApplied: toDateOnly(application.dateApplied),
  nextActionDate: toDateOnly(application.nextActionDate),
  stacks: application.stacks,
  notes: application.notes ?? undefined,
  createdAt: application.createdAt.toISOString(),
  updatedAt: application.updatedAt.toISOString(),
});

export function createApplicationRepository(prisma: ApplicationRepositoryPrismaClient) {
  return {
    async create(input: CreateApplicationInput): Promise<JobApplication> {
      const data = createApplicationSchema.parse(input);

      const createData: Prisma.JobApplicationCreateInput = {
        company: data.company,
        role: data.role,
        jobUrl: data.jobUrl ?? null,
        source: data.source ?? null,
        location: data.location ?? null,
        workMode: data.workMode,
        status: data.status,
        dateApplied: toDate(data.dateApplied) ?? null,
        nextActionDate: toDate(data.nextActionDate) ?? null,
        stacks: data.stacks,
        notes: data.notes ?? null,
      };

      const created = await prisma.jobApplication.create({
        data: createData,
      });

      return toDomainApplication(created);
    },

    async findMany(filters: ApplicationFilters = {}): Promise<JobApplication[]> {
      const applications = await prisma.jobApplication.findMany({
        orderBy: [{ createdAt: 'desc' }, { company: 'asc' }],
      });

      return filterApplications(applications.map(toDomainApplication), filters);
    },
  };
}

export type ApplicationRepository = ReturnType<typeof createApplicationRepository>;
export type CreateApplicationRepositoryInput = Prisma.JobApplicationCreateInput;
