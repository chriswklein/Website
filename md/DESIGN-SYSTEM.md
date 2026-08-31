# Design System — Atomic Foundation
**Version:** 1.0.0
**Last Updated:** 2026-08-25
**Status:** Active — source of truth for all design and build decisions

---

## How to Use This Document

This document defines every atom in the design system. Every component, every page layout, and every Claude Code session must reference this document before making any visual decision.

Rules for use:
- No hardcoded values anywhere — every value in this document has a token name that must be used in CSS
- No inventing values — if a value isn't in this document, add it here first, then use it
- Token names in CSS variables must match token names in this document exactly
- Token names in Figma Variables must match token names in this document exactly

---

## 1. Colour

### 1.1 Primitives

Raw colour values. Never apply these directly to elements. Always reference via semantic tokens.

| Token Name | Hex Value | Description |
|---|---|---|
| `grey-0` | `#FFFFFF` | Pure white |
| `grey-50` | `#F5F5F5` | Near white |
| `grey-100` | `#E8E8E8` | Light grey |
| `grey-200` | `#CCCCCC` | Soft grey |
| `grey-300` | `#AAAAAA` | Mid-light grey |
| `grey-400` | `#888888` | Mid grey |
| `grey-500` | `#666666` | Mid-dark grey |
| `grey-600` | `#444444` | Dark grey |
| `grey-700` | `#2A2A2A` | Deeper dark grey |
| `grey-800` | `#1A1A1A` | Near black |
| `grey-900` | `#111111` | Almost black |
| `grey-1000` | `#000000` | Pure black |
| `gold-dark` | `#BA8200` | Dark gold |
| `gold-light` | `#E5A000` | Light gold |
| `pink-dark` | `#A9407C` | Deep pink/magenta |
| `pink-light` | `#FF60BB` | Light pink |
| `teal-dark` | `#00BAA5` | Dark teal |
| `teal-light` | `#00E5CB` | Light teal |

### 1.2 Semantic Tokens — Background

| CSS Variable | References | Usage |
|---|---|---|
| `--color-background-base` | `grey-900` `#111111` | Main page background — applied to `body` |
| `--color-background-surface` | `grey-800` `#1A1A1A` | Cards, panels, sidebars, elevated surfaces |
| `--color-background-subtle` | `grey-700` `#2A2A2A` | Hover states, image placeholders, code blocks |

### 1.3 Semantic Tokens — Text

| CSS Variable | References | Contrast vs Base | Usage |
|---|---|---|---|
| `--color-text-primary` | `grey-50` `#F5F5F5` | ~15:1 ✅ | All body text, headings, primary UI labels |
| `--color-text-secondary` | `grey-300` `#AAAAAA` | ~7.5:1 ✅ | Captions, metadata, timestamps, helper text |
| `--color-text-tertiary` | `grey-400` `#888888` | ~4.6:1 ✅ | Placeholder text — large sizes only |
| `--color-text-disabled` | `grey-500` `#666666` | Not required | Disabled state text |
| `--color-text-inverse` | `grey-900` `#111111` | — | Text placed on light surfaces |

### 1.4 Semantic Tokens — Border

| CSS Variable | References | Usage |
|---|---|---|
| `--color-border-default` | `grey-700` `#2A2A2A` | Subtle card and panel borders, dividers |
| `--color-border-strong` | `grey-500` `#666666` | Input outlines, emphasized borders |

### 1.5 Semantic Tokens — Interactive

| CSS Variable | References | Usage |
|---|---|---|
| `--color-interactive-default` | `grey-50` `#F5F5F5` | Default interactive element colour |
| `--color-interactive-hover` | `grey-200` `#CCCCCC` | Hover state |
| `--color-interactive-active` | `grey-0` `#FFFFFF` | Active/pressed state |
| `--color-interactive-focus` | `grey-0` `#FFFFFF` | Focus ring colour — ~19:1 contrast ✅ |
| `--color-interactive-disabled` | `grey-500` `#666666` | Disabled interactive elements |

### 1.6 Semantic Tokens — Accent (Primary)

Teal is the live default primary accent — used for dividers, primary tags, links, code borders, and tooltip borders. `--color-accent-primary` / `--color-accent-primary-text` resolve to the teal values below by default; gold is a dormant `[data-theme="gold"]` override, not a co-equal option — see §1.10 Theme System for the full theme mechanism.

| CSS Variable | References (live default) | Contrast vs Base | Usage |
|---|---|---|---|
| `--color-accent-primary` | `teal-dark` `#00BAA5` | ~7.7:1 ✅ | Primary tag fill, hr dividers, code block border |
| `--color-accent-primary-text` | `teal-light` `#00E5CB` | ~11.8:1 ✅ | Hyperlinks, tooltip text accents, text on dark |

### 1.7 Semantic Tokens — Accent (Pink)

Pink is the secondary accent. Used for secondary tags and blockquote borders.

| CSS Variable | References | Contrast vs Base | Usage |
|---|---|---|---|
| `--color-accent-quote` | `pink-dark` `#A9407C` | ~4.6:1 ✅ | Secondary tag fill, blockquote left border |
| `--color-accent-quote-text` | `pink-light` `#FF60BB` | — | Pink text on dark surfaces |

### 1.8 Semantic Tokens — Components

| CSS Variable | References | Usage |
|---|---|---|
| `--tag-border` | `--color-accent-primary` | Tag default border and text colour |
| `--tag-border-hover` | `--color-accent-primary` | Tag hover border colour |
| `--tag-bg-hover` | `--color-background-subtle` | Tag hover background |
| `--color-link` | `--color-accent-primary-text` | Hyperlink default colour |
| `--color-link-hover` | `--color-accent-primary` | Hyperlink hover colour |
| `--color-divider-accent` | `--color-accent-primary` | hr and section dividers site-wide |
| `--color-quote-border` | `--color-accent-quote` | Blockquote left border |
| `--color-code-bg` | `--color-background-subtle` | Code and pre block background |
| `--color-code-border` | `--color-accent-primary` | Code block left border |
| `--color-tooltip-bg` | `--color-background-surface` | Tooltip background |
| `--color-tooltip-border` | `--color-accent-primary` | Tooltip border |
| `--color-tooltip-text` | `--color-text-primary` | Tooltip text |

### 1.9 Contrast Verification

All text pairings verified against WCAG AA (4.5:1 minimum for normal text, 3:1 for large text and UI components).

| Foreground | Background | Ratio | Status |
|---|---|---|---|
| `--color-text-primary` on `--color-background-base` | `#F5F5F5` on `#111111` | ~15:1 | ✅ AAA |
| `--color-text-secondary` on `--color-background-base` | `#AAAAAA` on `#111111` | ~7.5:1 | ✅ AA |
| `--color-text-primary` on `--color-background-surface` | `#F5F5F5` on `#1A1A1A` | ~12:1 | ✅ AAA |
| `--color-text-secondary` on `--color-background-surface` | `#AAAAAA` on `#1A1A1A` | ~6:1 | ✅ AA |
| `--color-accent-primary` on `--color-background-base` | `#BA8200` on `#111111` | ~5.2:1 | ✅ AA |
| `--color-accent-primary-text` on `--color-background-base` | `#E5A000` on `#111111` | ~8.9:1 | ✅ AAA |
| `--color-accent-quote` on `--color-background-base` | `#A9407C` on `#111111` | ~4.6:1 | ✅ AA |
| `--color-accent-primary-text` on `--color-background-subtle` | `#E5A000` on `#2A2A2A` | ~6.4:1 | ✅ AA |
| `--color-accent-primary-text` on `--color-background-surface` | `#E5A000` on `#1A1A1A` | ~7.8:1 | ✅ AAA |
| `--color-interactive-focus` on `--color-background-base` | `#FFFFFF` on `#111111` | ~19:1 | ✅ AAA |

### 1.10 Theme System

One background theme (dark — fixed) with two accent colour variants selectable via `data-theme` on `<html>`:

| Theme | `data-theme` value | `--color-accent-primary` | `--color-accent-primary-text` | Status |
|---|---|---|---|---|
| Teal | *(no attribute)* or `"teal"` | `teal-dark` `#00BAA5` | `teal-light` `#00E5CB` | **Live default** |
| Gold | `"gold"` | `gold-dark` `#BA8200` | `gold-light` `#E5A000` | Dormant — preserved for future use |

**Current state:** Teal is the site-wide default. The `:root` block defines `--color-accent-primary: #00BAA5` and `--color-accent-primary-text: #00E5CB`. The `[data-theme="teal"]` override block remains in place (its values match the default — harmless). A `[data-theme="gold"]` override block is defined but no UI currently activates it.

The theme toggle button (`initThemeToggle()` in `script.js`) is dormant — the function remains in the codebase but its call is commented out pending a permanent home in the planned Vertical Action Rail. No toggle button is rendered on any page.

All other tokens — backgrounds, greyscale, pink accent, borders — are unaffected by the theme system. Only `--color-accent-primary` and `--color-accent-primary-text` vary between themes.

Teal contrast ratios verified: `#00BAA5` on `#111111` ≈ 7.7:1 ✅ AA · `#00E5CB` on `#111111` ≈ 11.8:1 ✅ AAA.
Gold contrast ratios verified: `#BA8200` on `#111111` ≈ 5.2:1 ✅ AA · `#E5A000` on `#111111` ≈ 8.9:1 ✅ AAA.

The flash-prevention `<script>` at the top of every page `<head>` still runs on every load. With no preference stored in `localStorage` (the toggle is disabled so nothing writes to it), it finds nothing and exits silently — the page renders with the teal `:root` default with no flash and no console error. If a user had previously toggled to gold and has `"theme": "gold"` in `localStorage`, the script would apply `data-theme="gold"` and gold would render correctly — the dormant infrastructure remains functional.

### 1.11 Background Pattern

A subtle dot texture layered beneath `--color-background-base` on `body`, site-wide. Theme-agnostic — does not reference `--color-accent-primary` or any other theme-swappable token, so it renders identically regardless of which theme (teal or dormant gold) is active.

| CSS Variable | Value | Usage |
|---|---|---|
| `--pattern-dot-color` | `rgba(255, 255, 255, 0.05)` | Dot colour — fixed, not theme-dependent |
| `--pattern-dot-size` | `1.5px` | Radius of each dot |
| `--pattern-dot-spacing` | `var(--space-6)` | Grid spacing between dots (24px) |

Applied via `background-image` (radial-gradient dots) layered on top of `background-color` on `body` — the existing base colour is preserved underneath. Since it sits behind opaque card, header, and drawer surfaces, the pattern is only visible in empty page margins and gaps.

---

## 2. Typography

**Typeface:** Noto Sans — chosen for universal script coverage and localization support. Loaded via Google Fonts at weights 400, 500, 600, 700.

Google Fonts link required in every page `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### 2.1 Font Family

| CSS Variable | Value | Usage |
|---|---|---|
| `--font-family-base` | `'Noto Sans', sans-serif` | All text on the site |

### 2.2 Font Size Scale

Built on a 1.25 Major Third modular ratio from a 16px base. Converted from `px` to `rem` 2026-08-10 (commit c2ea59f) so type respects the user's browser/OS font-size preference — values below are rem, `px` equivalents shown for reference against the 16px base only.

| CSS Variable | Value | px equivalent | Usage |
|---|---|---|---|
| `--font-size-xs` | `0.75rem` | `12px` | Tab bar labels, legal fine print only |
| `--font-size-sm` | `0.875rem` | `14px` | Captions, tags, metadata, timestamps, nav labels |
| `--font-size-base` | `1rem` | `16px` | Body text — browser default, WCAG recommended minimum |
| `--font-size-md` | `1.125rem` | `18px` | Large body, intro paragraphs |
| `--font-size-lg` | `1.25rem` | `20px` | H4 |
| `--font-size-xl` | `1.5rem` | `24px` | H3 |
| `--font-size-2xl` | `1.875rem` | `30px` | H2 |
| `--font-size-3xl` | `2.25rem` | `36px` | H1 on mobile |
| `--font-size-4xl` | `3rem` | `48px` | H1 on desktop |
| `--font-size-5xl` | `3.75rem` | `60px` | Display / hero headline desktop only |

### 2.3 Font Weight

| CSS Variable | Value | Usage |
|---|---|---|
| `--font-weight-regular` | `400` | Body text, captions |
| `--font-weight-medium` | `500` | Labels, tags, nav items, metadata |
| `--font-weight-semibold` | `600` | H3, H4, subheadings |
| `--font-weight-bold` | `700` | H1, H2, display text |

### 2.4 Line Height

| CSS Variable | Value | Usage |
|---|---|---|
| `--line-height-tight` | `1.2` | Display and H1 — large type needs less leading |
| `--line-height-snug` | `1.3` | H2, H3 |
| `--line-height-normal` | `1.5` | H4, UI labels, large body |
| `--line-height-relaxed` | `1.6` | Body text — optimal for sustained reading |
| `--line-height-loose` | `1.75` | Small text, captions — compensates for reduced size |

### 2.5 Letter Spacing

| CSS Variable | Value | Usage |
|---|---|---|
| `--letter-spacing-tight` | `-0.02em` | Display and H1 at large sizes |
| `--letter-spacing-normal` | `0em` | Body text default |
| `--letter-spacing-wide` | `0.04em` | Labels, captions, tag text |
| `--letter-spacing-widest` | `0.08em` | Navigation items, tab bar labels, badges |

### 2.6 Paragraph Spacing

Space between consecutive paragraphs within a text block.

| CSS Variable | Value | Usage |
|---|---|---|
| `--paragraph-spacing-sm` | `12px` | Between caption-level text blocks |
| `--paragraph-spacing-base` | `16px` | Standard paragraph spacing |
| `--paragraph-spacing-md` | `24px` | Between body paragraphs in long-form reading |
| `--paragraph-spacing-lg` | `32px` | Between major content blocks |

### 2.7 Assembled Type Styles

These are the complete text styles as they appear on the page. Every text element must use one of these styles — no mixing individual tokens arbitrarily.

| Style Name | Size | Weight | Line Height | Letter Spacing | Usage |
|---|---|---|---|---|---|
| `display` | `--font-size-5xl` | `--font-weight-bold` | `--line-height-tight` | `--letter-spacing-tight` | Hero headline, desktop only |
| `h1` | `--font-size-4xl` desktop / `--font-size-3xl` mobile | `--font-weight-bold` | `--line-height-tight` | `--letter-spacing-tight` | Page title — one per page |
| `h2` | `--font-size-2xl` | `--font-weight-bold` | `--line-height-snug` | `--letter-spacing-normal` | Section headings — centre aligned |
| `h3` | `--font-size-xl` | `--font-weight-semibold` | `--line-height-snug` | `--letter-spacing-normal` | Card titles, subsection headings |
| `h4` | `--font-size-lg` | `--font-weight-semibold` | `--line-height-normal` | `--letter-spacing-normal` | Grouped content labels |
| `body-large` | `--font-size-md` | `--font-weight-regular` | `--line-height-relaxed` | `--letter-spacing-normal` | Intro paragraphs, lead text |
| `body` | `--font-size-base` | `--font-weight-regular` | `--line-height-relaxed` | `--letter-spacing-normal` | Default body text |
| `caption` | `--font-size-sm` | `--font-weight-medium` | `--line-height-loose` | `--letter-spacing-wide` | Image captions, timestamps, metadata |
| `label` | `--font-size-sm` | `--font-weight-medium` | `--line-height-normal` | `--letter-spacing-widest` | Buttons, tags, nav items, badges |
| `nav-tab` | `--font-size-xs` | `--font-weight-medium` | `--line-height-normal` | `--letter-spacing-widest` | Mobile tab bar labels only |

### 2.8 Typography Rules

These rules are mandatory. They define how type styles relate to each other on the page.

**Heading rules:**
- Section headings (H2) are always centre aligned
- All other headings (H1, H3, H4) are always left aligned
- Never skip heading levels — H1 → H2 → H3 → H4 in order
- One H1 per page only

**Body text rules:**
- Body text is always left aligned — never centred
- Maximum line length: `65ch` optimal, `80ch` maximum — enforced with `max-width` on `p` elements
- Minimum line length: `45ch` — never constrain text narrower than this

**Spacing between type elements:**
- H1 → following paragraph: `--space-6` (24px) gap
- H2 → following paragraph: `--space-4` (16px) gap
- H3 → following paragraph: `--space-3` (12px) gap
- H4 → following paragraph: `--space-2` (8px) gap
- Paragraph → following paragraph: `--paragraph-spacing-md` (24px)
- Paragraph → following heading: `--space-10` (40px)

**Localization rules:**
- No all-caps in navigation — breaks some scripts
- Allow 30–40% text expansion for German/French
- No fixed-width text containers
- All labels use short, translatable words

---

## 3. Spacing

Base-4 scale. Every spacing decision must reference one of these tokens. No arbitrary pixel values.

| CSS Variable | Value | Usage |
|---|---|---|
| `--space-0` | `0px` | Reset |
| `--space-1` | `4px` | Micro gaps — icon to label, tag internal vertical padding |
| `--space-2` | `8px` | Tight gaps — between inline elements, small internal padding |
| `--space-3` | `12px` | Compact padding — tag horizontal padding, tight component gaps |
| `--space-4` | `16px` | Base unit — default internal component padding |
| `--space-5` | `20px` | Slightly loose padding |
| `--space-6` | `24px` | Card internal padding, comfortable component gaps |
| `--space-8` | `32px` | Gap between related components, section sub-gaps |
| `--space-10` | `40px` | Gap before new heading, comfortable section padding |
| `--space-12` | `48px` | Section padding, generous component gaps |
| `--space-16` | `64px` | Large section gaps |
| `--space-20` | `80px` | Page section vertical rhythm |
| `--space-24` | `96px` | Major section separators |
| `--space-32` | `128px` | Hero and banner vertical padding |

### 3.1 Spacing Rules

**Component internal padding:**
- Small components (tags, badges): horizontal `--space-3`, vertical `--space-1`
- Medium components (buttons, inputs): horizontal `--space-5`, vertical `--space-3`
- Large components (cards): `--space-6` on all sides
- Sidebar components: `--space-6` internal, `--space-8` between sections within sidebar

**Spacing between components:**
- Tightly related items (tags within a card): `--space-2`
- Related items in a list or group: `--space-4`
- Distinct components in a layout: `--space-8`
- Major page sections: `--space-16` to `--space-20`

### 3.2 Runtime Exceptions

One narrow, intentional exception to "every value must be a token" exists: `--hero-vh-locked`, used only by `.home-hero`'s mobile `min-height` (`style.css`, MOBILE section).

It is **not** a design-scale value and never will be — it's `window.innerHeight` in pixels, read once by an inline `<script>` in `index.html`'s `<head>` and written to `document.documentElement.style` on every load. This exists because two CSS-only viewport-unit attempts (`100dvh`, then `100svh`) both still allowed a scroll-time layout jitter to reproduce on iOS WKWebView-based browsers (Brave/Edge — not Safari/Chrome), which handle live viewport-height recalculation during the toolbar's show/hide animation less consistently than Safari's native rendering path. A JS-computed constant sidesteps the inconsistency entirely, since it isn't a viewport unit at all and cannot react to an in-progress toolbar animation no matter how a given browser implements `dvh`/`svh`.

Deliberately **not** kept live via a `resize`/`orientationchange` listener — that would reintroduce the exact recalculate-during-scroll behavior this exists to eliminate. A stale value after a genuine device rotation is an accepted tradeoff, not an oversight; making it live again is a separate, deliberate future decision if it ever becomes a real problem, not a default to build in now.

`min-height: var(--hero-vh-locked, 100svh)` — the fallback is `100svh`, not a raw value, so the rule degrades to the previous (still-reasonable) CSS-only behavior if JS is ever unavailable.

If a future audit flags `--hero-vh-locked` as a hardcoded/non-token value: it's this documented exception, not a violation to fix.

---

## 4. Grid and Layout

### 4.1 Breakpoints

| Name | Width | Layout | Nav | Tab Bar | Footer |
|---|---|---|---|---|---|
| Mobile | below 768px | Single column | Hidden | Fixed top | Hidden |
| Tablet | 768px–1023px | Single column | Sticky top | Hidden | Visible |
| Desktop | 1024px and above | Page grid with variable card sizing | Sticky top | Hidden | Visible |

Mobile breakpoint in CSS: `@media (max-width: 767px)`
Tablet breakpoint in CSS: `@media (max-width: 1023px)`
Touch device query: `@media (hover: none)` — use for tooltip and hover-only interactions

### 4.2 Grid Specification

Page grid: single column, max-width `1200px`, centred, padding `0 var(--space-8)`

```
Card row — full width:   grid-template-columns: 1fr
Card row — two column:   grid-template-columns: 1fr 1fr, gap var(--space-6)
Card row — three column: grid-template-columns: 1fr 1fr 1fr, gap var(--space-6)

On tablet (≤1023px) and mobile (≤767px): all card rows collapse to single column
```

CSS variable for max content width: `--max-content: 1200px`

The `.page-grid` class is used for page-level layouts:
```css
.page-grid {
    width: 100%;
    max-width: var(--max-content);
    margin: 0 auto;
    padding: 0 var(--space-8);
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
}
```

The `.container` class is kept for standalone utility (not replaced by page-grid):
```css
.container {
    width: 100%;
    max-width: var(--max-content);
    margin: 0 auto;
    padding: 0 var(--space-8);
}
```

### 4.3 Page Layout Templates

**Home Page — Page Grid**

Single column page-grid. Card rows control multi-column layout within sections:

- Profile card: `.card-row.card-row--full` (full width)
- Featured Work section: first card full width, second and third cards side by side (`.card-row--two`)
- Thoughts section: first card full width, second and third cards side by side (`.card-row--two`)

On tablet (≤1023px) and mobile: all card rows collapse to single column.

**Standard Page — Single Column Centred**

Content centred using `.standard-page` (max-width 1200px, horizontal padding). Body text constrained to 65ch. Used for Work entries and Thoughts entries.

| Element | Width | Alignment |
|---|---|---|
| Banner image | Full content width | Left edge to right edge |
| Title | Full content width | Centre aligned |
| Metadata block | Auto | Centre aligned |
| Section headings | Full content width | Left aligned |
| Body text | `max-width: 65ch` | Left aligned |

### 4.4 Navigation Layout

**Desktop and landscape-tablet (>=1024px) — Sticky top header:**
- Logo/site name: left aligned, to the left of nav links (not stacked above), `--font-size-base`, `--font-weight-bold`
- Container: `display: flex; justify-content: space-between` — logo is the left child, the nav-links group is the right child, no fixed gap between them
- Nav links: gap `--space-20` between individual links (Home/Archive/About), via `.nav-links`
- Container aligns to the same `.container`/`var(--max-content)` edges as other page sections (Featured Work, Thoughts)
- Height: `64px`
- Background: `--color-background-base`
- Border bottom: `1px solid --color-border-default`
- Position: `sticky`, `top: 0`, `z-index: 100`
- Portrait-tablet (768-1023px) shows the same sticky header with the logo hidden — links only

**Mobile — Top-fixed tab bar:**
- Position: `fixed`, `top: 0`, full width
- Height: `64px`
- Background: `--color-background-surface`
- Border bottom: `1px solid --color-border-default`
- Items: Home, Work, Thoughts, About — icon above label
- Icon size: `20px`
- Label style: `nav-tab` type style
- Active item: `--color-interactive-default`
- Inactive item: `--color-text-secondary`
- Min touch target per item: `44px`
- `main` gets `padding-top: 80px` on mobile to prevent content overlap

### 4.5 Component-Specific Layout Tokens

Most component tokens (`--btn-*`, `--tag-*`, `--card-*`, etc.) are scoped locally inside their own component selector in `style.css` — see the Component Token Reference table in `md/COMPONENTS.md`. The token below is the exception: it's defined in the global `:root` block because it governs a layout ratio referenced across breakpoints, the same way `--max-content` is.

| CSS Variable | Value | Usage |
|---|---|---|
| `--card-image-column-width` | `42%` | Width of the image column in a horizontal (image-left) card layout, as a percentage of total card width |

---

## 5. Border Radius

| CSS Variable | Value | Usage |
|---|---|---|
| `--border-radius-none` | `0px` | Sharp corners — editorial elements, full-width images |
| `--border-radius-sm` | `4px` | Subtle rounding — inputs, code blocks |
| `--border-radius-md` | `8px` | Cards, panels, tooltips, modals |
| `--border-radius-lg` | `12px` | Large containers |
| `--border-radius-full` | `9999px` | Pills — tags, badges, fully rounded buttons |

---

## 6. Border Width

| CSS Variable | Value | Usage |
|---|---|---|
| `--border-width-thin` | `1px` | Default border on cards, inputs, dividers |
| `--border-width-medium` | `2px` | Focus rings, emphasized borders |
| `--border-width-thick` | `4px` | Blockquote left border, accent lines |

---

## 7. Elevation and Shadow

Used sparingly on dark backgrounds. Shadows are diffuse and dark.

| CSS Variable | Value | Usage |
|---|---|---|
| `--elevation-sm` | `0 1px 3px rgba(0,0,0,0.4)` | Subtle lift — tags, badges |
| `--elevation-md` | `0 4px 12px rgba(0,0,0,0.5)` | Cards, dropdowns, tooltips |
| `--elevation-lg` | `0 8px 24px rgba(0,0,0,0.6)` | Modals, overlays |
| `--elevation-xl` | `0 16px 48px rgba(0,0,0,0.7)` | Floating elements |

---

## 8. Motion

All animations must respect `prefers-reduced-motion`. When this media query fires, all transitions and animations must be disabled or instant.

### 8.1 Duration

| CSS Variable | Value | Usage |
|---|---|---|
| `--duration-instant` | `0ms` | No transition |
| `--duration-fast` | `100ms` | Micro-interactions — hover colour change, toggle |
| `--duration-base` | `200ms` | Standard transitions — most UI interactions |
| `--duration-slow` | `350ms` | Page-level transitions, reveals |
| `--duration-slower` | `500ms` | Emphasis animations |

### 8.2 Easing

| CSS Variable | Value | Usage |
|---|---|---|
| `--ease-linear` | `linear` | Progress bars, loading indicators |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Elements leaving the screen |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering the screen |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Elements changing position |

### 8.3 Reduced Motion Rule

This block must be present at the bottom of `style.css` and must never be removed:

```css
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
    html {
        scroll-behavior: auto;
    }
}
```

---

## 9. Focus and Accessibility

### 9.1 Focus Ring

Applied globally via `:focus-visible`. Never remove or override without a replacement.

| Property | Value | Token |
|---|---|---|
| Outline style | `solid` | — |
| Outline width | `2px` | `--border-width-medium` |
| Outline colour | `#FFFFFF` | `--color-interactive-focus` |
| Outline offset | `3px` | — |

```css
:focus-visible {
    outline: var(--border-width-medium) solid var(--color-interactive-focus);
    outline-offset: 3px;
}
```

### 9.2 Touch Targets

All interactive elements on mobile must meet minimum touch target size.

| Token | Value | Standard |
|---|---|---|
| `--touch-target-minimum` | `44px` | WCAG 2.5.5 AA minimum |
| `--touch-target-comfortable` | `48px` | Recommended comfortable target |

### 9.3 Line Length

Applied to all `p` elements and long-form text containers.

| Constraint | Value | Standard |
|---|---|---|
| Minimum | `45ch` | Below this reading feels choppy |
| Optimal | `65ch` | WCAG 1.4.8 recommended |
| Maximum | `80ch` | Beyond this eye tracking suffers |

```css
p {
    max-width: 65ch;
}
```

### 9.4 Utility Classes

These classes must be present in `style.css` and available on every page.

**.sr-only — Screen Reader Only**
Visually hidden but announced by screen readers.
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

**.skip-link — Skip to Main Content**
Visually hidden until keyboard focus. First child of `<body>` on every page.
```css
.skip-link {
    position: absolute;
    top: -100%;
    left: 0;
    z-index: 9999;
    padding: var(--space-3) var(--space-5);
    background: var(--color-background-surface);
    color: var(--color-text-primary);
    font-weight: var(--font-weight-medium);
    text-decoration: none;
}
.skip-link:focus {
    top: 0;
}
```

---

## 10. Icons

**None currently in use — text-only site-wide.** Tabler Icons (outline style) was removed completely 2026-07-05 (commit 7d71326): CDN link dropped from every page `<head>`, all icon elements removed, tab bar and Back to Top button rebuilt text-only. No icon CDN or library should be added to any page.

A future iteration may reintroduce Tabler Icons **self-hosted** (webfont downloaded into `assets/icons/`, not via CDN) — see md/COMPONENTS.md's Mobile Tab Bar and Back to Top Button "Deferred" sections for the planned icon mapping and sizes. If that happens:
- Always use outline variants — never use `-filled` suffix variants
- Always add `aria-hidden="true"` to decorative icons
- Icon-only interactive elements must have an `aria-label`
- Pair icons with text labels wherever space allows — never icon only in navigation

---

## 11. Images

### 11.1 Format Standards

| Format | Use Case |
|---|---|
| WebP | All photographs and complex images — primary format |
| PNG | Export from Figma only — convert to WebP before adding to project |
| SVG | Icons, illustrations, logos |
| JPG | Fallback for browsers without WebP support only |

Figma does not export WebP natively. Export as PNG from Figma, then convert using Squoosh (squoosh.app) at 80% quality before saving to the project.

### 11.2 Size Standards

**Profile and Portrait:**

| Use Case | Ratio | Display Size | Export Size | Max File Size |
|---|---|---|---|---|
| About page photo | 4:5 | 400×500px | 800×1000px | 200kb |
| Profile card illustration | 1:1 | 300×300px | 600×600px | 150kb |

**Card Images:**

| Use Case | Ratio | Display Size | Export Size | Max File Size |
|---|---|---|---|---|
| Feature card thumbnail | 16:9 | 640×360px | 1280×720px | 150kb |
| Feature card hero (full width) | 16:9 | 1200×675px | 1200×675px | 200kb |

**Standard Page Images:**

| Use Case | Ratio | Display Size | Export Size | Max File Size |
|---|---|---|---|---|
| Banner image | 3:1 | 1200×400px | 1200×400px | 200kb |
| Inline content image | 16:9 | 800×450px | 800×450px | 150kb |
| Inline content image portrait | 4:5 | 600×750px | 600×750px | 150kb |

**Open Graph:**

| Use Case | Ratio | Size | Max File Size |
|---|---|---|---|
| OG image all pages | 1.91:1 | 1200×630px | 200kb |

### 11.3 Folder Structure

```
assets/
├── images/
│   ├── profile/
│   │   └── christopher-klein.webp
│   ├── work/
│   │   └── {work-entry-slug}/
│   │       ├── {slug}-banner.webp
│   │       └── {slug}-thumbnail.webp
│   ├── thoughts/
│   │   └── {post-slug}/
│   │       ├── {slug}-banner.webp
│   │       └── {slug}-inline-01.webp
│   └── og/
│       ├── og-home.webp
│       ├── og-work.webp
│       ├── og-thoughts.webp
│       └── og-about.webp
└── icons/
    └── (future self-hosted Tabler Icons)
```

### 11.4 Naming Conventions

All lowercase. Hyphens between words. No underscores, no spaces. Suffix indicates image role.

Pattern: `{subject}-{role}.webp` or `{subject}-{role}-{variant}.webp`

Examples:

| File | What It Is |
|---|---|
| `christopher-klein.webp` | About page portrait |
| `star-engine-banner.webp` | Work entry banner |
| `star-engine-thumbnail.webp` | Work entry card thumbnail |
| `this-website-inline-01.webp` | First inline image in an entry |
| `og-home.webp` | Open Graph image for Home page |

Exception: Illustration files credited to a specific artist retain the artist's original naming convention as attribution. Example: `C-Rex-by-Bob-Nelson-2017.png`.

### 11.5 Srcset Strategy

For images appearing at different sizes across breakpoints, export two versions:

| Version | Suffix | When Served |
|---|---|---|
| Standard | `-800.webp` | Desktop and tablet |
| Small | `-400.webp` | Mobile |

HTML pattern:
```html
<img src="image-800.webp"
     srcset="image-400.webp 400w, image-800.webp 800w"
     sizes="(max-width: 767px) 400px, 800px"
     alt="Description"
     width="800"
     height="450"
     loading="lazy">
```

Small profile and illustration images that don't change significantly across breakpoints use a single size — no srcset needed.

### 11.6 Figma to WebP Workflow

```
Figma frame (crop and position image)
  → Export as PNG at 1×
    → Squoosh (squoosh.app)
      → Select WebP, quality 80%
      → Resize if needed
      → Confirm under file size limit
      → Download
        → Save to correct assets/images/ subfolder
          → Update img src in HTML
```

### 11.7 Required img Attributes

Every `<img>` tag must have:
```html
<img src="image.webp"
     alt="Descriptive alt text"
     width="800"
     height="450"
     loading="lazy">
```

Decorative images: `alt=""` and `aria-hidden="true"`

### 11.8 Performance Budget

| Image Type | Max File Size |
|---|---|
| Hero / banner | 200kb |
| Card thumbnail | 150kb |
| Profile / portrait | 200kb |
| Any single image | 500kb |

### 11.9 CSS Base Rule

This must be present in `style.css` and applies to all images:

```css
img {
    max-width: 100%;
    height: auto;
    display: block;
}
```

### 11.10 Video Demo (GIF Replacement)

`.video-demo` is the pattern for local UI/bug-demo clips that would otherwise be a GIF — distinct from `.video-embed` (third-party embeds; see COMPONENTS.md). No forced aspect-ratio: demo recordings vary in shape (square, portrait mobile capture), so the `<video>` sizes from its own intrinsic `width`/`height` attributes, the same CLS-prevention approach as §11.7/§11.9, constrained to `max-width: 100%` within its column.

Every `<video class="video-demo">` must have:
```html
<video poster="poster.jpg" width="1024" height="640" muted loop playsinline controls>
    <source src="clip.webm" type="video/webm">
    <source src="clip.mp4" type="video/mp4">
</video>
```

`poster` is required on every instance — it prevents a blank flash before decode, and is also the static state shown when `prefers-reduced-motion` is set.

The §8.3 CSS reduced-motion block does not govern `<video>` autoplay, so this is handled in `script.js`: `autoplayUnlessReducedMotion(selector)` adds `autoplay` only when `prefers-reduced-motion: reduce` is not set; otherwise the video is left on its poster with native controls, requiring an explicit user action to play. This is the implementation of the site's general `prefers-reduced-motion` commitment (§8) for looping demo content specifically.

---

## 12. Checklist for Claude Code Sessions

Before writing any code, verify:

- [ ] This document has been read in full
- [ ] `md/REFERENCE.md` has been read in full
- [ ] All colour values reference CSS variables — no hex codes in component CSS
- [ ] All spacing values reference CSS variables — no arbitrary pixel values
- [ ] All font sizes reference CSS variables
- [ ] All border radius values reference CSS variables
- [ ] All transition durations reference CSS variables
- [ ] All images have `width`, `height`, `alt`, and `loading="lazy"` attributes
- [ ] One `<h1>` per page
- [ ] Heading hierarchy is logical — no skipped levels
- [ ] Skip link is first child of `<body>`
- [ ] `<main id="main-content">` wraps all page content
- [ ] `aria-current="page"` is set on the active nav link
- [ ] `aria-hidden="true"` is on all decorative images and icons
- [ ] Tab bar is hidden on desktop, visible on mobile
- [ ] Footer is hidden on mobile
- [ ] `prefers-reduced-motion` block is present at bottom of `style.css`
- [ ] Tooltip is hidden on touch devices via `@media (hover: none)`

