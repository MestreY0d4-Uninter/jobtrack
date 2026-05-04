import type { ApplicationStatus } from '../applications/application.types';

export type UpcomingAction = {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  nextActionDate: string;
  isOverdue: boolean;
};

export type FrequentStack = {
  stack: string;
  count: number;
};

export type DashboardSummary = {
  total: number;
  statusCounts: Record<ApplicationStatus, number>;
  upcomingActions: UpcomingAction[];
  frequentStacks: FrequentStack[];
};
