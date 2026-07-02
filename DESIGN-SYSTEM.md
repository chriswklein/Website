# Design System — Atomic Foundation
**Version:** 1.0.0
**Last Updated:** 2026-07-01
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

### 1.6 Semantic Tokens — Accent (Gold)

Gold is the primary accent. Used for dividers, primary tags, links, code borders, and tooltip borders.

| CSS Variable | References | Contrast vs Base | Usage |
|---|---|---|---|
| `--color-accent-gold` | `gold-dark` `#BA8200` | ~5.2:1 ✅ | Primary tag fill, hr dividers, code block border |
| `--color-accent-gold-text` | `gold-light` `#E5A000` | ~8.9:1 ✅ | Hyperlinks, tooltip text accents, text on dark |

### 1.7 Semantic Tokens — Accent (Pink)

Pink is the secondary accent. Used for secondary tags and blockquote borders.

| CSS Variable | References | Contrast vs Base | Usage |
|---|---|---|---|
| `--color-accent-pink` | `pink-dark` `#A9407C` | ~4.6:1 ✅ | Secondary tag fill, blockquote left border |
| `--color-accent-pink-text` | `pink-light` `#FF60BB` | — | Pink text on dark surfaces |

### 1.8 Semantic Tokens — Components

| CSS Variable | References | Usage |
|---|---|---|
| `--color-tag-primary` | `--color-accent-gold` | Primary tag background |
| `--color-tag-secondary` | `--color-accent-pink` | Secondary tag background |
| `--color-tag-text` | `--color-text-primary` | Text on all tags — always white |
| `--color-link` | `--color-accent-gold-text` | Hyperlink default colour |
| `--color-link-hover` | `--color-accent-gold` | Hyperlink hover colour |
| `--color-divider-accent` | `--color-accent-gold` | hr and section dividers site-wide |
| `--color-quote-border` | `--color-accent-pink` | Blockquote left border |
| `--color-code-bg` | `--color-background-subtle` | Code and pre block background |
| `--color-code-border` | `--color-accent-gold` | Code block left border |
| `--color-tooltip-bg` | `--color-background-surface` | Tooltip background |
| `--color-tooltip-border` | `--color-accent-gold` | Tooltip border |
| `--color-tooltip-text` | `--color-text-primary` | Tooltip text |

### 1.9 Contrast Verification

All text pairings verified against WCAG AA (4.5:1 minimum for normal text, 3:1 for large text and UI components).

| Foreground | Background | Ratio | Status |
|---|---|---|---|
| `--color-text-primary` on `--color-background-base` | `#F5F5F5` on `#111111` | ~15:1 | ✅ AAA |
| `--color-text-secondary` on `--color-background-base` | `#AAAAAA` on `#111111` | ~7.5:1 | ✅ AA |
| `--color-text-primary` on `--color-background-surface` | `#F5F5F5` on `#1A1A1A` | ~12:1 | ✅ AAA |
| `--color-text-secondary` on `--color-background-surface` | `#AAAAAA` on `#1A1A1A` | ~6:1 | ✅ AA |
| `--color-accent-gold` on `--color-background-base` | `#BA8200` on `#111111` | ~5.2:1 | ✅ AA |
| `--color-accent-gold-text` on `--color-background-base` | `#E5A000` on `#111111` | ~8.9:1 | ✅ AAA |
| `--color-accent-pink` on `--color-background-base` | `#A9407C` on `#111111` | ~4.6:1 | ✅ AA |
| `--color-tag-text` on `--color-tag-primary` | `#F5F5F5` on `#BA8200` | ~3.1:1 | ✅ AA Large |
| `--color-tag-text` on `--color-tag-secondary` | `#F5F5F5` on `#A9407C` | ~3.2:1 | ✅ AA Large |
| `--color-interactive-focus` on `--color-background-base` | `#FFFFFF` on `#111111` | ~19:1 | ✅ AAA |

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

Built on a 1.25 Major Third modular ratio from a 16px base.

| CSS Variable | Value | Usage |
|---|---|---|
| `--font-size-xs` | `12px` | Tab bar labels, legal fine print only |
| `--font-size-sm` | `14px` | Captions, tags, metadata, timestamps, nav labels |
| `--font-size-base` | `16px` | Body text — browser default, WCAG recommended minimum |
| `--font-size-md` | `18px` | Large body, intro paragraphs |
| `--font-size-lg` | `20px` | H4 |
| `--font-size-xl` | `24px` | H3 |
| `--font-size-2xl` | `30px` | H2 |
| `--font-size-3xl` | `36px` | H1 on mobile |
| `--font-size-4xl` | `48px` | H1 on desktop |
| `--font-size-5xl` | `60px` | Display / hero headline desktop only |

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

---

## 4. Grid and Layout

### 4.1 Breakpoints

| Name | Width | Description |
|---|---|---|
| Mobile | `390px` | iPhone 14 — primary mobile target |
| Tablet | `768px` | Breakpoint boundary — layout changes here |
| Desktop | `1440px` | Design canvas width |

Mobile breakpoint in CSS: `@media (max-width: 768px)`
Touch device query: `@media (hover: none)` — use for tooltip and hover-only interactions

### 4.2 Grid Specification

| Breakpoint | Columns | Gutter | Margin | Max Content Width |
|---|---|---|---|---|
| Desktop 1440px | 12 | `32px` | `120px` | `1200px` |
| Tablet 768px | 8 | `24px` | `40px` | `688px` |
| Mobile 390px | 4 | `16px` | `16px` | `358px` |

CSS variable for max content width: `--max-content: 1200px`

The `.container` class enforces the max content width and centres content horizontally:
```css
.container {
    width: 100%;
    max-width: var(--max-content);
    margin: 0 auto;
    padding: 0 var(--space-8);
}
```
On mobile, container padding reduces to `var(--space-4)`.

### 4.3 Page Layout Templates

**Home Page — Three Column Grid**

| Column | Width | Content |
|---|---|---|
| Left — Profile Sidebar | `280px` fixed | Sticky profile card |
| Centre — Main Content | `1fr` | Featured Work |
| Right — Thoughts Sidebar | `300px` fixed | Recent Thoughts |

On mobile: all three columns stack into a single column in this order — Profile, Featured Work, Thoughts.

CSS implementation:
```css
.home-grid {
    display: grid;
    grid-template-columns: 280px 1fr 300px;
    gap: var(--space-8);
    align-items: start;
}
```

**Standard Page — Single Column Centred**

Content centred at max `680px` width for optimal reading line length. Used for Work entries and Thoughts entries.

| Element | Width | Alignment |
|---|---|---|
| Banner image | Full content width | Left edge to right edge |
| Title | Full content width | Centre aligned |
| Metadata block | Auto | Centre aligned |
| Section headings | Full content width | Left aligned |
| Body text | `max-width: 65ch` | Left aligned |

### 4.4 Navigation Layout

**Desktop — Sticky top header:**
- Logo/site name: centre aligned, `--font-size-base`, `--font-weight-bold`
- Nav links: centre aligned, below logo
- Height: `64px`
- Background: `--color-background-base`
- Border bottom: `1px solid --color-border-default`
- Position: `sticky`, `top: 0`, `z-index: 100`

**Mobile — Bottom tab bar:**
- Position: `fixed`, `bottom: 0`, full width
- Height: `64px`
- Background: `--color-background-surface`
- Border top: `1px solid --color-border-default`
- Items: Home, Work, Thoughts, About — icon above label
- Icon size: `20px`
- Label style: `nav-tab` type style
- Active item: `--color-interactive-default`
- Inactive item: `--color-text-secondary`
- Min touch target per item: `44px`
- Body padding-bottom on mobile: `80px` to prevent content overlap

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

**Library:** Tabler Icons — outline style only.

CDN link required in every page `<head>`:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
```

**Rules:**
- Always use outline variants — never use `-filled` suffix variants
- Always add `aria-hidden="true"` to decorative icons
- Icon-only interactive elements must have an `aria-label`
- Pair icons with text labels wherever space allows — never icon only in navigation

**Standard icon sizes:**
- Tab bar icons: `20px`
- Inline with text: `16px`
- Standalone decorative: `24px`

---

## 11. Images

### 11.1 Format

| Format | Use Case |
|---|---|
| WebP | All photographs and complex images — primary format |
| JPG | Fallback for browsers without WebP support |
| SVG | Icons, illustrations, logos — infinitely scalable |
| PNG | Transparent graphics where SVG isn't suitable |

Never use GIF — use short MP4 video instead for animation.

### 11.2 Aspect Ratios

| Ratio | Pixels at 320px wide | Usage |
|---|---|---|
| 16:9 | `320 × 180px` | Work and Thoughts card thumbnails |
| 3:2 | `320 × 213px` | Editorial photography |
| 1:1 | `320 × 320px` | Profile images, square grids |
| 3:1 | `1200 × 400px` | Article and project header banners |
| 21:9 | `1200 × 514px` | Full-width hero banners |

### 11.3 Required Attributes

Every `<img>` tag must have all of these:

```html
<img
    src="image.webp"
    srcset="image-400.webp 400w, image-800.webp 800w, image-1200.webp 1200w"
    sizes="(max-width: 768px) 100vw, 50vw"
    alt="Descriptive alt text"
    loading="lazy"
    width="800"
    height="450"
>
```

Decorative images:
```html
<img src="decoration.webp" alt="" aria-hidden="true" width="300" height="300">
```

### 11.4 Performance Budget

| Image Type | Max File Size |
|---|---|
| Hero / banner | 200kb |
| Card thumbnail | 100kb |
| Any single image | 500kb |

Compression tool: Squoosh (free, browser-based, converts to WebP).

### 11.5 CSS Base Rule

This must be present in `style.css` and applies to all images:

```css
img {
    max-width: 100%;
    height: auto;
    display: block;
}
```

---

## 12. Checklist for Claude Code Sessions

Before writing any code, verify:

- [ ] This document has been read in full
- [ ] `REFERENCE.md` has been read in full
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

