import { describe, expect, it } from 'vitest';

import { buildApplicationQueryString, hasActiveApplicationFilters } from './applicationFilters';

describe('application filters', () => {
  it('serializes only active filters for the API query string', () => {
    const query = buildApplicationQueryString({
      status: 'applied',
      workMode: 'remote',
      stack: ' React ',
      search: ' front ',
    });

    expect(query).toBe('status=applied&workMode=remote&stack=React&search=front');
  });

  it('omits blank filters and all-status/all-mode selections', () => {
    const query = buildApplicationQueryString({
      status: 'all',
      workMode: 'all',
      stack: '   ',
      search: '',
    });

    expect(query).toBe('');
    expect(hasActiveApplicationFilters({ status: 'all', workMode: 'all', stack: '', search: '' })).toBe(
      false,
    );
  });
});
