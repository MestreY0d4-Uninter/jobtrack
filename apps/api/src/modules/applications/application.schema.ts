import { z } from 'zod';

export const applicationStatuses = [
  'interested',
  'applied',
  'interview',
  'offer',
  'rejected',
  'archived',
] as const;

export const workModes = ['remote', 'hybrid', 'onsite', 'unknown'] as const;

export const applicationStatusSchema = z.enum(applicationStatuses);
export const workModeSchema = z.enum(workModes);

const emptyStringToUndefined = (value: unknown) => {
  if (typeof value === 'string' && value.trim() === '') {
    return undefined;
  }

  return value;
};

const emptyStringToNull = (value: unknown) => {
  if (typeof value === 'string' && value.trim() === '') {
    return null;
  }

  return value;
};

const optionalText = (maxLength: number) =>
  z.preprocess(emptyStringToUndefined, z.string().trim().max(maxLength).optional());

const clearableText = (maxLength: number) =>
  z.preprocess(emptyStringToNull, z.string().trim().max(maxLength).nullable().optional());

const optionalUrl = z.preprocess(
  emptyStringToUndefined,
  z.string().trim().url().max(500).optional(),
);

const clearableUrl = z.preprocess(
  emptyStringToNull,
  z.string().trim().url().max(500).nullable().optional(),
);

const isValidIsoDate = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return false;
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

export const isoDateStringSchema = z
  .string()
  .refine(isValidIsoDate, 'Expected a valid ISO date in YYYY-MM-DD format');

const optionalIsoDate = z.preprocess(emptyStringToUndefined, isoDateStringSchema.optional());

const clearableIsoDate = z.preprocess(emptyStringToNull, isoDateStringSchema.nullable().optional());

const stackSchema = z.string().trim().min(1).max(40);

export const createApplicationSchema = z.object({
  company: z.string().trim().min(2).max(120),
  role: z.string().trim().min(2).max(160),
  jobUrl: optionalUrl,
  source: optionalText(80),
  location: optionalText(120),
  workMode: workModeSchema.default('unknown'),
  status: applicationStatusSchema.default('interested'),
  dateApplied: optionalIsoDate,
  nextActionDate: optionalIsoDate,
  stacks: z.array(stackSchema).max(12).default([]),
  notes: optionalText(2000),
});

export const updateApplicationSchema = z
  .object({
    company: z.string().trim().min(2).max(120).optional(),
    role: z.string().trim().min(2).max(160).optional(),
    jobUrl: clearableUrl,
    source: clearableText(80),
    location: clearableText(120),
    workMode: workModeSchema.optional(),
    status: applicationStatusSchema.optional(),
    dateApplied: clearableIsoDate,
    nextActionDate: clearableIsoDate,
    stacks: z.array(stackSchema).max(12).optional(),
    notes: clearableText(2000),
  })
  .refine((value) => Object.keys(value).length > 0, 'Expected at least one field to update');

export const jobApplicationSchema = createApplicationSchema.extend({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type ApplicationStatus = z.infer<typeof applicationStatusSchema>;
export type WorkMode = z.infer<typeof workModeSchema>;
export type CreateApplicationInput = z.input<typeof createApplicationSchema>;
export type CreateApplicationData = z.output<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.input<typeof updateApplicationSchema>;
export type UpdateApplicationData = z.output<typeof updateApplicationSchema>;
export type JobApplication = z.infer<typeof jobApplicationSchema>;
