# HOWTO — Run the AI CI Workflow

This is a **quickstart guide** for executing the workflow.

👉 Full workflow definition (gates, prompts, rules):
`docs/agents/ci-style-ai-workflow.md`

👉 Rules and constraints:
`AGENTS.md`

---

## Quick Start (End-to-End)

## 1. Start in Claude (Context + Planning)

Open Claude and run:

```text
/caveman lite
/grill-with-docs
/zoom-out
```

Then follow:
→ `ci-style-ai-workflow.md` Gate 1 (Context)

---

## 2. Create Issues (Claude)

```text
/to-prd
/to-issues
```

Then:

* Pick **ONE issue only**
* Ensure it has acceptance criteria

---

## 3. Create Branch (Terminal)

```bash
git status
git checkout -b agent/<issue-number>-short-name
```

---

## 4. Switch to Codex / ChatGPT (Implementation)

Before switching:

* Use the handoff template:
  `docs/agents/agent-handoff-template.md`

Then run:

```text
/caveman full
/tdd
```

Follow:
→ `ci-style-ai-workflow.md` Gate 4 (TDD Loop)

---

## 5. Implement + Test (Codex)

* Write failing test
* Implement smallest fix
* Confirm tests pass
* Do NOT modify unrelated files

---

## 6. Diagnose (Codex)

```text
/diagnose
```

If unclear or risky:
→ escalate to Claude

---

## 7. Final Review (Claude)

Switch back to Claude:

```text
/caveman lite
/diagnose
```

Review **diff only**, not full repo.

---

## 8. Create PR + Merge

```bash
gh pr create --fill
```

Before merge:

```bash
git status
git pull --rebase
```

---

## Required Rules (Always Apply)

* One issue per branch
* Smallest possible change
* Tests first when practical
* No redesign mid-task
* Do NOT give Claude full repo context
* Always use Caveman mode (except docs)

---

## Agent Roles (Quick Reference)

| Task               | Agent           |
| ------------------ | --------------- |
| Context / Planning | Claude          |
| Implementation     | Codex / ChatGPT |
| Debugging          | Codex           |
| Review             | Claude          |
| Inline edits       | Copilot         |

---

## When to Escalate to Claude

Only escalate if:

* architecture is unclear
* requirements conflict
* behavior is ambiguous
* change spans multiple systems

---

## Where Everything Lives

| Purpose                    | File                        |
| -------------------------- | --------------------------- |
| Rules                      | `AGENTS.md`                 |
| Workflow (source of truth) | `ci-style-ai-workflow.md`   |
| Token optimization         | `ai-usage-budget.md`        |
| Handoff format             | `agent-handoff-template.md` |

---

## Key Principle

Do not improvise the workflow.

Follow:
→ `ci-style-ai-workflow.md` exactly
