import { describe, expect, it } from 'vitest';
import {
  changeFormStatus,
  toEntryChanges,
  validateFormValues,
  type LibraryEntryFormValues,
} from './library-entry-form';

const TODAY = '2026-09-30';

const playing: LibraryEntryFormValues = {
  status: 'PLAYING',
  hoursPlayed: '12',
  startedAt: '2026-09-01',
  completedAt: '',
};

describe('validateFormValues', () => {
  it.each(['', '-1', '1.5', 'abc', '100001'])(
    'rejects %j hours played',
    (hoursPlayed) => {
      expect(validateFormValues({ ...playing, hoursPlayed })).toHaveProperty(
        'hoursPlayed',
      );
    },
  );

  it('accepts a valid entry', () => {
    expect(validateFormValues(playing)).toEqual({});
  });

  it('rejects a completion date earlier than the start date', () => {
    expect(
      validateFormValues({
        ...playing,
        status: 'COMPLETED',
        completedAt: '2026-08-31',
      }),
    ).toHaveProperty('completedAt');
  });
});

describe('changeFormStatus', () => {
  it('fills and later clears the completion date as the status changes', () => {
    const completed = changeFormStatus(playing, 'COMPLETED', TODAY);
    expect(completed.completedAt).toBe(TODAY);

    const backToPlaying = changeFormStatus(completed, 'PLAYING', TODAY);
    expect(backToPlaying.completedAt).toBe('');
    expect(backToPlaying.startedAt).toBe('2026-09-01');
  });
});

describe('toEntryChanges', () => {
  it('sends empty dates as null and hours as a number', () => {
    expect(toEntryChanges({ ...playing, startedAt: '' })).toEqual({
      status: 'PLAYING',
      hoursPlayed: 12,
      startedAt: null,
      completedAt: null,
    });
  });
});
