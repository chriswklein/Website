# New Entry Process

Rules for creating Work entries (`work/`) and Thought entries (`thoughts/`).

---

## Writing Workflow

Content is drafted outside the codebase, in Google Docs, using Docs' actual Heading 2 / Heading 3 paragraph styles for section headings (not bold text) — this keeps an outline in Docs and makes heading levels unambiguous when handing content off.

A reusable Doc structure template exists (`content-writing-template.md`, kept outside the repo) covering: slug, title, tags, date, and — for Work entries — role/timeline/tools, plus Overview/section/Outcome structure. For Thought entries: Overview/chapter/subsection structure with an optional pull quote.

Once a Doc is finished, hand the content to Claude Code with a prompt referencing this document (`NEW-ENTRY-PROCESS.md`) and the finished text. Claude Code populates the appropriate template, applies the heading ID slugification rule, creates the manifest entry, and runs the pre-commit verification checklist — this is the mechanical transfer step and should not be done by hand.

Before handoff, manually verify:
- Every tag matches an existing tag in `data/archive-entries.json` exactly (spelling and casing)
- The slug is unique
- The banner image is ready or explicitly flagged as a placeholder

---

## HTML File Creation

### Heading ID Convention

Every `<h2>` and `<h3>` within `.standard-page-content` must have an `id` attribute derived from the heading text by slugifying it: lowercase all characters, replace spaces with hyphens, strip punctuation.

| Heading Text | `id` Attribute |
|---|---|
| `Overview` | `id="overview"` |
| `The Problem` | `id="the-problem"` |
| `Research & Discovery` | `id="research-discovery"` |
| `What I Learned` | `id="what-i-learned"` |

**Scope:** `.standard-page-content h2` and `.standard-page-content h3` only. Not the page `<h1>`, not breadcrumb, not headings outside the content area.

**Purpose:** Groundwork for a future Table of Contents. Do not build any ToC UI, anchor links, or navigation — IDs only.

### Starting Point

Copy the appropriate template from `templates/`:

- **Work entry** → `templates/work-entry-template.html`
- **Thought entry** → `templates/thought-entry-template.html`

Replace all `{placeholder}` values before committing.
