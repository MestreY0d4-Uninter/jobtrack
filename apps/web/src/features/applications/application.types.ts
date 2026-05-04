export const applicationStatuses = [
  'interested',
  'applied',
  'interview',
  'offer',
  'rejected',
  'archived',
] as const;

export const workModes = ['remote', 'hybrid', 'onsite', 'unknown'] as const;

export type ApplicationStatus = (typeof applicationStatuses)[number];
export type WorkMode = (typeof workModes)[number];

export type JobApplication = {
  id: string;
  company: string;
  role: string;
  jobUrl?: string;
  source?: string;
  location?: string;
  workMode: WorkMode;
  status: ApplicationStatus;
  dateApplied?: string;
  nextActionDate?: string;
  stacks: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateApplicationPayload = {
  company: string;
  role: string;
  jobUrl?: string;
  source?: string;
  location?: string;
  workMode?: WorkMode;
  status?: ApplicationStatus;
  dateApplied?: string;
  nextActionDate?: string;
  stacks?: string[];
  notes?: string;
};

export type UpdateApplicationPayload = Partial<CreateApplicationPayload>;

export const statusLabels: Record<ApplicationStatus, string> = {
  interested: 'Interesse',
  applied: 'Aplicado',
  interview: 'Entrevista',
  offer: 'Oferta',
  rejected: 'Recusado',
  archived: 'Arquivado',
};

export const workModeLabels: Record<WorkMode, string> = {
  remote: 'Remoto',
  hybrid: 'Híbrido',
  onsite: 'Presencial',
  unknown: 'Não informado',
};
