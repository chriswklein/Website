# Design System — Component Specifications
**Version:** 2.2.1
**Last Updated:** 2026-09-24
**Status:** Active — source of truth for all component build decisions

---

## How to Use This Document

This document defines every UI component in the system. Each entry specifies:
- **Anatomy** — every element that makes up the component
- **Component tokens** — scoped CSS variables that map to semantic tokens. Use these, not the semantic tokens directly, when styling the component
- **All states** — default, hover, focus, active, disabled, and any component-specific states
- **Accessibility spec** — ARIA attributes, keyboard behaviour, screen reader output
- **Interaction spec** — what happens on each user action
- **Responsive behaviour** — how the component changes at each breakpoint
- **Figma component name** — the exact name in the Figma file this maps to
- **CSS class name** — the exact class name used in HTML and CSS

Rules for Claude Code:
- Read the component entry in full before writing any code
- Use component tokens, not semantic tokens, in component CSS
- All states must be implemented — not just default
- Figma component name and CSS class name must match exactly
- Never invent values — if a value is not in this document or md/DESIGN-SYSTEM.md, raise it as a question before proceeding

---

## Component Index

1. Button
2. Tag
2b. Tag-Chip
2c. Filter Drawer
3. Card
4. Navigation — Desktop
5. Navigation — Mobile Tab Bar
6. Tooltip
7. Toast Notification
8. Breadcrumb
9. Divider
10. Blockquote
11. Code Block
12. Back to Top Button
13. Share Button
14. Standard Page Template
15. Video Demo
16. Inline Link
17. CTA Link

---

## 1. Button

**Figma Component Name:** `Button`
**CSS Class:** `.btn`
**HTML Element:** `<button>` or `<a>` when linking

### Design Intent
Buttons are the primary interactive call-to-action element. They communicate the outcome of an action. Label text always describes what will happen — never generic labels like "Click here" or "Submit". Short labels use `.sr-only` hidden context for screen readers when the visible label alone is ambiguous.

### When to Use
- Triggering an action (copy to clipboard, submit, navigate)
- Primary CTA at the end of a card or section

### When NOT to Use
- Navigating between pages where an `<a>` tag is more semantically correct
- As a decorative element with no action

### Variants

| Variant | Class | Usage |
|---|---|---|
| Primary | `.btn` | Default — main CTA, filled background |
| Ghost | `.btn--ghost` | Secondary — outline only, no fill |
| Danger hover | `.btn--danger-hover` | Modifier added to `.btn` on controls that clear or remove something (the Archive's three Clear controls — see `## 2c`). Hover (hover-capable devices only, `@media (hover: hover)`) and `:active` set the background to `--color-danger`; never while `disabled`. Border and text keep the shared `.btn` hover tokens (~6.3:1 on the red). Not for dismiss/confirm controls — see md/DESIGN-SYSTEM.md §1.7b |
| Icon + Label | `.btn--icon` | Button with an icon left of label — not currently built in style.css; no icon library is in use site-wide (see md/REFERENCE.md §5) |

### Component Tokens

```css
--btn-bg:               var(--color-background-subtle);
--btn-bg-hover:         var(--color-border-strong);
--btn-bg-active:        var(--color-border-default);
--btn-border:           var(--color-border-strong);
--btn-border-hover:     var(--color-interactive-hover);
--btn-border-focus:     var(--color-interactive-focus);
--btn-text:             var(--color-text-primary);
--btn-text-hover:       var(--color-interactive-default);
--btn-text-disabled:    var(--color-text-disabled);
--btn-padding-x:        var(--space-5);
--btn-padding-y:        var(--space-3);
--btn-font-size:        var(--font-size-sm);
--btn-font-weight:      var(--font-weight-medium);
--btn-letter-spacing:   var(--letter-spacing-wide);
--btn-radius:           var(--border-radius-sm);
--btn-transition:       var(--duration-fast) var(--ease-out);
--btn-min-height:       44px;

/* Ghost variant overrides */
--btn-ghost-bg:         transparent;
--btn-ghost-border:     var(--color-border-strong);
--btn-ghost-text:       var(--color-text-primary);
```

### Anatomy

```
[ Icon? ] [ Label ] [ .sr-only context? ]
```

- Container: `<button class="btn">` or `<a class="btn">`
- Optional icon (if `.btn--icon` is ever built): `<i class="icon-{name}" aria-hidden="true"></i>` — no icon library currently in use
- Label: visible text
- Optional screen reader context: `<span class="sr-only">{additional context}</span>`

### States

| State | Background | Border | Text | Transition |
|---|---|---|---|---|
| Default | `--btn-bg` | `--btn-border` | `--btn-text` | — |
| Hover | `--btn-bg-hover` | `--btn-border-hover` | `--btn-text-hover` | `--btn-transition` |
| Focus | `--btn-bg` | `--btn-border-focus` | `--btn-text` | Focus ring appears |
| Active | `--btn-bg-active` | `--btn-border` | `--btn-text` | — |
| Disabled | `--btn-bg` | `--btn-border` | `--btn-text-disabled` | None |

Focus ring: `2px solid var(--color-interactive-focus)`, offset `3px` — inherited from global `:focus-visible`.

Disabled: add `disabled` attribute on `<button>`. Add `aria-disabled="true"` and `tabindex="-1"` on `<a>` elements used as buttons.

### Accessibility

- Must have a descriptive label — visible text or `aria-label`
- If icon only: `aria-label` required on the button, icon gets `aria-hidden="true"`
- If short label with hidden context: use `.sr-only` span inside button
- Screen reader output: "{label} {sr-only context}, button"
- Keyboard: `Enter` and `Space` activate. `Tab` to focus.

### Responsive Behaviour

- Min height `44px` at all breakpoints — touch target requirement
- Full width on mobile when used as primary CTA in a card: add `.btn--full` modifier

---

## 2. Tag

**Figma Component Name:** `Tag`
**CSS Class:** `.tag`
**HTML Element:** `<a href="archive.html?tag={slug}" class="tag">`

### Design Intent
Tags are interactive navigation links. Clicking a tag navigates to `archive.html?tag={slug}` — a filtered view of all Work and Thoughts entries matching that tag. The slug is the tag label converted to lowercase with spaces replaced by hyphens.

Tags sit above `.card-block-link` via `.card-tags { position: relative; z-index: 3 }`. Inside clickable cards, individual tag clicks are independent of the card click — a tag click navigates to the archive, a card click navigates to the entry.

### When to Use
- Categorising Work entries and Thoughts entries

### When NOT to Use
- As non-interactive labels — tags are always links in this system

### Variants

Single variant only — `.tag`. No `.tag--secondary`.

### Component Tokens

```css
--tag-border:                var(--color-accent-primary);
--tag-border-hover:          var(--color-accent-primary);
--tag-text:                  var(--color-accent-primary);
--tag-text-hover:            var(--color-accent-primary);
--tag-bg:                    transparent;
--tag-bg-hover:              var(--color-background-subtle);
--tag-padding-x:             var(--space-3);
--tag-padding-y:             var(--space-1);
--tag-font-size:             var(--font-size-sm);
--tag-font-weight:           var(--font-weight-regular);
--tag-font-weight-hover:     var(--font-weight-bold);
--tag-letter-spacing:        var(--letter-spacing-wide);
--tag-radius:                var(--border-radius-lg);
--tag-transition:            var(--duration-fast) var(--ease-out);
```

### Anatomy

```
[ Label text ]
```

- Container: `<a href="archive.html?tag={slug}" class="tag">{Label}</a>`
- No icons inside tags
- Slug format: tag label converted to lowercase with hyphens — "User Experience" → `user-experience`

### States

| State | Background | Border | Text | Font-Weight |
|---|---|---|---|---|
| Default | `transparent` | `--color-accent-primary` | `--color-accent-primary` | `regular` |
| Hover | `--color-background-subtle` | `--color-accent-primary` | `--color-accent-primary` | `bold` |
| Focus | `transparent` | `--color-accent-primary` | `--color-accent-primary` + focus ring | `regular` |

### Accessibility

- Tags are interactive links — no `aria-hidden`
- Screen reader announces: "{Tag label}. Link."
- Keyboard: Tab to focus, Enter to navigate to archive
- Focus ring: `2px solid var(--color-interactive-focus)`, offset `3px`

### Responsive Behaviour

- Same size at all breakpoints
- Tags wrap to new line when they exceed container width — never truncate
- Gap between tags: `var(--space-2)`

---

## 2b. Tag-Chip

**Figma Component Name:** `Tag-Chip`
**CSS Class:** `.tag-chip`
**HTML Element:** `<button class="tag-chip" type="button" data-filter-tag="{slug}" aria-pressed="false">` (tag chips) or `data-filter-type="{work|thoughts}"` (type chips)

### Design Intent
Tag-Chips are the interactive filter controls used inside the Filter Drawer (`## 2c. Filter Drawer`) — the only place they appear; there is no separate desktop chip row. Unlike Tag links (which navigate to a new page), Tag-Chips toggle filter state in place with no page reload. They follow a 4-state model: Default, Hover, Active (filter applied), and Dim — a lower-emphasis but fully clickable state, never a disabled one. See States below for exactly what triggers Dim and where it's currently reachable on screen.

A selected tag renders twice, at every breakpoint: once in `#filter-drawer-active-chips` (the selected-tags row — the sole Active-styled instance, with its own × remove control) and once in its usual place in `#filter-drawer-chips` (the tag grid). That grid copy renders Dim, not Active — Active styling is reserved for the selected-tags-row instance only, so the same filter never appears "on" twice. The grid copy stays fully clickable (clicking it removes the filter, same as its selected-tags-row counterpart) — only the visual state differs; `aria-pressed` and `aria-label` reflect the real toggle state on both. One drawer, one grid, no per-breakpoint variant.

### When to Use
- Inside the Filter Drawer only — type chips in `.filter-drawer-primary-chips`, tag chips in `#filter-drawer-chips` and `#filter-drawer-active-chips`

### When NOT to Use
- As navigation links — use `.tag` instead
- As non-interactive labels

### Variants

| Modifier | Purpose |
|---|---|
| (none) | Default — filter not applied |
| `.tag-chip--active` | Filter is currently applied |
| `.tag-chip--dim` | Available and fully clickable, but another filter is active or this chip duplicates one already shown active elsewhere — never disabled |

### Component Tokens

```css
/* Default */
--chip-border:             var(--border-width-thin) solid var(--color-accent-primary);
--chip-bg:                 transparent;
--chip-text:               var(--color-accent-primary);
--chip-font-weight:        var(--font-weight-regular);

/* Hover */
--chip-bg-hover:           var(--color-background-subtle);
--chip-font-weight-hover:  var(--font-weight-bold);

/* Active */
--chip-border-active:      var(--border-width-medium) solid var(--color-accent-primary-text);
--chip-bg-active:          var(--color-background-surface);
--chip-text-active:        var(--color-accent-primary-text);
--chip-font-weight-active: var(--font-weight-bold);

/* Dim — recoloured 2026-09-24 (reading comfort token update) */
--chip-border-dim:         var(--border-width-thin) solid var(--color-border-strong);
--chip-bg-dim:             transparent;
--chip-text-dim:           var(--color-text-secondary);
```

### Anatomy

```
[ Label text ]        ← default / hover / dim
[ Label text  × ]     ← active (× is .tag-chip-x, aria-hidden)
```

- Container: `<button class="tag-chip" type="button" data-filter-tag="{slug}" aria-pressed="false">`
- X indicator (active only): `<span class="tag-chip-x" aria-hidden="true">×</span>` inside button
- `data-filter-tag`: slug matching the tag slugs derived from `data/archive-entries.json` entries (secondary chips); `data-filter-type`: `"work"` or `"thoughts"` (primary chips)
- `aria-pressed`: `"true"` when active, `"false"` otherwise — managed by the shared `applyChipState()` helper inside `initArchive()`

### States

| State | Background | Border | Text | Font-Weight |
|---|---|---|---|---|
| Default | `transparent` | `thin` + `--color-accent-primary` | `--color-accent-primary` | `regular` |
| Hover | `--color-background-subtle` | `thin` + `--color-accent-primary` | `--color-accent-primary` | `bold` |
| Active | `--color-background-surface` | `medium` + `--color-accent-primary-text` | `--color-accent-primary-text` | `bold` |
| Dim | `transparent` | `thin` + `--color-border-strong` | `--color-text-secondary` | `regular` |

**What triggers Dim, and where it's actually visible:** `applyChipState()` sets Dim whenever a chip is inactive while any other chip in its own group is active (`anyActive`), or when a chip is a grid duplicate of a tag already shown Active in the selected-tags row (`isDuplicateOfActiveRow`). Both triggers apply to type chips (`.filter-drawer-primary-chips`) and tag chips (`#filter-drawer-chips`) alike — but only type-chip Dim is currently visible on screen: that row is never hidden, so selecting Work visibly dims Thoughts. Tag-chip Dim is computed and classed identically, but `.filter-drawer--tags-active` (set whenever any secondary tag is active — see `## 2c. Filter Drawer`) hides the entire tag grid outright in favour of the selected-tags row alone, so a tag chip's Dim state, while correct, has no currently-reachable on-screen instance. The class and its styling are left in place, ready for a future layout that keeps the tag grid visible alongside active selections.

### Accessibility

- `type="button"` prevents form submission
- `aria-pressed` managed by JS — `"true"` when active, `"false"` otherwise
- When active: `aria-label="Remove {Label} filter"` set by JS to describe the removal action
- `.tag-chip-x`: `aria-hidden="true"` — decorative; the button's accessible label covers it
- Focus ring: `2px solid var(--color-interactive-focus)`, offset `3px`
- Screen reader (default): "{Label}. Button."
- Screen reader (active): "Remove {Label} filter. Button."
- Dim is a purely visual de-emphasis cue — it never sets `aria-disabled` and adds no visually-hidden text. `aria-pressed`/`aria-label` always reflect the real underlying toggle state exactly as they would if the chip weren't dimmed (`true` / "Remove {Label} filter" for a duplicate-of-active Dim chip; `false` / no label for an available-but-shadowed one) — a screen reader user gets no distinct signal that a chip is specifically Dim, only whichever real pressed state it already had

### Responsive Behaviour

- Same drawer, same chips, at every breakpoint — no separate desktop/tablet/mobile variant (see `## 2c. Filter Drawer`'s own Responsive Behaviour for how the drawer's outer box changes shape)
- State syncs between the tag grid and the selected-tags row via the shared `activeSecondary` set (tags) and `activeType` value (type) in `initArchive()`

### JavaScript API

Chips are built and wired by `initArchive()` in `script.js`. Tag chips carry `data-filter-tag="{slug}"`; type chips carry `data-filter-type="work"` or `data-filter-type="thoughts"`. On every `render()` pass, each chip's classes/`aria-pressed`/`aria-label`/× indicator are computed by the shared `applyChipState(btn, { isActive, anyActive, isDuplicateOfActiveRow })` helper — the single source of truth for chip state, used for both the type-chip loop and the tag-chip loop (`isDuplicateOfActiveRow` is `true` for any chip inside `#filter-drawer-chips`, since every chip there is a grid copy of whatever the selected-tags row already shows for an active tag — see Design Intent above).

Default chip:
```html
<button class="tag-chip" type="button" data-filter-tag="quality-assurance" aria-pressed="false">
    Quality Assurance
</button>
```

Active state (set by JS, not authored manually):
```html
<button class="tag-chip tag-chip--active" type="button" data-filter-tag="quality-assurance"
        aria-pressed="true" aria-label="Remove Quality Assurance filter">
    Quality Assurance
    <span class="tag-chip-x" aria-hidden="true">×</span>
</button>
```

Dim duplicate state (`#filter-drawer-chips` grid copy, when this tag is active and already shown in `#filter-drawer-active-chips`) — shown for markup reference; per the reachability note above, `#filter-drawer-chips` itself is hidden whenever any tag is active, so this exact instance isn't currently visible on screen:
```html
<button class="tag-chip tag-chip--dim" type="button" data-filter-tag="quality-assurance"
        aria-pressed="true" aria-label="Remove Quality Assurance filter">
    Quality Assurance
</button>
```

---

## 2c. Filter Drawer

**CSS Classes:** `.filter-drawer`, `.filter-drawer-body`, `.filter-drawer-controls`, `.filter-drawer-label`, `.filter-drawer-primary-chips`, `.filter-drawer-secondary-page`, `.filter-drawer-page-nav`, `.filter-drawer-page-btn`, `.filter-drawer-page-dots`, `.filter-drawer-page-dot`, `.filter-drawer-trigger`, `.action-rail-group`, `.action-rail-trigger`, `.action-rail-badge`, `.action-rail-clear`, `.btn--danger-hover`, `.archive-scrim`, `.archive-active-chips`, `.archive-sort-count-row`, `.archive-count`, `.archive-sort-toggle`, `.body-scroll-locked`
**JS Functions:** `initFilterDrawer()`, `initArchive()`, `trapFocus()` in `script.js`

### Design Intent
One filter drawer serves the whole Archive at every breakpoint — there is no inline filter row, no search field and no second desktop surface. A floating pill (`.action-rail-trigger`, "Filters") is the single persistent entry point; it sits at the right edge of the viewport at every scroll position and opens the drawer. Inside, the drawer stacks four rows: the controls row (Clear · "Filter" label · Done), the type chips (Work, Thoughts), the selected-tags row, and the paginated tag grid. Filters apply live as chips are toggled, which is why the closing control reads "Done" rather than "Close" — nothing is discarded on dismiss. (Search-matching logic still exists in `script.js` — `currentQuery` and its filtering — but is currently dormant with no UI wired to it, pending a future search redesign.)

The drawer is the same DOM and the same behaviour everywhere; only its outer box changes: a bottom sheet below 1024px (full-bleed on mobile, capped to `--max-content` and centred from 768px), and an anchored 632px panel at 1024px and up whose bottom-right corner is pinned to the floating trigger's resting position.

**Selected-tags row and grid:** `#filter-drawer-active-chips` lists every selected tag with its own × remove control. While at least one tag is selected the tag grid and its pagination are hidden (`.filter-drawer--tags-active`) and this row takes over the grid's reserved height; when the last tag is removed the grid returns on the page the user was browsing before the first tag was selected.

**Sort and count:** `.archive-sort-count-row` sits in `<main>` above the results — entry count on the left, sort toggle on the right. It is not part of the drawer, so it is inert while the drawer is open.

### When to Use
- On any page with filterable archive content

### HTML Structure

```html
<!-- Floating action rail group — the one persistent entry point, visible at
     every scroll position and breakpoint; hidden while the drawer is open. -->
<div class="action-rail-group action-rail-group--visible" id="action-rail-group">
    <!-- External Clear — rendered only while a filter is active -->
    <button class="archive-clear-btn btn btn--danger-hover action-rail-clear" type="button" hidden aria-label="Clear all filters">
        <span class="tag-chip-x" aria-hidden="true">×</span>
    </button>
    <button class="action-rail-trigger" type="button"
            aria-controls="filter-drawer" aria-haspopup="dialog"
            aria-expanded="false" aria-label="Open Filters">
        <svg class="action-rail-trigger-icon" aria-hidden="true" focusable="false">…</svg>
        <span class="trigger-label">Filters</span>
        <span class="action-rail-badge" aria-hidden="true" hidden>0</span>
    </button>
</div>

<!-- Scrim — invisible click-outside hit area; click closes the drawer -->
<div class="archive-scrim" id="archive-scrim" aria-hidden="true" hidden></div>

<!-- Drawer — starts hidden and inert -->
<div class="filter-drawer" id="filter-drawer"
     role="dialog" aria-modal="true" aria-label="Filter" hidden inert>
    <div class="filter-drawer-body">

        <!-- Row 1: Clear (left) · "Filter" label (centre) · Filters/Done trigger (right) -->
        <div class="filter-drawer-controls">
            <button class="archive-clear-btn btn btn--danger-hover" type="button" disabled aria-label="Clear all filters">Clear</button>
            <p class="filter-drawer-label"><svg class="filter-drawer-label-icon" aria-hidden="true" focusable="false">…</svg>Filter</p>
            <button class="filter-drawer-trigger" type="button"
                    aria-expanded="false" aria-controls="filter-drawer" aria-haspopup="dialog">
                <span class="trigger-label">Filters</span>
                <span class="action-rail-badge" aria-hidden="true" hidden>0</span>
            </button>
        </div>

        <!-- Row 2: type chips (exclusive) -->
        <div class="filter-drawer-primary-chips" role="group" aria-label="Filter by type">
            <button class="tag-chip" type="button" data-filter-type="work" data-label="Work" aria-pressed="false">Work<span class="chip-count" aria-hidden="true"></span></button>
            <button class="tag-chip" type="button" data-filter-type="thoughts" data-label="Thoughts" aria-pressed="false">Thoughts<span class="chip-count" aria-hidden="true"></span></button>
        </div>

        <!-- Selected tags — populated by updateActiveChipsRow() -->
        <div class="archive-active-chips" id="filter-drawer-active-chips"></div>

        <!-- Row 3: tag grid — chips built by buildSecondaryChips() -->
        <div class="filter-drawer-secondary-page">
            <div id="filter-drawer-chips"></div>
        </div>
        <div class="filter-drawer-page-nav" id="filter-drawer-page-nav" hidden>
            <button type="button" class="filter-drawer-page-btn filter-drawer-page-prev" aria-label="Previous page of tags">Previous</button>
            <div class="filter-drawer-page-dots" id="filter-drawer-page-dots"></div>
            <button type="button" class="filter-drawer-page-btn filter-drawer-page-next" aria-label="Next page of tags">Next</button>
        </div>
        <p class="sr-only" id="filter-drawer-page-status" aria-live="polite"></p>

    </div>
</div>

<!-- Inside <main>: count (left) + sort toggle (right) -->
<div class="archive-sort-count-row">
    <p class="archive-count" id="archive-count">Loading…</p>
    <button class="archive-sort-toggle" type="button">Latest ↑</button>
</div>

<!-- Direct child of <body>, after <main> — outside everything that goes inert -->
<div class="sr-only" id="filter-announcer" role="status" aria-live="polite" aria-atomic="true"></div>
```

**Notes:**
- Tag chips in the grid and selected-tags row, the type chips and their count spans are built and wired by `initArchive()` — see `## 2b. Tag-Chip`. `.chip-count` is computed on every render but hidden (`display: none`); a tag whose count is 0 for the current type gets `.tag-chip--zero-count` (`display: none`) and takes no slot in the grid.
- The `.trigger-label` span isolates the dynamic text ("Filters" ↔ "Done") from the badge span so JS can update the label without disturbing other content.
- Both triggers — the floating `.action-rail-trigger` and the drawer's own `.filter-drawer-trigger` — carry an `.action-rail-badge`. Every `.action-rail-badge` is updated from the same `filterCount` in the same `render()` pass. Below 768px the floating trigger shows only its icon and badge; `.trigger-label` stays in the accessibility tree.
- Selecting a type chip rewrites `?type=` with `history.replaceState`; `?type=` and `?tag=` on arrival pre-apply a filter. On arrival with `?type=` (and no valid `?tag=`) below 1024px the drawer opens itself once; `?tag=` arrivals and desktop arrivals leave it closed. Neither announces.

### Open and Close

| Trigger | Result |
|---|---|
| Click the floating "Filters" trigger (closed) | `openDrawer()`: background scroll locked; `inert` and `hidden` removed from the drawer; scrim shown; drawer slides in (`.filter-drawer--open`); both triggers get `aria-expanded="true"` and the label "Done"; the rest of the page (skip link, header, rail group, theme toggle, `<main>`, toast, tab bar, nav, footer) becomes `inert`; the floating rail group is hidden; focus moves to the drawer's Clear if enabled, else the first type chip |
| Click "Done" (drawer's own trigger), click the scrim, or press Escape | `closeDrawer()`: scroll unlocked and restored; drawer `inert` again and slides out; `inert` removed from the page; rail group restored; `aria-expanded="false"`, label "Filters"; focus returns to the trigger that opened it. All three paths call the same function |
| Tab / Shift+Tab | Wraps inside the drawer — see Accessibility |
| Touch-drag or wheel over the scrim | No effect — background scroll is locked |

`Done` is a neutral control: hover only changes its border, never its fill.

### Clear Controls

Three controls clear every active filter, all wired to the same `doReset()`:

| Control | Classes | Visible | Accessible name |
|---|---|---|---|
| Floating Clear × | `.archive-clear-btn.btn.btn--danger-hover.action-rail-clear` | × (`.tag-chip-x`, `aria-hidden`) | "Clear all filters" (`aria-label`) |
| Drawer Clear (Row 1) | `.archive-clear-btn.btn.btn--danger-hover` | "Clear" | "Clear all filters" (`aria-label`; begins with the visible word) |
| Empty-state "Clear Filters!" | `.archive-clear-btn.btn.btn--danger-hover.archive-empty-clear-btn` | "Clear Filters!" | "Clear Filters!" (visible text) |

- **Floating Clear ×:** first child of `.action-rail-group`, rendered only while a filter is active (`hidden` toggled by `render()`), and hidden with the rest of the group while the drawer is open. 44×44 (`--touch-target-minimum`); `.action-rail-group .action-rail-clear` gives it `--border-radius-full` and `--elevation-md` to match the Filters pill. The image dialog's Close, zoom and Prev/Next buttons also use `.action-rail-clear` and keep their flat radius and no shadow because that rule is scoped to the rail group.
- **Drawer Clear:** disabled while no filter is active.
- **Red hover/press:** `.btn--danger-hover` (see `## 1. Button`) turns the background `--color-danger` on hover (hover-capable devices only) and on `:active`, never while `disabled`. Only these three controls carry it; Done, the image dialog's controls, the Filters pill, the sort toggle and tag chips stay neutral on hover. `:focus-visible` keeps the standard focus ring — focus alone never turns a Clear red.
- **`doReset()`** clears the type, every selected tag, the sort (back to Latest) and the pagination position, and removes `?type=`.

### Type and Tag Chips

- **Type chips** (`.filter-drawer-primary-chips`, `role="group"`, `aria-label="Filter by type"`): Work and Thoughts, exclusive — selecting one replaces the other, selecting the active one clears it. The Archive `<h1>` (visually hidden) updates to "Archive / Work" or "Archive / Thoughts".
- **Tag chips** (`#filter-drawer-chips`): every unique tag from `data/archive-entries.json`, alphabetical, multi-select (an entry matches if it has any selected tag). Tags with no entries under the current type are removed from the grid. A selected tag appears in `#filter-drawer-active-chips` as an Active chip with a × and `aria-label="Remove {Label} filter"`; its copy in the grid renders Dim (`isDuplicateOfActiveRow`, see `## 2b. Tag-Chip`).

### Pagination

- The grid shows 12 tags per page (`SECONDARY_PAGE_SIZE`). Controls live in `#filter-drawer-page-nav`: Previous, one `.filter-drawer-page-dot` per page (`aria-label="Page {n}"`, `aria-current="true"` on the current one — the current dot is also larger, so state is not colour alone), Next. Previous and Next wrap at the ends.
- The nav is hidden (`hidden`, which keeps its space via `visibility: hidden` so the drawer doesn't resize) when the current state has one page or a tag is selected. If no reachable type state (All, Work, Thoughts) needs more than one page, the drawer gets `.filter-drawer--no-pagination` and the nav is removed with `display: none`.
- The drawer's tag area has a fixed height, `--drawer-secondary-height`, measured by `updateDrawerSecondaryMetrics()` against an off-screen replica for the tallest page across all three type states, so switching type never resizes the drawer.
- `#filter-drawer-page-status` (`.sr-only`, `aria-live="polite"`) reads "Page {n} of {total}"; it is empty when there is only one page.
- Arriving with `?tag=` lands the grid on the page containing that tag.

### Background Scroll Lock

While the drawer is open, `<body>` is locked using the `position: fixed` body-lock technique (not `overflow: hidden`, which leaks scroll on iOS Safari):

- **On open** (`lockBodyScroll()` in `initFilterDrawer()`): saves `window.scrollY`, sets `document.body.style.top = -{savedScrollY}px` inline, and adds `.body-scroll-locked` (`position: fixed; left: 0; right: 0;` in style.css — `top` is the one value set inline because it is dynamic per open).
- **On close** (`unlockBodyScroll()`, first call in `closeDrawer()`): removes `.body-scroll-locked`, clears the inline `top`, and calls `window.scrollTo({ top: savedScrollY, left: 0, behavior: 'instant' })`. `behavior: 'instant'` is required because `html` sets `scroll-behavior: smooth`, which `scrollTo` would otherwise inherit.
- `inert` has no effect on document-level scroll, so this lock is a separate mechanism, not redundant with it.

### Sort Toggle

- `.archive-sort-toggle` flips between Latest ↑ and Earliest ↓ (`currentSort`, held in `initArchive()`; not stored in the URL). It re-orders the results by entry date only — the entry count and the set of entries never change. Its visible text is its accessible name; it has no `aria-label` or `aria-pressed`.
- On each click `announceSortChange()` speaks "Sorted by Latest first." or "Sorted by Earliest first." through `#filter-announcer`. No count is included.

### Accessibility

- Triggers: `aria-expanded` updated by JS; `aria-controls="filter-drawer"`; `aria-haspopup="dialog"`.
- Drawer: `role="dialog"`, `aria-modal="true"`, `aria-label="Filter"`; `hidden inert` while closed, so it is neither reachable nor announced.
- Trigger names: both triggers get an `aria-label` built in one place, `updateTriggerLabels()`: the visible label plus the active-filter count from `getActiveFilterSummary()`. Floating trigger: "Open Filters" closed, "Done filtering" open. Drawer's own trigger: "Filters" / "Done". With N ≥ 1 active filters ", N active filters" is appended (", 1 active filter" for one; nothing at 0). Every name starts with the visible word (WCAG 2.5.3). The visible badge stays `aria-hidden="true"`, so the count is never read twice.
- Trigger descriptions: each trigger has a `.sr-only` sibling `span#filter-trigger-description-{n}` referenced by `aria-describedby`, reading "Selected: {names}" — the first three active filters in on-screen order (type chip first, then tags in the order selected), then " and N more". The attribute is removed entirely at 0 filters. The spans are siblings of each trigger, not children, so they stay out of the trigger's own name.
- Focus containment: while open, everything outside the drawer is `inert`, and `trapFocus()` wraps Tab at the first and last *rendered* control (hidden pagination and zero-count or off-page chips are skipped). The skip link is in the inert set, so Tab and Shift+Tab never leave the drawer. Escape closes from anywhere inside.
- Return focus: the trigger that opened the drawer receives focus on close; `inert` is removed from the page first, and focus is set with `preventScroll` so it can't fight the restored scroll position.
- Focus retention — focus is never dropped to `<body>`:
  - Type chip: keeps focus.
  - Selecting a tag: focus moves to that tag's chip in the selected-tags row (the grid chip just pressed is hidden).
  - Removing a tag with its ×: focus moves to that tag's chip in the grid if the grid is showing again; otherwise to the neighbouring selected chip (next, then previous); otherwise pagination Previous if visible; otherwise Done.
  - Clear: the drawer's Clear (now disabled) sends focus to Done; the floating Clear and the empty-state button (both gone after a reset) send it to the floating Filters trigger.
  - Pagination controls: keep focus.
  - Nothing moves focus on page load or on arrival with pre-applied filters.
- Filter announcer: `#filter-announcer` (`.sr-only`, `role="status"`, `aria-live="polite"`, `aria-atomic="true"`) is a direct child of `<body>`, outside `<main>`, the drawer and the rail group, so it is never `inert` or hidden in either drawer state. It is the only live region for filter and sort changes. One function, `announce()`, writes to it: it clears the region and sets the message 100ms later so an identical repeat is still announced. `announceFilterChange()` builds "{Name} selected. Showing N entries.", "{Name} removed. Showing N entries." or "Filters cleared. Showing N entries." ("1 entry" for one); `announceSortChange()` builds the sort message above. Each runs once per user action, after `render()`, and never on page load, `?type=`/`?tag=` arrival, or drawer open/close. `#archive-count` is not a live region (it sits in the inert `<main>` while the drawer is open; the announcer carries the same count from the same `filtered.length`).
- Chip count spans: `.chip-count` is `aria-hidden="true"` and hidden.

### Responsive Behaviour

| Breakpoint | Drawer | Floating trigger (`.action-rail-group`) | Sort + count row |
|---|---|---|---|
| Mobile (< 768px) | Bottom sheet, full-bleed, `max-height: 70vh` | Icon + badge only (label is screen-reader-only), `top: 70%` | `position: fixed` below the 64px tab bar, `z-index: 10` |
| Tablet (768–1023px) | Bottom sheet, capped to `--max-content` and centred | Icon + "Filters" pill + badge, `top: 50%` | `position: fixed` below the 64px header, `z-index: 10` |
| Desktop (≥ 1024px) | Anchored 632px panel, bottom-right corner pinned to the floating trigger; fades and scales in; `--elevation-xl` | Icon + "Filters" pill + badge, `top: 50%` | In normal flow |

The scrim is an invisible hit area (`opacity: 0` in both states) at every breakpoint — results stay fully visible behind the open drawer.

### Z-Index Layering

| Layer | z-index |
|---|---|
| Sort + count row (< 1024px) | 10 |
| Tab bar (mobile) | 200 |
| Scrim (`.archive-scrim`) | 249 |
| Drawer (`.filter-drawer`) | 250 |
| Rail group (`.action-rail-group`) | 260 |
| Image viewer scrim (`.image-viewer-scrim`) | 269 |
| Image viewer (`.image-viewer`) | 270 |
| Toast | 300 |

The image viewer belongs to Standard Pages, not the Archive; it is listed because it sits above the rail group (260) that both pages share.

### Dependencies

- `trapFocus()` — reusable utility in `script.js`
- `lockBodyScroll()` / `unlockBodyScroll()` — closures inside `initFilterDrawer()`; see Background Scroll Lock, above
- `.tag-chip` — See `## 2b. Tag-Chip`
- `applyChipState()` — shared chip class/aria state helper in `initArchive()`; see `## 2b. Tag-Chip`
- `updateActiveChipsRow()` — populates `#filter-drawer-active-chips` from the `activeSecondary` set
- `updateDrawerSecondaryMetrics()` — sets `--drawer-secondary-height` and `.filter-drawer--no-pagination`
- `announce()` / `announceFilterChange()` / `announceSortChange()` — the announcer functions in `initArchive()`
- `inert` HTML attribute — applied to all page content outside the drawer on open; removed on close before focus return

---

## 3. Card

**Figma Component Name:** `Card/Work`
**CSS Base Class:** `.card`
**HTML Element:** `<article class="card card--{variant}">`

### Design Intent
Cards are the primary content presentation unit. The entire card is clickable via the IxDF block link pattern — an absolutely positioned anchor (`card-block-link`) covers the full card for mouse users, while the CTA anchor (`card-cta`) is the sole keyboard-focusable element with a full, descriptive `aria-label`. This gives mouse users click-anywhere convenience and keyboard users a clean, descriptive tab stop.

### Variants

| Variant | Modifier | Figma Style | Usage |
|---|---|---|---|
| Feature | `.card--feature` | `Style=Feature` | Work / portfolio cards on Home and Work index |
| Thought | `.card--thought` | `Style=Thought` | Blog / writing entries on Home and Thoughts index |

### Block Link Pattern (Feature and Thought variants only)

The `.card-block-link` is an absolutely positioned empty anchor that covers the full card. It is `aria-hidden="true"` and `tabindex="-1"` — invisible to assistive technology and not keyboard focusable. Mouse users click anywhere on the card to navigate. The `.card-cta` anchor sits above the block link (`z-index: 2`) and is the only keyboard-accessible interactive element. It carries the full descriptive `aria-label`.

```
z-index stack (card has position: relative):
  .card-cta            z-index: var(--card-cta-z)       ← keyboard focus lands here
  .card-block-link     z-index: var(--card-block-link-z) ← intercepts mouse clicks on card body
  card content         z-index: auto                     ← visible but not pointer-interactive
```

### Component Tokens

```css
--card-bg:              var(--color-background-surface);
--card-border:          var(--color-border-default);
--card-radius:          var(--border-radius-md);
--card-image-bg:        var(--color-background-subtle);
--card-image-ratio:     16 / 9;
--card-transition:      var(--duration-base) var(--ease-out);
--card-block-link-z:    1;
--card-cta-z:           2;

/* Card CTA button — inherits from Button component tokens */
--card-cta-bg:          var(--btn-bg);
--card-cta-border:      var(--btn-border);
--card-cta-text:        var(--btn-text);
--card-cta-radius:      var(--btn-radius);
--card-cta-padding-x:   var(--btn-padding-x);
--card-cta-padding-y:   var(--btn-padding-y);
```

`.card-content` padding is `var(--space-3) var(--space-6)` (12px top/bottom, 24px left/right) — set directly on `.card-content`, not via the `--card-padding` custom property (which still exists for `.card-image-caption`'s use in the Profile variant, unaffected by this).

Feature-variant desktop/tablet horizontal layout uses `--card-image-column-width` (`42%`) — see §4.5 of `md/DESIGN-SYSTEM.md`, since it's a global `:root` token rather than scoped to `.card`.

### States

| State | Card Border | Card Background | Box Shadow | Transition |
|---|---|---|---|---|
| Default | `--card-border` | `--card-bg` | none | — |
| Hover | `var(--color-accent-primary-text)` (teal) | `--card-bg` | `0 var(--space-1) 0 var(--color-accent-primary)` — solid, non-blurred | `--card-transition` |
| Focus (keyboard) | Focus ring on `.card-cta` | `--card-bg` | none | Focus ring appears |

Hover applies to the whole card — including the image column on Feature cards at tablet/desktop width. The image has no border of its own; it's flush against the card's inner edge, so it's already visually wrapped by the same border with no separate rule needed.

---

### Variant: Feature (Card/Feature)

**CSS Class:** `.card.card--feature`
**Usage:** Work / portfolio cards

Content order (both Feature and Thought): **Title → Tags → Meta → Excerpt → CTA**. This was reordered from the earlier Title → Excerpt → Tags → Meta → CTA — validated in a card-layout comparison scratch file (`card-variants-preview.html`, since removed) before being promoted into this live component. See design-system.html Section 14 for the current live markup.

#### Anatomy

```
[ .card-block-link — empty, aria-hidden, tabindex=-1 ]
[ .card-image — 16:9 decorative background, no fixed height ]
[ .card-content ]
  [ h3.card-title ]
  [ .card-tags ]
    [ .tag ]
  [ p.card-meta — {date} · {author} ]
  [ p.card-excerpt — 2-line clamp, full text in DOM ]
  [ a.card-cta ]
```

```html
<article class="card card--feature">
    <a href="{url}" class="card-block-link" aria-hidden="true" tabindex="-1"></a>
    <div class="card-image" role="presentation"></div>
    <div class="card-content">
        <h3 class="card-title">{Title}</h3>
        <div class="card-tags">
            <a href="/archive.html?tag={slug}" class="tag">{Tag}</a>
        </div>
        <p class="card-meta">{date} · {author}</p>
        <p class="card-excerpt">{Description}</p>
        <a href="{url}" class="card-cta" aria-label="{Title} — view this project">View</a>
    </div>
</article>
```

#### Accessibility

- `<article>` announces as a landmark to screen readers
- `.card-block-link` is `aria-hidden="true"` and `tabindex="-1"` — skipped entirely by keyboard and AT; it's a sibling of `.card-content`, never a wrapper around it
- `.card-cta` is the sole focusable element (besides tags) — carries full `aria-label`
- Tags are real `<a href="/archive.html?tag={slug}">` links — no `aria-hidden`, no `tabindex` override — independently focusable and clickable, verified via real Tab-key navigation and hit-testing
- Screen reader output: "Article. {Title}, heading level 3. {Tag}, link. ... View, link." (CTA aria-label: "{Title} — view this project")
- Image: CSS background — no alt text needed
- `.card-excerpt` visually clamps to 2 lines (`-webkit-line-clamp: 2`) but the full text remains in the DOM and is exposed in the accessibility tree — confirmed via a real accessibility-tree snapshot, not just source inspection

#### Responsive Behaviour

| Breakpoint | Layout | Image | Content |
|---|---|---|---|
| Below 768px | Stacked (default block flow — no extra CSS needed) | Full width, `aspect-ratio: 16/9` | Below image |
| 768px and above (tablet + desktop) | `display: flex; flex-direction: row` | Left column, `width: var(--card-image-column-width)` (42%), `aspect-ratio: auto` | `flex: 1`, right of image |

The image has no fixed height at either breakpoint. At 768px+, `align-items: stretch` on `.card--feature` makes the image match whatever height `.card-content` naturally reaches for its real text — verified against both a long-excerpt and a short-excerpt real entry, image height matched content height exactly (0px difference) in both cases. The card itself never exceeds the page's existing content-column width, since it fills its parent grid cell (`.card-row`, `.container`), which is already `max-width`-capped.

---

### Variant: Thought (Card/Thought)

**CSS Class:** `.card.card--thought`
**Usage:** Blog / writing entries. No thumbnail image — content only, at every breakpoint.

Same content order, padding, and hover treatment as Feature — see above. `.card--thought .card-image { display: none; }` remains as a safety net, but in practice no `.card-image` element is ever rendered for Thought entries (`buildCard()` only builds the image div when `entry.type === 'work'`), so the horizontal-layout media query (scoped to `.card--feature`) never applies here regardless of viewport width.

#### Anatomy

```
[ .card-block-link — empty, aria-hidden, tabindex=-1 ]
[ .card-content ]
  [ h3.card-title ]
  [ .card-tags ]
    [ .tag ]
  [ p.card-meta — Published {date} · {author} ]
  [ p.card-excerpt — 2-line clamp, full text in DOM ]
  [ a.card-cta ]
```

```html
<article class="card card--thought">
    <a href="{url}" class="card-block-link" aria-hidden="true" tabindex="-1"></a>
    <div class="card-content">
        <h3 class="card-title">{Title}</h3>
        <div class="card-tags">
            <a href="/archive.html?tag={slug}" class="tag">{Tag}</a>
        </div>
        <p class="card-meta">Published {date} · {author}</p>
        <p class="card-excerpt">{Summary}</p>
        <a href="{url}" class="card-cta" aria-label="{Title} — read this thought">Read</a>
    </div>
</article>
```

#### Accessibility

- `.card-cta` `aria-label` action: "read this thought"
- Screen reader output: "Article. {Title}, heading level 3. ... Read, link." (with aria-label: "{Title} — read this thought")
- Same tag/excerpt accessibility notes as Feature, above

---

## 4. Navigation — Desktop

**Figma Component Name:** `Nav/Desktop`
**CSS Class:** `.site-nav`
**HTML Element:** `<header><nav class="site-nav" aria-label="Main navigation">`

### Design Intent
The desktop nav is the persistent wayfinding element. Logo/name is centred above the nav links. It stays sticky at the top so users always have access to navigation without scrolling back up.

### Component Tokens

```css
--nav-bg:               var(--color-background-base);
--nav-border:           var(--color-border-default);
--nav-height:           64px;
--nav-logo-size:        var(--font-size-base);
--nav-logo-weight:      var(--font-weight-bold);
--nav-link-size:        var(--font-size-sm);
--nav-link-weight:      var(--font-weight-medium);
--nav-link-spacing:     var(--letter-spacing-widest);
--nav-link-color:       var(--color-text-secondary);
--nav-link-hover:       var(--color-text-primary);
--nav-link-active:      var(--color-text-primary);
--nav-link-gap:         var(--space-8);
--nav-transition:       var(--duration-fast) var(--ease-out);
```

### Anatomy

```
[ .nav-logo "Christopher Klein" centred ]
[ .nav-links centred below logo ]
  [ a Home ] [ a Work ] [ a Thoughts ] [ a About ]
```

- Container: `<nav class="site-nav" aria-label="Main navigation">`
- Logo: `<a href="index.html" class="nav-logo">Christopher Klein</a>` — centred, `--nav-logo-size`, `--nav-logo-weight`
- Links wrapper: `<ul class="nav-links" role="list">` — centred below logo
- Each link: `<li><a href="{page}.html">{Label}</a></li>`
- Active link: `aria-current="page"` set dynamically via `script.js` after nav injection

### Active State

Active nav link:
- Text colour: `--nav-link-active` (white)
- Text decoration: underline, `2px` offset
- Set via: `[aria-current="page"]` CSS selector

### States

| State | Colour | Decoration |
|---|---|---|
| Default | `--nav-link-color` | None |
| Hover | `--nav-link-hover` | None |
| Focus | `--nav-link-hover` | Focus ring |
| Active (current page) | `--nav-link-active` | Underline |

### Accessibility

- `aria-label="Main navigation"` on `<nav>`
- `aria-current="page"` on the active link — set by `script.js`
- Skip link before nav: `<a href="#main-content" class="skip-link">Skip to main content</a>`

### Responsive Behaviour

- Desktop: visible — centred layout
- Mobile: hidden via `display: none` — replaced by tab bar

---

## 5. Navigation — Mobile Tab Bar

**Figma Component Name:** `Nav/TabBar`
**CSS Class:** `.tab-bar`
**HTML Element:** `<nav class="tab-bar" aria-label="Mobile navigation">`

### Design Intent
The tab bar replaces the desktop nav entirely on mobile. It is always visible, fixed to the top of the viewport, giving users constant access to all four primary sections without scrolling. Icon and text label always shown together. Never icon only.

### Component Tokens

```css
--tab-bar-bg:               var(--color-background-surface);
--tab-bar-border:           var(--color-border-default);
--tab-bar-height:           64px;
--tab-bar-icon-size:        20px;
--tab-bar-label-size:       var(--font-size-xs);
--tab-bar-label-weight:     var(--font-weight-medium);
--tab-bar-label-spacing:    var(--letter-spacing-widest);
--tab-bar-item-color:       var(--color-text-secondary);
--tab-bar-item-active:      var(--color-interactive-default);
--tab-bar-item-min-width:   44px;
--tab-bar-item-min-height:  44px;
--tab-bar-transition:       var(--duration-fast) var(--ease-out);
--tab-bar-z-index:          200;
```

### Icons — Deferred

> **Current state: text-only.** Icons have been removed pending self-hosting. Future iteration will add Tabler Icons once the webfont is downloaded and placed in `assets/icons/`. Do not use the CDN.

### Anatomy — Current (text-only)

```
[ .tab-bar-item ] [ .tab-bar-item ] [ .tab-bar-item ] [ .tab-bar-item ]
  [ Home ]          [ Work ]          [ Thoughts ]      [ About ]
```

Each item: `<a href="{page}.html" class="tab-bar-item"><span>{Label}</span></a>`

### Anatomy — Future (with self-hosted icons)

```
[ .tab-bar-item ] [ .tab-bar-item ] [ .tab-bar-item ] [ .tab-bar-item ]
  [ icon ]          [ icon ]          [ icon ]          [ icon ]
  [ Home ]          [ Work ]          [ Thoughts ]      [ About ]
```

Planned icon mapping (Tabler Icons, outline):
- Home: `ti-home`
- Work: `ti-briefcase`
- Thoughts: `ti-pencil`
- About: `ti-user`

Each item: `<a href="{page}.html" class="tab-bar-item">`
Icon: `<i class="ti ti-{name}" aria-hidden="true"></i>`
Label: `<span>{Label}</span>`

Active item: `.tab-bar-item.is-active` or `[aria-current="page"]`

### States

| State | Colour |
|---|---|
| Default | `--tab-bar-item-color` |
| Active | `--tab-bar-item-active` |
| Focus | Focus ring |

### Accessibility

- `aria-label="Mobile navigation"` on `<nav>`
- `aria-current="page"` on active item
- Icons: `aria-hidden="true"` — label provides the text
- Min touch target: `44px` width and height per item

### Responsive Behaviour

- Mobile: visible — `position: fixed`, `top: 0`
- Desktop: hidden via `display: none`
- Body requires `padding-bottom: 80px` on mobile to prevent content being obscured

---

## 6. Tooltip

**Figma Component Name:** `Tooltip`
**CSS Class:** `.tooltip`
**HTML Element:** `<span role="tooltip" class="tooltip">`

### Design Intent
Tooltips provide supplementary context on hover or keyboard focus. They never contain required information — if the information is critical, it belongs in the visible UI. Desktop only — touch devices do not have hover and the OS handles long-press natively.

### Component Tokens

```css
--tooltip-bg:               var(--color-tooltip-bg);
--tooltip-border:           var(--color-tooltip-border);
--tooltip-text:             var(--color-tooltip-text);
--tooltip-radius:           var(--border-radius-md);
--tooltip-padding-x:        var(--space-3);
--tooltip-padding-y:        var(--space-2);
--tooltip-font-size:        var(--font-size-sm);
--tooltip-max-width:        240px;
--tooltip-z-index:          100;
--tooltip-shadow:           var(--elevation-md);
--tooltip-transition:       var(--duration-fast) var(--ease-out);
--tooltip-offset:           8px;
```

### Anatomy

```
[ .tooltip-wrapper ]
  [ trigger element ]
  [ .tooltip ]
    [ tooltip text ]
```

- Wrapper: `<span class="tooltip-wrapper">`
- Trigger: any element — button, link, icon, text
- Tooltip: `<span role="tooltip" id="{unique-id}" class="tooltip">{text}</span>`
- Trigger must have: `aria-describedby="{unique-id}"`

### States

| State | Visibility |
|---|---|
| Default | Hidden (`opacity: 0`, `visibility: hidden`) |
| Hover (desktop) | Visible (`opacity: 1`, `visibility: visible`) |
| Focus-within (keyboard) | Visible |
| Escape key | Hidden — handled by `script.js` |

Transition on show: `opacity` and `visibility`, `--tooltip-transition`.

### Accessibility

- `role="tooltip"` on the tooltip element
- `aria-describedby` on the trigger pointing to the tooltip `id`
- Content: supplementary only — never required information
- Keyboard: appears on `:focus-within`, dismissed with `Escape`
- Touch: hidden via `@media (hover: none)` — never shown on touch devices

### Interaction Spec

- Show: `.tooltip-wrapper:hover .tooltip` and `.tooltip-wrapper:focus-within .tooltip`
- Hide: mouse leaves wrapper, or focus leaves wrapper, or `Escape` key pressed
- `Escape` handler in `script.js` blurs the trigger element to remove focus

### Responsive Behaviour

- Desktop: visible on hover and focus
- Mobile and touch: `display: none` via `@media (hover: none)` — not shown at all

---

## 7. Toast Notification

**Figma Component Name:** `Toast`
**CSS Class:** `.toast`
**HTML Element:** `<div role="status" aria-live="polite" class="toast">`

### Design Intent
The toast notification provides brief confirmation that an action was completed. Currently used for the Share button copy-to-clipboard action. It appears near the trigger, stays visible for approximately 2 seconds, then fades out automatically. It never requires user dismissal.

### Component Tokens

```css
--toast-bg:                 var(--color-background-surface);
--toast-border:             var(--color-accent-primary);
--toast-text:               var(--color-text-primary);
--toast-radius:             var(--border-radius-md);
--toast-padding-x:          var(--space-4);
--toast-padding-y:          var(--space-2);
--toast-font-size:          var(--font-size-sm);
--toast-font-weight:        var(--font-weight-medium);
--toast-shadow:             var(--elevation-md);
--toast-z-index:            300;
--toast-duration:           2000ms;
--toast-transition:         var(--duration-base) var(--ease-out);
```

### Anatomy

```
[ .toast — "URL copied to clipboard!" ]
```

- Container: `<div role="status" aria-live="polite" class="toast">URL copied to clipboard!</div>` — bare text, no icon (no icon library currently in use — see md/REFERENCE.md §5)

### States

| State | Opacity | Visibility |
|---|---|---|
| Hidden (default) | `0` | `hidden` |
| Visible | `1` | `visible` |
| Fading out | `0` (transition) | `hidden` after transition |

Show: add `.toast--visible` class via JavaScript
Hide: remove `.toast--visible` after `--toast-duration`

### Accessibility

- `role="status"` announces content to screen readers without interrupting
- `aria-live="polite"` — screen reader waits for current speech to finish before announcing
- Never requires user interaction to dismiss

### Interaction Spec

1. User clicks Share button
2. JavaScript copies `window.location.href` to clipboard
3. `.toast--visible` class added to `.toast`
4. After `2000ms`, `.toast--visible` class removed
5. Toast fades out via opacity transition

---

## 8. Breadcrumb

**Figma Component Name:** `Breadcrumb`
**CSS Class:** `.breadcrumb`
**HTML Element:** `<nav aria-label="Breadcrumb" class="breadcrumb">`

### Design Intent
Breadcrumbs tell the user where they are within the site hierarchy. Used on all standard pages (Work entries, Thoughts entries). Helps users understand context and navigate back without using the browser back button.

### Component Tokens

```css
--breadcrumb-font-size:         var(--font-size-sm);
--breadcrumb-color:             var(--color-text-secondary);
--breadcrumb-link-color:        var(--color-text-secondary);
--breadcrumb-link-hover:        var(--color-text-primary);
--breadcrumb-current-color:     var(--color-text-primary);
--breadcrumb-separator-color:   var(--color-text-secondary);
--breadcrumb-gap:               var(--space-2);
--breadcrumb-margin-bottom:     var(--space-6);
```

### Anatomy

```
[ Work ] [ › ] [ Page Title ]
```

Two segments only (Primary Tag, current page) — the Month/Year segment
formerly between them was removed 2026-08-17 (duplicated the Primary Tag's
own destination and caused the title/caption overlap fixed in the same
pass). The Primary Tag link already covers "browse this section" via
`/archive.html?type={work|thoughts}`; no separate Archive crumb is added.

- Wrapper: `<nav aria-label="Breadcrumb">`
- List: `<ol class="breadcrumb-list">`
- Each item: `<li class="breadcrumb-item">`
- Links: `<a href="{url}">{Label}</a>`
- Current page: `<span aria-current="page">{Title}</span>` — not a link
- Separator: `<span aria-hidden="true" class="breadcrumb-separator">›</span>` — between items, hidden from screen readers

### Accessibility

- `aria-label="Breadcrumb"` on `<nav>` — distinguishes from main nav
- `aria-current="page"` on the last item — current page is not a link
- Separators: `aria-hidden="true"` — decorative only
- Screen reader output: "Breadcrumb navigation. Work, link. Page Title, current page."

### Responsive Behaviour

- Same at all breakpoints
- Wraps to new line if title is long — never truncates

---

## 9. Divider

**Figma Component Name:** `Divider`
**CSS Class:** `hr` (native element, no custom class needed)
**HTML Element:** `<!-- Dot divider -->
<div class="divider--dots" role="separator" aria-hidden="true"><span></span></div>`

### Design Intent
Dividers separate major sections of content. Gold accent colour is used site-wide for all dividers — not grey. This is an intentional design decision that gives the site a warm, distinctive feel.

### Component Tokens

```css
--divider-color:    var(--color-divider-accent);
--divider-height:   1px;
--divider-margin:   var(--space-8) 0;
```

### Usage

```html
<!-- Dot divider -->
<div class="divider--dots" role="separator" aria-hidden="true"><span></span></div>
```

No additional classes or attributes needed. Styled globally via the `hr` element selector.

### Accessibility

`<!-- Dot divider -->
<div class="divider--dots" role="separator" aria-hidden="true"><span></span></div>` has an implicit `role="separator"` — screen readers announce it as a thematic break between content sections. No additional ARIA needed.

---

## 12b. Divider — Dots

**Figma Component Name:** `Divider/Dots`
**CSS Class:** `.divider--dots`
**HTML Element:** `<div class="divider--dots" role="separator" aria-hidden="true"><span></span></div>`

### Design Intent
A subtle section separator using three 4px circles in dark gold. Used when a full-width line would be too heavy — lighter content breaks, end of card sections, between biography paragraphs.

### Component Tokens

```css
--divider-dots-size:    4px
--divider-dots-gap:     12px
--divider-dots-color:   var(--color-accent-primary)
--divider-dots-margin:  var(--space-8) auto
```

### Anatomy

Three dots generated via `::before`, `<span>`, and `::after` pseudo-elements. No additional child elements needed beyond the single `<span>`.

### States

Static — no interaction states.

### Accessibility

- `role="separator"` — announces as a thematic break
- `aria-hidden="true"` — the dots are decorative; screen readers announce the role only

---

## 10. Blockquote

**Figma Component Name:** `Blockquote`
**CSS Class:** `.blockquote` applied to `<blockquote>`
**HTML Element:** `<blockquote>`

### Design Intent
Blockquotes highlight a notable quote or pull quote from the text. Option A — left border stroke only — is the chosen pattern. The pink left border creates a visual distinction from gold accents used elsewhere, giving quotes their own identity.

### Component Tokens

```css
--blockquote-border-color:      var(--color-quote-border);
--blockquote-border-width:      var(--border-width-thick);
--blockquote-bg:                var(--color-background-surface);
--blockquote-padding-x:         var(--space-5);
--blockquote-padding-y:         var(--space-4);
--blockquote-radius-right:      var(--border-radius-md);
--blockquote-text-size:         var(--font-size-md);
--blockquote-text-style:        italic;
--blockquote-text-color:        var(--color-text-primary);
--blockquote-cite-size:         var(--font-size-sm);
--blockquote-cite-color:        var(--color-text-secondary);
--blockquote-margin:            var(--space-8) 0;
```

### Anatomy

```
[ left border ] [ quote text ]
               [ cite — attribution ]
```

- Container: `<blockquote>`
- Quote text: `<p>` inside blockquote — italic
- Attribution: `<cite>— {Name}</cite>` — not italic, secondary colour

### Left Border Implementation

```css
blockquote {
    border-left: var(--blockquote-border-width) solid var(--blockquote-border-color);
    border-radius: 0 var(--blockquote-radius-right) var(--blockquote-radius-right) 0;
}
```

---

## 11. Code Block

**Figma Component Name:** `CodeBlock`
**CSS Class:** `code` and `pre` (native elements)
**HTML Elements:** `<code>` for inline, `<pre><code>` for block

### Design Intent
Code blocks display technical content with clear visual distinction from body text. Gold left border connects them to the accent colour system. Dark background creates contrast from the page surface.

### Component Tokens

```css
--code-bg:              var(--color-code-bg);
--code-border-color:    var(--color-code-border);
--code-border-width:    var(--border-width-thick);
--code-text-color:      var(--color-accent-primary-text);
--code-font-family:     'Courier New', Courier, monospace;
--code-font-size:       var(--font-size-sm);
--code-padding-inline:  var(--space-2) var(--space-3);
--code-radius:          var(--border-radius-sm);
--code-block-padding:   var(--space-4) var(--space-5);
--code-block-margin:    var(--space-6) 0;
```

### Anatomy

Inline: `<code>{snippet}</code>`

Block — always wrapped in `.code-wrap` (added 2026-09-03, see below):
```html
<div class="code-wrap">
    <pre><code>{multiline code}</code></pre>
</div>
```

### Horizontal Overflow — `.code-wrap`

**Every block `<pre><code>` must be wrapped in `<div class="code-wrap">`.** `.code-wrap { overflow-x: auto; margin: var(--space-6) 0; }` (`style.css`) — a plain scroll container, no visual styling of its own. `pre` itself also keeps its own `overflow-x: auto` as a defensive fallback, but `.code-wrap` is the reliable fix; do not rely on `pre`'s own overflow alone.

**Why this exists:** a long, unbroken code line (`white-space: pre` — never wrapped; wrapping code text would break formatting/readability, the wrong tradeoff here) can render wider than its container. Without a dedicated scroll container, this silently expanded `window.innerWidth` on a narrow screen instead of producing a scrollbar — confirmed via testing 2026-09-03, the same root mechanism as `.table-wrap` (`## 3. Card`'s sibling table-overflow fix, same date). Never use `white-space: pre-wrap` or `word-break` to force-wrap code text to avoid this — horizontal scroll is the correct pattern for code, same as it is for wide tables.

This is currently the only code block on the site (`design-system.html` Section 13) — no Work or Thoughts entry currently contains one — but any future code block, anywhere, must use this wrapper from the start rather than being discovered as a bug later.

---

## 12. Back to Top Button

**Figma Component Name:** `BackToTop`
**CSS Class:** `.back-to-top`
**HTML Element:** `<button class="back-to-top" aria-label="Back to top">`

### Design Intent
The Back to Top button appears after the user has scrolled 400px down the page. It gives users a quick way to return to the top without scrolling. It respects `prefers-reduced-motion` — when set, the scroll is instant rather than smooth.

### Component Tokens

```css
--back-to-top-bg:           var(--color-background-surface);
--back-to-top-border:       var(--color-border-strong);
--back-to-top-text:         var(--color-text-primary);
--back-to-top-hover-bg:     var(--color-background-subtle);
--back-to-top-radius:       var(--border-radius-sm);
--back-to-top-padding-x:    var(--space-5);
--back-to-top-padding-y:    var(--space-3);
--back-to-top-font-size:    var(--font-size-sm);
--back-to-top-font-weight:  var(--font-weight-medium);
--back-to-top-transition:   var(--duration-base) var(--ease-out);
--back-to-top-min-height:   44px;
```

### Icon — Deferred

> **Current state: text-only.** The arrow-up icon has been removed pending self-hosting. Future iteration will add the `ti-arrow-up` icon once Tabler Icons is self-hosted in `assets/icons/`. Do not use the CDN.

### Anatomy — Current (text-only)

```
[ .back-to-top ]
  [ "Back to Top" ]
```

- Button: `<button class="back-to-top" aria-label="Back to top"><span>Back to Top</span></button>`

### Anatomy — Future (with self-hosted icon)

```
[ .back-to-top ]
  [ icon ti-arrow-up ] [ "Back to Top" ]
```

- Button: `<button class="back-to-top" aria-label="Back to top">`
- Icon: `<i class="ti ti-arrow-up" aria-hidden="true"></i>`
- Label: `<span>Back to Top</span>`

### States

| State | Visibility | Notes |
|---|---|---|
| Default (< 400px scroll) | Hidden | `opacity: 0`, `visibility: hidden`, `pointer-events: none` |
| Visible (≥ 400px scroll) | Shown | `opacity: 1`, `visibility: visible` — `.back-to-top--visible` class |
| Hover | `--back-to-top-hover-bg` | Background darkens |
| Focus | Focus ring | Global focus style |

### Interaction Spec

Show/hide: `script.js` listens to `window.scroll`. At 400px threshold, toggles `.back-to-top--visible`.

Click action:
```javascript
window.scrollTo({ top: 0, behavior: 'smooth' });
```
With `prefers-reduced-motion`:
```javascript
window.scrollTo({ top: 0, behavior: 'auto' });
```

### Responsive Behaviour

- Desktop: centred below content, above footer
- Mobile: same centred, in-flow placement at the end of page content — the tab bar is fixed to the top of the viewport (see §5), not the bottom, so no special clearance is needed here

---

## 13. Share Button

**Figma Component Name:** `ShareButton`
**CSS Class:** `.share-btn`
**HTML Element:** `<button class="share-btn btn btn--ghost" aria-label="Copy link to clipboard">Share</button>`

### Design Intent
The Share button allows users to copy the current page URL to their clipboard. It appears in the metadata block on all standard pages, both at the top below the title and repeated at the bottom of the content. On click, it triggers the Toast notification confirming the copy action.

### Component Tokens

Inherits from Button component tokens (`.btn`, `.btn--ghost`) — no component-specific tokens of its own. (Previously documented a `--share-btn-icon-size` token; removed with the icon it sized — no icon library currently in use, see md/REFERENCE.md §5.)

### Anatomy

```
[ .share-btn.btn.btn--ghost — "Share" ]
```

- Button: `<button class="share-btn btn btn--ghost" aria-label="Copy link to clipboard">Share</button>` — bare text label, no icon

### Interaction Spec

1. User clicks `.share-btn`
2. `navigator.clipboard.writeText(window.location.href)` copies the URL
3. Toast notification appears: "URL copied to clipboard!"
4. Toast auto-dismisses after 2000ms

### Accessibility

- `aria-label="Copy link to clipboard"` — more descriptive than "Share" alone
- After successful copy: `aria-label` temporarily updates to "URL copied to clipboard!" for 2 seconds, then reverts
- Toast uses `aria-live="polite"` to announce to screen readers

### Responsive Behaviour

Same at all breakpoints.

---

## 14. Standard Page Template

**CSS Class:** `.standard-page`
**HTML Files:** `templates/work-entry-template.html`, `templates/thought-entry-template.html` (two separate template files — see Template Consolidation note below)
**Used for:** Individual Work entries and Thoughts entries (blog posts, project writeups)

### Design Intent
The standard page template provides a consistent reading experience for all long-form content. It is single column, centred, and optimised for sustained reading. Redesigned 2026-08-17: the header separated authorship from structured metadata (a left-aligned Project Details / Details card), the banner image became contained rather than full-bleed on mobile, and the footer was rebuilt around Share, a tag-driven "More Work" / "More Thoughts" link, and a reused contact section — replacing the old non-functional Previous / Next navigation entirely. Revised again 2026-08-19 against a visual review: the author row was removed outright, the Details card's tag pills and row text were brought back down to the site's existing shared scales (they'd drifted to Figma-derived sizes larger than the rest of the site), the footer's two action buttons were fixed to render at matching size, and the banner's max-width was capped to the same 65ch the text column beneath it already uses (it had been stretching to the full 1200px page ceiling instead).

### Anatomy

```
[ nav.breadcrumb — Primary Tag › Page Title, 2 segments ]
[ .standard-page-banner — 3:1 ratio (3:2 mobile), full-width (`width: 100%`, no max-width — confirmed 2026-08-25; the 8/19 revision's intent to cap it to the 65ch text column was reverted later the same day and never carried into this doc until now), contained within .standard-page's own padding at every breakpoint ]
[ p.standard-page-caption ]
[ h1.standard-page-title — centre aligned ]
[ .standard-page-details — card ]
  [ .standard-page-details-row — Employer / Role / Timeline / Tools (Work) or Published / Updated (Thoughts) ]
    [ span.standard-page-details-label ]
    [ span.standard-page-details-value ]
  [ .standard-page-details-row.standard-page-details-row--tags ]
    [ span.standard-page-details-label — "Tags" ]
    [ .standard-page-details-tags > a.tag — same class/size as an Archive card tag, no modifier ]
[ hr.standard-page-divider — max-width 65ch, centred ]
[ .standard-page-content ]
  [ h2 headings, h3 subheadings, p body text ]
  [ ul/ol lists, blockquote, code blocks as needed ]
  [ figure > img + figcaption.standard-page-caption — captioned in-body image ]
  [ img — bare, uncaptioned in-body image ]
  [ table — 65ch reading column, scrolls via overflow-x on narrow viewports ]
[ hr.standard-page-divider — max-width 65ch, centred ]
[ .standard-page-footer ]
  [ .standard-page-footer-actions ]
    [ button.share-btn.btn.btn--ghost ]
    [ a.btn.btn--ghost — "More Work" (Work) or "More Thoughts" (Thoughts), tag-driven per template ]
  [ div.divider--dots ]
  [ section#contact-heading — "Want to work together? Contact me!", reused verbatim from about.html ]
[ .back-to-top-row > button.back-to-top ]
```

There is no author row (photo + name) — it was added in the 8/18 redesign
and removed in the 8/19 revision as a deliberate simplification, not an
oversight. Authorship for both entry types is Christopher Klein by default
and isn't otherwise surfaced in this header.

**In-body images (2026-08-18):** `.standard-page-content img` (full width,
natural aspect ratio, `border-radius: var(--border-radius-md)`,
`margin-bottom: var(--space-6)`) styles any image dropped into body content,
separate from the banner (which is a CSS background-image, not an `<img>`).
Images needing a credit/caption use `<figure><img><figcaption
class="standard-page-caption"></figcaption></figure>` — reusing the banner's
existing caption class rather than a second caption style.
`.standard-page-content figure` carries the block's `margin-bottom` instead
of the inner `img` so a captioned figure doesn't double up spacing.
Uncaptioned images are a bare `<img>` with no wrapper. All images require
alt text (`alt=""` only for decorative images) and `loading="lazy"`, matching
the convention already used on About's profile photo. Every in-body image
is also a click-to-zoom trigger — see below and `### Image Viewer
(Click-to-Zoom)`.

**Click-to-zoom trigger (as of 2026-09-21):** at page load `initImageViewer()`
wraps each `.standard-page-content img` in a real
`<button type="button" class="image-zoom-trigger">` (entry HTML is unchanged;
the trigger is added by JS, so every current and future body image gets it).
Its accessible name is "View larger image: {alt}" (an `.sr-only` prefix plus
the image's own alt), one Tab stop per image. **Hover:** a 2px
`--color-accent-primary-text` outline (`outline-offset: calc(-1 *
var(--border-width-thin))`) drawn over the trigger's reserved 1px transparent
border, so nothing shifts; it applies on `:hover:not(:focus-visible)`, so a
keyboard-focused trigger keeps the sitewide focus ring and its
`--color-accent-primary` border. **Expand icon:** a decorative
`.image-zoom-trigger-icon` (`aria-hidden`, `pointer-events: none` — the whole
thumbnail stays the single click target) in the image's top-right corner,
inset `--space-2`: a `--space-8` plate (`--color-background-surface` fill, 1px
`--color-border-strong`, `--border-radius-sm`) holding a `--space-5` inline SVG
of `assets/icons/arrows/expand.svg` in `currentColor`. Visibility: hidden at
rest; shown on `:hover` and on `:focus-visible`; always shown under
`@media (hover: none)`, since touch has no hover. The fade uses
`--duration-fast` / `--ease-out`, covered by the sitewide reduced-motion rule.

**In-body tables (2026-08-18):** `.standard-page-content table` caps at the
same 65ch reading column as everything else in body content (a per-instance
call to override if a specific table genuinely needs more columns) and
scrolls horizontally (`overflow-x: auto` directly on the table, the same
approach `pre` already uses for wide content, rather than an extra wrapper
element) instead of trying to reflow columns on narrow viewports. `th` reuses
`.standard-page-details-label`'s exact label treatment (size/weight/color) by
value, not by selector reference. `td` matches body paragraph text. Row separators use
the sitewide thin-border convention, with the last row's border removed the
same way `.about-history-item:last-child` drops its own.

### Image Viewer (Click-to-Zoom)

**CSS Classes:** `.image-viewer`, `.image-viewer-scrim`, `.image-viewer-image`, `.image-viewer-close`, `.image-viewer-nav`, `.image-viewer-zoom-controls`, `.image-zoom-trigger`, `.image-zoom-trigger-icon`
**JS Function:** `initImageViewer()` in `script.js` (depends on `trapFocus()`); a no-op on any page without `.standard-page-content` images.

A modal dialog (`role="dialog"`, `aria-modal="true"`, `aria-label` = the current image's alt text) showing one enlarged image, opened from the click-to-zoom trigger above. It is built once per page and shared by every image on it, using the same accessible-modal mechanics as the Filter Drawer and ToC panel (inert background, `trapFocus()`, body scroll lock) rather than a new technique.

- **Anatomy:** `.image-viewer-scrim` (`z-index` 269, `--color-background-base`, 0.85 opacity when open) and `.image-viewer` (`z-index` 270) containing Close (×, top-right), the enlarged image, zoom − / + (bottom centre) and Previous / Next (left / right edge; only created when the page has 2+ images, and they wrap around). All controls are `.btn.action-rail-clear` buttons with neutral hover.
- **Zoom and pan:** 1× (fit) to 4× in 0.5 steps, applied as `translate() scale()` on the image; pan is clamped so the visible edge never crosses the fit-to-view frame. Zoom out is disabled at 1×, zoom in at 4×, and Previous / Next are disabled while zoomed (arrows pan instead).
- **Input:** Esc closes. `+`/`=` and `-`/`_` zoom. Arrow keys pan by 40px when zoomed, and navigate (Left/Right) at 1×. The scroll wheel over the image zooms; dragging the image pans when zoomed; two-finger pinch zooms at any level. Pressing a control never starts a pan (drag is bound to the image only).
- **High-res tier:** the dialog loads `{name}-full.webp`, derived from the thumbnail's `src` by `deriveFullSrc()` (always `.webp`); `scripts/build-images.js` generates it at `HIGH_RES_SCALE` (2×) the 800px thumbnail width. If the `-full` file is missing, `onerror` falls back once to the thumbnail, so an image not yet processed still opens.
- **Layering:** every control has `z-index: var(--image-viewer-controls-z)` (a local custom property, `1`, on `.image-viewer` — the same convention as `--card-block-link-z`), so it renders above the enlarged image at every zoom and pan state. Without it the transformed image painted over Close from about 1.5× zoom. DOM order (which is also Tab order) is unchanged.
- **Focus and screen readers:** opening focuses Close; Esc or Close returns focus to the exact trigger for the image on screen (it follows Previous / Next); Tab and Shift+Tab stay inside the dialog. A `.sr-only` polite region announces "Image N of M: {alt}" as the image changes. The background is `inert` and body scroll is locked while open.
- **Known gap:** the scrim has a click-to-close handler, but `.image-viewer` covers it, so clicking the empty area of the dialog does not close it today (Esc and Close do).

### Template Consolidation — Flagged Follow-Up

Work and Thoughts entries are NOT rendered from one shared runtime template —
each entry is a hand-authored static HTML file (no build step, no
client-side data-driven rendering for entry pages; contrast with
archive.html, which fetches `data/archive-entries.json` and renders
client-side). Two source templates exist:
`templates/work-entry-template.html` and
`templates/thought-entry-template.html`. Merging these into one true shared
template would require introducing dynamic, JSON-driven rendering for
standard pages — a materially bigger architectural change than a template
redesign (this project deliberately has no build tools per md/REFERENCE.md
§1/§2). Logged here as a candidate for a dedicated future session rather
than folded into this redesign.

Within that constraint, the "dynamic, tag-driven" parts of this redesign
(the breadcrumb's Primary Tag link and the footer's "More Work" / "More
Thoughts" link) both use the identical `/archive.html?type={work|thoughts}`
href pattern, one substitution point per template — not divergent
hardcoded logic — so consolidating later stays a mechanical merge.

**Migration status (confirmed complete 2026-08-23):** all five live entries
(`work/star-engine.html`, `work/this-website.html`,
`thoughts/welcome.html` (renamed 2026-09-20, formerly `thoughts/read-me.html`,
before that `thoughts/code-and-conduct.html`, before that `thoughts/thrilling-beginnings.html`),
`thoughts/physical-and-digital-media.html`,
`thoughts/industrializing-the-industry.html`) plus both templates use this
design. The previous `.standard-page-meta` / `.standard-page-nav` structure
has no remaining consumers anywhere in the repo and its CSS has been removed
from style.css — there is no longer a second generation to keep in sync.

### Project Details / Details Card

**CSS Class:** `.standard-page-details`

Left-aligned label/value rows in a card: `padding: var(--space-2)`,
`gap: var(--space-2)`, `background-color: var(--color-background-surface)`,
`border: var(--border-width-thin) solid var(--color-border-default)`,
`border-radius: var(--border-radius-md)`. Figma referenced background
`#141414`, which has no exact token match (between `--color-background-base`
`#111111` and `--color-background-surface` `#1A1A1A`) — mapped to
`--color-background-surface` for consistency with the Card component's own
`--card-bg`, since this is functionally a card.

Rows: Employer, Role, Timeline, Tools, Tags on Work entries; Published,
Updated, Tags on Thoughts entries (the Work-specific field set from the
Figma spec doesn't apply to Thoughts, which never had Employer/Role/
Timeline/Tools — see Template Consolidation above). Employer/Role/Timeline/
Tools/Published/Updated rows: `align-items: center`. Tags row:
`align-items: flex-start` (wraps).

Label/value columns use `flex: 1` / `flex: 2` (proportional, not a
hardcoded pixel width) — Figma specified a ~210px label column, but no
existing sitewide label/value pattern uses a fixed px width, so relative
flex-grow ratios were used instead per Rule 6.

**Revised 2026-08-19:** label and value text was reduced from the original
Figma-derived Body-20 sizing (`--font-size-lg`, 20px) down to
`--font-size-sm` (14px) + `--line-height-normal` — the same "card body copy"
scale `.card-meta` already uses for metadata elsewhere on the site
(Archive/Home card date-author line). Label additionally takes
`--font-weight-medium` to distinguish it from the value column, which stays
`--font-weight-regular`. This also resolved a mobile overflow/wrap risk the
larger Figma-derived sizing had at narrow widths.

Tags use the plain, unmodified `.tag` component — same class, same
computed size, as an Archive card or Filter Drawer tag. The 8/18 redesign
introduced a `.tag--details` modifier (larger font, filled background) to
match the original Figma spec; that modifier was removed 2026-08-19 so a
tag pill looks identical whether it appears on an Archive card or in this
Details card, per visual review. All interaction states (hover,
focus-visible) are the sitewide `.tag` states, unchanged.

Responsive: rows stack to a single column (`flex-direction: column`) at
mobile (≤767px), matching the existing `.about-history-meta` stacking
pattern.

### Footer

**CSS Class:** `.standard-page-footer`

Replaces the old non-functional Previous / Next navigation entirely. In
order:

1. **Share** — the existing `.share-btn` component (see `## 13. Share
   Button`), relocated here unchanged. Same markup, same
   `initShareButtons()` behaviour in script.js (selector-based, unaffected
   by DOM relocation).
2. **More Work / More Thoughts** — `<a class="btn btn--ghost"
   href="/archive.html?type={work|thoughts}">`, tag-driven per template
   (same href pattern the breadcrumb's Primary Tag link already uses, and
   the same pattern Home's `.section-footer` "View more work" / "Read more
   thoughts" links use).
3. **Contact section** — `<section aria-labelledby="contact-heading">`
   with `.section-heading`, `.contact-buttons`, `.contact-icon-btn` (Resume
   / Email / LinkedIn) reused verbatim from about.html, no changes.

A `.divider--dots` separates the actions row from the contact section,
matching about.html's own use of the same divider between sections.

**Revised 2026-08-19:** Share ("Share", 5 characters) and More Work/More
Thoughts ("More Work" / "More Thoughts", 9–13 characters) rendered at
visibly different widths — each `.btn` was sizing to its own text content.
`.standard-page-footer-actions .btn` now sets `flex: 1` so both buttons
split the row evenly, the same fix already used sitewide for the identical
problem on `.filter-drawer-page-btn` (Previous/Next in the Filter Drawer —
see `## 2c. Filter Drawer`).

### Table of Contents — Trigger & Panel

**Removed 2026-09-18:** an earlier always-visible Desktop rail
(`.toc-rail`, `min-width: 1440px`) shipped 2026-08-23 stood alongside
this trigger + panel pattern, visible on Desktop only. It had no
reserved gutter in the content column and overlapped the entry's own
`<h1>`/body copy at Desktop widths, so it was removed outright rather
than fixed in place — this trigger + panel pattern (previously scoped to
`max-width: 1439px`, i.e. every real iPad width in both orientations plus
phone) now applies unconditionally at every breakpoint, Desktop included,
unchanged from how it already behaved below 1440px. See
md/REFERENCE.md §14 changelog for the full decision log.

**CSS Classes:** `.action-rail-group.toc-trigger-group` (trigger's
positioned wrapper), `.action-rail-trigger` (trigger button, `id="toc-trigger"`),
`.action-rail-badge` (position count), `.toc-panel` (panel `<nav>`,
`id="toc-panel"`), `.toc-panel-label`, `.toc-panel-list`, `.toc-panel-scrim`,
`.toc-rail-link` (row — shared with the Back to Top row), `.toc-rail-item--sub`
(H3 marker — no rule of its own, only the hook the H3 icon layout keys off),
`.toc-rail-link--active` (current heading), `.toc-sub-icon`
(H3-only leading icon) — the `.toc-rail-*`
naming on these three predates the rail's removal and is kept as-is
(Rule 3a: the classes themselves were never rail-specific markup, just a
shared naming prefix), not renamed as part of this change.

**Anatomy:** `.toc-panel-list` contains one Back to Top row first
(`buildBackToTopRow()` — see below), then one `<li><a class="toc-rail-link">`
per heading in document order (H3s additionally get `.toc-rail-item--sub`
as a marker, and their link a leading `.toc-sub-icon` — see below).

**H3 sub-section icon (added 2026-09-20):** every H3 row's `<a>` gets
`assets/icons/floating-button/sub-section.svg` inlined (not `<img src>`)
as its first child, built by `buildTocLinks()` from the `TOC_SUB_ICON_HTML`
constant (script.js) — an elbow-connector glyph reading as "child of the
row above." Path data is the source file's single flattened path, byte for
byte (`M5 13H22V15H3V2H5V13Z`, one subpath, no strokes/masks — confirmed
unioned/flattened before inlining, per the 8/21 contact-icons lesson);
only `fill="white"` became `fill="currentColor"` and the fixed
`width`/`height` moved to CSS. The source's `<g opacity="0.9">` wrapper is
kept, same as the other inlined icons (`content.svg` on the trigger and
panel label). Decorative: `aria-hidden="true"`, so a row's accessible name
is still just its heading text. H2 rows and the Back to Top button get no
icon and keep `display: block`; H3 links become `display: flex` with
`gap: var(--space-2)` and a `--icon-size-md` (16px) icon (same two values
`.toc-panel-label` uses for its own leading icon, Rule 3a) via
`.toc-rail-item--sub .toc-rail-link`. No colour rule anywhere: the icon
follows the row's own text colour through `currentColor` in every state —
confirmed by direct measurement, icon fill equal to link text colour in
default (`rgb(245,245,245)`), hover (`rgb(0,186,165)`) and active
(`rgb(0,229,203)`). The active row's faux-bold `text-shadow` only affects
glyphs, so the icon takes the active colour but not the extra weight.
**No left indent (revised 2026-09-20):** `li.toc-rail-item--sub` used to
carry `padding-left: var(--space-4)` (16px) to nest H3 rows under their H2.
Removed once the icon shipped — the icon alone now conveys nesting, so H2,
H3 and Back to Top rows all share identical left *and* right edges
(confirmed by direct measurement: every row at the same left and right
x-coordinate and the same width at both 1920×1000 and 390×844; H3 `li`
padding now `0px`). Right edges were already identical before this (the
link is `width: 100%` of its `li`), so the "H3 rows narrower than H2 rows"
premise the icon work was scoped from never matched the shipped CSS.
`.toc-rail-item--sub` keeps existing as a rule-less marker class only
(script.js still sets it, and the H3 icon selector keys off it). One
consequence carried over from the icon: it plus its gap take 24px of an H3
row's text width in the fixed 240px panel, so longer H3 titles wrap
earlier — on `work/star-engine.html`, "Decentralized Settings" wrapped to
two lines (62px vs 40px, at both widths) even with the 16px indent given
back, since the indent returned less width (16px) than the icon and gap
took (24px). That heading was renamed "Tangled" on 2026-09-20 and no
longer wraps (all 18 rows on that page are single-line), so no live row
currently demonstrates the effect — it will recur for any future H3 title
longer than roughly the width that heading had.

**Scrollspy:** `updateActiveState()` tracks scroll position directly
against each heading's own computed `scroll-margin-top` (not
`IntersectionObserver`). An `atBottom` special case forces the last
heading active once the page is genuinely scrolled to its true bottom:
every entry's shared footer block (Share/More Work, contact, Back to
Top, copyright) below the final heading is shorter than a typical
viewport, so that heading's own threshold-crossing check is otherwise
unreachable at any scroll position.

**Active/inactive styling:** inactive rows reuse `.action-rail-trigger`/
`.filter-drawer-page-btn`'s shared traits (font-size-sm, border-strong,
subtle background) rather than a parallel style; the active row reuses
`.tag-chip--active`'s exact treatment verbatim, including the
text-shadow "faux bold" neither class sets `font-weight` for.

**Trigger:** reuses `.action-rail-group`/`.action-rail-trigger`/
`.action-rail-badge` verbatim from Archive's own Filter trigger (Rule
3a) — labeled "Contents", a `.trigger-label` span plus an
`.action-rail-badge` span showing the live "X/Y" position (`aria-hidden`;
the count is announced instead via the trigger's own dynamic
`aria-label`, updated by the same shared `updateActiveState()` pass).
Show/hide uses the same scroll-threshold mechanism as `.back-to-top` —
visible only once `window.scrollY > 400`, via the shared
`.action-rail-group--visible` modifier class. Clicking toggles the panel
open/closed directly (`if (panel.hidden) openPanel(); else closePanel();`).

**Hide-while-open:** `openPanel()` removes `--visible` from the trigger's
wrapper synchronously — one hide method, not two. `closePanel()`
restores it via an instant-transition trick (add an `--instant` modifier
that disables the transition, add `--visible`, force a reflow, remove
`--instant`) so focus can return to the trigger immediately without the
`visibility: hidden`-elements-silently-refuse-`.focus()` problem that
would otherwise reintroduce a keyboard-accessibility regression.

**Panel positioning (revised 2026-09-19 — decoupled from the trigger):**
`position: fixed`, `right: max(--space-6, (100vw - --max-content)/4)`
(same formula the Desktop Filter Panel uses, and the trigger's own
`.action-rail-group` — coincidentally shared, not derived from it),
`top: var(--toc-panel-top-offset)` (`:root`; `calc(64px + --space-6)` —
`64px` is this site's header/tab-bar height, confirmed via direct read of
both `header` — sticky, tablet/desktop — and `.tab-bar` — fixed, mobile
— before changing anything: both render at exactly 64px at their own
visible breakpoints, so one constant covers every tier), `width: var(--toc-rail-width)`
(`240px`), `max-width: calc(100vw - --space-8 * 2)`. Applies at every
breakpoint, unconditionally — no per-tier override.

Previously `bottom`-anchored to the trigger's own resting position
(mirroring `.action-rail-group`'s `top: 50%`/`70%`), which meant the
panel's growable space topped out around 45–48% of viewport height no
matter what percentage its `max-height` used — there was never more room
than the gap between the header and wherever the trigger sat. `top` now
anchors a fixed length below the header instead, entirely independent of
the trigger's own position, freeing height to reach the real 75–80%
target below. `transform-origin` flipped from `bottom right` to
`top right` to match (the panel now opens by easing down into place from
a fixed point below the header, not up from the trigger's own corner).

**Mobile `<=767px` tier — investigated, no override needed:** the old
`bottom`-anchored design needed a separate `max-width: 767px` override to
retune its cap for `.action-rail-group`'s own mobile-only `top: 70%`
(vs. `50%` wider). That dependency is gone now that position anchors to
the header/tab-bar instead of the trigger, and the header/tab-bar height
those anchor to is identical (`64px`) at every tier — confirmed via
direct read, not assumed. One unconditional rule now correctly covers
mobile, tablet, and desktop; no `.toc-panel`-specific media query
remains.

**Height-cap, scroll, overflow:** `.toc-panel` (the outer `<nav>`) is
itself the scroll container — there's no separate inner scrolling list;
`.toc-panel-list` is layout-only, no chrome or scroll properties of its
own. `overflow-y: auto` plus a restyled scrollbar: `::-webkit-scrollbar*`
selectors (Chrome/Edge/Safari) and its own `scrollbar-width: thin` /
`scrollbar-color` declaration (Firefox).

**`max-height` clamp (revised 2026-09-19, twice — see both entries in
REFERENCE.md §14):** `max-height: min(clamp(--toc-panel-height-min, 78vh, --toc-panel-height-max), calc(100vh - --toc-panel-top-offset - --space-6))`.
Briefly shipped as `height` (not `max-height`) the same day, on the
reasoning that the spec's real ~75–80% target called for a presence size
rather than a shrink-to-content ceiling — but a real `height` forces
every panel to that size regardless of content, so a short heading list
rendered visible empty space below its last row. Reverted to `max-height`
same day, same value otherwise unchanged: a short list now shrink-wraps
its own content (confirmed via `thoughts/physical-and-digital-media.html`,
5 headings — no trailing gap), while a long list still caps at ~78vh
with internal scroll (confirmed via `work/star-engine.html`, ~20
headings — unchanged from the decoupled-position verification).
`--toc-panel-height-min`/`-max`
(`:root`, `320px`/`1024px`) are derived from `--space-32` (`calc(--space-32 * 2.5)`
/ `calc(--space-32 * 8)`, Rule 3a). With `top` now a fixed length rather
than a `vh` fraction, `calc(100vh - --toc-panel-top-offset - --space-6)`
alone is sufficient to guarantee no header overlap or viewport overflow
at any height — simpler than the old trigger-relative formula, which had
to reason about `vh` fractions on both the anchor and the cap. `min()`
combines it with the clamp: the `78vh` mid-point is what actually governs
height at every ordinary viewport (confirmed via direct Playwright
measurement — all landed at exactly 78.0%: 2560×1300, a realistic
logical-CSS stand-in for a 4K panel at 150% OS scaling per the spec, not
a monitor's raw physical resolution; 1920×1000; 834×1100; 390×844), while
the `calc()` safety ceiling only binds on an unusually short window
(confirmed at 1920×500) or the clamp's own `--toc-panel-height-max`
ceiling binds on an unusually narrow-and-tall one (confirmed at
390×3000) — both correctly handled without overlap.

**Scrim:** `.toc-panel-scrim` is a real click-catching element
(`pointer-events: auto` only while `--open`), not a document-click
listener — a background click can never both close the panel and
activate whatever's underneath it. Applies unconditionally at every
breakpoint, same as the panel itself.

**`inert`:** `getTocInertTargets()` returns `#nav-placeholder`,
`#main-content`, `.toast`, `.tab-bar`, `#footer-placeholder` — all get
`inert` while the panel is open (removed on close), excluding
background content from Tab order and the accessibility tree in both
directions. The trigger itself isn't included in this list — its own
`visibility: hidden` state (from the hide-while-open above) already
removes it from both on its own.

**Scroll-lock is NOT used here** — worth stating plainly, since the
Filter Drawer this panel is otherwise modeled on *does* lock
background scroll, and a future session could reasonably assume this
one does too. `lockBodyScroll()` / `unlockBodyScroll()` are still
defined inside this same closure but are never called from `openPanel()`
or `closePanel()` — confirmed by reading every call site directly, not
by assuming from a prior summary. It was added for this panel
originally, then traced as the root cause of several real, confirmed
bugs (the badge/scrollspy state reading corrupted values while the
lock's `position: fixed` on `<body>` was active; `.back-to-top`
disappearing with no actual scroll having happened; a WebKit-only
content-blanking issue on a second panel open) and removed entirely.
The scrim + `inert` combination alone proved sufficient to block
background interaction and keep focus contained, with none of
`position: fixed`-on-`<body>`'s side effects.

**Dismiss paths** — three direct, plus a fourth external-scroll
mechanism:
1. **Escape** (`handlePanelEscape()`) — closes with focus returned to the trigger.
2. **Scrim click** — closes without returning focus (the user clicked away, not on a path expecting focus back).
3. **Selecting a row** — a real heading link or the Back to Top row, both sharing the `.toc-rail-link` class, so one generic click listener on `.toc-panel-list` closes on either without special-casing which was clicked. Closes without returning focus, since the row's own action (scroll, and for headings the browser's native fragment-focus) already moves focus meaningfully.
4. **External scroll** (`handlePanelScroll()`) — closes the instant the underlying page scrolls more than a 2px tolerance from its position when the panel opened, so the trigger's own independent scroll-threshold listener never gets a chance to re-show it over a still-open panel. The listener is attached only while open (added in `openPanel()`, removed in `closePanel()`) and is bubble-phase only (no `capture`), confirmed via direct testing not to fire from the panel's own internal `overflow-y: auto` scrolling — element-level scroll events don't bubble to a bubble-phase `window` listener.

**Back to Top row:** `buildBackToTopRow()` builds a
`<button class="toc-rail-link" aria-label="Back to top">` — a button, not
an `<a>`, since there's no `#heading` to link to. Deliberately built
outside `buildTocLinks()` and never added to the `panelLinks` array
`updateActiveState()` tracks, which is what makes "never active, never
counted" automatic rather than a special case: the active-toggle loop
only touches that array (and this button has no `href` to match in the
first place), and the badge's `headings.length` denominator never
includes it. Prepended as the panel's own first row ahead of the real
headings. Selecting it both scrolls to the real top (the shared `scrollToTop()`
function, §12) and closes the panel via the same generic
`.toc-rail-link` click listener every other row uses — no separate close
path written for it.

### Accessibility

- Details card tag links: same accessibility as `.tag` (real links, own
  `aria-label`, independently focusable)
- Toast notification on share uses `aria-live="polite"` and temporary
  `aria-label` update on the button — unchanged by relocation
- Contact section: `aria-labelledby="contact-heading"`, matching about.html

### Responsive Behaviour

| Breakpoint | Layout |
|---|---|
| Desktop (≥1024px) | Banner full-width (`width: 100%`, no max-width — confirmed 2026-08-25, see Anatomy above), contained within `.standard-page`'s own padding, not capped to the 65ch text column beneath it; details rows label/value side by side; footer actions row side by side, matched width |
| Tablet (768–1023px) | Same as desktop — banner still full-width within the page's own padding |
| Mobile (<768px) | Banner contained (no longer full-bleed) but still full-width within the page's own padding, same as the other two tiers; details rows stack to single column; footer actions stack full-width |

---

## 15. Video Demo

**Figma Component Name:** `VideoDemo`
**CSS Class:** `.video-demo`
**HTML Element:** `<div class="video-demo"><video poster="..." width="..." height="..." muted loop playsinline controls>...</video></div>`

### Design Intent
`.video-demo` is a GIF replacement for local UI/bug-demo recordings — a short, silent, looping clip embedded inline in a page. It's the sibling of `.video-embed` (see design-system.html Section 22): use `.video-embed` for third-party embeds like YouTube, use `.video-demo` for self-hosted clips in `assets/videos/`. Unlike `.video-embed`'s fixed 16:9 wrapper, there's no forced aspect-ratio, since UI/bug demo recordings vary in shape (square, portrait mobile capture, full-desktop landscape).

### When to Use
Anywhere a GIF would otherwise be used to show a UI interaction or reproduce a bug — entry pages, bug reports, changelogs.

### When NOT to Use
Third-party video (YouTube, Vimeo, etc.) — use `.video-embed` instead.

### Component Tokens

```css
--video-demo-radius:        var(--border-radius-md);
--video-demo-margin-bottom: var(--space-6);
```

### Anatomy

```html
<div class="video-demo">
    <video poster="/assets/videos/example-demo-poster.jpg" width="1024" height="640" muted loop playsinline controls>
        <source src="/assets/videos/example-demo.webm" type="video/webm">
        <source src="/assets/videos/example-demo.mp4" type="video/mp4">
    </video>
</div>
```

- Wrapper: `<div class="video-demo">` — no styling role beyond bottom margin; the `<video>` itself carries size and radius.
- `poster` — required on every instance. Prevents a blank flash before decode, and is the static state shown under reduced motion.
- `width`/`height` — the video's real intrinsic dimensions, same CLS-prevention role as `<img>` (DESIGN-SYSTEM.md §11.7).
- `muted loop playsinline` — required for autoplay to be permitted by the browser and to loop GIF-style.
- `controls` — native controls only; no custom play/pause UI.
- Two `<source>` elements — `webm` first (smaller), `mp4` fallback.

### States

| State | Behaviour |
|---|---|
| `prefers-reduced-motion: reduce` not set | `autoplay` is added by `script.js` on page load; video loops silently, GIF-equivalent |
| `prefers-reduced-motion: reduce` set | No `autoplay` added; video shows its `poster` with native controls, requiring an explicit user action to play |

### Accessibility
Respects `prefers-reduced-motion` (see Interaction Spec) — this is the implementation of that site-wide commitment (see md/REFERENCE.md) for looping demo content specifically, since the CSS-only reduced-motion block (DESIGN-SYSTEM.md §8.3) doesn't reach `<video>` autoplay. Native `controls` give keyboard and screen-reader users a standard, accessible play/pause/seek interface — no custom control UI to reimplement.

### Interaction Spec

On page load, `script.js` runs:
```javascript
autoplayUnlessReducedMotion('.video-demo video');
```
which checks `matchMedia('(prefers-reduced-motion: reduce)')` and only sets `autoplay` (and calls `.play()`) when it's not set. Written to take a selector so it's reusable for any future autoplay-capable media, not a one-off inline check.

### Responsive Behaviour
No breakpoint-specific overrides — `max-width: 100%` plus the video's own `width`/`height` attributes already scale it fluidly within its column at every breakpoint.

---

## 16. Inline Link

**CSS Class:** `.link-inline`
**HTML Element:** `<a href="{url}" class="link-inline">{Label}<svg class="link-inline-icon">...</svg></a>`

Not yet named in Figma — built directly in code 2026-09-02, no Figma component reference exists yet.

### Design Intent
For links embedded mid-sentence in running body copy — the hero subtitle, entry body text. Underlined at rest, not just on hover, so the link reads as a link independent of colour alone. Sibling of `## 17. CTA Link`: this variant is for links inside a run of surrounding text; use the CTA Link variant for a standalone link that doesn't sit inline in a sentence.

### When to Use
- Inline text links inside a sentence or paragraph of body copy

### When NOT to Use
- Standalone links not embedded in a run of surrounding text — use `.link-cta` (`## 17`) instead
- The Card block-link overlay — see `.card-block-link` under `## 3. Card`

### Component Tokens
No component-scoped tokens — reuses semantic tokens directly:
```css
color:  var(--color-link);          /* rest */
color:  var(--color-link-hover);    /* hover */
```
Icon size: `var(--icon-size-sm)` (`.link-inline-icon`).

### Anatomy
```
[ Label text ][ trailing icon ]
```
- Container: `<a class="link-inline">`
- Icon: `<svg class="link-inline-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path ... fill="currentColor"/></svg>` — trailing, last child inside the anchor
- `font-style: normal` is set explicitly on `.link-inline` — a deliberate reset so the link never inherits italics from an italic context (e.g. inside a `<cite>` or `<em>`), per the "no italics" requirement
- No separate `aria-label` — the visible label text is the accessible name

### States

| State | Colour | Text Decoration |
|---|---|---|
| Default | `--color-link` | underline |
| Hover | `--color-link-hover` | underline |
| Focus | `--color-link` | underline + sitewide `:focus-visible` ring (2px solid white, 3px offset) — `.link-inline` defines no focus override of its own |

### Accessibility

- No touch-target padding — WCAG 2.5.5 (Target Size) exempts inline links within a running block of text from the 44px minimum, since `.link-inline` is never meant to appear as a standalone target the way `.link-cta` is
- Icon: `aria-hidden="true" focusable="false"` — decorative; the label text alone carries the accessible name
- Focus ring: inherited from the sitewide `:focus-visible` rule (`style.css`, "FOCUS STYLES") — no component-level override

### Responsive Behaviour
Same at all breakpoints — no responsive overrides defined.

### Status
Built in `style.css` and previewed in `design-system.html` Section 24, added 2026-09-02. **Not yet applied to any real page** — a visual reference only, pending a follow-up task to apply it to existing inline links (e.g. the Home hero subtitle's "Christopher Klein" link). Flagged for review in that same section: the icon at `var(--icon-size-sm)` (14px) may read large against 16px body copy — `var(--icon-size-xs)` (12px) is the first fallback to try.

---

## 17. CTA Link

**CSS Class:** `.link-cta`
**HTML Element:** `<a href="{url}" class="link-cta" aria-label="{Title} — {action}">{action}<svg class="link-cta-icon">...</svg></a>`

Not yet named in Figma — built directly in code 2026-09-02, no Figma component reference exists yet.

### Design Intent
The real, visible, keyboard-focusable link on every Card component as of 2026-09-02 — replaces `.card-block-link` in that role (see `## 3. Card`; `.card-block-link` is now `aria-hidden="true" tabindex="-1"` on every card). An underlined text link, not a button — no border, background, or button chrome — but padded to meet the 44px touch target, since (unlike `## 16. Inline Link`) it stands alone rather than sitting inline in a run of surrounding text.

### When to Use
- The primary destination link on a Card (Feature or Thought variant)

### When NOT to Use
- Mid-sentence inline links — use `.link-inline` (`## 16`) instead
- Anywhere `.btn` / `.btn--ghost` button styling is called for — this is a text link, not a button, and carries no button chrome

### Component Tokens
No component-scoped tokens — reuses semantic tokens directly:
```css
color:   var(--color-link);          /* rest */
color:   var(--color-link-hover);    /* hover */
padding: var(--space-3) var(--space-2);
margin:  calc(var(--space-3) * -1) calc(var(--space-2) * -1);
```
Icon size: `var(--icon-size-md)` (`.link-cta-icon`).

### Anatomy
```
[ Label text ][ trailing icon ]
```
- Container: `<a class="link-cta" aria-label="{Title} — {action}">`
- Label text: `"View this work"` (Work entries) or `"View this thought"` (Thoughts entries) — driven by `entry.type` in `buildCard()` (`script.js`), not hardcoded per card; `index.html`'s hand-written cards match this exactly per-card
- Icon: `<svg class="link-cta-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path ... fill="currentColor"/></svg>` — trailing, last child inside the anchor
- `aria-label`: full descriptive string, `"{Title} — {action}"` (e.g. `"Star Engine — View this work"`) — the visible "View this work" / "View this thought" text alone would be ambiguous out of context (several cards share the same visible label on one page), so the accessible name adds the title
- `font-style: normal` set explicitly, same reset rationale as `.link-inline`

### Touch-Target Padding
`padding: var(--space-3) var(--space-2)` (12px vertical, 8px horizontal) expands the link's clickable/tappable box to meet the 44px WCAG 2.5.5 minimum. This is offset by an equal, negated `margin: calc(var(--space-3) * -1) calc(var(--space-2) * -1)` so the added padding doesn't visually shift the link's position or widen the gap between it and the card excerpt above it — the padding grows the hit area only; the visible text stays exactly where it would sit with no padding at all.

### States

| State | Colour | Text Decoration |
|---|---|---|
| Default | `--color-link` | underline |
| Hover | `--color-link-hover` | underline |
| Focus | `--color-link` | underline + sitewide `:focus-visible` ring (2px solid white, 3px offset) — `.link-cta` defines no focus override of its own |

### Accessibility

- Sole keyboard-focusable link on the card as of 2026-09-02 — Tab moves directly from whatever precedes the card to `.link-cta`, skipping `.card-block-link` entirely. Confirmed via a real Tab-key walkthrough and a real accessibility-tree snapshot (not just markup review) on both `index.html`'s hand-written cards and `buildCard()`'s Archive cards.
- `aria-label` carries the full descriptive string so the link is unambiguous read out of context (e.g. in a screen reader's links list, where several cards' plain "View this work" text would otherwise collide)
- Icon: `aria-hidden="true" focusable="false"` — decorative
- Focus ring: inherited from the sitewide `:focus-visible` rule — no component-level override
- `.card-content .link-cta { position: relative; z-index: 2; }` keeps it above `.card-block-link` (`z-index: 1`) so it remains the real target for both mouse and keyboard, even though the block-link still visually covers the full card for mouse-anywhere convenience

### Responsive Behaviour
Same at all breakpoints — no responsive overrides defined.

### Status
Built and live on every card as of 2026-09-02: `index.html`'s Feature and Thought cards, `buildCard()` in `script.js` (drives every Archive card — all 5 live entries), and previewed in `design-system.html` Sections 14 and 25.

---

## Component Token Reference

Quick reference mapping every component token to its semantic source.

Updated 2026-09-24 (reading comfort token update, Parts A–D) to current hex values.

| Component Token | Semantic Token | Raw Value |
|---|---|---|
| `--btn-bg` | `--color-background-subtle` | `#2F2F2F` |
| `--btn-bg-hover` | `--color-background-hover` (added 2026-09-24 — previously aliased `--color-border-strong` directly, which failed AA text contrast on hover; see md/DESIGN-SYSTEM.md §1.9) | `#3D3D3D` |
| `--btn-bg-active` | `--color-border-default` (a border token reused as a fill — audited 2026-09-24 and left as-is: `--color-text-primary` on it is ~8.9:1, already well above AA) | `#3D3D3D` |
| `--btn-border` | `--color-border-strong` | `#707070` |
| `--btn-border-hover` | `--color-interactive-hover` (teal as of 2026-09-24 — `.btn--danger-hover:hover` overrides this to `--color-danger` instead, so the Clear controls' hover border matches their red fill rather than rendering teal) | `#00BAA5` |
| `--btn-text` | `--color-text-primary` | `#E8E8E8` |
| `--btn-text-hover` | `--color-interactive-default` | `#E8E8E8` |
| `--btn-text-disabled` | `--color-text-disabled` | `#666666` |
| `--card-bg` | `--color-background-surface` | `#242424` |
| `--card-border` | `--color-border-default` | `#3D3D3D` |
| `--card-radius` | `--border-radius-md` | `8px` |
| `--card-image-bg` | `--color-background-subtle` | `#2F2F2F` |
| `--card-image-column-width` | — (global `:root` token, see md/DESIGN-SYSTEM.md §4.5) | `42%` |
| `--card-block-link-z` | — | `1` |
| `--card-cta-z` | — | `2` |
| `--image-viewer-controls-z` | — (local to `.image-viewer`) | `1` |
| `--tag-border` | `--color-accent-primary` | `#00BAA5` |
| `--tag-border-hover` | `--color-accent-primary-text` | `#00E5CB` |
| `--tag-text` | `--color-accent-primary` | `#00BAA5` |
| `--tag-text-hover` | `--color-accent-primary-text` | `#00E5CB` |
| `--tag-bg` | `transparent` | `transparent` |
| `--tag-bg-hover` | `--color-background-base` | `#1C1C1C` |
| `--nav-bg` | `--color-background-base` | `#1C1C1C` |
| `--nav-link-color` | `--color-text-secondary` | `#AEAEAE` |
| `--nav-link-active` | `--color-text-primary` | `#E8E8E8` |
| `--tab-bar-bg` | `--color-background-surface` | `#242424` |
| `--tab-bar-item-color` | `--color-text-secondary` | `#AEAEAE` |
| `--tab-bar-item-active` | `--color-interactive-default` | `#E8E8E8` |
| `--tooltip-bg` | `--color-tooltip-bg` → `--color-background-surface` | `#242424` |
| `--tooltip-border` | `--color-tooltip-border` → `--color-accent-primary` | `#00BAA5` |
| `--toast-border` | `--color-accent-primary` | `#00BAA5` |
| `--blockquote-border-color` | `--color-quote-border` → `--color-accent-quote` | `#A9407C` |
| `--code-border-color` | `--color-code-border` → `--color-accent-primary` | `#00BAA5` |
| `--divider-color` | `--color-divider-accent` → `--color-accent-primary` | `#00BAA5` |

`--tag-border`/`--tag-border-hover`/`--tag-bg-hover` are documented here (and in DESIGN-SYSTEM.md §1.8) as named component tokens, but neither actually exists as a CSS custom property in style.css — `.tag`/`.tag-chip` reference the semantic tokens directly. Pre-existing drift, not caused by this update and not resolved here (see the 2026-09-24 audit's Flags).

---

## Next Claude Code Fix List

Tracked fixes and enhancements queued for future Claude Code sessions.

| # | Item | Status |
|---|---|---|
| 6 | Remove Tabler Icons CDN from all pages site-wide, remove all icon elements everywhere (not scoped to just the tab bar and Back to Top button), text-only tab bar and back to top button, update any CSS that sizes or positions icons | ✅ Done 2026-07-05 |
