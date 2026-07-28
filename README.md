# 📅 Lit Reusable Web Component Date Picker — Build 48

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20Demo-000000?style=for-the-badge&logo=vercel)](https://lit-reusable-date-picker-build48.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/breakingthebot/lit-reusable-date-picker-build48)
[![Tests](https://img.shields.io/badge/Vitest-21%20Passed-6E9F18?style=for-the-badge&logo=vitest)](file:///C:/Users/marve/Desktop/AI-286-Builds/Build_48/datePickerService.spec.js)
[![Version](https://img.shields.io/badge/Release-v1.1.0-blue?style=for-the-badge)](file:///C:/Users/marve/Desktop/AI-286-Builds/Build_48/CHANGELOG.md)

---

## 🌟 Overview

**NexusCloud Lit Reusable Date Picker** is an enterprise-grade, framework-agnostic Shadow DOM Web Component built with **Lit 3.x**. Designed for seamless integration into any frontend architecture—**React, Vue 3, Angular 17+, Svelte, or Vanilla HTML/JS**—it delivers single-date and date-range selection, quick preset ranges, custom formatting, and dark/light theme switching with zero third-party UI framework dependencies.

### 🌐 Live Production Demo
- **Live Vercel Application**: [https://lit-reusable-date-picker-build48.vercel.app](https://lit-reusable-date-picker-build48.vercel.app)
- **GitHub Codebase**: [https://github.com/breakingthebot/lit-reusable-date-picker-build48](https://github.com/breakingthebot/lit-reusable-date-picker-build48)

---

## 🔥 Key Features

- **🧩 Framework-Agnostic Web Component**: Encapsulated Shadow DOM element (`<nexus-date-picker>`) compatible with React, Vue, Angular, Svelte, and Vanilla JS.
- **📊 Real-Time Interactivity Funnel Analytics**: Dispatched `date-picker-analytics` events logging modal opens, date selections, and preset clicks.
- **🎨 Glassmorphism Multi-Theme Preset Vault**: 4 aesthetic design system presets (`theme="dark|cyber|light|midnight"`) driven by CSS variable design tokens.
- **🚀 Year & Month Quick Jump Picker**: Interactive header dropdown selectors allowing instant long-distance calendar navigation across years (2020-2035) and months.
- **⚡ Forward Jump Relative Presets (+7d / +30d / +90d)**: Rapid future date range shortcuts allowing single-click selection of upcoming project windows.
- **📝 Form Associated Custom Element & Input Sync**: Native `<form>` integration (`formAssociated = true`, `ElementInternals`, `name`, `required`) with hidden value binding and constraint validation.
- **🌍 Multilingual i18n & Locale Engine**: Configurable localization (`locale="en|es|fr|de"`) with translated month names and configurable start-of-week (`first-day-of-week="0|1"` for Sunday or Monday).
- **📌 Custom Highlight Markers & Event Badges**: Configurable event markers (`enable-events="true"`) rendering colored dot indicators, hover tooltips, and event payload details.
- **📅 Multi-Month Dual View Renderer**: Configurable dual month panels (`view-months="2"`) rendering side-by-side consecutive months for seamless cross-month range picking.
- **⏰ Integrated Time Picker Extension (HH:MM)**: Combined Date & Time selection mode (`enable-time="true"`) with integrated time selector inputs and DateTime payload outputs.
- **⌨️ Keyboard Navigation & WCAG 2.1 AA Accessibility**: Full arrow key date grid traversal (`ArrowLeft`/`ArrowRight`/`ArrowUp`/`ArrowDown`), `PageUp`/`PageDown` month jumps, `Home`/`End` month boundary jumps, and ARIA grid roles (`role="grid"`, `aria-selected`, `aria-disabled`).
- **📅 Single & Range Selection Modes**: Supports single date selection as well as dual-click start/end date range picking with visual range highlights.
- **⚡ Quick Preset Date Ranges**: One-click selection for *Today*, *Yesterday*, *Last 7 Days*, *Last 30 Days*, *This Month*, and *Last Month*.
- **🎨 Dark & Light Mode Customization**: Configurable `theme="dark|light"` attribute with crisp glassmorphic CSS variables.
- **📐 Custom Date Formatting**: Flexible output formats including `YYYY-MM-DD`, `MM/DD/YYYY`, `DD/MM/YYYY`, and `MMM DD, YYYY`.
- **📢 Custom Event Dispatches**: Standardized DOM events (`date-select`, `range-select`) carrying rich payload data (`{ value, rangeStart, rangeEnd, formatted }`).
- **💻 Integration Vault**: Interactive code snippet viewer providing copy-paste integration code for 5 major frontend stacks.

---

## 💻 Quick Usage Example

```html
<!-- Include Web Component script -->
<script type="module" src="https://cdn.nexuscloud.ai/components/nexus-date-picker.js"></script>

<!-- Render Date Range Picker -->
<nexus-date-picker 
  mode="range" 
  format="YYYY-MM-DD" 
  theme="dark"
></nexus-date-picker>

<script>
  const picker = document.querySelector('nexus-date-picker');
  picker.addEventListener('range-select', (e) => {
    console.log('Selected Date Range:', e.detail.formatted);
  });
</script>
```

---

## 🧪 Unit Testing

Run the Vitest unit test suite covering calendar matrix generation, range validation, and formatting:

```bash
npm test
```

---

## 🛠️ Tech Stack

- **Web Component**: Lit 3.x / Native Custom Elements & Shadow DOM
- **Backend API**: Express.js
- **Styling**: Glassmorphic Vanilla CSS
- **Testing**: Vitest
- **Deployment**: Vercel
