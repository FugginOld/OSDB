const fs = require('fs');
const path = require('path');
const vm = require('vm');

function loadWizard() {
  const repoRoot = path.resolve(__dirname, '..', '..', '..');
  const wizardPath = path.join(repoRoot, 'docs', 'wizard.js');
  const raw = fs.readFileSync(wizardPath, 'utf8');

  const initIdx = raw.indexOf("document.addEventListener('DOMContentLoaded'");
  const trimmed = initIdx >= 0 ? raw.slice(0, initIdx) : raw;

  const exportSnippet = `\n;globalThis.__OSDB_TEST_EXPORTS__ = {\n  BASES,\n  PACKAGES,\n  SERVICES,\n  isStableTrack,\n  RPI_HARDWARE,\n  state,\n  initDefaultPkgs,\n  initDefaultServices,\n  generateScript\n};\n`;

  const script = `${trimmed}\n${exportSnippet}`;
  const context = {
    console,
    TextEncoder,
    TextDecoder,
    setTimeout,
    clearTimeout,
    btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
    atob: (s) => Buffer.from(s, 'base64').toString('binary'),
  };

  vm.createContext(context);
  vm.runInContext(script, context, { filename: 'wizard.js' });

  if (!context.__OSDB_TEST_EXPORTS__) {
    throw new Error('Failed to load exports from wizard.js');
  }

  return context.__OSDB_TEST_EXPORTS__;
}

module.exports = { loadWizard };
