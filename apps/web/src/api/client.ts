import { buildApplicationQueryString, type ApplicationFilterState } from '../features/applications/applicationFilters';
import type {
  CreateApplicationPayload,
  JobApplication,
  UpdateApplicationPayload,
} from '../features/applications/application.types';
import type { DashboardSummary } from '../features/dashboard/dashboard.types';

type ApiClientOptions = {
  baseUrl?: string;
  fetchFn?: typeof fetch;
};

type ApiIssue = {
  path?: string;
  message?: string;
};

type ApiErrorBody = {
  error?: string;
  issues?: ApiIssue[];
  message?: string;
};

type ListApplicationsResponse = {
  data: JobApplication[];
};

const defaultBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api';

const normalizeBaseUrl = (baseUrl: string) => baseUrl.replace(/\/$/, '');

const getErrorMessage = async (response: Response) => {
  let body: ApiErrorBody | undefined;

  try {
    body = (await response.json()) as ApiErrorBody;
  } catch {
    body = undefined;
  }

  if (body?.issues !== undefined && body.issues.length > 0) {
    return body.issues
      .map((issue) => {
        if (issue.path !== undefined && issue.path !== '') {
          return `${issue.path}: ${issue.message ?? 'erro de validação'}`;
        }

        return issue.message ?? 'erro de validação';
      })
      .join('; ');
  }

  if (body?.message !== undefined) {
    return body.message;
  }

  if (body?.error !== undefined) {
    return body.error;
  }

  return `Erro HTTP ${response.status}`;
};

export function createJobTrackApiClient(options: ApiClientOptions = {}) {
  const baseUrl = normalizeBaseUrl(options.baseUrl ?? defaultBaseUrl);
  const fetchImpl = options.fetchFn;

  const request = async <TResponse>(path: string, init: RequestInit): Promise<TResponse> => {
    const response = await (fetchImpl ?? globalThis.fetch)(`${baseUrl}${path}`, init);

    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }

    if (response.status === 204) {
      return undefined as TResponse;
    }

    return (await response.json()) as TResponse;
  };

  return {
    async listApplications(filters: ApplicationFilterState): Promise<JobApplication[]> {
      const query = buildApplicationQueryString(filters);
      const response = await request<ListApplicationsResponse>(
        `/applications${query === '' ? '' : `?${query}`}`,
        { method: 'GET' },
      );

      return response.data;
    },

    async getDashboardSummary(): Promise<DashboardSummary> {
      return request<DashboardSummary>('/dashboard/summary', { method: 'GET' });
    },

    async createApplication(payload: CreateApplicationPayload): Promise<JobApplication> {
      return request<JobApplication>('/applications', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
    },

    async updateApplication(id: string, payload: UpdateApplicationPayload): Promise<JobApplication> {
      return request<JobApplication>(`/applications/${id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
    },

    async deleteApplication(id: string): Promise<void> {
      await request<void>(`/applications/${id}`, { method: 'DELETE' });
    },
  };
}

export const jobTrackApi = createJobTrackApiClient();
