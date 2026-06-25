# Personal Website — Project Reference Document
**Version:** 1.0.0
**Last Updated:** 2026-06-24
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
| Design | Figma | With Tokens Studio plugin for design token management |
| Code Editor | VS Code | With Live Server extension for local preview |
| Languages | HTML, CSS, JavaScript | Plain — no frameworks or preprocessors |
| Version Control | GitHub | Public repository |
| Hosting | Netlify | Free tier, automatic deploys on push |
| Fonts | Noto Sans | Via Google Fonts — chosen for universal script/localization coverage |

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
├── nav.html            — Navigation component (partial)
├── footer.html         — Footer component (partial, also handles contact)
├── style.css           — All styles and design tokens as CSS variables
├── script.js           — JS: component injection, mobile nav, back-to-top (planned)
├── REFERENCE.md        — This document
└── .gitignore          — Node template, covers OS files and .env
```

### Adding New Pages
Every new page only needs four things:
1. `<div id="nav-placeholder"></div>` at the top of `<body>`
2. Page content wrapped in `<main>`
3. `<div id="footer-placeholder"></div>` at the bottom of `<body>`
4. `<script src="script.js"></script>` before closing `</body>`

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
| `--font-size-sm` | 14px | Captions, labels, metadata |
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
| `grey.0` | #FFFFFF |
| `grey.50` | #F5F5F5 |
| `grey.100` | #E8E8E8 |
| `grey.200` | #CCCCCC |
| `grey.300` | #AAAAAA |
| `grey.400` | #888888 |
| `grey.500` | #666666 |
| `grey.600` | #444444 |
| `grey.700` | #2A2A2A |
| `grey.800` | #1A1A1A |
| `grey.900` | #111111 |
| `grey.1000` | #000000 |

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

### Accessibility Standards
- WCAG AA minimum on all decisions
- Focus ring: 2px solid white, 3px offset
- Touch targets: 44px minimum
- Line length: 45ch minimum, 65ch optimal, 80ch maximum
- `prefers-reduced-motion` respected — animations disabled when set
- Semantic HTML required — no div soup
- `lang` attribute on every `<html>` tag
- Alt text required on every meaningful image

### Localization Standards
- Noto Sans covers all scripts
- No all-caps in navigation (breaks some scripts)
- Text expansion allowance: 30–40% for German/French
- No fixed-width text containers
- RTL layout (Arabic/Hebrew) noted for future consideration

---

## 6. Pages

### Home (index.html)
**Purpose:** First impression. Name, tagline, brief intro.
**Status:** Scaffolded — placeholder content only

### Work (work.html)
**Purpose:** Portfolio or professional work showcase.
**Status:** Scaffolded — placeholder content only

### Thoughts (thoughts.html)
**Purpose:** Blog / writing. Individual entries TBD.
**Status:** Scaffolded — placeholder content only

### About (about.html)
**Purpose:** Detailed personal bio. Also handles contact (alongside footer).
**Status:** Scaffolded — placeholder content only

---

## 7. Components

### Navigation (nav.html)
- Sticky header
- Logo/name left, links right
- Mobile: hamburger toggle at 768px breakpoint
- Hamburger animates to X on open
- `aria-expanded` toggled for screen reader support
- Menu closes on link click
- Injected via `script.js` fetch into `#nav-placeholder`

### Footer (footer.html)
- Copyright line
- Contact handled here and on About page
- Injected via `script.js` fetch into `#footer-placeholder`

### Back to Top Button
- **Status:** Planned
- Appears after user scrolls past a threshold
- Smooth scrolls to top
- Accessible — keyboard operable, labelled for screen readers
- Respects `prefers-reduced-motion`

---

## 8. Planned Features (In Scope)

- [ ] Back to top button
- [ ] Page content — Home
- [ ] Page content — Work
- [ ] Page content — Thoughts (blog index)
- [ ] Page content — About / Contact
- [ ] Figma design — page layouts using design system
- [ ] Page layout templates / reusable formats
- [ ] Deploy to custom domain (if applicable)

---

## 9. Explicitly Out of Scope

- No JavaScript frameworks (React, Vue, etc.)
- No CSS preprocessors (Sass, Less)
- No CMS or database
- No backend or server-side logic
- No analytics (can be added post-launch)
- No comments system on Thoughts/Blog
- No dark/light mode toggle (dark is default and only theme)
- No staging branch (removed — not needed for solo project)

---

## 10. Coding Standards

### HTML
- Semantic elements always (`<header>`, `<nav>`, `<main>`, `<footer>`, `<article>`, `<section>`)
- `lang="en"` on every `<html>` tag
- Alt text on every meaningful `<img>`
- Decorative images get `alt=""`
- Heading hierarchy must be logical — never skip levels
- One `<h1>` per page

### CSS
- All values reference CSS variables — no hardcoded colours or sizes
- Mobile styles in `@media (max-width: 768px)` blocks
- No inline styles
- Comments mark every section clearly
- `prefers-reduced-motion` block maintained at bottom of file

### JavaScript
- Vanilla JS only — no libraries or frameworks
- Components injected via `fetch()` on `DOMContentLoaded`
- `initNav()` called only after nav markup is in the DOM
- No inline JavaScript in HTML files

### Git
- All work on `dev` branch
- Commit messages descriptive and lowercase: `"add back to top button"`
- Push to `dev`, review at Netlify dev URL, merge to `main` to go live
- Never commit `.env` files

---

## 11. Session Handoff Notes

*Use this section to capture where things were left at the end of each working session.*

**2026-06-24**
- Base HTML, CSS, and JS set up and live on Netlify
- Nav and footer extracted as components, injected via script.js
- Two branches active: `main` (production) and `dev` (development)
- Next: Design page layouts in Figma, define reusable page templates, build page content

---
