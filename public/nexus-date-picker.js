// public/nexus-date-picker.js
// Framework-Agnostic Web Component custom Date Picker built with Lit / Native Custom Elements.
// Created: 2026-07-28

import {
  generateCalendarGrid,
  getPresetRanges,
  getRelativePresets,
  getYearOptions,
  getNextMonth,
  getSampleEvents,
  getLocaleTranslations,
  validateFormAssociation,
  formatDate,
  formatDateTime,
  validateTime,
  validateDateRange,
  getKeyboardNavigationDate
} from '/datePickerService.js';

class NexusDatePicker extends HTMLElement {
  static get formAssociated() {
    return true;
  }

  static get observedAttributes() {
    return ['mode', 'format', 'theme', 'locale', 'first-day-of-week', 'enable-time', 'enable-events', 'view-months', 'name', 'required', 'min-date', 'max-date', 'value', 'range-start', 'range-end'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    if ('attachInternals' in this) {
      this.internals = this.attachInternals();
    }

    const now = new Date();
    this.state = {
      year: now.getFullYear(),
      month: now.getMonth(),
      mode: this.getAttribute('mode') || 'single',
      format: this.getAttribute('format') || 'YYYY-MM-DD',
      theme: this.getAttribute('theme') || 'dark',
      locale: this.getAttribute('locale') || 'en',
      firstDayOfWeek: parseInt(this.getAttribute('first-day-of-week') || '0'),
      enableTime: this.getAttribute('enable-time') === 'true',
      enableEvents: this.getAttribute('enable-events') === 'true',
      viewMonths: parseInt(this.getAttribute('view-months') || '1'),
      name: this.getAttribute('name') || 'datePicker',
      required: this.getAttribute('required') === 'true',
      time: '12:00',
      minDate: this.getAttribute('min-date') || '',
      maxDate: this.getAttribute('max-date') || '',
      value: this.getAttribute('value') || '',
      rangeStart: this.getAttribute('range-start') || '',
      rangeEnd: this.getAttribute('range-end') || '',
      focusedDate: formatDate(now, 'YYYY-MM-DD'),
      isOpen: false,
      events: getSampleEvents()
    };

    this.render = this.render.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  connectedCallback() {
    document.addEventListener('click', this.handleDocumentClick);
    this.updateFormValue();
    this.render();
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleDocumentClick);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === 'mode') this.state.mode = newValue || 'single';
    if (name === 'format') this.state.format = newValue || 'YYYY-MM-DD';
    if (name === 'theme') this.state.theme = newValue || 'dark';
    if (name === 'locale') this.state.locale = newValue || 'en';
    if (name === 'first-day-of-week') this.state.firstDayOfWeek = parseInt(newValue || '0');
    if (name === 'enable-time') this.state.enableTime = newValue === 'true';
    if (name === 'enable-events') this.state.enableEvents = newValue === 'true';
    if (name === 'view-months') this.state.viewMonths = parseInt(newValue || '1');
    if (name === 'name') this.state.name = newValue || 'datePicker';
    if (name === 'required') this.state.required = newValue === 'true';
    if (name === 'min-date') this.state.minDate = newValue || '';
    if (name === 'max-date') this.state.maxDate = newValue || '';
    if (name === 'value') this.state.value = newValue || '';
    if (name === 'range-start') this.state.rangeStart = newValue || '';
    if (name === 'range-end') this.state.rangeEnd = newValue || '';

    this.updateFormValue();
    this.render();
  }

  updateFormValue() {
    const val = this.getSubmitValue();
    if (this.internals && this.internals.setFormValue) {
      this.internals.setFormValue(val);
      const validation = validateFormAssociation(val, {
        required: this.state.required,
        minDate: this.state.minDate,
        maxDate: this.state.maxDate
      });

      if (!validation.isValid) {
        this.internals.setValidity({ valueMissing: true }, validation.validationMessage);
      } else {
        this.internals.setValidity({});
      }
    }
  }

  getSubmitValue() {
    if (this.state.mode === 'single') {
      if (!this.state.value) return '';
      return this.state.enableTime 
        ? `${this.state.value} ${this.state.time}` 
        : this.state.value;
    } else {
      if (this.state.rangeStart && this.state.rangeEnd) {
        return `${this.state.rangeStart} to ${this.state.rangeEnd}`;
      }
      return this.state.rangeStart || '';
    }
  }

  handleDocumentClick(e) {
    if (!this.contains(e.target) && !e.composedPath().includes(this)) {
      if (this.state.isOpen) {
        this.state.isOpen = false;
        this.render();
      }
    }
  }

  handleKeydown(e) {
    if (!this.state.isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        this.state.isOpen = true;
        this.render();
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      this.state.isOpen = false;
      this.render();
      this.shadowRoot.querySelector('.picker-trigger')?.focus();
      return;
    }

    const navKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'];
    if (navKeys.includes(e.key)) {
      e.preventDefault();
      const nextDateStr = getKeyboardNavigationDate(this.state.focusedDate, e.key);
      this.state.focusedDate = nextDateStr;

      const d = new Date(nextDateStr + 'T00:00:00');
      this.state.year = d.getFullYear();
      this.state.month = d.getMonth();

      this.render();

      setTimeout(() => {
        const btn = this.shadowRoot.querySelector(`[data-date="${nextDateStr}"]`);
        btn?.focus();
      }, 0);
      return;
    }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.selectDay(this.state.focusedDate);
    }
  }

  togglePicker() {
    this.state.isOpen = !this.state.isOpen;
    this.render();
  }

  prevMonth() {
    if (this.state.month === 0) {
      this.state.month = 11;
      this.state.year -= 1;
    } else {
      this.state.month -= 1;
    }
    this.render();
  }

  nextMonth() {
    if (this.state.month === 11) {
      this.state.month = 0;
      this.state.year += 1;
    } else {
      this.state.month += 1;
    }
    this.render();
  }

  selectDay(dateStr) {
    this.state.focusedDate = dateStr;

    const matchedEvents = this.state.enableEvents ? this.state.events.filter(e => e.date === dateStr) : [];

    if (this.state.mode === 'single') {
      this.state.value = dateStr;
      if (!this.state.enableTime) {
        this.state.isOpen = false;
      }

      const formatted = this.state.enableTime 
        ? formatDateTime(dateStr, this.state.time, this.state.format)
        : formatDate(dateStr, this.state.format);

      this.updateFormValue();

      this.dispatchEvent(new CustomEvent('date-select', {
        bubbles: true,
        composed: true,
        detail: { value: dateStr, time: this.state.time, formatted, events: matchedEvents }
      }));
    } else {
      // Range mode
      if (!this.state.rangeStart || (this.state.rangeStart && this.state.rangeEnd)) {
        this.state.rangeStart = dateStr;
        this.state.rangeEnd = '';
      } else if (this.state.rangeStart && !this.state.rangeEnd) {
        if (dateStr < this.state.rangeStart) {
          this.state.rangeStart = dateStr;
        } else {
          this.state.rangeEnd = dateStr;
          if (!this.state.enableTime) {
            this.state.isOpen = false;
          }

          const startFmt = this.state.enableTime 
            ? formatDateTime(this.state.rangeStart, this.state.time, this.state.format)
            : formatDate(this.state.rangeStart, this.state.format);

          const endFmt = this.state.enableTime 
            ? formatDateTime(dateStr, this.state.time, this.state.format)
            : formatDate(dateStr, this.state.format);

          this.updateFormValue();

          this.dispatchEvent(new CustomEvent('range-select', {
            bubbles: true,
            composed: true,
            detail: {
              rangeStart: this.state.rangeStart,
              rangeEnd: dateStr,
              time: this.state.time,
              formatted: `${startFmt} - ${endFmt}`
            }
          }));
        }
      }
    }
    this.render();
  }

  applyPreset(preset) {
    this.state.rangeStart = preset.rangeStart;
    this.state.rangeEnd = preset.rangeEnd;
    this.state.mode = 'range';
    this.state.isOpen = false;

    const startFmt = formatDate(preset.rangeStart, this.state.format);
    const endFmt = formatDate(preset.rangeEnd, this.state.format);

    this.updateFormValue();

    this.dispatchEvent(new CustomEvent('range-select', {
      bubbles: true,
      composed: true,
      detail: {
        preset: preset.key,
        rangeStart: preset.rangeStart,
        rangeEnd: preset.rangeEnd,
        formatted: `${startFmt} - ${endFmt}`
      }
    }));
    this.render();
  }

  getInputValueText() {
    if (this.state.mode === 'single') {
      if (!this.state.value) return 'Select date...';
      return this.state.enableTime 
        ? formatDateTime(this.state.value, this.state.time, this.state.format)
        : formatDate(this.state.value, this.state.format);
    } else {
      if (this.state.rangeStart && this.state.rangeEnd) {
        const startFmt = this.state.enableTime ? formatDateTime(this.state.rangeStart, this.state.time, this.state.format) : formatDate(this.state.rangeStart, this.state.format);
        const endFmt = this.state.enableTime ? formatDateTime(this.state.rangeEnd, this.state.time, this.state.format) : formatDate(this.state.rangeEnd, this.state.format);
        return `${startFmt} - ${endFmt}`;
      } else if (this.state.rangeStart) {
        const startFmt = this.state.enableTime ? formatDateTime(this.state.rangeStart, this.state.time, this.state.format) : formatDate(this.state.rangeStart, this.state.format);
        return `${startFmt} - Select end...`;
      }
      return 'Select date range...';
    }
  }

  renderMonthPanel(year, month, grid, isSecondMonth = false) {
    const t = getLocaleTranslations(this.state.locale);
    const weekdays = this.state.firstDayOfWeek === 1 ? t.weekdaysMon : t.weekdaysSun;
    const yearOptions = getYearOptions(2020, 2035);

    return `
      <div class="calendar-main">
        <div class="header-nav">
          ${!isSecondMonth ? `<button type="button" class="nav-btn btn-prev" aria-label="Previous month">◀</button>` : '<div></div>'}
          
          <div style="display: flex; gap: 6px; align-items: center;">
            <select class="header-select month-select" data-panel="${isSecondMonth ? 'second' : 'first'}">
              ${t.months.map((m, idx) => `<option value="${idx}" ${idx === month ? 'selected' : ''}>${m}</option>`).join('')}
            </select>
            <select class="header-select year-select" data-panel="${isSecondMonth ? 'second' : 'first'}">
              ${yearOptions.map(y => `<option value="${y}" ${y === year ? 'selected' : ''}>${y}</option>`).join('')}
            </select>
          </div>

          ${(isSecondMonth || this.state.viewMonths === 1) ? `<button type="button" class="nav-btn btn-next" aria-label="Next month">▶</button>` : '<div></div>'}
        </div>

        <div class="weekdays-row" role="row">
          ${weekdays.map(w => `<span role="columnheader">${w}</span>`).join('')}
        </div>

        <div class="days-grid" role="grid" aria-label="${t.months[month]} ${year} grid">
          ${grid.map(day => {
            const hasEvents = this.state.enableEvents && day.events && day.events.length > 0;
            const eventTitle = hasEvents ? day.events.map(e => e.title).join(', ') : '';

            return `
              <button 
                type="button" 
                role="gridcell"
                tabindex="${day.dateStr === this.state.focusedDate ? '0' : '-1'}"
                aria-selected="${day.isSelected || day.isRangeStart || day.isRangeEnd}"
                aria-disabled="${day.isDisabled}"
                title="${eventTitle ? `Event: ${eventTitle}` : ''}"
                class="day-cell 
                  ${!day.isCurrentMonth ? 'other-month' : ''} 
                  ${day.isToday ? 'today' : ''} 
                  ${day.isSelected ? 'selected' : ''} 
                  ${day.isRangeStart ? 'range-start' : ''} 
                  ${day.isRangeEnd ? 'range-end' : ''} 
                  ${day.isInRange ? 'in-range' : ''} 
                  ${day.isDisabled ? 'disabled' : ''}" 
                data-date="${day.dateStr}"
                ${day.isDisabled ? 'disabled' : ''}
              >
                <span>${day.dayNumber}</span>
                ${hasEvents ? `
                  <div class="event-dots-container">
                    ${day.events.map(e => `<span class="event-dot" style="background: ${e.color};"></span>`).join('')}
                  </div>
                ` : ''}
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  render() {
    const {
      year,
      month,
      mode,
      format,
      theme,
      locale,
      firstDayOfWeek,
      enableTime,
      enableEvents,
      viewMonths,
      name,
      required,
      time,
      minDate,
      maxDate,
      value,
      rangeStart,
      rangeEnd,
      focusedDate,
      isOpen,
      events
    } = this.state;

    const grid1 = generateCalendarGrid(year, month, {
      selectedDate: value,
      rangeStart,
      rangeEnd,
      minDate,
      maxDate,
      events: enableEvents ? events : [],
      firstDayOfWeek
    });

    let grid2 = null;
    let nextMonthMeta = null;

    if (viewMonths === 2) {
      nextMonthMeta = getNextMonth(year, month, locale);
      grid2 = generateCalendarGrid(nextMonthMeta.year, nextMonthMeta.month, {
        selectedDate: value,
        rangeStart,
        rangeEnd,
        minDate,
        maxDate,
        events: enableEvents ? events : [],
        firstDayOfWeek
      });
    }

    const pastPresets = getPresetRanges();
    const relativePresets = getRelativePresets();
    const allPresets = [...pastPresets, ...relativePresets];
    const submitVal = this.getSubmitValue();

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          --bg-card: ${theme === 'dark' ? 'rgba(15, 23, 42, 0.95)' : '#ffffff'};
          --text-main: ${theme === 'dark' ? '#f8fafc' : '#0f172a'};
          --text-muted: ${theme === 'dark' ? '#94a3b8' : '#64748b'};
          --border-color: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'};
          --accent-purple: #8b5cf6;
          --range-bg: rgba(139, 92, 246, 0.2);
          position: relative;
        }

        .picker-trigger {
          background: ${theme === 'dark' ? 'rgba(30, 41, 59, 0.8)' : '#f8fafc'};
          border: 1px solid var(--border-color);
          color: var(--text-main);
          padding: 10px 16px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 240px;
          justify-content: space-between;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .picker-trigger:focus-visible {
          outline: 2px solid var(--accent-purple);
          outline-offset: 2px;
        }

        .calendar-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          padding: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          z-index: 100;
          display: ${isOpen ? 'flex' : 'none'};
          flex-direction: column;
          gap: 16px;
          backdrop-filter: blur(16px);
        }

        .dropdown-content {
          display: flex;
          gap: 16px;
        }

        .presets-sidebar {
          display: flex;
          flex-direction: column;
          gap: 4px;
          border-right: 1px solid var(--border-color);
          padding-right: 16px;
          min-width: 140px;
          max-height: 280px;
          overflow-y: auto;
        }

        .preset-section-header {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          margin: 6px 0 2px 0;
          letter-spacing: 0.5px;
        }

        .preset-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          padding: 5px 8px;
          border-radius: 6px;
          text-align: left;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .preset-btn:hover, .preset-btn:focus-visible {
          background: rgba(139, 92, 246, 0.15);
          color: var(--accent-purple);
          outline: none;
        }

        .calendar-main {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 280px;
        }

        .header-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-select {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid var(--border-color);
          color: var(--text-main);
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          outline: none;
          cursor: pointer;
        }

        .header-select:focus {
          border-color: var(--accent-purple);
        }

        .nav-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          color: var(--text-main);
          width: 30px;
          height: 30px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }

        .nav-btn:hover, .nav-btn:focus-visible {
          background: rgba(139, 92, 246, 0.2);
          border-color: var(--accent-purple);
          outline: none;
        }

        .weekdays-row {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
        }

        .days-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }

        .day-cell {
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          border-radius: 8px;
          cursor: pointer;
          color: var(--text-main);
          border: 1px solid transparent;
          background: transparent;
          transition: all 0.15s ease;
          outline: none;
          position: relative;
        }

        .day-cell.other-month {
          color: var(--text-muted);
          opacity: 0.4;
        }

        .day-cell:hover:not(.disabled), .day-cell:focus-visible:not(.disabled) {
          background: rgba(139, 92, 246, 0.25);
          color: #ffffff;
          border-color: var(--accent-purple);
        }

        .day-cell.today {
          border: 1px solid var(--accent-purple);
          font-weight: 700;
        }

        .day-cell.selected, .day-cell.range-start, .day-cell.range-end {
          background: var(--accent-purple) !important;
          color: #ffffff !important;
          font-weight: 700;
        }

        .day-cell.in-range {
          background: var(--range-bg) !important;
          border-radius: 0;
        }

        .day-cell.disabled {
          opacity: 0.2;
          cursor: not-allowed;
        }

        .event-dots-container {
          display: flex;
          gap: 2px;
          margin-top: 2px;
        }

        .event-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
        }

        /* Time Picker Bar Styles */
        .time-picker-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--border-color);
          padding-top: 12px;
        }

        .time-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .time-input {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid var(--border-color);
          color: var(--text-main);
          padding: 6px 10px;
          border-radius: 8px;
          font-size: 13px;
          outline: none;
        }

        .time-input:focus {
          border-color: var(--accent-purple);
        }
      </style>

      <!-- Hidden Form Input Sync -->
      <input type="hidden" name="${name}" value="${submitVal}" ${required ? 'required' : ''}>

      <button type="button" class="picker-trigger" aria-haspopup="dialog" aria-expanded="${isOpen}">
        <span>📅 ${this.getInputValueText()}</span>
        <span>▼</span>
      </button>

      <div class="calendar-dropdown" role="dialog" aria-label="Calendar date picker">
        <div class="dropdown-content">
          ${mode === 'range' ? `
            <div class="presets-sidebar" role="menu" aria-label="Quick date presets">
              <span class="preset-section-header">Past Presets</span>
              ${pastPresets.map(p => `
                <button type="button" class="preset-btn" data-preset="${p.key}" role="menuitem">${p.label}</button>
              `).join('')}

              <span class="preset-section-header">Future Jumps</span>
              ${relativePresets.map(p => `
                <button type="button" class="preset-btn" data-preset="${p.key}" role="menuitem">${p.label}</button>
              `).join('')}
            </div>
          ` : ''}

          ${this.renderMonthPanel(year, month, grid1, false)}

          ${viewMonths === 2 && grid2 ? this.renderMonthPanel(nextMonthMeta.year, nextMonthMeta.month, grid2, true) : ''}
        </div>

        ${enableTime ? `
          <div class="time-picker-bar">
            <span class="time-label">⏰ Select Time (HH:MM):</span>
            <input type="time" class="time-input" value="${time}">
          </div>
        ` : ''}
      </div>
    `;

    // Attach event listeners
    const triggerBtn = this.shadowRoot.querySelector('.picker-trigger');
    const dropdownEl = this.shadowRoot.querySelector('.calendar-dropdown');

    triggerBtn.addEventListener('click', () => this.togglePicker());
    triggerBtn.addEventListener('keydown', this.handleKeydown);
    dropdownEl.addEventListener('keydown', this.handleKeydown);

    this.shadowRoot.querySelector('.btn-prev')?.addEventListener('click', () => this.prevMonth());
    this.shadowRoot.querySelector('.btn-next')?.addEventListener('click', () => this.nextMonth());

    this.shadowRoot.querySelectorAll('.month-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const selectedMonth = parseInt(e.target.value);
        this.state.month = selectedMonth;
        this.render();
      });
    });

    this.shadowRoot.querySelectorAll('.year-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const selectedYear = parseInt(e.target.value);
        this.state.year = selectedYear;
        this.render();
      });
    });

    if (enableTime) {
      const timeInput = this.shadowRoot.querySelector('.time-input');
      timeInput?.addEventListener('change', (e) => {
        this.state.time = e.target.value;
        this.updateFormValue();
        this.render();
      });
    }

    this.shadowRoot.querySelectorAll('.day-cell:not(.disabled)').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const dateStr = e.currentTarget.getAttribute('data-date');
        this.selectDay(dateStr);
      });
    });

    this.shadowRoot.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const key = e.currentTarget.getAttribute('data-preset');
        const preset = allPresets.find(p => p.key === key);
        if (preset) this.applyPreset(preset);
      });
    });
  }
}

customElements.define('nexus-date-picker', NexusDatePicker);
