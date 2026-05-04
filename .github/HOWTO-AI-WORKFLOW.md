# HOWTO — AI CI Workflow Step-by-Step

This guide walks through every stage of the workflow in sequence.  
**AI used:** Claude · Codex / ChatGPT · GitHub Copilot

---

## Before You Start — One-Time Repo Setup

Run this once when adding the workflow to a new repo.

```bash
# Install Matt Pocock skills
npx skills@latest add mattpocock/skills

# Install Caveman
npx skills add JuliusBrussee/caveman
```

Then in your agent:
```text
/setup-matt-pocock-skills
```

Confirm these files are present (create if missing):

```text
AGENTS.md
CONTEXT.md
docs/agents/ci-style-ai-workflow.md
docs/agents/ai-usage-budget.md
docs/agents/agent-handoff-template.md
docs/adr/0000-template.md
.github/pull_request_template.md
.github/ISSUE_TEMPLATE/ai-task.md
```

See [`docs/agents/repo-bootstrap-checklist.md`](docs/agents/repo-bootstrap-checklist.md) for the full setup steps.

---

## Stage 1 — Context
**Agent: Claude**

Start every session by building context. Never skip this — it prevents scope creep and wasted tokens.

```text
/caveman lite
/grill-with-docs
/zoom-out
```

What to verify before moving on:
- Affected files are identified
- Domain terms are checked against `CONTEXT.md`
- Relevant ADRs have been reviewed
- The smallest useful change is identified

> **Pass condition:** Scope is clear. No unknown domain terms. No architecture conflict ignored.

---

## Stage 2 — Plan
**Agent: Claude**

For any non-trivial work, create a PRD and break it into issues.

```text
/to-prd
/to-issues
```

Each issue must include:
- Problem statement
- Acceptance criteria
- Likely files touched
- Tests expected
- Risk level
- Rollback note

> **Pass condition:** Each issue is independently completable and small enough for one branch.

**Session-saving prompt for Claude:**
```text
Use AGENTS.md and CONTEXT.md.
Use /caveman lite.
Do not re-read the whole repo.
Issue: #__
Branch: agent/__
Changed files: __
Tests run: __
Task: Review only this diff for correctness, missing tests, architecture conflicts, and merge risk.
```

---

## Stage 3 — Issue
**Agent: Claude or GitHub Issues via `gh`**

Create or select the issue to work on. Only one issue per session.

```bash
gh issue create
# or select an existing issue
gh issue list
```

Label with the appropriate triage label:
- `needs-triage` — not yet reviewed
- `ready-for-agent` — cleared for Codex to implement
- `ready-for-human` — needs human decision

> **Pass condition:** One issue selected. Issue has acceptance criteria.

---

## Stage 4 — Branch
**Agent: You (terminal)**

Create a branch tied to the issue. Start from a clean working tree.

```bash
git status                                    # confirm clean
git checkout -b agent/<issue-number>-short-name
```

> **Pass condition:** Branch is tied to exactly one issue.

---

## Stage 5 — Test
**Agent: Codex / ChatGPT**

Switch to Codex now. Hand off using the template in [`docs/agents/agent-handoff-template.md`](docs/agents/agent-handoff-template.md).

```text
/caveman full
/tdd
```

**Session-saving prompt for Codex:**
```text
Use AGENTS.md and CONTEXT.md.
Use /caveman full.
Work only on issue #__.
Do not redesign unrelated code.
Write or update tests first when practical.
Run available checks.
Return changed files, commands run, and remaining risks.
```

TDD loop:
1. Write or identify a failing test
2. Run test — confirm it fails
3. Implement the smallest fix
4. Run test — confirm it passes
5. Refactor only if tests stay green

> **Pass condition:** Tests added or reason documented. No unrelated rewrites.

---

## Stage 6 — Change
**Agent: Codex / ChatGPT + Copilot (inline)**

Codex implements the change. Copilot assists with autocomplete and boilerplate inline.

Codex rules:
- Work on **one issue only**
- Implement the **smallest possible change**
- Do not modify unrelated files
- Do not redesign mid-task

When Codex finishes, it must summarize:
```text
Changed files:
Commands run:
Tests passing:
Known risks:
Next recommended step:
```

**Escalate from Codex → Claude only when:**
- Architecture is unclear
- Tests conflict with expected behavior
- Requirements are ambiguous
- A change affects multiple subsystems
- An ADR may be needed

Do **not** escalate for syntax errors, normal test failures, formatting, or import fixes.

> **Pass condition:** Change is complete, tests pass, no unrelated files modified.

---

## Stage 7 — Diagnose
**Agent: Codex / ChatGPT first; Claude if needed**

```text
/diagnose
```

Check:
- Bug reproduced or feature verified
- Edge cases considered
- Assumptions listed
- Regression tests exist where practical

For medium/large changes, also run:
```text
/improve-codebase-architecture
```
Ask: *Did this change improve structure, preserve behavior, avoid duplication, and follow CONTEXT.md vocabulary?*

> **Pass condition:** No unresolved blocker. No untested critical path.

---

## Stage 8 — Review
**Agent: Claude**

Switch back to Claude for final review. Pass only the diff — not the whole repo.

```text
/caveman lite
/diagnose
```

Review prompt:
```text
Review this diff only. Block the PR for correctness issues, missing tests, risky assumptions,
unnecessary complexity, or architecture conflicts. Do not re-read the whole repo unless required.
```

Fill out the handoff template before switching:

```text
Repo: 
Branch: 
Issue: 
Goal: 
Current Status: 
Changed Files: 
Commands Run: 
Test Results: 
Known Issues: 
Remaining Work: 
```

> **Pass condition:** Review findings resolved. Remaining risks documented in PR.

---

## Stage 9 — Merge
**Agent: You (terminal)**

Create the PR and merge when all conditions are met.

```bash
gh pr create --fill
```

PR must include:
- Linked issue
- Summary of changes
- Tests run
- Known risks
- Rollback plan

Before merging:
```bash
git status
git pull --rebase
```

Merge only when:
- Issue acceptance criteria are met
- All tests pass
- No unresolved review comments
- Branch contains one focused change

---

## Quick Reference

| Stage | Agent | Key Commands |
|-------|-------|-------------|
| Context | Claude | `/caveman lite` · `/grill-with-docs` · `/zoom-out` |
| Plan | Claude | `/to-prd` · `/to-issues` |
| Issue | Claude / `gh` | `gh issue list` |
| Branch | You | `git checkout -b agent/<n>-name` |
| Test | Codex | `/caveman full` · `/tdd` |
| Change | Codex + Copilot | smallest change · one issue |
| Diagnose | Codex → Claude | `/diagnose` |
| Review | Claude | diff only · `/caveman lite` |
| Merge | You | `gh pr create --fill` |

---

## What Never Changes

- One issue at a time
- One branch per issue
- Claude plans and reviews — Codex builds — Copilot assists
- Caveman mode on for every agent session (except docs)
- Never give Claude the full repo — only what it needs
