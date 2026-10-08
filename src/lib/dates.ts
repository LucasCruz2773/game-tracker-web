/** A calendar date in the `YYYY-MM-DD` format, as exchanged with the API. */
export type IsoDate = string;

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

const longDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

/** Today in the user's time zone (the API's "today" would be UTC). */
export function todayIsoDate(now: Date = new Date()): IsoDate {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatIsoDate(isoDate: IsoDate): string {
  const match = ISO_DATE_PATTERN.exec(isoDate);
  if (!match) {
    return isoDate;
  }
  const [, year, month, day] = match;
  // Formatting in UTC keeps the calendar day from shifting with the local time zone.
  return longDateFormatter.format(
    new Date(Date.UTC(Number(year), Number(month) - 1, Number(day))),
  );
}

export function isoDateYear(isoDate: IsoDate): string {
  return isoDate.slice(0, 4);
}

const reviewDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

/** Formats an ISO timestamp from the API in the user's local time zone. */
export function formatReviewDate(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  return Number.isNaN(date.getTime())
    ? isoTimestamp
    : reviewDateFormatter.format(date);
}
