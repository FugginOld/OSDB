# AI-Assisted Development Workflow

This repository uses a **CI-style AI workflow** to make AI-driven development:

* predictable
* test-driven
* reviewable
* token-efficient

---

## Core Idea

Most AI workflows fail because one tool is used for everything.

This system splits responsibilities:

| Tool                | Role                               |
| ------------------- | ---------------------------------- |
| **Claude**          | Planning, architecture, review     |
| **ChatGPT / Codex** | Implementation, testing, debugging |
| **GitHub Copilot**  | Inline assistance                  |

**Claude thinks. Codex builds. Copilot assists.**

---

## Workflow Model

```text
Context → Plan → Issue → Branch → Test → Change → Diagnose → Review → Merge
```

Every change follows this sequence.

---

## How to Use This System

Start here:

👉 **Quickstart guide**
`HOWTO-AI-WORKFLOW.md`

---

Then follow:

👉 **Full workflow (source of truth)**
`docs/agents/ci-style-ai-workflow.md`

---

And obey:

👉 **Rules and constraints**
`AGENTS.md`

---

## Key Components

| File                        | Purpose                            |
| --------------------------- | ---------------------------------- |
| `AGENTS.md`                 | Rules, enforcement, agent behavior |
| `ci-style-ai-workflow.md`   | Step-by-step workflow and prompts  |
| `ai-usage-budget.md`        | Token control and agent limits     |
| `agent-handoff-template.md` | Required agent switching format    |

---

## Required Setup

Install skills once per repo:

```bash
npx skills@latest add mattpocock/skills
npx skills add JuliusBrussee/caveman
```

Then initialize:

```text
/setup-matt-pocock-skills
```

---

## Non-Negotiable Principles

* One issue at a time
* One branch per issue
* Small, testable changes only
* Tests before implementation (when practical)
* No redesign during bug fixes
* Never send full repo context to Claude
* Always follow the defined workflow

---

## Why This Works

* Reduces token usage by separating responsibilities
* Prevents scope creep with strict gates
* Improves quality with enforced TDD + review
* Keeps changes small and easy to merge

---

## Bottom Line

Do not improvise.

Follow:

* `HOWTO-AI-WORKFLOW.md` to run it
* `ci-style-ai-workflow.md` to execute it correctly
* `AGENTS.md` to enforce it
