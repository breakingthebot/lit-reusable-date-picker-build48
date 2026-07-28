// server.js
// Express Server for NexusCloud Lit Reusable Date Picker Web Component Showcase.
// Created: 2026-07-28

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  generateCalendarGrid,
  getPresetRanges,
  getFrameworkSnippet,
  validateDateRange,
  formatDate
} from './datePickerService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/datePickerService.js', express.static(path.join(__dirname, 'datePickerService.js')));

// GET /api/calendar/grid - Return 42-cell calendar grid for month & year
app.get('/api/calendar/grid', (req, res) => {
  try {
    const year = parseInt(req.query.year || new Date().getFullYear());
    const month = parseInt(req.query.month || new Date().getMonth());
    const selectedDate = req.query.selectedDate || '';
    const rangeStart = req.query.rangeStart || '';
    const rangeEnd = req.query.rangeEnd || '';
    const minDate = req.query.minDate || '';
    const maxDate = req.query.maxDate || '';
    const disabledDates = req.query.disabledDates ? req.query.disabledDates.split(',') : [];

    const grid = generateCalendarGrid(year, month, {
      selectedDate,
      rangeStart,
      rangeEnd,
      minDate,
      maxDate,
      disabledDates
    });

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return res.json({
      success: true,
      year,
      month,
      monthName: monthNames[month],
      grid
    });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

// GET /api/presets - Return quick preset ranges
app.get('/api/presets', (req, res) => {
  return res.json({ success: true, presets: getPresetRanges() });
});

// GET /api/snippets - Return framework integration code snippets
app.get('/api/snippets', (req, res) => {
  const framework = req.query.framework || 'react';
  const mode = req.query.mode || 'single';
  const snippet = getFrameworkSnippet(framework, mode);
  return res.json({ success: true, framework, mode, snippet });
});

// POST /api/validate-range - Validate date range selection
app.post('/api/validate-range', (req, res) => {
  const { rangeStart, rangeEnd, minDate, maxDate } = req.body || {};
  const validation = validateDateRange(rangeStart, rangeEnd, minDate, maxDate);
  return res.json({ success: validation.isValid, ...validation });
});

// Fallback route serving index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`⚡ NexusCloud Lit Date Picker server running at http://localhost:${PORT}`);
});
