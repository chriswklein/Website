# Personal Website — Project Reference Document
**Version:** 1.2.0
**Last Updated:** 2026-06-28
**Status:** In Progress

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
| Design | Figma | HTML to Design extension for importing preview.html; Figma Variables set up manually |
| Code Editor | VS Code | With Live Server extension for local preview |
| Languages | HTML, CSS, JavaScript | Plain — no frameworks or preprocessors |
| Version Control | GitHub | Public repository |
| Hosting | Netlify | Free tier, automatic deploys on push |
| Fonts | Noto Sans | Via Google Fonts — chosen for universal script/localization coverage |

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
├── work.html           — Work / Portfolio page
├── thoughts.html       — Thoughts / Blog page
├── about.html          — About page (also handles contact)
├── preview.html        — Design system preview page (dev reference only)
├── nav.html            — Navigation component (partial)
├── footer.html         — Footer component (partial)
├── style.css           — All styles and design tokens as CSS variables
├── script.js           — JS: component injection, mobile nav, aria-current, back-to-top
├── tokens/
│   └── design-system.json — Design tokens in Tokens Studio format (reference only)
├── REFERENCE.md        — This document
└── .gitignore          — Node template, covers OS files and .env
```

### Adding New Pages
Every new page only needs four things:
1. `<a href="#main-content" class="skip-link">Skip to main content</a>` as first child of `<body>`
2. `<div id="nav-placeholder"></div>` after skip link
3. Page content wrapped in `<main id="main-content">`
4. `<div id="footer-placeholder"></div>` at the bottom of `<body>`
5. `<script src="script.js"></script>` before closing `</body>`

Nav and footer inject automatically via `script.js`.

> **Note:** Pages must be served via a local server (Live Server, http-server) or hosted — not opened directly as `file://` URLs. The `fetch()` calls in `script.js` will fail due to browser CORS restrictions on the file protocol.

---

## 5. Design System

### Typeface
**Noto Sans** — chosen for universal script coverage and localization support.
- Loaded via Google Fonts at weights: 400, 500, 600, 700
- "No tofu" — renders all scripts without missing character boxes

### Type Scale (Major Third — 1.25 ratio from 16px base)

| Token | Size | Usage |
|---|---|---|
| `--font-size-xs` | 12px | Legal/fine print only |
| `--font-size-sm` | 14px | Captions, labels, metadata, nav tab labels |
| `--font-size-base` | 16px | Body text (browser default) |
| `--font-size-md` | 18px | Large body, intro paragraphs |
| `--font-size-lg` | 20px | H4 |
| `--font-size-xl` | 24px | H3 |
| `--font-size-2xl` | 30px | H2 |
| `--font-size-3xl` | 36px | H1 mobile |
| `--font-size-4xl` | 48px | H1 desktop |

### Font Weights

| Token | Value | Usage |
|---|---|---|
| `--font-weight-regular` | 400 | Body text |
| `--font-weight-medium` | 500 | Labels, captions |
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

**Palette:** Black, white, and greyscale only. Dark background, light text.

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
- **Card thumbnails:** 3:2 ratio on index/listing pages
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
- `prefers-reduced-motion` respected — animations disabled when set
- Semantic HTML required — no div soup
- `lang` attribute on every `<html>` tag
- Alt text required on every meaningful image

### Accessibility Utility Classes

#### `.sr-only` — Screen Reader Only
Hides text visually, keeps it announced by screen readers. Use on short button/link labels.
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
Visually hidden link at top of every page. Appears on keyboard focus. Allows keyboard users to bypass navigation.
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
Usage in HTML — first child of `<body>`:
```html
<a href="#main-content" class="skip-link">Skip to main content</a>
```

### ARIA Standards
| Attribute | Usage | Status |
|---|---|---|
| `aria-label` | Explicit labels on elements where visible text isn't descriptive enough | Apply as needed |
| `aria-expanded` | Hamburger toggle state | ✅ Implemented in nav |
| `aria-hidden="true"` | Decorative images, icons | Apply to all decorative elements |
| `aria-current="page"` | Active nav link | Set dynamically in script.js after nav injection |
| `aria-live="polite"` | Dynamic content (search results) | Deferred — implement with search feature |
| Focus trapping | Overlays and modals | Deferred — implement with search overlay |

### Link and Button Label Standards
Short visible labels with `.sr-only` hidden context for screen readers.

| Context | Visible Label | Screen Reader Hears |
|---|---|---|
| Thoughts / Blog entries | Read | "Read [Article Title]" |
| Work / Project entries | View | "View [Project Title]" |
| Profile | More about me | "More about me" |
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

### Home (index.html)
**Purpose:** First impression. Dashboard layout — profile, featured work, recent thoughts.
**Status:** Design complete (Draft 3) — ready to build
**Layout:** Three column desktop (Profile sidebar left, Hero + Featured Work centre, Thoughts right)
**Mobile:** Single column — Hero, Featured Work, Thoughts, Profile
**Content counts:** 3 Featured Work cards, 3 Thoughts entries (most recent)

### Work (work.html)
**Purpose:** Portfolio or professional work showcase.
**Status:** Scaffolded — design pending
**Layout:** Standard page template — TBD Monday

### Thoughts (thoughts.html)
**Purpose:** Blog / writing index. Links to individual post pages.
**Status:** Scaffolded — design pending
**Layout:** Standard page template — TBD Monday

### About (about.html)
**Purpose:** Detailed personal bio. Handles contact. Feedback link lives here (not footer).
**Status:** Scaffolded — design pending
**Layout:** Standard page template — TBD Monday

---

## 7. Components

### Navigation (nav.html)
- **Desktop:** Sticky top header — logo/name left, links right
- **Mobile:** Bottom tab bar — replaces hamburger menu entirely
- Mobile tab bar items: Home, Work, Thoughts, About (icon + text label)
- Icon + text label required — never icon only (accessibility and localization)
- `aria-expanded` toggled for screen reader support (desktop)
- `aria-current="page"` set dynamically via `script.js` after nav injection
- Injected via `script.js` fetch into `#nav-placeholder`
- Tab bar label font size: `--font-size-xs` (12px) — allows for text expansion

### Footer (footer.html)
- **Desktop:** Visible — author credit, feedback link, site updated date
- **Mobile:** Hidden via `display: none` — not contextually relevant on mobile
- Contact and feedback link also lives on About page
- Injected via `script.js` fetch into `#footer-placeholder`

### Back to Top Button
- **Status:** Planned — include in Home page build
- Appears after user scrolls past a threshold
- Smooth scrolls to top
- Accessible — keyboard operable, labelled for screen readers
- Respects `prefers-reduced-motion`
- Position: above bottom tab bar on mobile (account for tab bar height in positioning)

### Card Component
- **Status:** Design decided — not yet built
- Style: Editorial image card
- Image: CSS background image (decorative, no alt text needed)
- Link pattern: Block link via `::after` pseudo-element on heading `<a>` tag
- Full card is clickable — heading link expands to cover card area
- Screen reader output: "Article → Heading link" — clean, not repetitive
- Tag label: `aria-hidden="true"` if decorative, `aria-label="Category: X"` if meaningful
- CTA label pattern: Short visible label + `.sr-only` hidden context

### Profile Sidebar
- **Status:** Included in Home page build
- Contains: illustration image, greeting H2, skill tags, bio blurb, LinkedIn button, Email button, More about me link
- **Desktop:** Sticky — stays visible while user scrolls through work cards
- **Mobile:** Appears at bottom of page below Thoughts section

---

## 8. Planned Features (Deferred — Post Launch)

### Floating Table of Contents
- Target pages: Thoughts individual post pages, potentially About
- Behaviour: Sidebar on desktop, floating collapsed button on mobile
- Auto-tracks scroll position using `IntersectionObserver` API
- Mobile: collapses to compact button, expands to drawer on tap
- Implementation: vanilla JS + CSS `position: sticky` + `IntersectionObserver`
- Status: Logged — build after Thoughts page content exists

### Search Overlay
- Trigger: Search icon in nav opens full-width overlay
- Input: Single text field — "Search posts, tags, and authors"
- Results grouped: Tags first (prefixed with #), Posts second
- Matched query term bolded within results
- Dismiss: Cancel button or Escape key
- Background: Page content blurs behind overlay
- Implementation: Fuse.js for client-side fuzzy search on static JSON index
- Requires: `aria-live="polite"` for dynamic results announcement
- Requires: Focus trapping while overlay is open
- Status: Logged — build when Thoughts page content exists

### Tag and Author Filtering
- Lives on Thoughts index page
- Filter by: Tag, Author
- Status: Logged — design TBD

### Draggable Floating Button / Context Menu
- Press and hold to drag, release to place
- Tap triggers context menu expansion (Reddit mobile pattern)
- Implementation: JS `pointerdown`, `pointermove`, `pointerup` events for drag
- Status: Logged — use case TBD

### Card Tag Colours
- Tags currently use placeholder colours (gold, pink) from previous project
- Decision needed: greyscale tags or intentional colour system for tags
- Status: Deferred — decide before Thoughts page build

### "More Work" / "More Thoughts" Link Treatment
- Current arrow line treatment needs refinement
- Status: Deferred — refine during page build

---

## 9. Future Project Ideas

### Figma Token Management Tool
- Motivation: Tokens Studio free tier is painful — no bulk delete, no reliable alias resolution across sets, core features paywalled
- Goal: Clean JSON import/export, bulk reset, reliable alias resolution, one-click Figma Variables sync
- Status: Idea logged — future standalone project

---

## 10. Explicitly Out of Scope

- No JavaScript frameworks (React, Vue, etc.)
- No CSS preprocessors (Sass, Less)
- No CMS or database
- No backend or server-side logic
- No analytics (can be added post-launch)
- No comments system on Thoughts/Blog
- No dark/light mode toggle (dark is default and only theme)
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
- No inline styles
- Comments mark every section clearly
- `prefers-reduced-motion` block maintained at bottom of file
- `.sr-only` and `.skip-link` utility classes maintained in style.css

### JavaScript
- Vanilla JS only — no libraries or frameworks
- Components injected via `fetch()` on `DOMContentLoaded`
- `initNav()` called only after nav markup is in the DOM
- `aria-current="page"` set on active nav link after injection
- No inline JavaScript in HTML files

### Git
- All work on `dev` branch
- Commit messages descriptive and lowercase: `"add back to top button"`
- Push to `dev`, review at Netlify dev URL, merge to `main` to go live
- Never commit `.env` files

---

## 12. Session Handoff Notes

**2026-06-24**
- Base HTML, CSS, and JS set up and live on Netlify
- Nav and footer extracted as components, injected via script.js
- Two branches active: `main` (production) and `dev` (development)
- Design system tokens established — Tokens Studio abandoned for free tier limitations, Figma Variables set up manually
- preview.html generated by Claude Code as design system reference

**2026-06-28**
- Home page design complete — Draft 3 locked and ready to build
- Navigation decision: sticky top on desktop, bottom tab bar on mobile
- Footer decision: visible on desktop, hidden on mobile
- Accessibility utilities confirmed: `.sr-only`, `.skip-link`, `aria-current`, `aria-hidden`
- Link label standard confirmed: short visible label + `.sr-only` hidden context
- Image standards established and documented
- Card component pattern decided: CSS background image + block link via `::after`
- Deferred features logged: floating TOC, search overlay, tag filtering, draggable button
- Next session (Monday): Design standard page template for Work, Thoughts, About — then build Home page with Claude Code
- End of week goal: Home page implemented and live on `dev`
