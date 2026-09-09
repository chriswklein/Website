# Prompt Guide — Claude Code Session Rules
**Version:** 1.2.0
**Last Updated:** 2026-08-21
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
 
## Rule 3a — Component Reuse Takes Priority Over Figma/Design-Doc Literal Values (added 8/18)
 
Before implementing any element that resembles an existing pattern already in use elsewhere on the live site — tag/chip pills, buttons, card body text, labels, etc. — check whether that pattern already exists as a reusable class in `style.css` (see COMPONENTS.md for the current inventory). If it does, **reuse that class/size as-is.** Do not derive a new, parallel size for that same kind of element by mapping a Figma or spec-doc pixel value to the "nearest" token — nearest-token mapping is for genuinely new values, not a substitute for reusing an existing component.
 
This rule exists because of a concrete failure: the 8/18 Standard Page redesign mapped the pasted Figma spec's literal tag/text pixel values to their nearest design tokens rather than reusing the site's already-established `.tag` pill size and body-text scale, producing a visibly inconsistent result (oversized tags and card text) that had to be corrected in a follow-up pass. Figma/spec-doc values represent design *intent*; they are not license to diverge from a pattern the site has already built and uses elsewhere. When in doubt, grep the codebase for the existing pattern before writing new CSS for something that looks similar.
 
---
 
## Rule 4 — style.css Loading
 
Read `style.css` only when the task requires writing or modifying CSS. For documentation-only tasks, content updates, or git operations, skip it entirely.
 
When reading `style.css`, read the full file once before making any edits. Do not read it in sections across multiple tool calls unless the file exceeds context limits.
 
---
 
## Rule 5 — Scope Discipline
 
Each prompt defines an explicit scope. Do not modify files or make changes outside the stated scope even if you identify other issues. Flag unrelated issues at the end of your report rather than fixing them silently.
 
If a prompt says "do not modify anything else" — that instruction is absolute. No exceptions.
 
---
 
## Rule 5a — Breakpoint Consistency by Default (added 8/21)
 
Unless a prompt or spec doc explicitly scopes a decision to one specific breakpoint (mobile, tablet, or desktop) — by naming it — assume the decision should apply consistently across **all three**. Breakpoint-specific behavior is the exception, not the default, and should only be built when a prompt calls it out by name.
 
If a prompt or spec doc is ambiguous about whether something should span all three breakpoints or stay scoped to just one or two, do not decide unilaterally either way. Flag it explicitly and check with Chris before implementing — this is the same "flag rather than decide silently" principle Rule 5 applies to scope in general, applied specifically to breakpoint coverage.
 
This rule exists because of a concrete case: the 8/21 Archive filter redesign spec's Prompt B (remove Load More/entry cap) and Prompt C (no-results empty state) were both still labeled "both breakpoints" — leftover phrasing from an earlier two-breakpoint (mobile + desktop) version of the plan, written before the redesign was revised to explicitly unify all three breakpoints (mobile, tablet, desktop) on one shared Filter Drawer pattern. Nothing about either decision was ever meant to exclude tablet; it was stale wording, not an intentional breakpoint-specific choice — but nothing forced a check before it could have been read literally and shipped that way.
 
---
 
## Rule 6 — Verification Before Reporting
 
After completing all tasks, run these checks before reporting completion:
 
- Grep for any hardcoded hex values introduced in CSS — none are permitted
- Grep for any inline styles introduced in HTML — none are permitted
- Confirm no files outside the stated scope were modified
- Confirm all CSS values reference CSS variables from `style.css`
- Confirm any element resembling an existing site pattern (tags, buttons, card text, etc.) reuses that pattern's actual class/size rather than a new parallel value — see Rule 3a
- Confirm the change was applied consistently across all breakpoints the decision covers per Rule 5a (all three by default, unless explicitly scoped narrower) — not just the breakpoint that happened to be top of mind
- When a browser-automation tool (Playwright/Chrome) is available, use it to confirm the rendered result at mobile, tablet, and desktop widths — do not rely on static code/CSS review alone when a rendering check is possible. If no such tool is available in the session, say so explicitly in the completion report rather than reporting full verification.

**Report file changes concisely.**
What changed: file(s) and the specific rule/element.
How: the mechanism (one line, no restating the diff).
Why: root cause or reason, only if non-obvious.
Learned: only if something generalizes beyond this task.
Skip: reassurance language, restating the TLDR, narrating each verification step performed. State the result, not the process of getting there. If a judgment call was made, one line: what was decided and why — no framing paragraph.
 
---
 
## Rule 7 — Commit Messages
 
When asked to commit changes, use lowercase descriptive messages matching the project standard:
 
```
"fix card paragraph max-width constraint"
"add tag hover specificity for feature and thought cards"
"centre standard page content block"
```
 
Never use generic messages like "update styles" or "fix bugs".
 
---

## Rule 8 — Known Gotchas

**Local dev server caching:** Local dev servers (e.g. Python's `http.server`) send no cache-control headers, and Chromium will silently keep serving a cached copy of `style.css`, `script.js`, or even the HTML document itself across navigations in the same browser tab — even after the file changed on disk. This produces false-negative verification results: a fix looks like it "didn't work" when it's actually just not being loaded.

If an edit doesn't appear to take effect during Playwright/browser verification, don't conclude the change is wrong — first restart the dev server on a fresh port (forces a new origin, guaranteeing no cached assets) before re-checking. A same-tab stylesheet-only reload (replacing the `<link>` element via `page.evaluate`) can work for CSS alone, but a fresh port is the reliable fix when HTML or script.js are also in question.

---
 
## Quick Reference — Most Common Task Types
 
**CSS bug fix** → Read: `REFERENCE.md`, `style.css` only
 
**New component** → Read: all three docs + `style.css` + connect Figma
 
**Accessibility fix** → Read: all three docs + `style.css`, no Figma
 
**Content update** → Read: `REFERENCE.md` only
 
**Documentation update** → Read: `REFERENCE.md` + relevant docs only
 