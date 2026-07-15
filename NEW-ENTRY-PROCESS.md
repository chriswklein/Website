# New Entry Process

Rules for creating Work entries (`work/`) and Thought entries (`thoughts/`).

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
