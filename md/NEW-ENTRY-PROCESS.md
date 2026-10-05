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

### In-Body Images (added 2026-09-30)

Every `<img>` inside `.standard-page-content` is wrapped by `initImageViewer()` (`script.js`) as a click-to-zoom trigger. If `scripts/build-images.js` produced a `-full.webp` variant for that image (its high-res, click-to-zoom source), add `data-full-src="{path to the -full.webp file}"` to the `<img>` tag. If no `-full.webp` was produced, leave `data-full-src` off entirely — the viewer falls back to the thumbnail's own `src` with no extra request, rather than guessing a filename and generating a failed 404 request for a file that was never built. See `md/COMPONENTS.md`'s Image Viewer notes ("## 14. Standard Page Template") for the full mechanism.

### Filling In `[URL TBD]` Placeholders Later (added 2026-10-05)

When replacing a `[URL TBD]` marker on a `.link-inline`/`.link-cta` link with its real URL, check both of the following before publishing:

- **The `.link-nowrap` span.** The link's last word — "TBD]" today — is wrapped in `<span class="link-nowrap">...</span>` together with the trailing icon (`md/COMPONENTS.md` `## 16`/`## 17`, "Last Word + Icon Never Separate" and the span's own rule in `style.css`). **This span must keep wrapping whatever the new last word is after the edit** — the mechanism that stops the arrow from landing alone on its own line only works if it stays glued to the actual final word of the link text. If the real URL's link text changes which word is last (e.g. the placeholder text itself is replaced, not just the href), move the `<span class="link-nowrap">` to wrap the new last word before publishing; don't leave it wrapping stale text partway through the link, and don't remove it.
- **The new-tab suffix.** If the real URL is external (leaving crzdevz.com — true for every current `[URL TBD]` placeholder: itch.io, PC Gamer, IndieDB, ModDB, GameDev Academy, KitGuru, VG247), add `target="_blank" rel="noopener noreferrer"` to the link if not already present, and add `<span class="sr-only"> (opens in new tab)</span>` as the anchor's last child, after `.link-nowrap` (`md/COMPONENTS.md` `## 16` Accessibility). Don't add the suffix before the link actually opens a new tab — announcing "(opens in new tab)" on a link that doesn't is its own accessibility bug, not a smaller version of the one this fixes.

### Before Publishing (removing `published: false`, added 2026-10-05)

Grep the entry for leftover `{ }` template placeholders; zero allowed. This catches exactly the kind of thing a visual review misses — a hidden `.standard-page-details-row` or any other element that never renders by default can carry raw `{YYYY-MM-DD}`/`{Month DD, YYYY}`/`{slug}`-style template text indefinitely without ever being seen, until something un-hides it or a reader views source. Confirmed as a real, not hypothetical, failure mode: `sharing-and-caring-part-1.html`'s hidden Updated row shipped with exactly this (`<time datetime="{YYYY-MM-DD}">{Month DD, YYYY}</time>`) through several rounds of review before a dedicated grep caught it.

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

**Renaming a slug on the live site:** use `git mv` for the entry file (history is preserved, no copy of the old file is left behind), then add a 301 for the old URL in `_redirects` at the repo root — one rule for the `.html` form and one for the extensionless form, since Netlify serves both. Leave the rules non-forced (no `!`): they only fire once the old file is gone, which the `git mv` guarantees. Redirects can't be exercised on a local static server — test the old URL on the Netlify dev preview after pushing.
