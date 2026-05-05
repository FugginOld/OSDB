# CI-Style AI Workflow

## Purpose

This workflow enforces a **repeatable, low-token, high-quality AI development process**.

It ensures:

* predictable changes
* strict scope control
* proper agent usage
* minimal token waste
* safe, test-driven delivery

---

## Workflow Overview (Mandatory Order)

```text
Context → Plan → Issue → Branch → Test → Change → Diagnose → Review → PR → Merge
```

Agents MUST NOT skip steps.

---

# Gate 0 — Repo Setup (Run Once)

### Command

```text
/setup-matt-pocock-skills
```

### Verify Files Exist

```text
AGENTS.md
CONTEXT.md
docs/agents/ci-style-ai-workflow.md
docs/agents/ai-usage-budget.md
docs/agents/agent-handoff-template.md
docs/adr/
.github templates
```

### Pass Condition

* Repo is AI-ready
* Workflow + rules are enforced

---

# Gate 1 — Context (Claude)

### Agent

Claude

### Commands

```text
/caveman lite
/grill-with-docs
/zoom-out
```

### Prompt

```text
Use AGENTS.md and CONTEXT.md.

Identify:
- affected files
- domain terminology
- related architecture decisions
- smallest safe change

Do NOT propose implementation yet.
```

### Pass Condition

* Scope is clearly defined
* No unknown domain terms
* No architecture conflicts ignored

---

# Gate 2 — Plan → Issue (Claude)

### Commands

```text
/to-prd
/to-issues
```

### Prompt

```text
Break this work into the smallest independent issue.

Include:
- problem
- acceptance criteria
- files likely touched
- tests required
- risks
- rollback plan

Do NOT combine multiple concerns.
```

### Pass Condition

* Issue is independently completable
* Fits in one branch
* Has clear acceptance criteria

---

# Gate 3 — Branch (Human or Codex)

### Command

```bash
git checkout -b agent/<issue-number>-short-name
```

### Rules

* One branch per issue
* Clean working tree required

---

# Gate 4 — TDD Loop (Codex / ChatGPT)

### Commands

```text
/caveman full
/tdd
```

### Prompt

```text
Use AGENTS.md and CONTEXT.md.

Work only on this issue.

Loop:
1. Write or identify failing test
2. Run test and confirm failure
3. Implement smallest possible fix
4. Run test and confirm pass
5. Refactor only if tests stay green

Do NOT:
- modify unrelated files
- redesign architecture
- skip tests unless justified
```

### Pass Condition

* Tests exist or justification provided
* Smallest change implemented
* No scope creep

---

# Gate 5 — Diagnose (Codex → Claude if needed)

### Command

```text
/diagnose
```

### Prompt

```text
Validate this change.

Check:
- expected behavior
- edge cases
- regressions
- assumptions

List any risks or gaps.
```

### Pass Condition

* No unresolved blockers
* Critical paths tested
* Risks identified

---

# Gate 6 — Architecture Check (Claude, if needed)

### Command

```text
/improve-codebase-architecture
```

### Prompt

```text
Evaluate ONLY if needed.

Did this change:
- preserve behavior?
- avoid duplication?
- align with CONTEXT.md?
- introduce unnecessary abstraction?

Reject overengineering.
```

### Pass Condition

* No unnecessary abstraction
* No duplication introduced
* No ADR conflicts

---

# Gate 7 — Local CI (Codex / Human)

### Run Checks (examples)

```bash
git status
npm test
npm run lint
pytest
ruff check .
mypy .
```

### Pass Condition

* All checks pass
* Failures fixed or documented

---

# Gate 8 — Final Review (Claude)

### Commands

```text
/caveman lite
/diagnose
```

### Prompt

```text
Use AGENTS.md.

Review ONLY this diff.

Block for:
- correctness issues
- missing tests
- risky assumptions
- unnecessary complexity
- architecture conflicts

Do NOT review entire repo.
```

### Pass Condition

* Issues resolved
* Risks documented

---

# Gate 9 — Pull Request

### Command

```bash
gh pr create --fill
```

### PR Must Include

* linked issue
* summary
* tests run
* risks
* rollback plan

---

# Gate 10 — Merge

### Commands

```bash
git status
git pull --rebase
```

### Merge Only If

* acceptance criteria met
* tests pass
* review complete
* no unresolved comments

---

# Agent Usage Rules (Enforced)

### Claude

* planning
* architecture
* review

### Codex / ChatGPT

* implementation
* testing
* debugging

### Copilot

* inline assistance only

---

# Token Optimization Rules

### NEVER

* send full repo repeatedly
* resend unchanged context
* include long logs untrimmed

### ALWAYS

* send minimal diff
* send relevant files only
* summarize outputs

---

# Required Output Format (All Agents)

```text
Changed files:
Commands run:
Tests passing:
Known risks:
Next step:
```

---

# Handoff Rule (Mandatory)

When switching agents:

Use:

```text
docs/agents/agent-handoff-template.md
```

Rules:

* do not restart work
* do not expand scope
* continue from current branch

---

# Escalation Rules

Escalate to Claude ONLY when:

* architecture unclear
* requirements conflict
* behavior ambiguous
* multi-system impact

DO NOT escalate for:

* small bugs
* syntax errors
* test failures

---

# Core Principles

* Small changes win
* Tests validate behavior
* Scope must stay tight
* Tokens are limited → use them intentionally
* Workflow discipline > speed
