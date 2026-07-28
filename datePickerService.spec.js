// datePickerService.spec.js
// Unit tests for Lit Custom Date Picker Service.
// Created: 2026-07-28

import { describe, it, expect } from 'vitest';
import {
  getDaysInMonth,
  getFirstDayOfWeek,
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
