import type { Prisma, JobApplication as PrismaJobApplication } from '@prisma/client';

import { filterApplications, type ApplicationFilters } from './application.filters.js';
import {
  createApplicationSchema,
  updateApplicationSchema,
  type CreateApplicationInput,
  type JobApplication,
  type UpdateApplicationData,
  type UpdateApplicationInput,
} from './application.schema.js';
import type { AppPrismaClient } from '../../prisma/client.js';

type ApplicationModel = AppPrismaClient['jobApplication'];

type ApplicationRepositoryPrismaClient = {
  jobApplication: Pick<
    ApplicationModel,
    'create' | 'findMany' | 'findUnique' | 'update' | 'deleteMany'
  >;
};

const toDate = (value: string | undefined) => {
  if (value === undefined) {
    return undefined;
  }

  return new Date(`${value}T00:00:00.000Z`);
};

const toNullableDate = (value: string | null | undefined) => {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  return new Date(`${value}T00:00:00.000Z`);
};

const toDateOnly = (value: Date | null) => value?.toISOString().slice(0, 10) ?? undefined;

const hasOwnKey = <TObject extends object>(object: TObject, key: keyof TObject) =>
  Object.prototype.hasOwnProperty.call(object, key);

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

const toCreateData = (input: CreateApplicationInput): Prisma.JobApplicationCreateInput => {
  const data = createApplicationSchema.parse(input);

  return {
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
};

const toUpdateData = (data: UpdateApplicationData): Prisma.JobApplicationUpdateInput => {
  const updateData: Prisma.JobApplicationUpdateInput = {};

  if (data.company !== undefined) {
    updateData.company = data.company;
  }

  if (data.role !== undefined) {
    updateData.role = data.role;
  }

  if (hasOwnKey(data, 'jobUrl')) {
    updateData.jobUrl = data.jobUrl === undefined ? null : data.jobUrl;
  }

  if (hasOwnKey(data, 'source')) {
    updateData.source = data.source === undefined ? null : data.source;
  }

  if (hasOwnKey(data, 'location')) {
    updateData.location = data.location === undefined ? null : data.location;
  }

  if (data.workMode !== undefined) {
    updateData.workMode = data.workMode;
  }

  if (data.status !== undefined) {
    updateData.status = data.status;
  }

  if (hasOwnKey(data, 'dateApplied')) {
    const dateApplied = toNullableDate(data.dateApplied);
    updateData.dateApplied = dateApplied === undefined ? null : dateApplied;
  }

  if (hasOwnKey(data, 'nextActionDate')) {
    const nextActionDate = toNullableDate(data.nextActionDate);
    updateData.nextActionDate = nextActionDate === undefined ? null : nextActionDate;
  }

  if (data.stacks !== undefined) {
    updateData.stacks = data.stacks;
  }

  if (hasOwnKey(data, 'notes')) {
    updateData.notes = data.notes === undefined ? null : data.notes;
  }

  return updateData;
};

export function createApplicationRepository(prisma: ApplicationRepositoryPrismaClient) {
  return {
    async create(input: CreateApplicationInput): Promise<JobApplication> {
      const created = await prisma.jobApplication.create({
        data: toCreateData(input),
      });

      return toDomainApplication(created);
    },

    async findMany(filters: ApplicationFilters = {}): Promise<JobApplication[]> {
      const applications = await prisma.jobApplication.findMany({
        orderBy: [{ createdAt: 'desc' }, { company: 'asc' }],
      });

      return filterApplications(applications.map(toDomainApplication), filters);
    },

    async findById(id: string): Promise<JobApplication | null> {
      const application = await prisma.jobApplication.findUnique({ where: { id } });

      return application === null ? null : toDomainApplication(application);
    },

    async update(id: string, input: UpdateApplicationInput): Promise<JobApplication | null> {
      const existing = await prisma.jobApplication.findUnique({ where: { id } });

      if (existing === null) {
        return null;
      }

      const data = updateApplicationSchema.parse(input);
      const updated = await prisma.jobApplication.update({
        where: { id },
        data: toUpdateData(data),
      });

      return toDomainApplication(updated);
    },

    async delete(id: string): Promise<boolean> {
      const result = await prisma.jobApplication.deleteMany({ where: { id } });

      return result.count > 0;
    },
  };
}

export type ApplicationRepository = ReturnType<typeof createApplicationRepository>;
export type CreateApplicationRepositoryInput = Prisma.JobApplicationCreateInput;
