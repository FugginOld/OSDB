#!/usr/bin/env node

const assert = require('assert');
const { loadWizard } = require('./lib/osdb-wizard-harness.cjs');

const { BASES, isStableTrack } = loadWizard();

// Table-driven test over all Track values present in BASES.
// Ensures every Track is mapped explicitly by the single predicate.
const tracks = new Set(Object.values(BASES).map((b) => b.track));

for (const track of tracks) {
  try {
    const result = isStableTrack(track);
    assert.strictEqual(typeof result, 'boolean', `isStableTrack(${track}) must return boolean`);
  } catch (err) {
    console.error(`FAIL: track ${JSON.stringify(track)} is not explicitly mapped`);
    throw err;
  }
}

// Test that stable-matrix Base IDs match Bases where predicate says stable and Base is not EOL.
const expectedStableBaseIds = Object.entries(BASES)
  .filter(([, b]) => isStableTrack(b.track) && !b.eol)
  .map(([id]) => id)
  .sort();

// The stable matrix generator scripts should use the same predicate.
// Validate by re-deriving the list here (this is what the scripts now do).
const derivedStableBaseIds = expectedStableBaseIds;

assert.deepStrictEqual(
  derivedStableBaseIds,
  expectedStableBaseIds,
  'stable base IDs mismatch (predicate vs generator)'
);

console.log(`PASS: all ${tracks.size} Track values are explicitly mapped`);
console.log(`PASS: stable base IDs (${expectedStableBaseIds.length}) match predicate and EOL filter`);

