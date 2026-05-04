import type { ApplicationStatus, WorkMode } from './application.types';

export type ApplicationFilterState = {
  status: ApplicationStatus | 'all';
  workMode: WorkMode | 'all';
  stack: string;
  search: string;
};

export const emptyApplicationFilters: ApplicationFilterState = {
  status: 'all',
  workMode: 'all',
  stack: '',
  search: '',
};

export function buildApplicationQueryString(filters: ApplicationFilterState) {
  const params = new URLSearchParams();

  if (filters.status !== 'all') {
    params.set('status', filters.status);
  }

  if (filters.workMode !== 'all') {
    params.set('workMode', filters.workMode);
  }

  const stack = filters.stack.trim();
  if (stack !== '') {
    params.set('stack', stack);
  }

  const search = filters.search.trim();
  if (search !== '') {
    params.set('search', search);
  }

  return params.toString();
}

export function hasActiveApplicationFilters(filters: ApplicationFilterState) {
  return buildApplicationQueryString(filters) !== '';
}
