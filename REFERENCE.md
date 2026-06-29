# Personal Website — Project Reference Document
**Version:** 1.3.0
**Last Updated:** 2026-06-29
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
| Design | Figma | HTML to Design extension for importing preview.html; Figma Variables set up manually |
| Code Editor | VS Code | With Live Server extension for local preview |
| Languages | HTML, CSS, JavaScript | Plain — no frameworks or preprocessors |
| Version Control | GitHub | Public repository |
| Hosting | Netlify | Free tier, automatic deploys on push |
| Fonts | Noto Sans | Via Google Fonts — chosen for universal script/localization coverage |
| Icons | Tabler Icons | Via CDN webfont — outline style only, never filled variants |

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
├── script.js           — JS: component injection, mobile nav, aria-current, back-to-top, tooltip escape
├── assets/
│   ├── images/         — WebP images, srcset variants
│   └── icons/          — SVG icons if needed beyond Tabler
├── tokens/
│   └── design-system.json — Design tokens in Tokens Studio format (reference only)
├── REFERENCE.md        — This document
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
7. Tabler Icons CDN in `<head>`

Nav and footer inject automatically via `script.js`.

> **Note:** Pages must be served via a local server (Live Server, http-server) or hosted — not opened directly as `file://` URLs. The `fetch()` calls in `script.js` will fail due to browser CORS restrictions on the file protocol.

---

## 5. Design System

### Typeface
**Noto Sans** — chosen for universal script coverage and localization support.
- Loaded via Google Fonts at weights: 400, 500, 600, 700
- "No tofu" — renders all scripts without missing character boxes

### Icons
**Tabler Icons** — loaded via CDN webfont.
- Outline style only — never use `-filled` suffix variants
- Always include `aria-hidden="true"` on decorative icons
- Icon-only interactive elements must have `aria-label`
- CDN: `https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css`

### Type Scale (Major Third — 1.25 ratio from 16px base)

| Token | Size | Usage |
|---|---|---|
| `--font-size-xs` | 12px | Legal/fine print, tab bar labels |
| `--font-size-sm` | 14px | Captions, labels, metadata, tags |
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
| Token | Value | Notes |
|---|---|---|
| `--color-accent-gold` | #BA8200 | Primary tag fill, dividers, code border. Contrast on base: ~5.2:1 ✅ |
| `--color-accent-gold-text` | #E5A000 | Gold text on dark, hyperlinks, tooltip border. Contrast on base: ~8.9:1 ✅ |
| `--color-accent-pink` | #A9407C | Secondary tag fill, quote block border. Contrast on base: ~4.6:1 ✅ |
| `--color-accent-pink-text` | #FF60BB | Pink text on dark, alt text contexts |

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
| `--color-tag-primary` | var(--color-accent-gold) | Primary tag background |
| `--color-tag-secondary` | var(--color-accent-pink) | Secondary tag background |
| `--color-tag-text` | var(--color-text-primary) | Text on all tags |
| `--color-link` | var(--color-accent-gold-text) | Hyperlink default |
| `--color-link-hover` | var(--color-accent-gold) | Hyperlink hover |
| `--color-divider-accent` | var(--color-accent-gold) | hr and section dividers |
| `--color-quote-border` | var(--color-accent-pink) | Blockquote left border |
| `--color-code-bg` | var(--color-background-subtle) | Code and pre background |
| `--color-code-border` | var(--color-accent-gold) | Code left border |
| `--color-tooltip-bg` | var(--color-background-surface) | Tooltip background |
| `--color-tooltip-border` | var(--color-accent-gold) | Tooltip border |
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
- `prefers-reduced-motion` respected — animations disabled when set
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

### Home (index.html)
**Purpose:** First impression. Dashboard layout — profile, featured work, recent thoughts.
**Status:** Design locked (Draft 4) — ready to build
**Layout:** Three column desktop (Profile sidebar left 280px, Featured Work centre 1fr, Thoughts right 300px)
**Mobile:** Single column — Profile, Featured Work, Thoughts. Bottom tab bar navigation.
**Content counts:** 3 Featured Work cards (built to expand), 3 Thoughts entries (1 large featured + 2 smaller recent)

### Work (work.html)
**Purpose:** Portfolio or professional work showcase — index of all projects.
**Status:** Scaffolded — design pending

### Standard Page Template (Work entries, Thoughts entries)
**Purpose:** Individual work or blog post pages.
**Status:** Design locked — ready to build after Home
**Layout:** Single column, centred, max-width content
**Elements:**
- Breadcrumb navigation: Section > Month/Year > Title
- Full width banner image (3:1 ratio) with caption
- Centre aligned H1 title
- Author avatar, name, published date, updated date
- Tags and Share button (copy URL to clipboard with toast confirmation)
- Left-aligned section headings (H2, H3)
- Left-aligned body text
- Tags and Share repeated at bottom of content
- Back to Top button

### Thoughts (thoughts.html)
**Purpose:** Blog / writing index.
**Status:** Scaffolded — design pending

### About (about.html)
**Purpose:** Detailed personal bio. Handles contact and feedback link.
**Status:** Scaffolded — design pending

---

## 7. Components

### Navigation (nav.html)
- **Desktop:** Sticky top header — logo/name left, links right
- **Mobile:** Bottom tab bar — replaces hamburger entirely
- Nav links: Home, Work, Thoughts, About
- `aria-current="page"` set dynamically via `script.js` after nav injection
- Injected via `script.js` fetch into `#nav-placeholder`

### Mobile Bottom Tab Bar
- Fixed to bottom of viewport
- Items: Home (ti-home), Work (ti-briefcase), Thoughts (ti-pencil), About (ti-user)
- Icon + text label — never icon only
- Font size xs (12px) for labels
- Active state uses `--color-interactive-default`
- Min touch target 44px per item
- Body gets `padding-bottom: 80px` on mobile to prevent content overlap
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
- Positioned above bottom tab bar on mobile

### Card Component
- Style: Image card with CSS background image
- Image: `background-image` CSS property — decorative, no alt needed
- Block link pattern: `::after` pseudo-element on `.card-link` covers full card
- CTA label: "Read about this piece of work" (Work), "Read this thought" (Thoughts)
- Tags: `.tag` and `.tag--secondary` classes
- Screen reader: heading link announces destination cleanly

### Tag Component
- `.tag` — gold background `--color-tag-primary`, white text
- `.tag--secondary` — pink background `--color-tag-secondary`, white text
- Shape: pill (border-radius full)
- Font: sm, medium weight, wide letter spacing
- Always `aria-hidden="true"` if decorative, `aria-label="Category: X"` if meaningful

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
- Left border: `--color-code-border` (gold)
- Monospace font

### Dividers (hr)
- 1px solid `--color-divider-accent` (gold `#BA8200`)
- Used as section separators site-wide

### Profile Sidebar (Home page only)
- **Desktop:** Sticky — `position: sticky`, `top: 80px`
- **Mobile:** Appears at top of page (first in source order)
- Contains: illustration, caption, H2 greeting, skill tags, bio, LinkedIn button, Email button, Read More about Chris link

---

## 8. Planned Features (Deferred — Post Launch)

### Floating Table of Contents
- Target: Thoughts individual post pages
- Behaviour: Sidebar on desktop, floating collapsed button on mobile
- Auto-tracks scroll with `IntersectionObserver` API
- Status: Logged — build after Thoughts page content exists

### Advanced Tooltips
- Inspired by Baldur's Gate 3 — rich contextual cards with nested information
- Status: Logged — post launch

### Search Overlay
- Trigger: Search icon in nav
- Full-width overlay, results grouped by Tags then Posts
- Implementation: Fuse.js client-side fuzzy search
- Requires: `aria-live="polite"`, focus trapping
- Status: Logged — build when Thoughts content exists

### Tag and Author Filtering
- Lives on Thoughts index page
- Status: Logged

### Draggable Floating Button / Context Menu
- Press and hold to drag, tap to expand context menu
- Implementation: JS pointer events
- Status: Logged — use case TBD

### Related Content Footer (Standard Pages)
- Footer section on each standard page showing related work or posts
- Keeps users browsing the site
- Status: Logged — post launch

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
- Tabler Icons CDN in `<head>` on every page

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
- No inline JavaScript in HTML files

### Git
- All work on `dev` branch
- Commit messages descriptive and lowercase
- Push to `dev`, review at Netlify dev URL, merge to `main` to go live
- Never commit `.env` files

---

## 12. Designer to Engineer Handoff Standards

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

## 13. Session Handoff Notes

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
