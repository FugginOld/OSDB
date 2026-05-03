# Snapshot Tests Use Exact Diff

Snapshot Tests compare freshly generated Build Scripts against stored reference files using exact character-level diff. Any difference — including whitespace and comments — fails the test.

## Considered Options

- **Semantic diff** — only fail on functionally meaningful changes (package lists, mirror URLs, hook content). Rejected: defining "functionally meaningful" for bash scripts is fragile, and a fuzzy diff could let a subtle package-list change pass undetected.

## Consequences

Intentional changes to wizard output (rewording a comment, changing whitespace) require a deliberate snapshot update. This is the intended behaviour — it forces every output change to be a conscious act rather than an accident.
