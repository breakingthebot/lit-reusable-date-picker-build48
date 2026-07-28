# Changelog - Build 48: Lit Reusable Date Picker Web Component

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.8.0] - 2026-07-28

### Added
- Integrated **Date Picker Min/Max Relative Shortcut Presets (+7d / +30d)** in `datePickerService.js` and `public/nexus-date-picker.js`.
- Added forward relative date range calculator (`getRelativePresets`).
- Updated `<nexus-date-picker>` preset sidebar rendering section headers (*Past Presets*, *Future Jumps*) with relative jump buttons (`Next 7 Days (+7d)`, `Next 14 Days (+14d)`, `Next 30 Days (+30d)`, `Next 90 Days (+90d)`).
- Added unit tests in `datePickerService.spec.js` (18 total unit tests passing).

## [0.7.0] - 2026-07-28

### Added
- Integrated **Date Picker Form Validation & Input Sync Integration** in `datePickerService.js` and `public/nexus-date-picker.js`.
- Added Form Association constraint validation helper (`validateFormAssociation`).
- Updated `<nexus-date-picker>` with `formAssociated = true`, `ElementInternals` API integration (`attachInternals`, `setFormValue`, `setValidity`), hidden input synchronization, and attributes `name` and `required`.
- Added HTML Form Interoperability Sandbox with `<form id="demoForm">` and live submission status banner in `public/index.html`.
- Added unit tests in `datePickerService.spec.js` (17 total unit tests passing).

## [0.6.0] - 2026-07-28

### Added
- Integrated **Date Picker Internationalization & Locale Engine (i18n)** in `datePickerService.js` and `public/nexus-date-picker.js`.
- Added multi-language locale translation dictionaries (`getLocaleTranslations`) for English (`en`), Spanish (`es`), French (`fr`), and German (`de`).
- Updated `<nexus-date-picker>` with attributes `locale` and `first-day-of-week` (`0` for Sunday, `1` for Monday), translated month titles & weekday header rows, and Monday-first day grid layouts.
- Added Locale Language and First Day of Week selectors in live controls configurator in `public/index.html`.
- Added unit tests in `datePickerService.spec.js` (16 total unit tests passing).

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
