# Markdown lint policy

## Goal
Keep markdownlint output actionable by linting repo-owned documentation and excluding externally managed content.

## Scope

Linted (repo-owned):
- `/*.md` (for example `README.md`, `HOWTO.md`, `AGENTS.md`)
- `/docs/**/*.md`

Excluded (managed content):
- `/.agents/skills/**` (skill docs are managed outside this repository)

## Configuration files
- `/.markdownlint.jsonc`: authoritative rule configuration (used by editors and extended by cli2)
- `/.markdownlintignore`: ignore list for tools that support it
- `/.markdownlint-cli2.jsonc`: markdownlint-cli2 entrypoint (globs + extends `/.markdownlint.jsonc`)

## Rules
The repo config disables a small set of high-noise style rules (for example table spacing and mandatory fence languages) to match the existing documentation style and keep CI output regression-focused.

## How to run
Preferred:
- `npx -y markdownlint-cli2`

Notes:
- Running markdownlint across `**/*.md` will include `/.agents/skills/**` unless you use the repo config (or add a negated glob).
