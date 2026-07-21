# Prompt Guide — Claude Code Session Rules
**Version:** 1.0.0
**Last Updated:** 2026-07-12
**Purpose:** Defines which resources to load and which tools to use for each task type. Follow this document at the start of every session to avoid loading unnecessary context and consuming excess tokens.

---

## Rule 1 — Always Read First

`REFERENCE.md` is required reading for every session without exception. It contains project decisions, coding standards, branching strategy, and session handoff notes that apply to all tasks.

---

## Rule 2 — Resource Loading by Task Type

Use this table to determine which additional documents and tools to load before starting any task. Load only what is listed for the task type. Do not load additional resources speculatively.

| Task Type | REFERENCE.md | DESIGN-SYSTEM.md | COMPONENTS.md | style.css | Figma MCP |
|---|---|---|---|---|---|
| CSS bug fix | ✅ Required | ❌ Skip | ❌ Skip | ✅ Required | ❌ Skip |
| Spacing or typography fix | ✅ Required | ✅ Required | ❌ Skip | ✅ Required | ❌ Skip |
| Accessibility fix | ✅ Required | ✅ Required | ✅ Required | ✅ Required | ❌ Skip |
| Colour or token fix | ✅ Required | ✅ Required | ❌ Skip | ✅ Required | ❌ Skip |
| Content update (HTML text only) | ✅ Required | ❌ Skip | ❌ Skip | ❌ Skip | ❌ Skip |
| Documentation update only | ✅ Required | Optional | Optional | ❌ Skip | ❌ Skip |
| New component build | ✅ Required | ✅ Required | ✅ Required | ✅ Required | ✅ Required |
| Existing component fix | ✅ Required | ✅ Required | ✅ Required | ✅ Required | ❌ Skip |
| Layout restructure | ✅ Required | ✅ Required | ✅ Required | ✅ Required | ✅ Required |
| New page build | ✅ Required | ✅ Required | ✅ Required | ✅ Required | ✅ Required |
| Standard page content build | ✅ Required | ✅ Required | ✅ Required | ✅ Required | Optional |
| Design system sync | ✅ Required | ✅ Required | ✅ Required | ✅ Required | ✅ Required |
| Figma component creation | ✅ Required | ✅ Required | ✅ Required | ❌ Skip | ✅ Required |
| Preview page regeneration | ✅ Required | ✅ Required | ✅ Required | ✅ Required | ❌ Skip |
| Git operations only | ✅ Required | ❌ Skip | ❌ Skip | ❌ Skip | ❌ Skip |

---

## Rule 3 — Figma MCP Usage

**Connect to Figma only when the task type column says ✅ Required or Optional.**

When connecting to Figma:
- Always navigate to the "Design System" page — not the Components page
- Read the specific component variant referenced in the prompt
- Use the exact CSS values from the Figma inspect panel — never approximate
- Do not browse unrelated frames or components

**Never connect to Figma for:**
- Bug fixes
- CSS property adjustments
- Accessibility attribute corrections
- Documentation updates
- Git operations
- Any task where exact pixel values are not needed

If a prompt does not explicitly mention Figma or reference a specific component variant, do not connect to Figma.

---

## Rule 4 — style.css Loading

Read `style.css` only when the task requires writing or modifying CSS. For documentation-only tasks, content updates, or git operations, skip it entirely.

When reading `style.css`, read the full file once before making any edits. Do not read it in sections across multiple tool calls unless the file exceeds context limits.

---

## Rule 5 — Scope Discipline

Each prompt defines an explicit scope. Do not modify files or make changes outside the stated scope even if you identify other issues. Flag unrelated issues at the end of your report rather than fixing them silently.

If a prompt says "do not modify anything else" — that instruction is absolute. No exceptions.

---

## Rule 6 — Verification Before Reporting

After completing all tasks, run these checks before reporting completion:

- Grep for any hardcoded hex values introduced in CSS — none are permitted
- Grep for any inline styles introduced in HTML — none are permitted
- Confirm no files outside the stated scope were modified
- Confirm all CSS values reference CSS variables from `style.css`
- When changing a link's destination, also check whether its aria-label or visible text still accurately describes the new destination — correct any stale or placeholder wording found rather than leaving it mismatched.
- When a value referenced in existing markup (a tag, a slug, a label) doesn't yet exist in the data source, check whether it's already implied elsewhere in the codebase before deciding whether to add it, flag it, or ask — don't silently invent a different value or drop it.

Report what changed in each file. If nothing changed in a file, say so explicitly.

---

## Rule 7 — Server Verification

Do not launch a local server to verify changes unless the task involves:
- JavaScript behaviour — toast notifications, scroll events, clipboard API, tab bar active state
- Cross-component interactions — nav injection, footer injection via fetch()
- First build of a new page

For CSS fixes, token changes, HTML content updates, and documentation — skip server verification. State what changed and what to check. The developer verifies visually via Live Server.

---

## Rule 8 — Commit Messages

When asked to commit changes, use lowercase descriptive messages matching the project standard:

```
"fix card paragraph max-width constraint"
"add tag hover specificity for feature and thought cards"
"centre standard page content block"
```

Never use generic messages like "update styles" or "fix bugs".

---

## Quick Reference — Most Common Task Types

**CSS bug fix** → Read: `REFERENCE.md`, `style.css` only

**New component** → Read: all three docs + `style.css` + connect Figma

**Accessibility fix** → Read: all three docs + `style.css`, no Figma

**Content update** → Read: `REFERENCE.md` only

**Documentation update** → Read: `REFERENCE.md` + relevant docs only

