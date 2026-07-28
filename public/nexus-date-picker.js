// public/nexus-date-picker.js
// Framework-Agnostic Web Component custom Date Picker built with Lit / Native Custom Elements.
// Created: 2026-07-28

import {
  generateCalendarGrid,
  getPresetRanges,
  formatDate,
  validateDateRange
} from '/datePickerService.js';

class NexusDatePicker extends HTMLElement {
  static get observedAttributes() {
    return ['mode', 'format', 'theme', 'min-date', 'max-date', 'value', 'range-start', 'range-end'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const now = new Date();
    this.state = {
      year: now.getFullYear(),
      month: now.getMonth(),
      mode: this.getAttribute('mode') || 'single',
      format: this.getAttribute('format') || 'YYYY-MM-DD',
      theme: this.getAttribute('theme') || 'dark',
      minDate: this.getAttribute('min-date') || '',
      maxDate: this.getAttribute('max-date') || '',
      value: this.getAttribute('value') || '',
      rangeStart: this.getAttribute('range-start') || '',
      rangeEnd: this.getAttribute('range-end') || '',
      isOpen: false,
      hoverDate: ''
    };

    this.render = this.render.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
  }

  connectedCallback() {
    document.addEventListener('click', this.handleDocumentClick);
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
    if (name === 'min-date') this.state.minDate = newValue || '';
    if (name === 'max-date') this.state.maxDate = newValue || '';
    if (name === 'value') this.state.value = newValue || '';
    if (name === 'range-start') this.state.rangeStart = newValue || '';
    if (name === 'range-end') this.state.rangeEnd = newValue || '';

    this.render();
  }

  handleDocumentClick(e) {
    if (!this.contains(e.target) && !e.composedPath().includes(this)) {
      if (this.state.isOpen) {
        this.state.isOpen = false;
        this.render();
      }
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
    if (this.state.mode === 'single') {
      this.state.value = dateStr;
      this.state.isOpen = false;

      const formatted = formatDate(dateStr, this.state.format);
      this.dispatchEvent(new CustomEvent('date-select', {
        bubbles: true,
        composed: true,
        detail: { value: dateStr, formatted }
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
          this.state.isOpen = false;

          const startFmt = formatDate(this.state.rangeStart, this.state.format);
          const endFmt = formatDate(dateStr, this.state.format);

          this.dispatchEvent(new CustomEvent('range-select', {
            bubbles: true,
            composed: true,
            detail: {
              rangeStart: this.state.rangeStart,
              rangeEnd: dateStr,
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
      return this.state.value ? formatDate(this.state.value, this.state.format) : 'Select date...';
    } else {
      if (this.state.rangeStart && this.state.rangeEnd) {
        return `${formatDate(this.state.rangeStart, this.state.format)} - ${formatDate(this.state.rangeEnd, this.state.format)}`;
      } else if (this.state.rangeStart) {
        return `${formatDate(this.state.rangeStart, this.state.format)} - Select end...`;
      }
      return 'Select date range...';
    }
  }

  render() {
    const {
      year,
      month,
      mode,
      format,
      theme,
      minDate,
      maxDate,
      value,
      rangeStart,
      rangeEnd,
      isOpen
    } = this.state;

    const grid = generateCalendarGrid(year, month, {
      selectedDate: value,
      rangeStart,
      rangeEnd,
      minDate,
      maxDate
    });

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const presets = getPresetRanges();

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
          --accent-purple-hover: #7c3aed;
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
          min-width: 220px;
          justify-content: space-between;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .picker-trigger:hover {
          border-color: var(--accent-purple);
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
          gap: 16px;
          backdrop-filter: blur(16px);
        }

        .presets-sidebar {
          display: flex;
          flex-direction: column;
          gap: 6px;
          border-right: 1px solid var(--border-color);
          padding-right: 16px;
          min-width: 130px;
        }

        .preset-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          padding: 6px 10px;
          border-radius: 8px;
          text-align: left;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .preset-btn:hover {
          background: rgba(139, 92, 246, 0.15);
          color: var(--accent-purple);
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

        .month-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-main);
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

        .nav-btn:hover {
          background: rgba(139, 92, 246, 0.2);
          border-color: var(--accent-purple);
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
          align-items: center;
          justify-content: center;
          font-size: 13px;
          border-radius: 8px;
          cursor: pointer;
          color: var(--text-main);
          border: none;
          background: transparent;
          transition: all 0.15s ease;
        }

        .day-cell.other-month {
          color: var(--text-muted);
          opacity: 0.4;
        }

        .day-cell:hover:not(.disabled) {
          background: rgba(139, 92, 246, 0.25);
          color: #ffffff;
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
      </style>

      <button type="button" class="picker-trigger">
        <span>📅 ${this.getInputValueText()}</span>
        <span>▼</span>
      </button>

      <div class="calendar-dropdown">
        ${mode === 'range' ? `
          <div class="presets-sidebar">
            <strong style="font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">Presets</strong>
            ${presets.map(p => `
              <button type="button" class="preset-btn" data-preset="${p.key}">${p.label}</button>
            `).join('')}
          </div>
        ` : ''}

        <div class="calendar-main">
          <div class="header-nav">
            <button type="button" class="nav-btn btn-prev">◀</button>
            <span class="month-title">${monthNames[month]} ${year}</span>
            <button type="button" class="nav-btn btn-next">▶</button>
          </div>

          <div class="weekdays-row">
            <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
          </div>

          <div class="days-grid">
            ${grid.map(day => `
              <button 
                type="button" 
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
                ${day.dayNumber}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Attach event listeners
    this.shadowRoot.querySelector('.picker-trigger').addEventListener('click', () => this.togglePicker());
    this.shadowRoot.querySelector('.btn-prev').addEventListener('click', () => this.prevMonth());
    this.shadowRoot.querySelector('.btn-next').addEventListener('click', () => this.nextMonth());

    this.shadowRoot.querySelectorAll('.day-cell:not(.disabled)').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const dateStr = e.currentTarget.getAttribute('data-date');
        this.selectDay(dateStr);
      });
    });

    this.shadowRoot.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const key = e.currentTarget.getAttribute('data-preset');
        const preset = presets.find(p => p.key === key);
        if (preset) this.applyPreset(preset);
      });
    });
  }
}

customElements.define('nexus-date-picker', NexusDatePicker);
