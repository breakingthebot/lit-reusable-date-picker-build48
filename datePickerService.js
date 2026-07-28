// datePickerService.js
// Domain Service & Date Grid Engine for NexusCloud Custom Lit Date Picker Web Component.
// Created: 2026-07-28

/**
 * @typedef {Object} CalendarEvent
 * @property {string} date - ISO YYYY-MM-DD
 * @property {string} title - Short title of event
 * @property {'meeting'|'release'|'holiday'|'deadline'} type
 * @property {string} color - Hex or CSS color string
 */

/**
 * @typedef {Object} CalendarDay
 * @property {string} dateStr - Formatted ISO date string (YYYY-MM-DD)
 * @property {number} dayNumber - Day of month number (1-31)
 * @property {boolean} isCurrentMonth - Whether day belongs to rendered month
 * @property {boolean} isToday - Whether day is current calendar date
 * @property {boolean} isDisabled - Whether date is disabled by min/max or disabled list
 * @property {boolean} isSelected - Whether date is currently selected single date
 * @property {boolean} isRangeStart - Whether date is start of selected date range
 * @property {boolean} isRangeEnd - Whether date is end of selected date range
 * @property {boolean} isInRange - Whether date falls between start and end date range
 * @property {CalendarEvent[]} events - List of events registered on date
 */

/**
 * Returns number of days in a given month.
 * @param {number} year 
 * @param {number} month - 0-indexed (0 = Jan, 11 = Dec)
 * @returns {number}
 */
export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Returns the day of week index for 1st day of month (0 = Sun, 6 = Sat).
 * @param {number} year 
 * @param {number} month - 0-indexed
 * @returns {number}
 */
export function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}

/**
 * Returns next consecutive month metadata object.
 * @param {number} year 
 * @param {number} month - 0-indexed
 * @returns {{ year: number, month: number, monthName: string }}
 */
export function getNextMonth(year, month) {
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return {
    year: nextYear,
    month: nextMonth,
    monthName: monthNames[nextMonth]
  };
}

/**
 * Returns sample contextual calendar event markers.
 * @returns {CalendarEvent[]}
 */
export function getSampleEvents() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');

  return [
    { date: `${yyyy}-${mm}-05`, title: '🚀 Sprint Demo', type: 'release', color: '#10b981' },
    { date: `${yyyy}-${mm}-12`, title: '👥 Team Sync', type: 'meeting', color: '#3b82f6' },
    { date: `${yyyy}-${mm}-18`, title: '⚡ Architecture Review', type: 'meeting', color: '#8b5cf6' },
    { date: `${yyyy}-${mm}-25`, title: '🎉 Quarterly Holiday', type: 'holiday', color: '#f59e0b' }
  ];
}

/**
 * Calculates target date string when navigating grid with keyboard keys.
 * @param {string} currentDateStr - ISO YYYY-MM-DD
 * @param {'ArrowLeft'|'ArrowRight'|'ArrowUp'|'ArrowDown'|'Home'|'End'|'PageUp'|'PageDown'} key 
 * @returns {string}
 */
export function getKeyboardNavigationDate(currentDateStr, key) {
  const baseDate = currentDateStr ? new Date(currentDateStr + 'T00:00:00') : new Date();
  if (isNaN(baseDate.getTime())) return formatDate(new Date(), 'YYYY-MM-DD');

  const target = new Date(baseDate);

  switch (key) {
    case 'ArrowLeft':
      target.setDate(baseDate.getDate() - 1);
      break;
    case 'ArrowRight':
      target.setDate(baseDate.getDate() + 1);
      break;
    case 'ArrowUp':
      target.setDate(baseDate.getDate() - 7);
      break;
    case 'ArrowDown':
      target.setDate(baseDate.getDate() + 7);
      break;
    case 'Home':
      target.setDate(1);
      break;
    case 'End':
      target.setDate(getDaysInMonth(baseDate.getFullYear(), baseDate.getMonth()));
      break;
    case 'PageUp':
      target.setMonth(baseDate.getMonth() - 1);
      break;
    case 'PageDown':
      target.setMonth(baseDate.getMonth() + 1);
      break;
  }

  return formatDate(target, 'YYYY-MM-DD');
}

/**
 * Combines date and time into target formatted DateTime string.
 * @param {string} dateStr - YYYY-MM-DD
 * @param {string} timeStr - HH:MM
 * @param {'YYYY-MM-DD'|'MM/DD/YYYY'|'DD/MM/YYYY'|'MMM DD, YYYY'} format 
 * @returns {string}
 */
export function formatDateTime(dateStr, timeStr = '12:00', format = 'YYYY-MM-DD') {
  if (!dateStr) return '';
  const dateFormatted = formatDate(dateStr, format);
  const timeFormatted = validateTime(timeStr) ? timeStr : '12:00';
  return `${dateFormatted} ${timeFormatted}`;
}

/**
 * Validates HH:MM time string format.
 * @param {string} timeStr 
 * @returns {boolean}
 */
export function validateTime(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return false;
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return regex.test(timeStr.trim());
}

/**
 * Formats Date object into target string pattern.
 * @param {Date|string} date 
 * @param {'YYYY-MM-DD'|'MM/DD/YYYY'|'DD/MM/YYYY'|'MMM DD, YYYY'} format 
 * @returns {string}
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : new Date(date);
  if (isNaN(d.getTime())) return '';

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  switch (format) {
    case 'MM/DD/YYYY':
      return `${mm}/${dd}/${yyyy}`;
    case 'DD/MM/YYYY':
      return `${dd}/${mm}/${yyyy}`;
    case 'MMM DD, YYYY':
      return `${monthNames[d.getMonth()]} ${dd}, ${yyyy}`;
    case 'YYYY-MM-DD':
    default:
      return `${yyyy}-${mm}-${dd}`;
  }
}

/**
 * Parses formatted date string into ISO YYYY-MM-DD string.
 * @param {string} dateStr 
 * @returns {string|null}
 */
export function parseDateToIso(dateStr) {
  if (!dateStr || !dateStr.trim()) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return formatDate(d, 'YYYY-MM-DD');
}

/**
 * Generates a 42-cell calendar grid matrix for month rendering.
 * @param {number} year 
 * @param {number} month - 0-indexed
 * @param {Object} options
 * @param {string} [options.selectedDate]
 * @param {string} [options.rangeStart]
 * @param {string} [options.rangeEnd]
 * @param {string} [options.minDate]
 * @param {string} [options.maxDate]
 * @param {string[]} [options.disabledDates]
 * @param {CalendarEvent[]} [options.events]
 * @returns {CalendarDay[]}
 */
export function generateCalendarGrid(year, month, options = {}) {
  const {
    selectedDate = '',
    rangeStart = '',
    rangeEnd = '',
    minDate = '',
    maxDate = '',
    disabledDates = [],
    events = []
  } = options;

  const todayStr = formatDate(new Date(), 'YYYY-MM-DD');
  const firstDayIndex = getFirstDayOfWeek(year, month);
  const totalDaysCurrentMonth = getDaysInMonth(year, month);
  const prevMonthDays = getDaysInMonth(year, month - 1);

  const days = [];

  // 1. Previous month overflow days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = prevMonthDays - i;
    const prevDate = new Date(year, month - 1, dayNum);
    const dateStr = formatDate(prevDate, 'YYYY-MM-DD');

    days.push(createDayObject(dateStr, dayNum, false, todayStr, options));
  }

  // 2. Current month days
  for (let dayNum = 1; dayNum <= totalDaysCurrentMonth; dayNum++) {
    const currentDate = new Date(year, month, dayNum);
    const dateStr = formatDate(currentDate, 'YYYY-MM-DD');

    days.push(createDayObject(dateStr, dayNum, true, todayStr, options));
  }

  // 3. Next month overflow days (fill up to 42 cells)
  const remainingCells = 42 - days.length;
  for (let dayNum = 1; dayNum <= remainingCells; dayNum++) {
    const nextDate = new Date(year, month + 1, dayNum);
    const dateStr = formatDate(nextDate, 'YYYY-MM-DD');

    days.push(createDayObject(dateStr, dayNum, false, todayStr, options));
  }

  return days;
}

function createDayObject(dateStr, dayNum, isCurrentMonth, todayStr, options) {
  const {
    selectedDate = '',
    rangeStart = '',
    rangeEnd = '',
    minDate = '',
    maxDate = '',
    disabledDates = [],
    events = []
  } = options;

  const isDisabled = 
    (minDate && dateStr < minDate) ||
    (maxDate && dateStr > maxDate) ||
    disabledDates.includes(dateStr);

  const isSelected = selectedDate === dateStr;
  const isRangeStart = rangeStart === dateStr;
  const isRangeEnd = rangeEnd === dateStr;
  const isInRange = Boolean(rangeStart && rangeEnd && dateStr > rangeStart && dateStr < rangeEnd);

  const dayEvents = events.filter(e => e.date === dateStr);

  return {
    dateStr,
    dayNumber: dayNum,
    isCurrentMonth,
    isToday: dateStr === todayStr,
    isDisabled: Boolean(isDisabled),
    isSelected,
    isRangeStart,
    isRangeEnd,
    isInRange,
    events: dayEvents
  };
}

/**
 * Returns list of quick preset date ranges.
 * @returns {Array<{ label: string, key: string, rangeStart: string, rangeEnd: string }>}
 */
export function getPresetRanges() {
  const now = new Date();
  const todayStr = formatDate(now, 'YYYY-MM-DD');

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayStr = formatDate(yesterday, 'YYYY-MM-DD');

  const last7 = new Date(now);
  last7.setDate(now.getDate() - 6);

  const last30 = new Date(now);
  last30.setDate(now.getDate() - 29);

  const firstOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  return [
    { label: 'Today', key: 'today', rangeStart: todayStr, rangeEnd: todayStr },
    { label: 'Yesterday', key: 'yesterday', rangeStart: yesterdayStr, rangeEnd: yesterdayStr },
    { label: 'Last 7 Days', key: 'last_7_days', rangeStart: formatDate(last7, 'YYYY-MM-DD'), rangeEnd: todayStr },
    { label: 'Last 30 Days', key: 'last_30_days', rangeStart: formatDate(last30, 'YYYY-MM-DD'), rangeEnd: todayStr },
    { label: 'This Month', key: 'this_month', rangeStart: formatDate(firstOfThisMonth, 'YYYY-MM-DD'), rangeEnd: todayStr },
    { label: 'Last Month', key: 'last_month', rangeStart: formatDate(firstOfLastMonth, 'YYYY-MM-DD'), rangeEnd: formatDate(lastOfLastMonth, 'YYYY-MM-DD') }
  ];
}

/**
 * Validates selected date range limits.
 * @param {string} startDate 
 * @param {string} endDate 
 * @param {string} [minDate] 
 * @param {string} [maxDate] 
 * @returns {{ isValid: boolean, error?: string }}
 */
export function validateDateRange(startDate, endDate, minDate = '', maxDate = '') {
  if (!startDate) return { isValid: false, error: 'Start date is required' };
  if (endDate && endDate < startDate) return { isValid: false, error: 'End date cannot precede start date' };
  if (minDate && startDate < minDate) return { isValid: false, error: `Start date cannot precede minimum limit ${minDate}` };
  if (maxDate && (endDate || startDate) > maxDate) return { isValid: false, error: `Date exceeds maximum limit ${maxDate}` };

  return { isValid: true };
}

/**
 * Generates code snippet for incorporating <nexus-date-picker> into popular frontend frameworks.
 * @param {'react'|'vue'|'angular'|'svelte'|'vanilla'} framework 
 * @param {'single'|'range'} mode 
 * @returns {string}
 */
export function getFrameworkSnippet(framework = 'react', mode = 'single') {
  const modeAttr = mode === 'range' ? ' mode="range"' : '';

  switch (framework) {
    case 'react':
      return `import React, { useRef, useEffect } from 'react';\nimport '@nexuscloud/date-picker';\n\nexport function DateFilter() {\n  const pickerRef = useRef(null);\n\n  useEffect(() => {\n    const el = pickerRef.current;\n    const handleSelect = (e) => console.log('Selected date:', e.detail);\n    el?.addEventListener('date-select', handleSelect);\n    return () => el?.removeEventListener('date-select', handleSelect);\n  }, []);\n\n  return (\n    <nexus-date-picker\n      ref={pickerRef}\n      ${modeAttr}\n      format="YYYY-MM-DD"\n      enable-events="true"\n      theme="dark"\n    />\n  );\n}`;

    case 'vue':
      return `<template>\n  <nexus-date-picker\n    ${modeAttr}\n    format="YYYY-MM-DD"\n    enable-events="true"\n    theme="dark"\n    @date-select="onDateSelect"\n  />\n</template>\n\n<script setup>\nimport '@nexuscloud/date-picker';\n\nconst onDateSelect = (event) => {\n  console.log('Vue selected date:', event.detail);\n};\n</script>`;

    case 'angular':
      return `import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';\nimport '@nexuscloud/date-picker';\n\n@Component({\n  selector: 'app-date-filter',\n  schemas: [CUSTOM_ELEMENTS_SCHEMA],\n  template: \`\n    <nexus-date-picker \n      ${modeAttr} \n      enable-events="true"\n      format="YYYY-MM-DD"\n      (date-select)="onDateSelect($event)">\n    </nexus-date-picker>\n  \`\n})\nexport class DateFilterComponent {\n  onDateSelect(event: CustomEvent) {\n    console.log('Angular date:', event.detail);\n  }\n}`;

    case 'svelte':
      return `<script>\n  import { onMount } from 'svelte';\n  import '@nexuscloud/date-picker';\n\n  let selectedDate = '';\n  function handleSelect(event) {\n    selectedDate = event.detail.value;\n  }\n</script>\n\n<nexus-date-picker ${modeAttr} enable-events="true" on:date-select={handleSelect} />\n<p>Selected: {selectedDate}</p>`;

    case 'vanilla':
    default:
      return `<script type="module" src="https://cdn.nexuscloud.ai/components/nexus-date-picker.js"></script>\n\n<nexus-date-picker ${modeAttr} enable-events="true" format="YYYY-MM-DD" theme="dark"></nexus-date-picker>\n\n<script>\n  const picker = document.querySelector('nexus-date-picker');\n  picker.addEventListener('date-select', (e) => {\n    console.log('Selected date:', e.detail);\n  });\n</script>`;
  }
}
