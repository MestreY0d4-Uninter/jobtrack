import type { JobTrackApi } from './client';
import { emptyApplicationFilters, type ApplicationFilterState } from '../features/applications/applicationFilters';
import {
  applicationStatuses,
  type CreateApplicationPayload,
  type JobApplication,
  type UpdateApplicationPayload,
} from '../features/applications/application.types';
import type { DashboardSummary } from '../features/dashboard/dashboard.types';

const demoToday = '2026-05-04';

const demoApplications: JobApplication[] = [
  {
    id: '2f8d8de1-50fc-4c3f-b9f3-1040b68fb818',
    company: 'Curitiba Web Studio',
    role: 'Desenvolvedor Front-end',
    jobUrl: 'https://example.com/jobs/frontend-developer',
    source: 'LinkedIn',
    location: 'Curitiba, PR',
    workMode: 'hybrid',
    status: 'applied',
    dateApplied: '2026-05-01',
    nextActionDate: '2026-05-08',
    stacks: ['React', 'TypeScript', 'CSS'],
    notes: 'Revisar retorno e registrar próximos passos após o contato inicial.',
    createdAt: '2026-05-01T12:00:00.000Z',
    updatedAt: '2026-05-01T12:00:00.000Z',
  },
  {
    id: '5cf45f09-f8a9-4983-bab5-6bbbf8318a51',
    company: 'Remote Systems Brasil',
    role: 'Desenvolvedor Back-end Node.js',
    jobUrl: 'https://example.com/jobs/backend-developer',
    source: 'Programathor',
    location: 'Remoto Brasil',
    workMode: 'remote',
    status: 'interested',
    nextActionDate: '2026-05-10',
    stacks: ['Node.js', 'Fastify', 'PostgreSQL'],
    notes: 'Conferir requisitos de API, banco de dados e rotina de deploy.',
    createdAt: '2026-05-02T12:00:00.000Z',
    updatedAt: '2026-05-02T12:00:00.000Z',
  },
  {
    id: 'd8620702-881d-4776-aa96-4523b92fe511',
    company: 'Office Tech Solutions',
    role: 'Analista de Sistemas Internos',
    source: 'Site da empresa',
    location: 'Curitiba, PR',
    workMode: 'onsite',
    status: 'interview',
    dateApplied: '2026-04-28',
    nextActionDate: '2026-05-05',
    stacks: ['React', 'JavaScript', 'SQL'],
    notes: 'Preparar perguntas sobre sustentação, prioridades e fluxo da equipe.',
    createdAt: '2026-04-28T12:00:00.000Z',
    updatedAt: '2026-05-03T12:00:00.000Z',
  },
  {
    id: '9d2a36a5-4e2b-49fb-8af1-0ef0f87cf447',
    company: 'Product Platform Lab',
    role: 'Desenvolvedor Full-stack TypeScript',
    source: 'Indicação interna',
    location: 'Remoto Brasil',
    workMode: 'remote',
    status: 'offer',
    dateApplied: '2026-04-22',
    nextActionDate: '2026-05-06',
    stacks: ['React', 'TypeScript', 'PostgreSQL'],
    notes: 'Comparar responsabilidades, modalidade de trabalho e evolução técnica.',
    createdAt: '2026-04-22T12:00:00.000Z',
    updatedAt: '2026-05-04T12:00:00.000Z',
  },
];

const cloneApplication = (application: JobApplication): JobApplication => ({
  ...application,
  stacks: [...application.stacks],
});

const textMatches = (application: JobApplication, search: string) => {
  const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR');

  if (normalizedSearch === '') {
    return true;
  }

  return [
    application.company,
    application.role,
    application.location ?? '',
    application.source ?? '',
    application.notes ?? '',
    ...application.stacks,
  ]
    .join(' ')
    .toLocaleLowerCase('pt-BR')
    .includes(normalizedSearch);
};

const stackMatches = (application: JobApplication, stack: string) => {
  const normalizedStack = stack.trim().toLocaleLowerCase('pt-BR');

  if (normalizedStack === '') {
    return true;
  }

  return application.stacks.some((applicationStack) =>
    applicationStack.toLocaleLowerCase('pt-BR').includes(normalizedStack),
  );
};

const filterApplications = (applications: JobApplication[], filters: ApplicationFilterState) =>
  applications.filter((application) => {
    if (filters.status !== 'all' && application.status !== filters.status) {
      return false;
    }

    if (filters.workMode !== 'all' && application.workMode !== filters.workMode) {
      return false;
    }

    if (!stackMatches(application, filters.stack)) {
      return false;
    }

    return textMatches(application, filters.search);
  });

const addDays = (dateOnly: string, days: number) => {
  const date = new Date(`${dateOnly}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);

  return date.toISOString().slice(0, 10);
};

const createDashboardSummary = (applications: JobApplication[]): DashboardSummary => {
  const statusCounts = Object.fromEntries(applicationStatuses.map((status) => [status, 0])) as DashboardSummary['statusCounts'];
  const stackCounts = new Map<string, { stack: string; count: number }>();
  const nextSevenDays = addDays(demoToday, 7);

  for (const application of applications) {
    statusCounts[application.status] += 1;

    for (const rawStack of application.stacks) {
      const stack = rawStack.trim();
      const key = stack.toLocaleLowerCase('pt-BR');

      if (stack === '') {
        continue;
      }

      const current = stackCounts.get(key);
      if (current === undefined) {
        stackCounts.set(key, { stack, count: 1 });
      } else {
        current.count += 1;
      }
    }
  }

  return {
    total: applications.length,
    statusCounts,
    upcomingActions: applications
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
        isOverdue: application.nextActionDate < demoToday,
      }))
      .sort((left, right) => left.nextActionDate.localeCompare(right.nextActionDate)),
    frequentStacks: [...stackCounts.values()].sort((left, right) => {
      if (right.count !== left.count) {
        return right.count - left.count;
      }

      return left.stack.localeCompare(right.stack, 'pt-BR');
    }),
  };
};

const makeApplication = (payload: CreateApplicationPayload, id: string): JobApplication => {
  const now = new Date().toISOString();

  return {
    id,
    company: payload.company,
    role: payload.role,
    jobUrl: payload.jobUrl === '' ? undefined : payload.jobUrl,
    source: payload.source === '' ? undefined : payload.source,
    location: payload.location === '' ? undefined : payload.location,
    workMode: payload.workMode ?? 'unknown',
    status: payload.status ?? 'interested',
    dateApplied: payload.dateApplied === '' ? undefined : payload.dateApplied,
    nextActionDate: payload.nextActionDate === '' ? undefined : payload.nextActionDate,
    stacks: payload.stacks ?? [],
    notes: payload.notes === '' ? undefined : payload.notes,
    createdAt: now,
    updatedAt: now,
  };
};

export function createDemoJobTrackApiClient(initialApplications = demoApplications): JobTrackApi {
  let applications = initialApplications.map(cloneApplication);
  let nextId = 1;

  return {
    async listApplications(filters = emptyApplicationFilters) {
      return filterApplications(applications, filters).map(cloneApplication);
    },

    async getDashboardSummary() {
      return createDashboardSummary(applications);
    },

    async createApplication(payload) {
      const application = makeApplication(payload, `demo-${nextId}`);
      nextId += 1;
      applications = [application, ...applications];

      return cloneApplication(application);
    },

    async updateApplication(id, payload: UpdateApplicationPayload) {
      const existing = applications.find((application) => application.id === id);

      if (existing === undefined) {
        throw new Error('not_found');
      }

      const updated: JobApplication = {
        ...existing,
        ...payload,
        jobUrl: payload.jobUrl === '' ? undefined : (payload.jobUrl ?? existing.jobUrl),
        source: payload.source === '' ? undefined : (payload.source ?? existing.source),
        location: payload.location === '' ? undefined : (payload.location ?? existing.location),
        dateApplied: payload.dateApplied === '' ? undefined : (payload.dateApplied ?? existing.dateApplied),
        nextActionDate:
          payload.nextActionDate === '' ? undefined : (payload.nextActionDate ?? existing.nextActionDate),
        notes: payload.notes === '' ? undefined : (payload.notes ?? existing.notes),
        stacks: payload.stacks ?? existing.stacks,
        updatedAt: new Date().toISOString(),
      };

      applications = applications.map((application) => (application.id === id ? updated : application));

      return cloneApplication(updated);
    },

    async deleteApplication(id) {
      applications = applications.filter((application) => application.id !== id);
    },
  };
}
