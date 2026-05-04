import {
  applicationStatuses,
  type ApplicationStatus,
  type JobApplication,
} from '../applications/application.schema.js';

type UpcomingAction = Pick<
  JobApplication,
  'id' | 'company' | 'role' | 'status' | 'nextActionDate'
> & {
  nextActionDate: string;
  isOverdue: boolean;
};

type FrequentStack = {
  stack: string;
  count: number;
};

export type DashboardSummary = {
  total: number;
  statusCounts: Record<ApplicationStatus, number>;
  upcomingActions: UpcomingAction[];
  frequentStacks: FrequentStack[];
};

export type DashboardSummaryOptions = {
  today?: string;
};

const toDateOnly = (date: Date) => date.toISOString().slice(0, 10);

const addDays = (dateOnly: string, days: number) => {
  const date = new Date(`${dateOnly}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);

  return toDateOnly(date);
};

const normalizeStack = (stack: string) => stack.trim().toLocaleLowerCase('pt-BR');

const createEmptyStatusCounts = () =>
  Object.fromEntries(applicationStatuses.map((status) => [status, 0])) as Record<
    ApplicationStatus,
    number
  >;

export function buildDashboardSummary(
  applications: readonly JobApplication[],
  options: DashboardSummaryOptions = {},
): DashboardSummary {
  const today = options.today ?? toDateOnly(new Date());
  const nextSevenDays = addDays(today, 7);
  const statusCounts = createEmptyStatusCounts();
  const stackCounts = new Map<string, FrequentStack>();

  for (const application of applications) {
    statusCounts[application.status] += 1;

    for (const rawStack of application.stacks) {
      const stack = rawStack.trim();

      if (stack === '') {
        continue;
      }

      const key = normalizeStack(stack);
      const current = stackCounts.get(key);

      if (current === undefined) {
        stackCounts.set(key, { stack, count: 1 });
      } else {
        current.count += 1;
      }
    }
  }

  const upcomingActions = applications
    .filter(
      (application): application is JobApplication & { nextActionDate: string } =>
        application.nextActionDate !== undefined && application.nextActionDate <= nextSevenDays,
    )
    .map((application) => ({
      id: application.id,
      company: application.company,
      role: application.role,
      status: application.status,
      nextActionDate: application.nextActionDate,
      isOverdue: application.nextActionDate < today,
    }))
    .sort((left, right) => {
      const dateOrder = left.nextActionDate.localeCompare(right.nextActionDate);

      if (dateOrder !== 0) {
        return dateOrder;
      }

      return left.company.localeCompare(right.company, 'pt-BR');
    });

  const frequentStacks = [...stackCounts.values()].sort((left, right) => {
    if (right.count !== left.count) {
      return right.count - left.count;
    }

    return left.stack.localeCompare(right.stack, 'pt-BR');
  });

  return {
    total: applications.length,
    statusCounts,
    upcomingActions,
    frequentStacks,
  };
}
