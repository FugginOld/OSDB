# Domain Docs

How engineering skills should consume this repo's domain documentation when exploring codebase.

## Before exploring, read these

- **`CONTEXT.md`** at repo root, or
- **`CONTEXT-MAP.md`** at repo root if it exists (points to per-context `CONTEXT.md` files)
- **`docs/adr/`** - read ADRs that touch area you are about to change

If any missing, proceed silently. Do not flag absence or suggest creating upfront.

## File structure

Single-context repo (this repo):

```text
/
|- CONTEXT.md
|- docs/adr/
`- src/
```

Multi-context repo (if `CONTEXT-MAP.md` exists):

```text
/
|- CONTEXT-MAP.md
|- docs/adr/
`- src/
   |- <context-a>/CONTEXT.md
   `- <context-b>/CONTEXT.md
```

## Use glossary vocabulary

When output names domain concepts (issue titles, refactor proposals, hypotheses, test names), use terms from `CONTEXT.md`. Avoid synonyms glossary rejects.

## Flag ADR conflicts

If output contradicts existing ADR, surface explicitly instead of silently overriding.
