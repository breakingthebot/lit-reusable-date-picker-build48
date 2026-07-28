# Changelog - Build 48: Lit Reusable Date Picker Web Component

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.0] - 2026-07-28

### Added
- Integrated **Date Picker Custom Highlight Markers & Event Badges** in `datePickerService.js` and `public/nexus-date-picker.js`.
- Added sample events domain provider (`getSampleEvents`) and grid event attachment logic.
- Updated `<nexus-date-picker>` with attribute `enable-events="true|false"`, state `events`, colored event dot indicators (`.event-dot`), native HTML tooltips (`title="Event: ..."`), and event list payload dispatches (`detail.events`).
- Added Contextual Event Badges toggle checkbox in live controls configurator in `public/index.html`.
- Added unit tests in `datePickerService.spec.js` (14 total unit tests passing).

## [0.4.0] - 2026-07-28

### Added
- Integrated **Date Picker Multi-Month Dual View Renderer** in `datePickerService.js` and `public/nexus-date-picker.js`.
- Added next month calculation domain helper (`getNextMonth`).
- Updated `<nexus-date-picker>` with attribute `view-months="1|2"`, state `viewMonths` (`2` default in showcase), modular dual month panel renderer (`renderMonthPanel`), and seamless cross-month range selection.
- Added Month Panels Layout selector in live controls configurator in `public/index.html`.
- Added unit tests in `datePickerService.spec.js` (13 total unit tests passing).

## [0.3.0] - 2026-07-28

### Added
- Integrated **Date Picker Time Picker Extension (Date + Time HH:MM)** in `datePickerService.js` and `public/nexus-date-picker.js`.
- Added DateTime formatting helper (`formatDateTime`) and time string format validator (`validateTime`).
- Updated `<nexus-date-picker>` with attribute `enable-time="true|false"`, state `time` (`12:00`), bottom Time Picker Bar UI (`<input type="time" class="time-input">`), and combined DateTime custom event payload dispatches (`{ value, time, formatted }`).
- Added Time Picker toggle checkbox in live controls configurator in `public/index.html`.
- Added unit tests in `datePickerService.spec.js` (12 total unit tests passing).

## [0.2.0] - 2026-07-28

### Added
- Integrated **Date Picker Keyboard Navigation & Accessibility Vault** in `datePickerService.js` and `public/nexus-date-picker.js`.
- Added keyboard date navigation calculation helper (`getKeyboardNavigationDate`).
- Updated `<nexus-date-picker>` with full keyboard listener (`ArrowLeft`/`ArrowRight`/`ArrowUp`/`ArrowDown`/`Home`/`End`/`PageUp`/`PageDown`/`Escape`), focus management, and ARIA grid roles (`role="grid"`, `role="row"`, `role="gridcell"`, `aria-selected`, `aria-disabled`).
- Added WCAG 2.1 AA Keyboard Shortcuts Guide card in `public/index.html`.
- Added unit tests in `datePickerService.spec.js` (10 total unit tests passing).

## [0.1.0] - 2026-07-28

### Added
- Created `<nexus-date-picker>` custom Lit / Web Component in `public/nexus-date-picker.js`.
- Integrated calendar grid matrix engine (`generateCalendarGrid`), date formatting (`formatDate`), and range selection validation (`validateDateRange`) in `datePickerService.js`.
- Implemented single date and date-range selection modes with custom event dispatches (`date-select`, `range-select`).
- Added quick preset range sidebar (`Today`, `Yesterday`, `Last 7 Days`, `Last 30 Days`, `This Month`, `Last Month`).
- Implemented dark and light theme switching (`theme="dark|light"`).
- Built Express server backend in `server.js` with static asset routing and API endpoints (`/api/calendar/grid`, `/api/presets`, `/api/snippets`).
- Built showcase landing page in `public/index.html` featuring live component preview, interactive attribute controls, and multi-framework integration code vault (React, Vue, Angular, Svelte, Vanilla).
- Added 9 Vitest unit tests in `datePickerService.spec.js` (100% pass rate).
