import { describe, expect, it } from 'vitest';
import { parseGameOrdering } from './games.types';

describe('parseGameOrdering', () => {
  it.each(['relevance', 'popularity', 'rating', 'name', 'released'] as const)(
    'accepts %s',
    (ordering) => {
      expect(parseGameOrdering(ordering)).toBe(ordering);
    },
  );

  it('falls back to relevance for missing or unknown values', () => {
    expect(parseGameOrdering(null)).toBe('relevance');
    expect(parseGameOrdering('unknown')).toBe('relevance');
  });
});
