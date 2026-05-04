# AI-Assisted Development Workflow

This repo uses a structured CI-style AI workflow that assigns the right work to the right AI tool, keeps changes small and reviewable, and protects against session limits and runaway token usage.

---

## The Core Idea

Most AI coding failures come from one mistake: using a powerful reasoning model (Claude) for everything. That's expensive, slow, and burns through session limits fast.

This workflow fixes that by splitting responsibilities:

| AI Tool | Role | When |
|---------|------|------|
| **Claude** | Planner / Reviewer | Start and end of every change |
| **Codex / ChatGPT** | Builder | All implementation, test loops, debugging |
| **GitHub Copilot** | Inline Assistant | Autocomplete and small edits, always |

Claude thinks. Codex builds. Copilot assists.

---

## Workflow at a Glance

```
Context → Plan → Issue → Branch → Test → Change → Diagnose → Review → Merge
```

Every change follows this sequence — no skipping gates. See [`docs/agents/ci-style-ai-workflow.md`](docs/agents/ci-style-ai-workflow.md) for full gate definitions.

---

## Key Tools

### Matt Pocock Skills
A set of slash commands that give AI agents structured instructions for common tasks. Install once per repo:

```bash
npx skills@latest add mattpocock/skills
```

Then activate in any agent session:
```text
/setup-matt-pocock-skills
```

Key commands: `/grill-with-docs` · `/zoom-out` · `/to-prd` · `/to-issues` · `/tdd` · `/diagnose` · `/improve-codebase-architecture`

### Caveman Mode
A Claude Code skill that reduces token usage by ~65% through compressed output. Install:

```bash
npx skills add JuliusBrussee/caveman
```

Use it in every AI session:
```text
/caveman lite   # planning and review (Claude)
/caveman full   # implementation (Codex)
```

> Do **not** use Caveman when writing documentation, PRDs, ADRs, or user-facing copy.

---

## Companion Docs

| File | Purpose |
|------|---------|
| [`docs/agents/ci-style-ai-workflow.md`](docs/agents/ci-style-ai-workflow.md) | Gate-by-gate workflow with pass conditions |
| [`docs/agents/ai-usage-budget.md`](docs/agents/ai-usage-budget.md) | Agent budget rules, session-saving prompts, escalation rules |
| [`docs/agents/agent-handoff-template.md`](docs/agents/agent-handoff-template.md) | Handoff template when switching agents |
| [`docs/agents/repo-bootstrap-checklist.md`](docs/agents/repo-bootstrap-checklist.md) | Step-by-step setup for a new repo |
| [`HOWTO.md`](HOWTO.md) | Step-by-step usage guide for the full workflow |

---

## Non-Negotiable Rules

- One issue at a time · one branch per issue
- Small, reviewable changes only
- No redesign during a bug fix
- No abstraction before behavior works
- Tests before implementation when practical
- Run local checks before every PR
- Update `CONTEXT.md` when domain vocabulary changes
- Add an ADR for every architecture decision

---

## Required Repo Files

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
