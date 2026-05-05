# AGENTS.md

## Purpose

This repository uses a **CI-style AI workflow** to ensure all AI-assisted changes are:

* Predictable
* Reviewable
* Safe
* Token-efficient

This system is optimized for:

* Claude Pro (planning / architecture / review)
* ChatGPT / Codex (implementation / testing)
* GitHub Copilot (inline assistance)

---

## Companion Docs

| File                                      | Purpose                          |
| ----------------------------------------- | -------------------------------- |
| `docs/agents/ci-style-ai-workflow.md`     | Full gate-by-gate workflow       |
| `docs/agents/ai-usage-budget.md`          | Token usage rules and escalation |
| `docs/agents/agent-handoff-template.md`   | Required agent handoff format    |
| `docs/agents/repo-bootstrap-checklist.md` | Repo setup checklist             |

---

## Workflow Model (Mandatory)

```text
Context → Plan → Issue → Branch → Test → Change → Diagnose → Review → Merge
```

---

## Workflow Enforcement (Non-Negotiable)

All agents **MUST follow workflow gates in order**.

Agents MUST NOT:

* Skip gates
* Combine multiple issues into one branch
* Begin implementation without a defined issue
* Perform large multi-step changes in one pass

If a gate is incomplete:
→ **STOP and complete it before continuing**

---

## Agent Roles (Strict Separation)

### Claude (Planner / Reviewer)

Use for:

* `/zoom-out`
* `/grill-with-docs`
* `/to-prd`
* `/to-issues`
* architecture decisions
* ADR creation/review
* final PR review
* ambiguous `/diagnose`

Do NOT use for:

* implementation loops
* multi-file edits
* repeated debugging
* large code generation

---

### ChatGPT / Codex (Builder)

Use for:

* `/tdd`
* implementation
* writing tests
* debugging
* scripts
* local validation

Rules:

* One issue at a time
* Tests first when practical
* Smallest possible change
* Run local checks before proceeding

Do NOT:

* redesign architecture mid-task
* modify unrelated files
* work across multiple issues

---

### GitHub Copilot (Inline Only)

Use for:

* autocomplete
* boilerplate
* repetitive edits

Do NOT use for:

* architecture decisions
* repo-wide reasoning
* replacing Codex or Claude roles

---

## Caveman Mode (Required)

```text
/caveman lite   → planning / review
/caveman full   → implementation
```

Use Caveman mode unless writing:

* documentation
* PR descriptions
* ADRs
* README content

---

## Required Output Format (All Agents)

Every response MUST end with:

```text
Changed files:
Commands run:
Tests passing:
Known risks:
Next step:
```

Failure to include this = incomplete response

---

## Scope Control (Strict)

Agents MUST NOT:

* modify unrelated files
* refactor outside issue scope
* introduce new abstractions unless required
* expand task beyond issue definition

If additional work is discovered:
→ Create a **new issue**

---

## Token Usage Rules (Enforced)

### Claude Input Constraints

Claude MUST only receive:

* `AGENTS.md`
* `CONTEXT.md`
* issue description
* changed files
* relevant snippets only
* `git diff`
* trimmed test output

Do NOT provide:

* full repo dumps
* repeated context
* large generated files
* long logs without trimming

---

### Work Distribution

| Agent         | Responsibility                     |
| ------------- | ---------------------------------- |
| Claude        | planning, architecture, review     |
| ChatGPT/Codex | implementation, testing, debugging |
| Copilot       | inline assistance                  |

---

## Escalation Rules

Escalate to Claude ONLY when:

* architecture is unclear
* requirements conflict
* behavior is ambiguous
* change spans multiple subsystems
* ADR may be required

Do NOT escalate for:

* syntax errors
* failing tests
* formatting issues
* small bugs

---

## Agent Handoff (Required)

When switching agents, you MUST use:

`docs/agents/agent-handoff-template.md`

Agents MUST:

* continue from current branch
* use existing context only
* NOT redo completed work
* NOT expand scope

---

## Agent Switching Rules

Switch **Claude → Codex** when:

* issue is clearly defined
* implementation begins

Switch **Codex → Claude** when:

* implementation is complete
* final review is needed
* risk or ambiguity is detected

---

## Matt Pocock Skills (Required)

Run once per repo:

```text
/setup-matt-pocock-skills
```

Core commands:

```text
/grill-with-docs
/zoom-out
/to-prd
/to-issues
/tdd
/diagnose
/improve-codebase-architecture
```

Rules:

* `/tdd` is REQUIRED for implementation
* `/diagnose` is REQUIRED before PR
* `/improve-codebase-architecture` only after behavior is correct

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

---

## Non-Negotiable Rules

* One issue per branch
* Small, reviewable changes only
* Tests before implementation (when practical)
* No redesign during bug fixes
* No abstraction before behavior works
* All checks must pass before PR
* Update `CONTEXT.md` when domain changes
* Create ADRs for architecture decisions

---

## Default Prompt (All AI Work)

```text
Use AGENTS.md and follow the CI workflow strictly.
Use Caveman mode unless writing docs.
Work on one issue only.
Do not modify unrelated files.
Do not redesign existing code.
Write tests first when practical.
Run all available checks.
Return results in the required output format.
```
