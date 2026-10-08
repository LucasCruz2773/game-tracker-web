import { describe, expect, it } from 'vitest';
import { formatIsoDate, formatReviewDate, todayIsoDate } from './dates';

describe('todayIsoDate', () => {
  it('uses the local calendar day, not the UTC one', () => {
    // 22:30 local time: in Brazil (UTC-3) the UTC date is already the next day.
    const lateEvening = new Date(2026, 8, 30, 22, 30);

    expect(todayIsoDate(lateEvening)).toBe('2026-09-30');
  });

  it('pads single-digit months and days', () => {
    expect(todayIsoDate(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});

describe('formatReviewDate', () => {
  it('formats timestamps in pt-BR', () => {
    expect(formatReviewDate('2026-09-30T15:00:00.000Z')).toMatch(
      /30 de set\.? de 2026/,
    );
  });
});

describe('formatIsoDate', () => {
  it('formats the calendar day without shifting it by time zone', () => {
    expect(formatIsoDate('2018-01-25')).toMatch(/^25 de jan\.? de 2018$/);
  });

  it('returns unexpected values unchanged', () => {
    expect(formatIsoDate('soon')).toBe('soon');
  });
});
