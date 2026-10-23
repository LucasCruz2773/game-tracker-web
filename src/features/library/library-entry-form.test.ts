import { describe, expect, it } from 'vitest';
import {
  toEntryChanges,
  validateFormValues,
  type LibraryEntryFormValues,
} from './library-entry-form';

const playing: LibraryEntryFormValues = {
  status: 'PLAYING',
  hoursPlayed: '12',
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
});

describe('toEntryChanges', () => {
  it('sends status and hours as a number', () => {
    expect(toEntryChanges(playing)).toEqual({
      status: 'PLAYING',
      hoursPlayed: 12,
    });
  });
});
