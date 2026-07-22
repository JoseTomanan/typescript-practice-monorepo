import { formatDisplayDate, toDateInputValue } from './DateFormat';

describe('formatDisplayDate', () => {
  it('formats a Date instance using the locale date string', () => {
    const date = new Date('2026-07-22T10:00:00.000Z');
    expect(formatDisplayDate(date)).toBe(date.toLocaleDateString());
  });

  it('formats an ISO date string the same way as a Date instance', () => {
    const iso = '2026-07-22T10:00:00.000Z';
    expect(formatDisplayDate(iso)).toBe(new Date(iso).toLocaleDateString());
  });
});

describe('toDateInputValue', () => {
  it('extracts the YYYY-MM-DD prefix from an ISO date string', () => {
    expect(toDateInputValue('2026-07-22T10:00:00.000Z')).toBe('2026-07-22');
  });

  it('returns undefined when no date is given', () => {
    expect(toDateInputValue(undefined)).toBeUndefined();
  });
});
