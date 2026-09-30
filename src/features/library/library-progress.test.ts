import { describe, expect, it } from 'vitest';
import { applyStatusChange, validateLibraryProgress } from './library-progress';
import type { LibraryProgress } from './library.types';

const TODAY = '2026-09-30';

const backlog: LibraryProgress = {
  status: 'BACKLOG',
  startedAt: null,
  completedAt: null,
};

describe('applyStatusChange', () => {
  it('starts today when a new game is added as PLAYING', () => {
    expect(applyStatusChange(null, 'PLAYING', TODAY)).toEqual({
      status: 'PLAYING',
      startedAt: TODAY,
      completedAt: null,
    });
  });

  it('keeps the start date the user already had', () => {
    const dropped: LibraryProgress = {
      status: 'DROPPED',
      startedAt: '2026-01-10',
      completedAt: null,
    };

    expect(applyStatusChange(dropped, 'PLAYING', TODAY)).toMatchObject({
      startedAt: '2026-01-10',
    });
  });

  it('completes today without inventing a start date', () => {
    expect(applyStatusChange(backlog, 'COMPLETED', TODAY)).toEqual({
      status: 'COMPLETED',
      startedAt: null,
      completedAt: TODAY,
    });
  });

  it('keeps an existing completion date when it stays COMPLETED', () => {
    const completed: LibraryProgress = {
      status: 'COMPLETED',
      startedAt: '2026-01-10',
      completedAt: '2026-02-01',
    };

    expect(applyStatusChange(completed, 'COMPLETED', TODAY)).toEqual(completed);
  });

  it('clears the completion date when leaving COMPLETED', () => {
    const completed: LibraryProgress = {
      status: 'COMPLETED',
      startedAt: '2026-01-10',
      completedAt: '2026-02-01',
    };

    expect(applyStatusChange(completed, 'PLAYING', TODAY)).toEqual({
      status: 'PLAYING',
      startedAt: '2026-01-10',
      completedAt: null,
    });
  });
});

describe('validateLibraryProgress', () => {
  it('accepts a completion on the same day it started', () => {
    expect(
      validateLibraryProgress({
        status: 'COMPLETED',
        startedAt: TODAY,
        completedAt: TODAY,
      }),
    ).toBeNull();
  });

  it('rejects a completion before the start', () => {
    expect(
      validateLibraryProgress({
        status: 'COMPLETED',
        startedAt: '2026-03-01',
        completedAt: '2026-02-28',
      }),
    ).toBe('completed_before_started');
  });

  it('rejects a completion date on a game that is not COMPLETED', () => {
    expect(validateLibraryProgress({ ...backlog, completedAt: TODAY })).toBe(
      'completed_without_status',
    );
  });
});
