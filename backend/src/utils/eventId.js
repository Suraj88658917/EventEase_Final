const { format } = require('date-fns');

/**
 * Generates a random 3-character alphanumeric string
 */
function random3() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let s = '';
  for (let i = 0; i < 3; i++) {
    s += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return s;
}

/**
 * Generate a unique Event ID in format: EVT-MMMYYYY-XXX
 * Example: EVT-SEP2025-A1B
 * @param {Date} date - Optional, defaults to current date
 */
function generateEventId(date = new Date()) {
  const m = format(date, 'MMM').toUpperCase();
  const y = format(date, 'yyyy');
  return `EVT-${m}${y}-${random3()}`;
}

module.exports = generateEventId;
