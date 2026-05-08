'use strict';

/**
 * Normalize snapshot text for consistent comparison:
 * - Replace the generated timestamp with a placeholder so diffs don't fail on date changes
 * - Convert CRLF and bare CR to LF to avoid false failures on Windows checkouts
 * - Ensure the text ends with exactly one newline
 */
function normalizeSnapshotText(script) {
  const normalizedTimestamp = script.replace(
    /^# Generated At \(UTC\): .+$/m,
    '# Generated At (UTC): <TIMESTAMP>',
  );
  const normalizedNewlines = normalizedTimestamp.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  if (normalizedNewlines.length === 0 || normalizedNewlines.endsWith('\n')) return normalizedNewlines;
  return `${normalizedNewlines}\n`;
}

module.exports = { normalizeSnapshotText };
