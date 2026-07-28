# Changelog - Build 48: Lit Reusable Date Picker Web Component

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
