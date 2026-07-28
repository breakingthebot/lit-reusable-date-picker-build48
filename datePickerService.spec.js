// datePickerService.spec.js
// Unit tests for Lit Custom Date Picker Service.
// Created: 2026-07-28

import { describe, it, expect } from 'vitest';
import {
  getDaysInMonth,
  getFirstDayOfWeek,
  getNextMonth,
  getSampleEvents,
  getLocaleTranslations,
  getRelativePresets,
  getYearOptions,
  getThemePresets,
  createAnalyticsTracker,
  generateIcsFile,
  generateGoogleCalendarUrl,
  validateFormAssociation,
  formatDate,
  formatDateTime,
  validateTime,
  parseDateToIso,
  generateCalendarGrid,
  getPresetRanges,
  validateDateRange,
  getFrameworkSnippet,
  getKeyboardNavigationDate
} from './datePickerService.js';

describe('datePickerService', () => {
  it('calculates total days in month correctly including leap years', () => {
    expect(getDaysInMonth(2026, 1)).toBe(28); // Feb 2026 non-leap
    expect(getDaysInMonth(2024, 1)).toBe(29); // Feb 2024 leap year
    expect(getDaysInMonth(2026, 6)).toBe(31); // July 2026
  });

  it('generates iCalendar (.ics) string format and Google Calendar event URLs', () => {
    const ics = generateIcsFile('2026-07-10', '2026-07-20', 'Sprint Review');
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('SUMMARY:Sprint Review');
    expect(ics).toContain('DTSTART;VALUE=DATE:20260710');

    const gcalUrl = generateGoogleCalendarUrl('2026-07-10', '2026-07-20', 'Sprint Review');
    expect(gcalUrl).toContain('https://calendar.google.com/calendar/render?action=TEMPLATE');
    expect(gcalUrl).toContain('text=Sprint%20Review');
    expect(gcalUrl).toContain('dates=20260710/20260720');
  });

  it('tracks real-time funnel analytics (opens, selections, preset clicks)', () => {
    const tracker = createAnalyticsTracker();
    expect(tracker.getSummary()).toEqual({ opens: 0, selections: 0, presetClicks: 0 });

    tracker.logOpen();
    tracker.logOpen();
    tracker.logSelection();
    tracker.logPreset();

    const summary = tracker.getSummary();
    expect(summary.opens).toBe(2);
    expect(summary.selections).toBe(1);
    expect(summary.presetClicks).toBe(1);
  });

  it('retrieves theme design token presets (dark, cyber, light, midnight)', () => {
    const themes = getThemePresets();
    expect(Object.keys(themes).length).toBe(4);
    expect(themes.dark.label).toBe('Dark Glass');
    expect(themes.cyber.accent).toBe('#ff007f');
    expect(themes.midnight.label).toBe('Midnight Blue');
  });

  it('generates array of selectable year integers for quick year jump', () => {
    const years = getYearOptions(2020, 2035);
    expect(years.length).toBe(16);
    expect(years[0]).toBe(2020);
    expect(years[15]).toBe(2035);
  });

  it('retrieves relative forward jump presets (+7d, +14d, +30d, +90d)', () => {
    const relativePresets = getRelativePresets();
    expect(relativePresets.length).toBe(4);
    expect(relativePresets[0].key).toBe('next_7_days');
    expect(relativePresets[2].key).toBe('next_30_days');
  });

  it('validates form association required and min/max date constraints', () => {
    expect(validateFormAssociation('', { required: true }).isValid).toBe(false);
    expect(validateFormAssociation('2026-07-28', { required: true }).isValid).toBe(true);
    expect(validateFormAssociation('2026-07-01', { minDate: '2026-07-05' }).isValid).toBe(false);
    expect(validateFormAssociation('2026-07-30', { maxDate: '2026-07-25' }).isValid).toBe(false);
  });

  it('retrieves multi-language locale translations (en, es, fr, de)', () => {
    const es = getLocaleTranslations('es');
    const fr = getLocaleTranslations('fr');
    const de = getLocaleTranslations('de');

    expect(es.months[0]).toBe('Enero');
    expect(fr.months[0]).toBe('Janvier');
    expect(de.months[0]).toBe('Januar');
    expect(es.weekdaysMon[0]).toBe('Lu');
  });

  it('calculates first day of week index for Sunday (0) vs Monday (1) start of week', () => {
    // 2026-07-01 was a Wednesday (Sunday-based index 3, Monday-based index 2)
    expect(getFirstDayOfWeek(2026, 6, 0)).toBe(3);
    expect(getFirstDayOfWeek(2026, 6, 1)).toBe(2);
  });

  it('retrieves sample event markers and attaches events to calendar grid cells', () => {
    const sampleEvents = getSampleEvents();
    expect(sampleEvents.length).toBe(4);

    const targetDate = sampleEvents[0].date;
    const [y, m] = targetDate.split('-').map(Number);

    const grid = generateCalendarGrid(y, m - 1, {
      events: sampleEvents
    });

    const eventCell = grid.find(cell => cell.dateStr === targetDate);
    expect(eventCell).toBeDefined();
    expect(eventCell.events.length).toBe(1);
    expect(eventCell.events[0].title).toBe(sampleEvents[0].title);
  });

  it('calculates next consecutive month metadata object correctly', () => {
    const nextJul = getNextMonth(2026, 6); // July -> August
    expect(nextJul.year).toBe(2026);
    expect(nextJul.month).toBe(7);
    expect(nextJul.monthName).toBe('August');

    const nextDec = getNextMonth(2026, 11); // Dec 2026 -> Jan 2027
    expect(nextDec.year).toBe(2027);
    expect(nextDec.month).toBe(0);
    expect(nextDec.monthName).toBe('January');
  });

  it('combines date and time into formatted DateTime strings', () => {
    expect(formatDateTime('2026-07-28', '14:30', 'YYYY-MM-DD')).toBe('2026-07-28 14:30');
    expect(formatDateTime('2026-07-28', '09:15', 'MM/DD/YYYY')).toBe('07/28/2026 09:15');
  });

  it('validates HH:MM time strings format accurately', () => {
    expect(validateTime('14:30')).toBe(true);
    expect(validateTime('00:00')).toBe(true);
    expect(validateTime('23:59')).toBe(true);
    expect(validateTime('25:00')).toBe(false);
    expect(validateTime('invalid')).toBe(false);
  });

  it('calculates keyboard arrow key navigation target dates', () => {
    const base = '2026-07-15';
    expect(getKeyboardNavigationDate(base, 'ArrowLeft')).toBe('2026-07-14');
    expect(getKeyboardNavigationDate(base, 'ArrowRight')).toBe('2026-07-16');
    expect(getKeyboardNavigationDate(base, 'ArrowUp')).toBe('2026-07-08');
    expect(getKeyboardNavigationDate(base, 'ArrowDown')).toBe('2026-07-22');
    expect(getKeyboardNavigationDate(base, 'Home')).toBe('2026-07-01');
    expect(getKeyboardNavigationDate(base, 'End')).toBe('2026-07-31');
    expect(getKeyboardNavigationDate(base, 'PageUp')).toBe('2026-06-15');
    expect(getKeyboardNavigationDate(base, 'PageDown')).toBe('2026-08-15');
  });

  it('determines the 1st day of week index correctly', () => {
    // 2026-07-01 was a Wednesday (index 3)
    expect(getFirstDayOfWeek(2026, 6)).toBe(3);
  });

  it('formats Date objects and date strings into target patterns', () => {
    const date = new Date(2026, 6, 28); // July 28, 2026
    expect(formatDate(date, 'YYYY-MM-DD')).toBe('2026-07-28');
    expect(formatDate(date, 'MM/DD/YYYY')).toBe('07/28/2026');
    expect(formatDate(date, 'DD/MM/YYYY')).toBe('28/07/2026');
    expect(formatDate(date, 'MMM DD, YYYY')).toBe('Jul 28, 2026');
  });

  it('parses valid date strings into ISO YYYY-MM-DD format', () => {
    expect(parseDateToIso('2026/07/28')).toBe('2026-07-28');
    expect(parseDateToIso('invalid-date')).toBe(null);
  });

  it('generates a complete 42-cell calendar grid matrix for month rendering', () => {
    const grid = generateCalendarGrid(2026, 6, {
      selectedDate: '2026-07-15',
      minDate: '2026-07-05',
      maxDate: '2026-07-25'
    });

    expect(grid.length).toBe(42);

    const selectedDay = grid.find(d => d.dateStr === '2026-07-15');
    expect(selectedDay).toBeDefined();
    expect(selectedDay.isSelected).toBe(true);

    const disabledDayBeforeMin = grid.find(d => d.dateStr === '2026-07-02');
    expect(disabledDayBeforeMin).toBeDefined();
    expect(disabledDayBeforeMin.isDisabled).toBe(true);

    const validDay = grid.find(d => d.dateStr === '2026-07-10');
    expect(validDay.isDisabled).toBe(false);
  });

  it('evaluates range selection start, end, and in-range flags', () => {
    const grid = generateCalendarGrid(2026, 6, {
      rangeStart: '2026-07-10',
      rangeEnd: '2026-07-20'
    });

    const startDay = grid.find(d => d.dateStr === '2026-07-10');
    const endDay = grid.find(d => d.dateStr === '2026-07-20');
    const midDay = grid.find(d => d.dateStr === '2026-07-15');
    const outsideDay = grid.find(d => d.dateStr === '2026-07-25');

    expect(startDay.isRangeStart).toBe(true);
    expect(endDay.isRangeEnd).toBe(true);
    expect(midDay.isInRange).toBe(true);
    expect(outsideDay.isInRange).toBe(false);
  });

  it('retrieves quick preset date ranges', () => {
    const presets = getPresetRanges();
    expect(presets.length).toBe(6);
    expect(presets[0].key).toBe('today');
    expect(presets[2].key).toBe('last_7_days');
  });

  it('validates date range boundaries accurately', () => {
    expect(validateDateRange('2026-07-10', '2026-07-20').isValid).toBe(true);
    expect(validateDateRange('2026-07-20', '2026-07-10').isValid).toBe(false);
    expect(validateDateRange('2026-07-10', '2026-07-20', '2026-07-15').isValid).toBe(false);
  });

  it('generates framework integration code snippets', () => {
    const reactSnippet = getFrameworkSnippet('react', 'single');
    const vueSnippet = getFrameworkSnippet('vue', 'range');
    const angularSnippet = getFrameworkSnippet('angular', 'single');

    expect(reactSnippet).toContain('nexus-date-picker');
    expect(vueSnippet).toContain('mode="range"');
    expect(angularSnippet).toContain('CUSTOM_ELEMENTS_SCHEMA');
  });
});
