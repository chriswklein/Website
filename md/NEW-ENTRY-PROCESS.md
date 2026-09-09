# New Entry Process

Rules for creating Work entries (`work/`) and Thought entries (`thoughts/`).

---

## Writing Workflow

Content is drafted outside the codebase, in Google Docs, using Docs' actual Heading 2 / Heading 3 paragraph styles for section headings (not bold text) — this keeps an outline in Docs and makes heading levels unambiguous when handing content off.

A reusable Doc structure template exists (`content-writing-template.md`, kept outside the repo) covering: slug, title, tags, date, and — for Work entries — role/timeline/tools, plus Overview/section/Outcome structure. For Thought entries: Overview/chapter/subsection structure with an optional pull quote.

Once a Doc is finished, hand the content to Claude Code with a prompt referencing this document (`md/NEW-ENTRY-PROCESS.md`) and the finished text. Claude Code populates the appropriate template, applies the heading ID slugification rule, creates the manifest entry, and runs the pre-commit verification checklist — this is the mechanical transfer step and should not be done by hand.

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

---

## Removing an Entry

Steps to fully retire a Work or Thought entry, in order:

1. **Delete the entry's HTML file** — `work/{slug}.html` or `thoughts/{slug}.html`.
2. **Remove its manifest entry** from `data/archive-entries.json` — this is what drives `archive.html` and any JS-built card (`buildCard()` in `script.js`); once the entry is gone from here, it stops appearing in Archive and in its type/tag filter counts automatically.
3. **Check and update `index.html` for any hand-written card referencing it.** Home's Featured Work / Featured Thoughts cards are static, hand-written HTML — they are **not** synced to the manifest. Deleting a manifest entry does nothing to a Home card that still links to it; if the removed entry was featured on Home, its card must be deleted from `index.html` by hand in the same pass, or the card is left pointing at a 404.
4. **Confirm no other page hardlinks the deleted slug.** Grep the repo for the slug across `*.html`, `script.js`, and `data/*.json` — real cross-links between entries (e.g. a Previous/Next nav) are currently placeholder `href="#"` in every template, so this is normally a no-op, but confirm it rather than assume it as the site grows.
5. **Orphaned tags need no manual cleanup.** Archive's tag filter chips are derived dynamically at runtime from whatever tags are still present across `allEntries` (`buildSecondaryChips()` in `script.js`) — there is no separate, hand-maintained tag list anywhere. If a tag's last remaining entry is deleted, that tag simply stops being generated as a chip on the next page load. Nothing to edit, nothing to remember to clean up later.

**Going dormant instead of deleting:** if an entry should stay reachable via Archive but come off Home, skip steps 1 and 2 — leave the HTML file and manifest entry in place, and remove only its Home card in step 3. The entry remains fully live at its real URL and in Archive's results/filters; it just isn't featured.

**Renaming a slug:** treat it as delete-and-recreate at the file level (old filename removed, new filename added) plus an in-place edit of the manifest entry's `id`, `title`, `url`, and any other changed fields — `url` must be updated to match the new filename or the manifest entry silently points at a now-missing file. Update the entry's own on-page `<title>`, breadcrumb current-page item, `<h1>`, and any hardcoded tag chips to match the new title/tags exactly, per the tag/slug consistency rule in the Writing Workflow section above. Update any Home card referencing the old slug the same way.
