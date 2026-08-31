# Personal Website — Project Reference Document
**Version:** 1.3.0
**Last Updated:** 2026-08-25
**Status:** In Progress — Home page ready to build

---

## 1. Project Overview

A personal website built with plain HTML, CSS, and JavaScript. The goal is full ownership with no recurring subscriptions, no platform dependency, and no vendor lock-in. Replacing an existing Squarespace account.

### Core Principles
- No frameworks, no build tools, no subscriptions
- Accessible by default — WCAG AA minimum on every decision
- Localization-ready from the start
- Performant — static files only
- Scope-disciplined — ship simple, iterate later

---

## 2. Stack

| Layer | Tool | Notes |
|---|---|---|
| Design | Figma | HTML to Design extension for importing design-system.html; Figma Variables set up manually |
| Code Editor | VS Code | With Live Server extension for local preview |
| Languages | HTML, CSS, JavaScript | Plain — no frameworks or preprocessors |
| Version Control | GitHub | Public repository |
| Hosting | Netlify | Free tier, automatic deploys on push |
| Fonts | Noto Sans | Via Google Fonts — chosen for universal script/localization coverage |
| Icons | None | Tabler Icons CDN removed site-wide 2026-07-05 (commit 7d71326) — text-only. See §5 Icons. |

### Tokens Studio Note
Tokens Studio free tier does not reliably resolve aliases between token sets. Figma Variables are set up manually in a single `global` collection instead. The `tokens/design-system.json` file is kept as a reference and backup but is not actively synced via Tokens Studio.

### Hosting URLs
| Branch | Environment | URL |
|---|---|---|
| `main` | Production (live site) | Assigned by Netlify on setup |
| `dev` | Development preview | Assigned by Netlify on setup |

---

## 3. Branching Strategy

```
dev → main
```

- All work happens on `dev`
- `main` is only touched when changes are ready to go live
- Netlify deploys both branches automatically to separate URLs
- Pull request from `dev` → `main` generates a Netlify deploy preview for final review before merge
- `staging` branch was created and removed — not needed for a solo project

---

## 4. File Structure

```
my-website/
├── index.html          — Home page
├── archive.html        — Unified Work + Thoughts index — client-side fetch/filter/sort of data/archive-entries.json
├── about.html           — About page (also handles contact)
├── design-system.html  — Design system reference page (dev reference only)
├── nav.html            — Navigation component (partial)
├── footer.html         — Footer component (partial)
├── style.css           — All styles and design tokens as CSS variables
├── script.js           — JS: component injection, mobile nav, aria-current, back-to-top, Archive filter/search/sort, Filter Drawer, ToC rail, tooltip escape
├── work/                — Individual Work entry pages (hand-authored static HTML, one file per entry)
├── thoughts/             — Individual Thoughts entry pages (hand-authored static HTML, one file per entry)
├── templates/
│   ├── work-entry-template.html
│   └── thought-entry-template.html
├── data/
│   └── archive-entries.json — Manifest driving archive.html's listing/filtering and any JS-built card; Home's Featured cards are hand-written and NOT synced to this file
├── assets/
│   ├── images/         — WebP/PNG images (see md/DESIGN-SYSTEM.md §11.3 for folder structure — flagged as currently out of sync with real paths, see §11 note there)
│   ├── icons/           — Favicons and any SVG icons beyond Tabler
│   └── docs/            — Downloadable documents (e.g. resume PDF)
├── tokens/
│   └── design-system.json — Design tokens in Tokens Studio format (reference only)
├── md/                  — Governance docs: REFERENCE.md (this document), DESIGN-SYSTEM.md, COMPONENTS.md, PROMPT-GUIDE.md, NEW-ENTRY-PROCESS.md
└── .gitignore          — Node template, covers OS files and .env
```

### Adding New Pages
Every new page needs:
1. `<a href="#main-content" class="skip-link">Skip to main content</a>` as first child of `<body>`
2. `<div id="nav-placeholder"></div>` after skip link
3. Page content wrapped in `<main id="main-content">`
4. `<div id="footer-placeholder"></div>` at the bottom of `<body>`
5. Mobile tab bar `<nav class="tab-bar">` before footer placeholder
6. `<script src="script.js"></script>` before closing `</body>`

Nav and footer inject automatically via `script.js`.

> **Note:** Pages must be served via a local server (Live Server, http-server) or hosted — not opened directly as `file://` URLs. The `fetch()` calls in `script.js` will fail due to browser CORS restrictions on the file protocol.

---

## 5. Design System

### Typeface
**Noto Sans** — chosen for universal script coverage and localization support.
- Loaded via Google Fonts at weights: 400, 500, 600, 700
- "No tofu" — renders all scripts without missing character boxes

### Icons
**None currently in use — text-only site-wide.** Tabler Icons was removed completely 2026-07-05 (commit 7d71326): CDN link dropped from every page, all icon elements removed, tab bar and Back to Top button rebuilt text-only. A future iteration may reintroduce Tabler Icons self-hosted (not via CDN) — see md/COMPONENTS.md's Mobile Tab Bar and Back to Top Button "Deferred" sections for the planned icon mapping. Until then:
- No icon library is loaded on any page
- Icon-only interactive elements must still have `aria-label` if icons are reintroduced

### Type Scale (Major Third — 1.25 ratio from 16px base)

| Token | Size | Usage |
|---|---|---|
| `--font-size-xs` | 0.75rem | Legal/fine print, tab bar labels |
| `--font-size-sm` | 0.875rem | Captions, labels, metadata, tags |
| `--font-size-base` | 1rem | Body text (browser default) |
| `--font-size-md` | 1.125rem | Large body, intro paragraphs |
| `--font-size-lg` | 1.25rem | H4 |
| `--font-size-xl` | 1.5rem | H3 |
| `--font-size-2xl` | 1.875rem | H2 |
| `--font-size-3xl` | 2.25rem | H1 mobile |
| `--font-size-4xl` | 3rem | H1 desktop |
| `--font-size-5xl` | 3.75rem | Display / hero headline desktop only |

### Font Weights

| Token | Value | Usage |
|---|---|---|
| `--font-weight-regular` | 400 | Body text |
| `--font-weight-medium` | 500 | Labels, captions, tags |
| `--font-weight-semibold` | 600 | H3, H4 |
| `--font-weight-bold` | 700 | H1, H2 |

### Line Heights

| Token | Value | Usage |
|---|---|---|
| `--line-height-tight` | 1.2 | Display, H1 |
| `--line-height-snug` | 1.3 | H2, H3 |
| `--line-height-normal` | 1.5 | H4, UI labels |
| `--line-height-relaxed` | 1.6 | Body text |
| `--line-height-loose` | 1.75 | Captions, small text |

### Colour System

**Palette:** Greyscale dark theme with two accent colours for tags, dividers, links, and interactive highlights.

#### Primitive Scale
| Token | Value |
|---|---|
| `grey-0` | #FFFFFF |
| `grey-50` | #F5F5F5 |
| `grey-100` | #E8E8E8 |
| `grey-200` | #CCCCCC |
| `grey-300` | #AAAAAA |
| `grey-400` | #888888 |
| `grey-500` | #666666 |
| `grey-600` | #444444 |
| `grey-700` | #2A2A2A |
| `grey-800` | #1A1A1A |
| `grey-900` | #111111 |
| `grey-1000` | #000000 |

#### Accent Primitives
Teal is the live default primary accent (confirmed against style.css's real `:root` block) — gold is a dormant `[data-theme="gold"]` override, not a co-equal option. See md/DESIGN-SYSTEM.md §1.6 for the full theme mechanism.

| Token | Value | Notes |
|---|---|---|
| `--color-accent-primary` | #00BAA5 | Primary tag fill, dividers, code border. Live default — teal. Contrast on base: ~7.7:1 ✅ |
| `--color-accent-primary-text` | #00E5CB | Teal text on dark, hyperlinks, tooltip border. Live default. Contrast on base: ~11.8:1 ✅ |
| `--color-accent-quote` | #A9407C | Secondary tag fill, quote block border. Contrast on base: ~4.6:1 ✅ |
| `--color-accent-quote-text` | #FF60BB | Pink text on dark, alt text contexts |

#### Semantic Tokens (as CSS variables in style.css)
| Token | Value | Contrast vs Base |
|---|---|---|
| `--color-background-base` | #111111 | — |
| `--color-background-surface` | #1A1A1A | — |
| `--color-background-subtle` | #2A2A2A | — |
| `--color-text-primary` | #F5F5F5 | ~15:1 ✅ |
| `--color-text-secondary` | #AAAAAA | ~7.5:1 ✅ |
| `--color-text-disabled` | #666666 | Not required |
| `--color-border-default` | #2A2A2A | — |
| `--color-border-strong` | #666666 | — |
| `--color-interactive-default` | #F5F5F5 | ~15:1 ✅ |
| `--color-interactive-hover` | #CCCCCC | — |
| `--color-interactive-focus` | #FFFFFF | ~19:1 ✅ |
| `--color-link` | var(--color-accent-primary-text) | Hyperlink default |
| `--color-link-hover` | var(--color-accent-primary) | Hyperlink hover |
| `--color-divider-accent` | var(--color-accent-primary) | hr and section dividers |
| `--color-quote-border` | var(--color-accent-quote) | Blockquote left border |
| `--color-code-bg` | var(--color-background-subtle) | Code and pre background |
| `--color-code-border` | var(--color-accent-primary) | Code left border |
| `--color-tooltip-bg` | var(--color-background-surface) | Tooltip background |
| `--color-tooltip-border` | var(--color-accent-primary) | Tooltip border |
| `--color-tooltip-text` | var(--color-text-primary) | Tooltip text |

All text pairings meet WCAG AA (4.5:1 minimum for normal text).

### Spacing Scale (Base-4)
`4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px, 128px`
CSS variables: `--space-1` through `--space-32`

### Grid

| Breakpoint | Frame | Columns | Gutter | Margin |
|---|---|---|---|---|
| Desktop | 1440px | 12 | 32px | 120px |
| Tablet | 768px | 8 | 24px | 40px |
| Mobile | 390px | 4 | 16px | 16px |

Max content width: `1200px` (`--max-content`)

### Image Standards
- **Format:** WebP primary, JPG fallback for photos, SVG for icons and illustrations
- **Aspect ratios:** 16:9 (320×180px), 3:2 (320×213px), 1:1 (320×320px), 3:1 banner (1200×400px)
- **Card thumbnails:** 16:9 ratio on Home page cards
- **Article header banners:** 3:1 ratio on individual post pages
- **Always use:** `loading="lazy"`, explicit `width` and `height`, `srcset` for responsive images
- **Alt text:** Descriptive on meaningful images, `alt=""` and `aria-hidden="true"` on decorative images
- **Performance targets:** Hero under 200kb, card thumbnails under 100kb, no single image over 500kb
- **Compression tool:** Squoosh (free, browser-based)
- **CSS rule required on all images:**
```css
img {
    max-width: 100%;
    height: auto;
    display: block;
}
```

### Accessibility Standards
- WCAG AA minimum on all decisions
- Focus ring: 2px solid white, 3px offset
- Touch targets: 44px minimum (48px comfortable)
- Line length: 45ch minimum, 65ch optimal, 80ch maximum
- `prefers-reduced-motion` respected — animations disabled when set; for looping video (`.video-demo`, see md/COMPONENTS.md §15) this is a JS-level check in script.js, since the CSS reduced-motion block doesn't reach `<video>` autoplay
- Semantic HTML required — no div soup
- `lang` attribute on every `<html>` tag
- Alt text required on every meaningful image

### Accessibility Utility Classes

#### `.sr-only` — Screen Reader Only
```css
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
```

#### `.skip-link` — Skip to Main Content
```css
.skip-link {
    position: absolute;
    top: -100%;
    left: 0;
}
.skip-link:focus {
    top: 0;
}
```
First child of `<body>` on every page. Links to `<main id="main-content">`.

### ARIA Standards
| Attribute | Usage | Status |
|---|---|---|
| `aria-label` | Explicit labels on elements where visible text isn't descriptive | Apply as needed |
| `aria-expanded` | Hamburger toggle state | ✅ Implemented in nav |
| `aria-hidden="true"` | Decorative images, icons | Apply to all decorative elements |
| `aria-current="page"` | Active nav link | Set dynamically in script.js after nav injection |
| `aria-live="polite"` | Dynamic content (search results, toast notifications) | Implement with search and share button |
| `role="tooltip"` | Tooltip elements | ✅ Confirmed for this build |
| `aria-describedby` | Links trigger element to tooltip | ✅ Confirmed for this build |
| Focus trapping | Overlays and modals | Deferred — implement with search overlay |

### Link and Button Label Standards
Short visible labels with `.sr-only` hidden context for screen readers.

| Context | Visible Label | Screen Reader Hears |
|---|---|---|
| Thoughts / Blog entries | Read | "Read [Article Title]" |
| Work / Project entries | View | "View [Project Title]" |
| Profile | Read More about Chris | Already descriptive |
| Section links | More Thoughts / More Work | Already descriptive |

### Localization Standards
- Noto Sans covers all scripts
- No all-caps in navigation (breaks some scripts)
- Text expansion allowance: 30–40% for German/French
- No fixed-width text containers
- RTL layout (Arabic/Hebrew) noted for future consideration
- Short labels ("Read", "View") chosen specifically for clean localization

---

## 6. Pages

### Layout Behaviour

**Desktop (≥1024px):**
- `<body>` uses flexbox column layout (`display: flex; flex-direction: column; min-height: 100vh`). `<main>` has `flex: 1` so it fills all available vertical space, pinning footer to the page bottom.
- Nav (`<header>`) is `position: sticky; top: 0; z-index: 100` — stays visible while scrolling.
- Footer visible, pushed to page bottom by main's `flex: 1`.
- Page scrolls normally (no fixed-height viewport scroll) — Option A scroll behaviour.
- Card rows can be full-width or two-column depending on the `.card-row--two` modifier.

**Tablet (768px–1023px):**
- Same flexbox body layout as desktop.
- Nav visible (sticky top), tab bar hidden.
- Footer visible.
- All `.card-row--two` collapse to single column.
- Page padding reduces to `var(--space-6)`.

**Mobile (below 768px):**
- `footer` hidden via `display: none`.
- Tab bar fixed to top. `main` has `padding-top: 80px` to prevent content overlap.
- `<header>` (nav) hidden.
- All card rows are single column.
- Page padding reduces to `var(--space-4)`.
- All card images use `aspect-ratio` not fixed height — ensures correct scaling at any width.

---

### Home (index.html)
**Purpose:** First impression. Page-grid layout — greeting, featured work, recent thoughts, recommendations, contact.
**Status:** Built — IxDF block link pattern, page-grid structure. No Profile sidebar/card — that was a Figma-era concept that never shipped (see md/COMPONENTS.md, "Home-page Profile Sidebar" removed 2026-08-23).
**Layout:** Single-column page-grid. Cards in full-width rows.
**Mobile:** Single column — same section order as desktop. Top-fixed tab bar navigation.
**Content counts:** 2 Featured Work cards (hand-written, not synced to the manifest), 1 Featured Thought card (hand-written), 2 recommendation quotes, contact section. Home's featured cards must be updated by hand if a featured entry is renamed or removed — see md/NEW-ENTRY-PROCESS.md.

### Archive (archive.html)
**Purpose:** Unified index of every Work and Thoughts entry — replaces the earlier separate `work.html` / `thoughts.html` page concept entirely.
**Status:** Built — client-side fetch of `data/archive-entries.json`, with search, sort, and the Filter Drawer (type + tag filtering, unified across all three breakpoints). Full behaviour spec: md/COMPONENTS.md "## 2c. Filter Drawer".
**Layout:** Sticky/condensing header with inline filter chips on desktop (floating rail trigger once scrolled), bottom-sheet/anchored-panel Filter Drawer on tablet/mobile and on desktop once condensed. Results grid below, single column of cards.
**Entry points:** `?type=work`, `?type=thoughts`, `?tag={slug}` query params pre-filter on load — used by nav links, tag links, and Home's "View more work" / "Read more thoughts" links.

### Standard Page Template (Work entries, Thoughts entries)
**Purpose:** Individual work or blog post pages.
**Status:** Built and shipped on all 5 live entries (`work/star-engine.html`, `work/this-website.html`, `thoughts/thrilling-beginnings.html`, `thoughts/physical-and-digital-media.html`, `thoughts/industrializing-the-industry.html`) plus both source templates in `templates/`. Redesigned 2026-08-17, revised 2026-08-19. Floating Table of Contents added 2026-08-23, mobile/tablet trigger+panel variant completed 2026-08-25 — now fully shipped on both surfaces: an always-visible scrollspy rail at ≥1440px, and a floating trigger + anchored panel below that (covers every real iPad width in both orientations, by design). Full anatomy, tokens, and states: md/COMPONENTS.md "## 14. Standard Page Template" — not duplicated here to avoid the two docs drifting out of sync again.
**Layout:** Single column, centred, max-width 65ch content.
**Creation process:** md/NEW-ENTRY-PROCESS.md.

### About (about.html)
**Purpose:** Detailed personal bio. Handles contact and feedback link.
**Status:** Built — hero, history/experience entries, recommendations, contact section.

---

## 7. Components

### Navigation (nav.html)
- **Desktop:** Sticky top header — logo/name left, links right
- **Mobile:** Top-fixed tab bar — replaces hamburger entirely
- Nav links: Home, Work, Thoughts, About
- `aria-current="page"` set dynamically via `script.js` after nav injection
- Injected via `script.js` fetch into `#nav-placeholder`

### Mobile Tab Bar
- Fixed to top of viewport
- Items: Home, Work, Thoughts, About
- Text-only (no icon library currently in use — see §5 Icons); a future iteration may add icons alongside the labels, never icon only
- Font size xs (12px) for labels
- Active state uses `--color-interactive-default`
- Min touch target 44px per item
- `main` gets `padding-top: 80px` on mobile to prevent content overlap
- Hidden on desktop via `display: none` outside mobile media query

### Footer (footer.html)
- **Desktop:** Visible — author credit, feedback link, site updated date
- **Mobile:** Hidden via `display: none`
- Contact and feedback link also lives on About page
- Injected via `script.js` fetch into `#footer-placeholder`

### Back to Top Button
- Appears after user scrolls 400px
- Smooth scrolls to top
- `aria-label="Back to top"`
- Respects `prefers-reduced-motion`
- Same centred, in-flow placement at every breakpoint — the tab bar is fixed to the top of the viewport on mobile, not the bottom, so no special clearance is needed

### Card Component
- Style: Image card with CSS background image
- Image: `background-image` CSS property — decorative, no alt needed
- Block link pattern: `::after` pseudo-element on `.card-link` covers full card
- CTA label: "Read about this piece of work" (Work), "Read this thought" (Thoughts)
- Tags: `.tag` links (see Tag Component below)
- Screen reader: heading link announces destination cleanly

### Tag Component
- `.tag` — transparent background, `--color-accent-primary` border and text
- Shape: rounded corners (border-radius lg)
- Font: sm, regular weight, wide letter spacing
- Tags are always interactive links — `<a href="/archive.html?tag={slug}" class="tag">`

### Tooltip Component
- **Desktop only** — hidden on touch devices via `@media (hover: none)`
- Trigger: hover and keyboard focus (`:focus-within`)
- Dismiss: `Escape` key via JavaScript
- `role="tooltip"` on tooltip element
- `aria-describedby` on trigger pointing to tooltip id
- Content: supplementary only — never required information
- Styles: `--color-tooltip-bg`, `--color-tooltip-border`, border-radius md, max-width 240px

### Share Button (Standard Pages)
- Action: Copy current page URL to clipboard using the Clipboard API
- Confirmation: Toast notification appears near button after copy
- Toast: small temporary message, fades out after ~2 seconds
- Toast uses `aria-live="polite"` so screen readers announce it
- Label: "Share" with icon

### Breadcrumb Navigation (Standard Pages)
- Pattern: Section > Month/Year Posted > Title of Piece
- Semantic: `<nav aria-label="Breadcrumb"><ol>` with `<li>` items
- Current page item gets `aria-current="page"`
- Separator: `>` character, `aria-hidden="true"`

### Blockquote
- Option A — left border stroke only
- 4px solid `--color-quote-border` (pink `#A9407C`)
- Background: `--color-background-surface`
- Border radius on right side only
- Body text italic, cite in secondary colour

### Code / Pre Blocks
- Background: `--color-code-bg`
- Left border: `--color-code-border` → `--color-accent-primary` (live default — teal `#00BAA5`; gold is a dormant `[data-theme="gold"]` override, see §5)
- Monospace font

### Dividers (hr)
- 1px solid `--color-divider-accent` → `--color-accent-primary` (live default — teal `#00BAA5`; gold is a dormant `[data-theme="gold"]` override, see §5)
- Used as section separators site-wide

### Profile Sidebar (Home page only)
- **Desktop:** Sticky — `position: sticky`, `top: 80px`
- **Mobile:** Appears at top of page (first in source order)
- Contains: illustration, caption, H2 greeting, skill tags, bio, LinkedIn button, Email button, Read More about Chris link

---

## 8. Planned Features (Deferred — Post Launch)

### Floating Table of Contents
- **Shipped** — both surfaces, on all Standard Page entries (Work and Thoughts both — broader than originally scoped to Thoughts only). Desktop (≥1440px): always-visible sidebar rail with scrollspy highlighting, shipped 2026-08-23. Below that (covers every real iPad width in both orientations, by design — not just phone): a floating trigger + anchored panel, completed 2026-08-25 after several rounds of real-device fixes. Scrollspy tracks scroll position directly (not `IntersectionObserver`) against each heading's own `scroll-margin-top`, shared by both surfaces. Full anatomy, tokens, and states: md/COMPONENTS.md "## 14. Standard Page Template".

### Advanced Tooltips
- Inspired by Baldur's Gate 3 — rich contextual cards with nested information
- Status: Logged — post launch

### Search Overlay
- Trigger: Search icon in nav
- Full-width overlay, results grouped by Tags then Posts
- Implementation: Fuse.js client-side fuzzy search
- Requires: `aria-live="polite"`, focus trapping
- Focus trapping: reuse `trapFocus()` utility in script.js (implemented for Filter Drawer)
- Status: Logged — build when Thoughts content exists

### Tag and Author Filtering
- **Shipped** — tag and type filtering live on `archive.html` via the Filter Drawer (unified Work + Thoughts index, not a separate "Thoughts index page" as originally planned). See md/COMPONENTS.md "## 2c. Filter Drawer". Author filtering was never built or scoped further — the site has one author.

### Draggable Floating Button / Context Menu
- Press and hold to drag, tap to expand context menu
- Implementation: JS pointer events
- Status: Logged — use case TBD

### Related Content Footer (Standard Pages)
- Footer section on each standard page showing related work or posts
- Keeps users browsing the site
- Status: Logged — post launch

### Vertical Action Rail
- A fixed vertical rail of floating action buttons, right-edge gutter, desktop
- **Filters trigger: shipped** — `.action-rail-group` / `.action-rail-trigger` live on `archive.html`, appears once the header condenses on scroll. See md/COMPONENTS.md "## 2c. Filter Drawer".
- Theme toggle: built (`.theme-toggle-rail`, `initThemeToggle()`) but dormant — call site commented out in script.js pending a permanent home in this rail; no toggle currently renders on any page
- Still logged/not built: additional actions (share, bookmark, react) and an accessibility-options slot
- Status: In progress — Filters trigger shipped; remaining slots (theme toggle activation, share/bookmark/react, accessibility options) still logged

---

## 9. Future Project Ideas

### Figma Token Management Tool
- Motivation: Tokens Studio free tier is painful
- Goal: Clean JSON import/export, bulk reset, reliable alias resolution, one-click Figma Variables sync
- Status: Idea logged

---

## 10. Explicitly Out of Scope

- No JavaScript frameworks (React, Vue, etc.)
- No CSS preprocessors (Sass, Less)
- No CMS or database
- No backend or server-side logic
- No analytics (can be added post-launch)
- No comments system on Thoughts/Blog
- No dark/light mode toggle — dark backgrounds are fixed across all themes; a gold/teal accent colour toggle exists via `data-theme` attribute on `<html>` and does not affect backgrounds or greyscale tokens
- No staging branch (removed — not needed for solo project)

---

## 11. Coding Standards

### HTML
- Semantic elements always (`<header>`, `<nav>`, `<main>`, `<footer>`, `<article>`, `<section>`)
- `lang="en"` on every `<html>` tag
- Alt text on every meaningful `<img>`
- Decorative images get `alt=""` and `aria-hidden="true"`
- Heading hierarchy must be logical — never skip levels
- One `<h1>` per page
- `.skip-link` as first child of `<body>` on every page
- `<main id="main-content">` on every page

### CSS
- All values reference CSS variables — no hardcoded colours or sizes
- Mobile styles in `@media (max-width: 768px)` blocks
- Touch device styles in `@media (hover: none)` blocks
- No inline styles
- Comments mark every section clearly
- `prefers-reduced-motion` block maintained at bottom of file
- `.sr-only` and `.skip-link` utility classes in style.css

### JavaScript
- Vanilla JS only — no libraries or frameworks
- Components injected via `fetch()` on `DOMContentLoaded`
- `initNav()` called only after nav markup is in the DOM
- `aria-current="page"` set on active nav link after injection
- Tooltip Escape key dismiss handled globally
- No inline JavaScript in HTML files — exception: a flash-prevention `<script>` in every page `<head>` reads `localStorage.getItem('theme')` and sets `data-theme` on `<html>` before CSS loads, preventing a visible accent colour flicker on load; external scripts run after HTML parsing and are too late to avoid it

### Git
- All work on `dev` branch
- Commit messages descriptive and lowercase
- Push to `dev`, review at Netlify dev URL, merge to `main` to go live
- Never commit `.env` files

---

## 12. Accessibility

Accessibility is a stated project pillar (see Core Principles, §1), not a post-launch checklist. This section tracks that commitment as ongoing work — implemented items are verified against the real site, not assumed from intent; planned items are named honestly as gaps rather than left undocumented.

### Currently Implemented

**Keyboard & Focus**
- Skip-to-content link, first child of `<body>` on every page
- Full Tab-order support across nav, cards, tags, buttons, and the Filter Drawer
- Visible focus outlines site-wide (`:focus-visible`, 2px solid white, 3px offset)
- Focus trap inside the open Filter Drawer (`trapFocus()`)
- Background content excluded from Tab order via `inert` while the drawer is open, and the drawer's own content excluded via `inert` while closed — both directions handled, not just one
- Escape closes the drawer, with focus returned to whichever trigger opened it
- The invisible full-card click overlay (`.card-block-link`) is correctly hidden from keyboard users (`aria-hidden="true"`, `tabindex="-1"`) — mouse convenience never creates a redundant or confusing tab stop

**Screen Reader & Semantic**
- Real NVDA testing conducted during development — not automated-only
- Meaningful `aria-label`s on state-changing controls (filter chips, Clear, Share, Back to Top, drawer triggers)
- `aria-expanded` / `aria-pressed` reflect live state, updated on every relevant interaction
- Heading and excerpt exposure verified against a real accessibility-tree snapshot, not assumed from markup alone
- Line-clamped card excerpts retain their full text in the DOM — the visual clamp never removes content from screen readers

**Visual & Contrast**
- Every colour pairing verified with real WCAG contrast math, not eyeballed (see md/DESIGN-SYSTEM.md §1.9)
- Tag/Chip states are differentiated by stroke width and font weight, not colour alone, per WCAG 1.4.1 (Default: thin border/regular weight; Active: medium border/bold weight; Dim: thin border/regular weight + muted text)
- The teal theme's contrast was verified before it went live as the default (not just the original gold theme)
- The background dot texture is kept low-opacity specifically so it never interferes with text contrast

**Motion**
- `prefers-reduced-motion` is respected for the Filter Drawer's open/close animation and all other transitions site-wide

**Typography**
- **Font-size tokens converted `px` → `rem`** (confirmed 2026-08-10, commit c2ea59f) — type now respects the user's browser/OS font-size preference, distinct from browser zoom, which already worked correctly before this. All `--font-size-*` tokens in style.css are rem-based; see md/DESIGN-SYSTEM.md §2.2 for the current values.

### Planned / Backlog

- **Tag link "visited" state:** tag links (`<a href="/archive.html?tag={slug}">`) currently announce as "visited" indefinitely in screen readers once clicked, which isn't meaningful here since they're filter controls, not content links. Needs an explicit `aria-label` override.
- **A real WAVE + Lighthouse accessibility baseline audit** — deliberately held until real content replaces the remaining placeholder text and images, so the audit measures the actual site rather than placeholder artifacts.
- **Accessibility options** as a planned future slot in the Vertical Action Rail (alongside language/translation) — not yet scoped in detail.

---

## 13. Designer to Engineer Handoff Standards

For reference when working with engineers or handing off to Claude Code:

**From Figma:**
- Dev Mode access for spacing, colour, font inspection
- Named components with documented variants and states
- Annotations for non-obvious behaviour — interactions, responsive rules, accessibility intent

**Supplementary Documentation (this REFERENCE.md covers):**
- Stack and hosting decisions
- Full design token documentation
- Component inventory with behaviour specs
- Accessibility requirements per component
- Coding standards and conventions
- Session handoff notes

**Acceptance Criteria per build:**
- No hardcoded colours or sizes — CSS variables only
- All images have explicit width and height
- One H1 per page, logical heading hierarchy
- aria-current set on active nav link
- Skip link present and functional
- Tab bar hidden desktop, visible mobile
- Footer hidden mobile
- All interactive elements keyboard operable
- Touch targets minimum 44px

---

## 14. Session Handoff Notes

**2026-06-24**
- Base HTML, CSS, and JS set up and live on Netlify
- Nav and footer extracted as components, injected via script.js
- Two branches active: `main` (production) and `dev` (development)
- Design system tokens established — Tokens Studio abandoned, Figma Variables set up manually
- preview.html generated by Claude Code as design system reference

**2026-06-28**
- Home page design complete — Draft 3 locked
- Navigation decision: sticky top desktop, bottom tab bar mobile
- Footer: visible desktop, hidden mobile
- Accessibility utilities confirmed: `.sr-only`, `.skip-link`, `aria-current`, `aria-hidden`
- Link label standard confirmed: short visible label + `.sr-only` hidden context
- Image standards established
- Card component pattern decided
- Deferred features logged

**2026-06-29**
- Home page design refined to Draft 4 — locked and ready to build
- Standard page template designed and locked — ready to build after Home
- Accent colour system confirmed: gold (#BA8200, #E5A000) and pink (#A9407C, #FF60BB)
- All semantic accent tokens defined and documented
- Divider: gold site-wide
- Blockquote: Option A left border, pink
- Code blocks: gold left border
- Tooltips: simple hover implementation, desktop only, confirmed for this build
- Share button: copy URL to clipboard with toast notification
- Breadcrumb navigation confirmed for standard pages
- Tabler Icons added to stack via CDN
- Claude Code prompt written for Home page build — ready to execute
- Next: Run Claude Code prompt, review build, commit to dev

2026-06-29 EOD

Home page initial build complete and committed to dev
Visual review pending — gaps between Figma design and implementation to be assessed tomorrow
Next: Full visual review, fix list, precision Claude Code fix prompt
Figma layer naming to be aligned with CSS class names before next build session
Figma MCP connection via Claude Code to be explored for tighter design-to-code fidelity

**2026-08-06**
- The five governance docs — REFERENCE.md, DESIGN-SYSTEM.md, COMPONENTS.md, PROMPT-GUIDE.md, NEW-ENTRY-PROCESS.md — moved from the project root into a new `md/` folder. README.md stays at the root.
- None of the five were ever fetched, linked, or referenced by any live page or script (confirmed by repo-wide grep before the move) — the move has no effect on the live site.
- All cross-references between these five files were updated in place to the `md/{filename}` form. Future sessions and prompts should reference them as `md/REFERENCE.md`, `md/DESIGN-SYSTEM.md`, `md/COMPONENTS.md`, `md/PROMPT-GUIDE.md`, `md/NEW-ENTRY-PROCESS.md` — not the old root-level paths.

**2026-08-17 to 2026-08-21 — summarized retroactively on 2026-08-23; see md/COMPONENTS.md for full detail on each, this is an index not a replacement**
- **8/17:** Standard Page Template redesign — Details card (label/value rows for Employer/Role/Timeline/Tools or Published/Updated) replaced the old author-row + `.standard-page-meta` header; footer rebuilt around Share + tag-driven "More Work"/"More Thoughts" + reused contact section, replacing the old non-functional Previous/Next `.standard-page-nav`. Breadcrumb simplified to 2 segments (Primary Tag › Title), dropping a redundant Month/Year segment. `work/star-engine.html`, `thoughts/thrilling-beginnings.html`, and both templates migrated first.
- **8/18:** In-body images and tables added to `.standard-page-content` (captioned via `<figure>`/`.standard-page-caption`, tables capped to 65ch with horizontal scroll). PROMPT-GUIDE.md Rule 3a added (reuse an existing component pattern over mapping a Figma/spec value to the nearest token) after a concrete Body-20 tag/text oversizing incident.
- **8/19:** Revision pass on the 8/17 redesign per visual review — author row removed outright (not just deferred), Details card text sizes walked back from Figma-derived Body-20 to the site's existing `.card-meta` scale, footer's Share/More-Work buttons fixed to equal width, banner max-width capped to the text column's own 65ch instead of the full 1200px page width, `.tag--details` modifier removed so Details-card tags match Archive-card tags exactly.
- **8/21:** Archive Filter Drawer redesign — the three-breakpoint filter UI unified onto one shared drawer pattern (previously more breakpoint-divergent); PROMPT-GUIDE.md Rule 5a added (assume a decision spans all three breakpoints unless a prompt names one specifically) after stale two-breakpoint wording nearly shipped that way.
- **By 8/21:** the remaining two entries (`work/this-website.html`, `thoughts/physical-and-digital-media.html`) and `thoughts/industrializing-the-industry.html` were also migrated to the 8/17-era Details/Footer structure — md/COMPONENTS.md's "Migration status" note had drifted out of sync claiming these three were still on the old structure; corrected 2026-08-23 after direct verification found zero real consumers of `.standard-page-meta` / `.standard-page-nav` anywhere in the repo.

**2026-08-23**
- Desktop-only floating Table of Contents rail shipped for Standard Page entries (Work and Thoughts both) — automatic heading-id generation (preserving any hand-authored id), always-visible scrollspy rail at ≥1024px, H3s nested under their parent H2. Mobile/tablet trigger + panel variant not built yet (separate follow-on). See `getTocHeadings()` / `initTocRail()` in script.js and the "STANDARD PAGE — TABLE OF CONTENTS RAIL" section of style.css.
- Documentation sync pass: REFERENCE.md (this document), DESIGN-SYSTEM.md, and COMPONENTS.md corrected against the real repo state after discovering several docs had been iterated on in claude.ai Project knowledge but never actually committed here. Dead CSS from the pre-8/17 Standard Page structure (`.standard-page-meta*`, `.standard-page-nav*`, `.card-meta-label`) removed from style.css — confirmed zero real consumers first. `.claude/settings.json` permission entries referencing the deleted `card-variants-preview.html` removed. Two referenced planning docs (`claude/2026-08-23-floating-toc-spec.md`, `2026-08-09-redesign-status.md`) do not exist anywhere in this repo — likely never committed from wherever they were drafted; flagged rather than reconstructed from assumption.
- DESIGN-SYSTEM.md §1.6 corrected — was still documenting gold as the primary accent after teal became the live default; now states teal as canonical, gold as the dormant `[data-theme="gold"]` override. §11.3/§11.4's documented asset path (`assets/images/work/{slug}/{slug}-banner.webp`) vs. the real path in use (`assets/images/entries/{slug}/{Slug}-banner.png`) was flagged, not resolved — needs a decision on which one changes.

**2026-08-25**
- Documentation-only audit follow-up pass across all three governance docs. Tabler Icons references corrected to "none currently in use, text-only" throughout REFERENCE.md (§2 Stack, §5 Icons, §7 Mobile Bottom Tab Bar, §11 Coding Standards) and DESIGN-SYSTEM.md §10 — confirmed complete removal was already site-wide (commit 7d71326, 2026-07-05), not scoped to only the tab bar and Back to Top button as COMPONENTS.md's own Fix List item 6 had understated. COMPONENTS.md's Mobile Tab Bar / Back to Top "Deferred" sections were already accurate and left untouched.
- Font-size rem conversion (commit c2ea59f, 2026-08-10) confirmed complete in style.css; moved out of this document's Planned/Backlog into a dated confirmation (§12). DESIGN-SYSTEM.md §2.2's Font Size Scale table was still documenting the pre-conversion px values — corrected to the real rem values.
- COMPONENTS.md's Component Token Reference table still showed 8 rows resolving to the dormant gold theme's hex (`#BA8200`/`#E5A000`) instead of the live teal default (`#00BAA5`/`#00E5CB`) — corrected; independently re-verified against style.css's `:root` block, not just the audit's claim. `--blockquote-border-color` (pink, `--color-accent-quote`) confirmed genuinely unaffected by the theme and left as-is.
- COMPONENTS.md's Toast Notification and Share Button anatomy blocks still showed `<i class="ti ti-check">` / `<i class="ti ti-share">` examples from before the Tabler removal — replaced with the real current markup (bare text `.toast` div; `.share-btn.btn.btn--ghost` with no icon). Share Button's own dead `--share-btn-icon-size` token (no icon left to size) removed as a direct consequence.
- `.standard-page-banner`'s real `max-width` confirmed definitively via direct style.css read: `none` (only `width: 100%` is set) — genuinely full-width, not capped to the 65ch text column. This resolves an open discrepancy flagged across multiple prior sessions: the 8/19 revision's intent to cap the banner was evidently reverted later the same day and never reflected in COMPONENTS.md §14, which still described the 65ch cap in both its Anatomy diagram and Responsive Behaviour table. Both corrected to describe the real full-width behavior.
- Not touched, flagged instead: REFERENCE.md §5's own Colour System (Accent Primitives table) still resolves `--color-accent-primary` to gold `#BA8200` — the same staleness already corrected in DESIGN-SYSTEM.md §1.6 on 2026-08-23 was never carried over to this document. Out of today's scope (not part of the audit's change list); needs its own pass. COMPONENTS.md's general Button component section (`.btn--icon` variant row, its Anatomy's `<i class="ti ti-{name}">` line) still names Tabler specifically for a variant that was never built in CSS — corrected as a direct, minimal extension of the Tabler cleanup already in scope, since leaving it would contradict this session's own "no icon library in use" corrections elsewhere. COMPONENTS.md §14's ToC rail/trigger/panel documentation (and this document's own §6/§8 ToC status lines, now stale after the mobile/tablet panel, 1440px breakpoint, scroll-lock removal, and Back to Top shipped since 8/23) deliberately left untouched — explicitly deferred to its own dedicated documentation session.
- REFERENCE.md §5's own Colour System (Accent Primitives table) — the discrepancy flagged just above — corrected in a follow-up pass: `--color-accent-primary` / `--color-accent-primary-text` now show the live teal values (`#00BAA5` / `#00E5CB`) with their real contrast figures (~7.7:1 / ~11.8:1), matching DESIGN-SYSTEM.md §1.6's already-established wording exactly, with a one-line note that gold is the dormant `[data-theme="gold"]` override.
- REFERENCE.md §7's Code/Pre Blocks and Dividers entries corrected from "gold" to the same teal live-default / dormant-gold-override framing, closing the last gold-as-current reference anywhere in this document.
- **ToC mobile/tablet variant completed and documented.** Read `initTocRail()` and every related function in script.js fresh, start to finish, confirming (not assuming from any prior summary) the real current state: both surfaces — the desktop rail (≥1440px) and the mobile/tablet floating trigger + anchored panel (below that, covering every real iPad width in both orientations) — are fully shipped, share one heading list and one scrollspy pass, and both include a non-counted, never-active "Back to Top" row (`buildBackToTopRow()`) alongside the existing `.back-to-top` button at the page bottom. Confirmed `lockBodyScroll()`/`unlockBodyScroll()` are defined but never called anywhere in `initTocRail()`'s closure (verified via direct grep of call sites, not just definitions) — scroll-lock was added for the panel, traced as the root cause of several real-device bugs (badge/scrollspy corruption, Back to Top disappearing, a WebKit content-blanking issue), and fully removed; the panel now relies on the scrim + `inert` combination alone, which proved sufficient on its own. The panel's own internal bottom-anchor tiering (50vh above ≤1439px, 30vh below ≤767px) is a separate, narrower tier nested inside the outer rail-vs-panel boundary — confirmed the two did not move together when the outer boundary shifted from 1024px to 1440px. Full real anatomy, tokens, and behavior for both surfaces now documented in COMPONENTS.md "## 14. Standard Page Template" (two new subsections) — REFERENCE.md §6 and §8 updated to match.

---

## 15. Unused Assets / Dormant Code

Per explicit instruction: nothing gets deleted without Chris's approval. Items below became unreferenced as a result of the 2026-08-30 card-icon-removal/layout-unification session (or earlier sessions) but are left in place — logged here instead of removed.

**Icon assets (`assets/icons/`)** — all still on disk, `fill="white"` source files, none currently inlined anywhere:
- `cards/work.svg` (briefcase) — was the Work Entry card type icon, removed 2026-08-30
- `cards/thoughts.svg` (chat bubble) — was the Thought Entry card type icon, removed 2026-08-30
- `cards/open-link.svg` — was the card title-row open-link icon, removed 2026-08-30
- `cards/message.svg` — was the original Thought Entry left-column icon (superseded by `thoughts.svg` in an earlier pass, already unused before 2026-08-30)

**CSS classes (`style.css`)** — rules remain defined but no HTML/JS currently references them:
- `.card-title-row`, `.card-title-group`, `.card-type-icon`, `.card-link-icon` — built for the now-removed card icon row
- `--card-image-column-width` (`:root`, 42%) — fed only the commented-out Feature-card horizontal layout below
- `.home-hero-icon--left`, `.home-hero-icon--right` — built for the mobile-hero-jitter-fix session's icon-overlaps-image treatment (position: absolute + translate offset). Superseded when the hero icons moved back to sitting beside the image inside `.contact-icon-btn` containers instead of overlapping it.

**Commented-out CSS (not deleted)** — `style.css`, "FEATURE CARD — horizontal layout" section: the `@media (min-width: 768px) { .card--feature {...} }` block that gave Work cards an image-left row layout at tablet/desktop. Work cards now use one vertical-stack layout at every breakpoint; the block is left in the file as a comment rather than removed.
