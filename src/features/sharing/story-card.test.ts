import { describe, expect, it } from 'vitest';
import type { LibraryEntry } from '../library/library.types';
import {
  formatHoursPlayed,
  storyCardDataFromEntry,
  storyFileName,
} from './story-card';

const entry = {
  id: 'entry',
  status: 'COMPLETED',
  hoursPlayed: 42,
  startedAt: null,
  completedAt: null,
  createdAt: '',
  updatedAt: '',
  game: {
    id: 'game',
    slug: 'celeste',
    title: 'Celeste',
    coverUrl: 'https://example.com/cover.jpg',
    releaseDate: null,
    genres: [],
    platforms: [],
  },
  review: { id: 'review', rating: 9, starRating: 4.5 },
} satisfies LibraryEntry;

describe('storyCardDataFromEntry', () => {
  it('creates story data for a completed and rated game', () => {
    expect(storyCardDataFromEntry(entry, 'maddy')).toEqual({
      title: 'Celeste',
      coverUrl: 'https://example.com/cover.jpg',
      rating: 9,
      starRating: 4.5,
      hoursPlayed: 42,
      username: 'maddy',
    });
  });

  it('rejects games that are not completed or rated', () => {
    expect(
      storyCardDataFromEntry({ ...entry, status: 'PLAYING' }, 'maddy'),
    ).toBeNull();
    expect(
      storyCardDataFromEntry({ ...entry, review: null }, 'maddy'),
    ).toBeNull();
  });
});

describe('story card formatting', () => {
  it('formats hours in Portuguese', () => {
    expect(formatHoursPlayed(1)).toBe('1 hora');
    expect(formatHoursPlayed(1200)).toBe('1.200 horas');
  });

  it('creates a safe file name', () => {
    expect(storyFileName('Pokémon: Blue/Red')).toBe(
      'pokemon-blue-red-game-tracker.png',
    );
  });
});
