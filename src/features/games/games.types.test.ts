import { describe, expect, it } from 'vitest';
import {
  defaultGameSortDirection,
  parseGameGenre,
  parseGameOrdering,
  parseGameSortDirection,
} from './games.types';

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

describe('parseGameGenre', () => {
  it('accepts known RAWG genre slugs', () => {
    expect(parseGameGenre('action')).toBe('action');
    expect(parseGameGenre('role-playing-games-rpg')).toBe(
      'role-playing-games-rpg',
    );
  });

  it('ignores missing or unknown genres', () => {
    expect(parseGameGenre(null)).toBeUndefined();
    expect(parseGameGenre('unknown')).toBeUndefined();
  });
});

describe('game sort direction', () => {
  it('uses field-appropriate defaults', () => {
    expect(defaultGameSortDirection('name')).toBe('asc');
    expect(defaultGameSortDirection('rating')).toBe('desc');
  });

  it('accepts explicit directions and rejects unknown values', () => {
    expect(parseGameSortDirection('asc', 'rating')).toBe('asc');
    expect(parseGameSortDirection('desc', 'name')).toBe('desc');
    expect(parseGameSortDirection('sideways', 'name')).toBe('asc');
  });
});
