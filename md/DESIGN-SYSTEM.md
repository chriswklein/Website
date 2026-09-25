# Design System — Atomic Foundation
**Version:** 1.2.1
**Last Updated:** 2026-09-24
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
| `pink-dark` | `#A9407C` | Deep pink/magenta |
| `pink-light` | `#FF60BB` | Light pink |
| `teal-dark` | `#00BAA5` | Dark teal |
| `teal-light` | `#00E5CB` | Light teal |

### 1.2 Semantic Tokens — Background

| CSS Variable | References | Usage |
|---|---|---|
| `--color-background-base` | `#1C1C1C` (no primitive — introduced 2026-09-24) | Main page background — applied to `body` |
| `--color-background-surface` | `#242424` (no primitive — introduced 2026-09-24) | Cards, panels, sidebars, elevated surfaces |
| `--color-background-subtle` | `#2F2F2F` (no primitive — introduced 2026-09-24) | Hover states, image placeholders, code blocks |
| `--color-background-hover` | `#3D3D3D` (no primitive — introduced 2026-09-24; same hex as `--color-border-default` today, a deliberately separate token so the two can change independently) | Default `.btn` hover fill (`--btn-bg-hover`) — added specifically so a hover fill is never also a border colour (see §1.9) |

### 1.3 Semantic Tokens — Text

Two text levels for real content — see the two-tier principle below the table.

| CSS Variable | References | Contrast on Base | Contrast on Surface | Usage |
|---|---|---|---|---|
| `--color-text-primary` | `grey-100` `#E8E8E8` | ~13.9:1 ✅ AAA | ~12.7:1 ✅ AAA | All body text, headings, primary UI labels |
| `--color-text-secondary` | `#AEAEAE` (no primitive — introduced 2026-09-24) | ~7.7:1 ✅ AAA | ~7.0:1 ✅ AAA | Captions, metadata, timestamps, helper text |
| `--color-text-disabled` | `grey-500` `#666666` | Not required | Not required | Disabled state text |
| `--color-text-inverse` | `grey-900` `#111111` | — | — | Text placed on light or accent-fill surfaces (e.g. `.action-rail-badge` on teal — see §1.9) |

**Two-tier text principle:** only two grey levels are used for real content — primary for the content itself, secondary for supporting info — both held at 7:1 or better against every background they actually sit on. Hierarchy comes from size, weight, and spacing, never a third, fainter grey step. `--color-text-disabled` is a separate non-content UI state (disabled controls), not a third text tier — `--color-text-tertiary` was removed in the 2026-09-24 update after confirming its only two real consumers (`.card-date`, `.standard-page-caption`) had simply been recoloured to secondary.

### 1.4 Semantic Tokens — Border

| CSS Variable | References | Usage |
|---|---|---|
| `--color-border-default` | `#3D3D3D` (no primitive — introduced 2026-09-24) | Subtle card and panel borders, dividers |
| `--color-border-strong` | `#707070` (no primitive — introduced 2026-09-24) | Input outlines, emphasized borders |

### 1.5 Semantic Tokens — Interactive

| CSS Variable | References | Usage |
|---|---|---|
| `--color-interactive-default` | `grey-100` `#E8E8E8` | Default interactive element colour |
| `--color-interactive-hover` | `teal-dark` `#00BAA5` | Hover state — a border colour only (e.g. `.btn:hover`'s border, via `--btn-border-hover`); not applied as a text fill and not used for any hover background — see `--color-background-hover` for that. As of 2026-09-24 this is the same hex as `--color-accent-primary` |
| `--color-interactive-focus` | `grey-0` `#FFFFFF` | Focus ring colour — ~17.0:1 on base / ~15.5:1 on surface ✅ |

`--color-interactive-active` and `--color-interactive-disabled` were removed in the 2026-09-24 update — confirmed zero real CSS consumers (each was documented but never actually applied by any rule).

### 1.6 Semantic Tokens — Accent (Primary)

Teal is the site's only accent — used for dividers, primary tags, links, code borders, and tooltip borders. The dormant `[data-theme="gold"]` override was removed from style.css in the 2026-09-24 reading comfort token update; `[data-theme="teal"]` remains as a harmless no-op that matches the `:root` default — see §1.10.

| CSS Variable | References | Contrast on Base | Contrast on Surface | Usage |
|---|---|---|---|---|
| `--color-accent-primary` | `teal-dark` `#00BAA5` | ~7.0:1 ✅ AA | ~6.3:1 ✅ AA | Primary tag fill, hr dividers, code block border |
| `--color-accent-primary-text` | `teal-light` `#00E5CB` | ~10.6:1 ✅ AAA | ~9.7:1 ✅ AAA | Hyperlinks, tooltip text accents, text on dark |

### 1.7 Semantic Tokens — Accent (Pink)

Pink is the secondary accent. Used for secondary tags and blockquote borders.

| CSS Variable | References | Contrast on Base | Contrast on Surface | Usage |
|---|---|---|---|---|
| `--color-accent-quote` | `pink-dark` `#A9407C` | ~3.0:1 | ~2.7:1 | Secondary tag fill, blockquote left border |

`--color-accent-quote-text` was removed in the 2026-09-24 update — confirmed zero real CSS consumers.

### 1.7b Semantic Tokens — Danger

**Red means "this removes something."** It appears only on the Clear controls (`.btn--danger-hover`: the Filter Drawer's Clear, the floating Clear ×, and the empty-state "Clear Filters!") as a hover / `:active` background fill. Dismiss and confirm controls — the drawer's Done, the image dialog's Close, zoom and Prev/Next — stay neutral on hover. Red is never used for text, borders, or general emphasis.

| CSS Variable | Value | Contrast | Usage |
|---|---|---|---|
| `--color-danger` | `#B41321` | ~5.6:1 with `--color-text-primary` / `--color-interactive-default` ✅ AA | Hover and `:active` background of clear-all controls only |

Defined once in `:root` next to the other semantic colours, with no primitive of its own. It is deliberately absent from the `[data-theme]` override blocks (it does not change with the accent theme) and has no `-text` variant, since no red text is used anywhere. The fill and, as of 2026-09-24, the hover border both change: the control's text stays `--color-interactive-default`, and the ~5.6:1 figure is that light text on the red fill. Against the page background red is only ~2.5:1, which is why it is a fill behind light text and never a general text colour. **Fixed 2026-09-24:** `--color-interactive-hover` (the default `.btn:hover` border colour) became teal (`#00BAA5`, the same hex as `--color-accent-primary` — see §1.5) in the same-day token update, which meant this control briefly rendered a teal border on its red hover fill, contradicting "red means remove" and the "stay neutral" framing above. `.btn--danger-hover:hover:not(:disabled)` now overrides `--btn-border-hover` to `--color-danger` directly, so the border matches the fill instead of inheriting the shared default — see §1.9 for the change note. Hover applies on hover-capable devices only and never while the control is `disabled` — see §9.5.

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

All text pairings verified against WCAG AA (4.5:1 minimum for normal text, 3:1 for large text and UI components). Rebuilt 2026-09-24 from the real rendered pairings — the background each token's real consumer actually sits on, not just base — per the 2026-09-24 token audit's Step 3 pairing trace.

| Foreground | Background | Ratio | Status |
|---|---|---|---|
| `--color-text-primary` on `--color-background-base` | `#E8E8E8` on `#1C1C1C` | ~13.9:1 | ✅ AAA |
| `--color-text-primary` on `--color-background-surface` | `#E8E8E8` on `#242424` | ~12.7:1 | ✅ AAA |
| `--color-text-secondary` on `--color-background-base` | `#AEAEAE` on `#1C1C1C` | ~7.7:1 | ✅ AAA |
| `--color-text-secondary` on `--color-background-surface` | `#AEAEAE` on `#242424` | ~7.0:1 | ✅ AAA |
| `--color-interactive-default` on `--color-background-base` | `#E8E8E8` on `#1C1C1C` | ~13.9:1 | ✅ AAA |
| `--color-accent-primary` on `--color-background-base` | `#00BAA5` on `#1C1C1C` | ~7.0:1 | ✅ AA |
| `--color-accent-primary-text` on `--color-background-base` | `#00E5CB` on `#1C1C1C` | ~10.6:1 | ✅ AAA |
| `--color-accent-primary-text` on `--color-background-surface` | `#00E5CB` on `#242424` | ~9.7:1 | ✅ AAA |
| `--color-interactive-focus` on `--color-background-base` | `#FFFFFF` on `#1C1C1C` | ~17.0:1 | ✅ AAA |
| `--color-text-primary` / `--color-interactive-default` on `--color-danger` | `#E8E8E8` on `#B41321` | ~5.6:1 | ✅ AA |
| `--color-text-inverse` on `--color-accent-primary` (`.action-rail-badge`) | `#111111` on `#00BAA5` | ~7.7:1 | ✅ AAA |
| `--color-text-secondary` on `--color-background-surface` (dimmed tag chip, `.tag-chip--dim`) | `#AEAEAE` on `#242424` | ~7.0:1 | ✅ AAA — same pairing as the base text-secondary row above; listed separately since it's a named component state (see COMPONENTS.md §2b) |
| `--color-interactive-default` on `--color-background-hover` (`.btn:hover` fill) | `#E8E8E8` on `#3D3D3D` | ~8.9:1 | ✅ AAA |
| `--color-danger` hover border vs. fill (`.btn--danger-hover:hover`) | `#B41321` border on `#B41321` fill | n/a | Border overridden to `--color-danger` itself (2026-09-24 fix) — see note below |

**Fixed 2026-09-24 — `.btn:hover` contrast regression resolved.** The prior rebuild of this table (same day, earlier pass) surfaced `--color-interactive-default` on `--color-border-strong` (`.btn:hover`'s fill at the time) at ~4.0:1, failing the 4.5:1 AA floor — caused by `.btn:hover` reusing a *border* token as its hover *fill*. Fixed by giving hover its own token: `--color-background-hover` (`#3D3D3D`, §1.2) — coincidentally the same hex `--color-border-default` already used, but now a separate variable so the two can move independently. `--btn-bg-hover` now aliases `--color-background-hover` instead of `--color-border-strong`; the resulting ~8.9:1 is the row above. `--btn-bg-active` (`.btn:active`'s fill) still aliases `--color-border-default` directly and was deliberately left unchanged, per the same audit: `--color-text-primary` on it is ~8.9:1, already well above AA, so there was nothing to fix there.

**Fixed 2026-09-24 — danger/Clear hover border.** `--color-interactive-hover` (the default `.btn:hover` border colour) became teal (`#00BAA5`) in the same-day token update, matching `--color-accent-primary` — which meant the three Clear controls (`.btn--danger-hover`: Filter Drawer Clear, floating Clear ×, empty-state "Clear Filters!") rendered a teal border on their red hover fill, contradicting §1.7b's "stays neutral on hover" framing. `.btn--danger-hover:hover:not(:disabled)` now also overrides `--btn-border-hover` to `--color-danger`, so the border matches the fill (no separate contrast ratio applies — it's the same colour against itself, effectively borderless in appearance). `:active` was already unaffected (`.btn:active` never touched `border-color`).

**Automated-tooling note (updated 2026-09-24):** the background dot-pattern that previously caused axe-core to mark ~314 body-text elements sitewide as `incomplete` (rather than pass/fail) for the `color-contrast` rule was removed in the 2026-09-24 reading comfort token update (former §1.11, now removed) — `body` renders on a flat `--color-background-base` fill with no gradient, so that specific blind spot no longer applies. Re-running axe-core (4.10.2, `color-contrast` rule) against Home, Archive, the This Website entry, and About at mobile/tablet/desktop after the update found **0 violations** at every page/breakpoint combination. A much smaller, separately-caused `incomplete` result still appears on some Home/Archive card text — axe's occlusion detection tripping on the `.card-block-link`/`.card-cta` layered-link technique (COMPONENTS.md §3), unrelated to backgrounds — already covered by this table's text-primary-on-surface figure above and independently safe.

### 1.10 Theme System

Effectively single-theme: teal is the only accent, defined directly in `:root`. The `[data-theme="teal"]` override block remains in place — its values match the `:root` default exactly, a harmless no-op, kept only so an explicit `data-theme="teal"` attribute (set by the dormant toggle logic below) resolves correctly if it's ever reactivated.

The `[data-theme="gold"]` override block was removed from style.css in the 2026-09-24 reading comfort token update — gold is no longer preserved anywhere in the codebase, dormant or otherwise. Teal's contrast figures are documented once, in §1.9.

The theme toggle button (`initThemeToggle()` in `script.js`) is dormant — the function remains in the codebase but its call is commented out pending a permanent home in the planned Vertical Action Rail. No toggle button is rendered on any page.

All other tokens — backgrounds, greyscale, pink accent, danger red, borders — are unaffected by the theme system. Only `--color-accent-primary` and `--color-accent-primary-text` could vary between themes, and only teal exists now.

The flash-prevention `<script>` at the top of every page `<head>` still runs on every load. With no preference stored in `localStorage` (the toggle is disabled so nothing writes to it), it finds nothing and exits silently — the page renders with the teal `:root` default with no flash and no console error. If a visitor has a stale `"theme": "gold"` value in `localStorage` from before the gold override was removed, the flash-prevention script still sets `data-theme="gold"` on `<html>`, but since no matching CSS rule exists any more, it has no effect — the page silently renders the `:root` teal default instead, harmlessly.

---

## 2. Typography

**Typeface:** Noto Sans (variable) — chosen for universal script coverage and localization support. Loaded via Google Fonts as a variable font, weight range 500–700.

Google Fonts link required in every page `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@500..700&display=swap" rel="stylesheet">
```

### 2.1 Font Family

| CSS Variable | Value | Usage |
|---|---|---|
| `--font-family-base` | `'Noto Sans', 'Noto Sans JP', sans-serif` | All text on the site — Noto Sans JP is a stack fallback only, not yet loaded via the `<link>` above; added when Japanese content ships |

### 2.2 Font Size Scale

Built on a 1.25 Major Third modular ratio from an original 16px base. Converted from `px` to `rem` 2026-08-10 (commit c2ea59f) so type respects the user's browser/OS font-size preference — values below are rem, `px` equivalents shown for reference against the 16px base only. `--font-size-base` was raised to `1.125rem` (18px) in the 2026-09-24 reading comfort update — a deliberate exception to the ratio, not a re-based scale; every other step (`xs` through `5xl`) still derives from the original 16px root, only `base` itself moved.

| CSS Variable | Value | px equivalent | Usage |
|---|---|---|---|
| `--font-size-xs` | `0.75rem` | `12px` | Tab bar labels, legal fine print only |
| `--font-size-sm` | `0.875rem` | `14px` | Captions, tags, metadata, timestamps, nav labels |
| `--font-size-base` | `1.125rem` | `18px` | Body text |
| `--font-size-md` | `1.125rem` | `18px` | Large body, intro paragraphs — numerically identical to `--font-size-base` since 2026-09-24, flagged as a follow-up naming/consolidation question, not resolved here |
| `--font-size-lg` | `1.25rem` | `20px` | H4 |
| `--font-size-xl` | `1.5rem` | `24px` | H3 |
| `--font-size-2xl` | `1.875rem` | `30px` | H2 |
| `--font-size-3xl` | `2.25rem` | `36px` | H1 on mobile |
| `--font-size-4xl` | `3rem` | `48px` | H1 on desktop |
| `--font-size-5xl` | `3.75rem` | `60px` | Display / hero headline desktop only |

### 2.3 Font Weight

| CSS Variable | Value | Usage |
|---|---|---|
| `--font-weight-regular` | `540` | Body text, captions |
| `--font-weight-medium` | `600` | Labels, tags, nav items, metadata |
| `--font-weight-semibold` | `650` | H3, H4, subheadings |
| `--font-weight-bold` | `700` | H1, H2, display text |

### 2.4 Line Height

| CSS Variable | Value | Usage |
|---|---|---|
| `--line-height-tight` | `1.2` | Display and H1 — large type needs less leading |
| `--line-height-snug` | `1.3` | H2, H3 |
| `--line-height-normal` | `1.5` | H4, UI labels, large body |
| `--line-height-relaxed` | `1.6` | Table cells, home hero subtitle, large-body specimen — no longer sustained body copy (moved to `loose` below, 2026-09-24) |
| `--line-height-loose` | `1.8` | Body text, entry paragraphs and lists, captions and small text — the site's sustained-reading line height since 2026-09-24 |

### 2.5 Letter Spacing

| CSS Variable | Value | Usage |
|---|---|---|
| `--letter-spacing-tight` | `-0.02em` | Display and H1 at large sizes |
| `--letter-spacing-normal` | `0em` | Body text default |
| `--letter-spacing-wide` | `0.04em` | Labels, captions, tag text |
| `--letter-spacing-widest` | `0.08em` | Navigation items, tab bar labels, badges |

### 2.6 Paragraph Spacing

`--paragraph-spacing-sm/-base/-md/-lg` were removed from `:root` in the 2026-09-24 reading comfort token update — confirmed zero real CSS consumers before removal (they were documented here as governing paragraph spacing, but no rule anywhere actually applied them). Real paragraph spacing is set directly with the spacing scale instead: `.standard-page-content p` uses `margin-bottom: var(--space-6)` (24px) between consecutive paragraphs.

### 2.7 Assembled Type Styles

These are the complete text styles as they appear on the page. Every text element must use one of these styles — no mixing individual tokens arbitrarily.

| Style Name | Size | Weight | Line Height | Letter Spacing | Usage |
|---|---|---|---|---|---|
| `display` | `--font-size-5xl` | `--font-weight-bold` | `--line-height-tight` | `--letter-spacing-tight` | Hero headline, desktop only |
| `h1` | `--font-size-4xl` desktop / `--font-size-3xl` mobile | `--font-weight-bold` | `--line-height-tight` | `--letter-spacing-tight` | Page title — one per page |
| `h2` | `--font-size-2xl` | `--font-weight-bold` | `--line-height-snug` | `--letter-spacing-normal` | Section headings — centre aligned |
| `h3` | `--font-size-xl` | `--font-weight-semibold` | `--line-height-snug` | `--letter-spacing-normal` | Card titles, subsection headings |
| `h4` | `--font-size-lg` | `--font-weight-semibold` | `--line-height-normal` | `--letter-spacing-normal` | Grouped content labels |
| `body-large` | `--font-size-md` | `--font-weight-regular` | `--line-height-relaxed` | `--letter-spacing-normal` | Intro paragraphs, lead text — no live consumer as of 2026-09-24 (`.about-hero-subtitle` moved to `--font-size-lg`, see §2.2) |
| `body` | `--font-size-base` | `--font-weight-regular` | `--line-height-loose` | `--letter-spacing-normal` | Default body text |
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
- Maximum line length: `65ch` optimal (`--measure-reading`), `80ch` maximum — enforced with `max-width` on `p` elements and `.standard-page-content` body copy
- Minimum line length: `45ch` — never constrain text narrower than this

**Spacing between type elements:**
- H1 → following paragraph: `--space-6` (24px) gap
- H2 → following paragraph: `--space-4` (16px) gap
- H3 → following paragraph: `--space-3` (12px) gap
- H4 → following paragraph: `--space-2` (8px) gap
- Paragraph → following paragraph: `--space-6` (24px) — see §2.6
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

Content centred using `.standard-page` (max-width 1200px, horizontal padding). Body text constrained to `--measure-reading` (65ch, added 2026-09-24 — previously a bare `65ch` literal repeated at every consumer). Used for Work entries and Thoughts entries.

| Element | Width | Alignment |
|---|---|---|
| Banner image | Full content width | Left edge to right edge |
| Title | Full content width | Centre aligned |
| Metadata block | Auto | Centre aligned |
| Section headings | Full content width | Left aligned |
| Body text | `max-width: var(--measure-reading)` (65ch) | Left aligned |

**Exception:** `design-system.html` uses `.standard-page-content` for its real body (needed so the Floating ToC's existing heading-scan can find its section headings) but deliberately cancels the reading-width cap via a companion `.ds-page-content` class, rendering full-width up to `.standard-page`'s 1200px ceiling instead — confirmed 2026-09-06, not a bug to correct back to 65ch. See design-system.html's own Section 26 for a side-by-side of both treatments.

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

Most component tokens (`--btn-*`, `--tag-*`, `--card-*`, etc.) are scoped locally inside their own component selector in `style.css` — see the Component Token Reference table in `md/COMPONENTS.md`. The tokens below are exceptions: they're defined in the global `:root` block because they govern layout ratios/measures referenced across breakpoints, the same way `--max-content` is.

| CSS Variable | Value | Usage |
|---|---|---|
| `--card-image-column-width` | `42%` | Width of the image column in a horizontal (image-left) card layout, as a percentage of total card width |
| `--measure-reading` | `65ch` | Added 2026-09-24. Reading-column max-width — body copy, entry paragraphs/lists, the Details card, and table wrappers (see §9.3) |

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
| `--elevation-md` | `0 4px 12px rgba(0,0,0,0.5)` | Cards, dropdowns, tooltips, the floating rail controls (Filters pill and Clear ×) |
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

Applied to all `p` elements and long-form text containers, via `--measure-reading` (added 2026-09-24; previously a bare `65ch` literal repeated at every consumer).

| Constraint | Value | Standard |
|---|---|---|
| Minimum | `45ch` | Below this reading feels choppy |
| Optimal | `65ch` (`--measure-reading`) | WCAG 1.4.8 recommended |
| Maximum | `80ch` | Beyond this eye tracking suffers |

```css
p {
    max-width: var(--measure-reading);
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

### 9.5 Hover Patterns

**Zero-shift hover border.** When a hover adds or thickens a border, draw it as an `outline` with a negative `outline-offset` over a border already reserved at rest — never by widening `border-width`, which would move the box and everything around it. The in-body image trigger (`.image-zoom-trigger`) reserves a 1px transparent border and, on hover, adds `outline: var(--border-width-medium) solid var(--color-accent-primary-text)` with `outline-offset: calc(-1 * var(--border-width-thin))`: a 2px band that starts at the reserved border's inner edge and grows outward. Scope it `:hover:not(:focus-visible)` so a keyboard-focused element keeps the sitewide focus ring (§9.1) instead of a competing hover outline.

**Hover-revealed decoration needs a touch fallback.** Anything shown only on hover — the expand icon plate on inline images, `.image-zoom-trigger-icon` — must also show on `:focus-visible`, and must be always visible under `@media (hover: none)`. Touch devices have no hover, so decoration hidden until hover would never appear there. Fade it with `--duration-*` / `--ease-*` tokens; the sitewide reduced-motion rule (§8.3) covers the fade.

**Hover fills stay out of touch.** Hover fills go inside `@media (hover: hover)` so a tap never leaves a stuck hover state (`.btn:hover` and `.btn--danger-hover:hover` both follow this); press feedback on `:active` stays outside the query so touch still gets it. A disabled control gets neither (`:not(:disabled)` on the danger rules).

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

