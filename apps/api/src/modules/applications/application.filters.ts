import type { ApplicationStatus, JobApplication, WorkMode } from './application.schema.js';

export type ApplicationFilters = {
  status?: ApplicationStatus;
  workMode?: WorkMode;
  stack?: string;
  search?: string;
};

const normalize = (value: string | undefined) => {
  const normalized = value?.trim().toLocaleLowerCase('pt-BR');

  return normalized === '' ? undefined : normalized;
};

export function filterApplications(
  applications: readonly JobApplication[],
  filters: ApplicationFilters = {},
): JobApplication[] {
  const stack = normalize(filters.stack);
  const search = normalize(filters.search);

  return applications.filter((application) => {
    if (filters.status !== undefined && application.status !== filters.status) {
      return false;
    }

    if (filters.workMode !== undefined && application.workMode !== filters.workMode) {
      return false;
    }

    if (
      stack !== undefined &&
      !application.stacks.some((applicationStack) => normalize(applicationStack) === stack)
    ) {
      return false;
    }

    if (search !== undefined) {
      const company = normalize(application.company) ?? '';
      const role = normalize(application.role) ?? '';

      return company.includes(search) || role.includes(search);
    }

    return true;
  });
}
