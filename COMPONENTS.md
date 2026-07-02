# Design System — Component Specifications
**Version:** 1.0.0
**Last Updated:** 2026-07-01
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
- Never invent values — if a value is not in this document or DESIGN-SYSTEM.md, raise it as a question before proceeding

---

## Component Index

1. Button
2. Tag
3. Card — Work
4. Card — Thought (Featured)
5. Card — Thought (Compact)
6. Navigation — Desktop
7. Navigation — Mobile Tab Bar
8. Profile Sidebar
9. Tooltip
10. Toast Notification
11. Breadcrumb
12. Divider
13. Blockquote
14. Code Block
15. Back to Top Button
16. Share Button

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
| Icon + Label | `.btn--icon` | Button with a Tabler icon left of label |

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
- Optional icon: `<i class="ti ti-{name}" aria-hidden="true"></i>`
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
**HTML Element:** `<span class="tag">`

### Design Intent
Tags communicate category or classification. They are always decorative — they support the content but are not required to understand it. Screen readers can skip them when `aria-hidden="true"` is applied.

### When to Use
- Categorising Work entries and Thoughts entries
- Displaying skill labels in the Profile sidebar

### When NOT to Use
- As interactive filters (that is a different component — Tag Filter, not yet built)
- As status indicators (use a different pattern)

### Variants

| Variant | Class | Background | Usage |
|---|---|---|---|
| Primary | `.tag` | `--color-tag-primary` (gold) | Main category, discipline, primary label |
| Secondary | `.tag--secondary` | `--color-tag-secondary` (pink) | Secondary category, sub-label |

### Component Tokens

```css
--tag-bg:               var(--color-tag-primary);
--tag-text:             var(--color-tag-text);
--tag-padding-x:        var(--space-3);
--tag-padding-y:        var(--space-1);
--tag-font-size:        var(--font-size-sm);
--tag-font-weight:      var(--font-weight-medium);
--tag-letter-spacing:   var(--letter-spacing-wide);
--tag-radius:           var(--border-radius-full);
--tag-line-height:      var(--line-height-normal);

/* Secondary variant override */
--tag-secondary-bg:     var(--color-tag-secondary);
```

### Anatomy

```
[ Label text ]
```

- Container: `<span class="tag">` or `<span class="tag tag--secondary">`
- No icons inside tags
- No interactive states — tags are not clickable in this version

### States

Tags have no interactive states in this version. They are static display elements.

### Accessibility

- Decorative tags: `aria-hidden="true"` — screen reader skips entirely
- Meaningful tags (when the category is required context): `aria-label="Category: {label}"`
- Default for this site: `aria-hidden="true"` on all tags — heading text carries the content meaning

### Responsive Behaviour

- Same size at all breakpoints
- Tags wrap to new line when they exceed container width — never truncate
- Gap between tags: `var(--space-2)`

---

## 3. Card — Work

**Figma Component Name:** `Card/Work`
**CSS Class:** `.card`
**HTML Element:** `<article class="card">`

### Design Intent
Work cards showcase portfolio projects. The entire card is clickable via the block link pattern — the heading link expands to cover the full card using a CSS `::after` pseudo-element. The image is atmospheric and decorative — it sets the visual tone but the heading carries all the meaning.

### When to Use
- Displaying a portfolio project in the Featured Work section on Home
- Displaying all projects on the Work index page

### Component Tokens

```css
--card-bg:              var(--color-background-surface);
--card-border:          var(--color-border-default);
--card-border-hover:    var(--color-border-strong);
--card-radius:          var(--border-radius-md);
--card-padding:         var(--space-6);
--card-image-bg:        var(--color-background-subtle);
--card-image-ratio:     16 / 9;
--card-gap:             var(--space-4);
--card-transition:      var(--duration-base) var(--ease-out);

/* Card CTA button — inherits from Button component */
--card-cta-bg:          var(--btn-bg);
--card-cta-border:      var(--btn-border);
--card-cta-text:        var(--btn-text);
--card-cta-radius:      var(--btn-radius);
--card-cta-padding-x:   var(--btn-padding-x);
--card-cta-padding-y:   var(--btn-padding-y);
```

### Anatomy

```
[ .card-image ]
[ .card-content ]
  [ h3 > .card-link ]
  [ .tag ] [ .tag--secondary ]
  [ p description ]
  [ .card-cta ]
```

- Container: `<article class="card">`
- Image: `<div class="card-image">` — CSS background-image, not `<img>`
- Content wrapper: `<div class="card-content">`
- Heading: `<h3><a href="{url}" class="card-link">{Title}<span class="sr-only"> — view this project</span></a></h3>`
- Tags: `<span class="tag" aria-hidden="true">`
- Description: `<p>`
- CTA: `<button class="card-cta">Read about this piece of work</button>` — decorative, the card-link is the real interactive element

### Block Link Pattern

The `::after` pseudo-element on `.card-link` expands to cover the entire card, making every pixel clickable while keeping the semantic link on the heading:

```css
.card {
    position: relative;
}
.card-link::after {
    content: '';
    position: absolute;
    inset: 0;
}
```

### States

| State | Card Border | Card Background | Transition |
|---|---|---|---|
| Default | `--card-border` | `--card-bg` | — |
| Hover | `--card-border-hover` | `--card-bg` | `--card-transition` |
| Focus (keyboard) | Focus ring on `.card-link` | `--card-bg` | Focus ring appears |

### Accessibility

- `<article>` element announces as a landmark to screen readers
- `.card-link` is the only interactive element — `.card-cta` is decorative and `aria-hidden="true"`
- Screen reader output: "Article. {Title} — view this project. Link. Heading level 3."
- Image: CSS background — no alt text needed
- Tags: `aria-hidden="true"`

### Responsive Behaviour

- Desktop: constrained to centre column width, full width within that column
- Mobile: full width, single column stack
- Image ratio maintained at 16:9 at all sizes

---

## 4. Card — Thought (Featured)

**Figma Component Name:** `Card/Thought/Featured`
**CSS Class:** `.card .card--thought .card--featured`
**HTML Element:** `<article class="card card--thought card--featured">`

### Design Intent
The featured thought card gives visual weight to the most recent post. Full-width image at top, then full content below. Used as the first entry in the Thoughts section on Home and the first entry on the Thoughts index page.

### Component Tokens

Inherits all `.card` tokens plus:

```css
--card-thought-image-ratio:     16 / 9;
--card-thought-summary-lines:   3;
--card-thought-meta-color:      var(--color-text-secondary);
--card-thought-meta-size:       var(--font-size-sm);
```

### Anatomy

```
[ .card-image full width ]
[ .card-content ]
  [ h3 > .card-link ]
  [ p summary — max 3 lines ]
  [ .tag ] [ .tag--secondary ]
  [ .card-meta: Published {date} · {author} ]
  [ .card-cta ]
```

CTA label: "Read this thought" with `.sr-only` context: `<span class="sr-only">: {Title}</span>`

### Accessibility

Screen reader output: "Article. {Title}: Read this thought. Link. Heading level 3."

---

## 5. Card — Thought (Compact)

**Figma Component Name:** `Card/Thought/Compact`
**CSS Class:** `.card .card--thought .card--compact`
**HTML Element:** `<article class="card card--thought card--compact">`

### Design Intent
Compact thought cards show secondary recent entries. Thumbnail image left, content right. Used as the second and third entries in the Thoughts section on Home.

### Component Tokens

Inherits all `.card` tokens plus:

```css
--card-compact-image-size:      80px;
--card-compact-image-radius:    var(--border-radius-sm);
--card-compact-gap:             var(--space-4);
--card-compact-layout:          grid;
--card-compact-columns:         80px 1fr;
```

### Anatomy

```
[ .card-image 80×80px ] [ .card-content ]
                           [ h3 > .card-link ]
                           [ .tag ]
                           [ .card-meta: date · author ]
                           [ .card-cta ]
```

Image is fixed `80px × 80px`, aspect ratio 1:1, `border-radius: var(--card-compact-image-radius)`.

### Responsive Behaviour

- Desktop and tablet: two-column grid layout (image left, content right)
- Mobile: stacks to single column — image full width on top, content below

---

## 6. Navigation — Desktop

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
[ .nav-logo "Chris Klein" centred ]
[ .nav-links centred below logo ]
  [ a Home ] [ a Work ] [ a Thoughts ] [ a About ]
```

- Container: `<nav class="site-nav" aria-label="Main navigation">`
- Logo: `<a href="index.html" class="nav-logo">Chris Klein</a>` — centred, `--nav-logo-size`, `--nav-logo-weight`
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

## 7. Navigation — Mobile Tab Bar

**Figma Component Name:** `Nav/TabBar`
**CSS Class:** `.tab-bar`
**HTML Element:** `<nav class="tab-bar" aria-label="Mobile navigation">`

### Design Intent
The tab bar replaces the desktop nav entirely on mobile. It is always visible at the bottom of the viewport — close to the thumb — giving users constant access to all four primary sections without scrolling. Icon and text label always shown together. Never icon only.

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

### Anatomy

```
[ .tab-bar-item ] [ .tab-bar-item ] [ .tab-bar-item ] [ .tab-bar-item ]
  [ icon ]          [ icon ]          [ icon ]          [ icon ]
  [ Home ]          [ Work ]          [ Thoughts ]      [ About ]
```

Items and their Tabler icons:
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

- Mobile: visible — `position: fixed`, `bottom: 0`
- Desktop: hidden via `display: none`
- Body requires `padding-bottom: 80px` on mobile to prevent content being obscured

---

## 8. Profile Sidebar

**Figma Component Name:** `Profile/Sidebar`
**CSS Class:** `.profile-sidebar`
**HTML Element:** `<aside class="profile-sidebar">`

### Design Intent
The profile sidebar gives visitors an immediate, human sense of who this site belongs to. It combines a personality illustration, a greeting, skill tags, a short bio, and contact actions. On desktop it stays sticky so it remains visible as the user scrolls through the work cards.

### Component Tokens

```css
--sidebar-bg:               var(--color-background-surface);
--sidebar-border:           var(--color-border-default);
--sidebar-radius:           var(--border-radius-md);
--sidebar-padding:          var(--space-6);
--sidebar-gap:              var(--space-4);
--sidebar-image-radius:     var(--border-radius-md);
--sidebar-sticky-top:       80px;
--sidebar-caption-size:     var(--font-size-xs);
--sidebar-caption-color:    var(--color-text-secondary);
--sidebar-name-size:        var(--font-size-2xl);
--sidebar-name-weight:      var(--font-weight-bold);
--sidebar-bio-size:         var(--font-size-sm);
--sidebar-bio-color:        var(--color-text-secondary);
```

### Anatomy

```
[ .sidebar-image — illustration ]
[ .sidebar-caption — attribution text ]
[ h2 .sidebar-name — "Hello, my name is Chris" ]
[ .tag ] [ .tag--secondary ]
[ p .sidebar-bio × 2 paragraphs ]
[ .btn — "Connect on LinkedIn" ]
[ .btn--ghost — "Send me an Email" ]
[ a .sidebar-more — "Read More about Chris" ]
```

- Image: `<img src="assets/images/C-Rex-by-Bob-Nelson-2017.png" alt="" aria-hidden="true" width="300" height="300">`
- Caption: `<p class="sidebar-caption">A small illustrated dinosaur, because why not. Illustration by Bob Nelson.</p>`
- Name: `<h2 class="sidebar-name">Hello, my name is Chris</h2>`
- More link: `<a href="about.html" class="sidebar-more">Read More about Chris<span class="sr-only"> on the About page</span></a>`

### States

- Sticky on desktop: `position: sticky; top: var(--sidebar-sticky-top);`
- Not sticky on mobile: `position: static`

### Accessibility

- `<aside>` element announces as a complementary landmark
- Illustration: `alt=""` and `aria-hidden="true"` — decorative
- "Read More about Chris" link has `.sr-only` context: "on the About page"

### Responsive Behaviour

- Desktop: sticky, left column, `280px` width
- Mobile: static, full width, appears first in page order above Featured Work

---

## 9. Tooltip

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

## 10. Toast Notification

**Figma Component Name:** `Toast`
**CSS Class:** `.toast`
**HTML Element:** `<div role="status" aria-live="polite" class="toast">`

### Design Intent
The toast notification provides brief confirmation that an action was completed. Currently used for the Share button copy-to-clipboard action. It appears near the trigger, stays visible for approximately 2 seconds, then fades out automatically. It never requires user dismissal.

### Component Tokens

```css
--toast-bg:                 var(--color-background-surface);
--toast-border:             var(--color-accent-gold);
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
[ .toast ]
  [ icon ] [ "Link copied!" ]
```

- Container: `<div role="status" aria-live="polite" class="toast">`
- Icon: `<i class="ti ti-check" aria-hidden="true"></i>`
- Text: "Link copied!"

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

## 11. Breadcrumb

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
[ Work ] [ › ] [ Month/Year ] [ › ] [ Page Title ]
```

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
- Screen reader output: "Breadcrumb navigation. Work, link. Month/Year, link. Page Title, current page."

### Responsive Behaviour

- Same at all breakpoints
- Wraps to new line if title is long — never truncates

---

## 12. Divider

**Figma Component Name:** `Divider`
**CSS Class:** `hr` (native element, no custom class needed)
**HTML Element:** `<hr>`

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
<hr>
```

No additional classes or attributes needed. Styled globally via the `hr` element selector.

### Accessibility

`<hr>` has an implicit `role="separator"` — screen readers announce it as a thematic break between content sections. No additional ARIA needed.

---

## 13. Blockquote

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

## 14. Code Block

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
--code-text-color:      var(--color-accent-gold-text);
--code-font-family:     'Courier New', Courier, monospace;
--code-font-size:       var(--font-size-sm);
--code-padding-inline:  var(--space-2) var(--space-3);
--code-radius:          var(--border-radius-sm);
--code-block-padding:   var(--space-4) var(--space-5);
--code-block-margin:    var(--space-6) 0;
```

### Anatomy

Inline: `<code>{snippet}</code>`

Block:
```html
<pre><code>{multiline code}</code></pre>
```

---

## 15. Back to Top Button

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

### Anatomy

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
- Mobile: centred above bottom tab bar — ensure it clears the tab bar height

---

## 16. Share Button

**Figma Component Name:** `ShareButton`
**CSS Class:** `.share-btn`
**HTML Element:** `<button class="share-btn" aria-label="Copy link to clipboard">`

### Design Intent
The Share button allows users to copy the current page URL to their clipboard. It appears in the metadata block on all standard pages, both at the top below the title and repeated at the bottom of the content. On click, it triggers the Toast notification confirming the copy action.

### Component Tokens

Inherits from Button component tokens plus:

```css
--share-btn-icon-size:  16px;
```

### Anatomy

```
[ .share-btn ]
  [ icon ti-share ] [ "Share" ]
```

- Button: `<button class="share-btn" aria-label="Copy link to clipboard">`
- Icon: `<i class="ti ti-share" aria-hidden="true"></i>`
- Label: `<span>Share</span>`

### Interaction Spec

1. User clicks `.share-btn`
2. `navigator.clipboard.writeText(window.location.href)` copies the URL
3. Toast notification appears: "Link copied!"
4. Toast auto-dismisses after 2000ms

### Accessibility

- `aria-label="Copy link to clipboard"` — more descriptive than "Share" alone
- After successful copy: `aria-label` temporarily updates to "Link copied!" for 2 seconds, then reverts
- Toast uses `aria-live="polite"` to announce to screen readers

### Responsive Behaviour

Same at all breakpoints.

---

## Component Token Reference

Quick reference mapping every component token to its semantic source.

| Component Token | Semantic Token | Raw Value |
|---|---|---|
| `--btn-bg` | `--color-background-subtle` | `#2A2A2A` |
| `--btn-border` | `--color-border-strong` | `#666666` |
| `--btn-text` | `--color-text-primary` | `#F5F5F5` |
| `--card-bg` | `--color-background-surface` | `#1A1A1A` |
| `--card-border` | `--color-border-default` | `#2A2A2A` |
| `--card-image-bg` | `--color-background-subtle` | `#2A2A2A` |
| `--tag-bg` | `--color-tag-primary` → `--color-accent-gold` | `#BA8200` |
| `--tag-secondary-bg` | `--color-tag-secondary` → `--color-accent-pink` | `#A9407C` |
| `--tag-text` | `--color-tag-text` → `--color-text-primary` | `#F5F5F5` |
| `--nav-bg` | `--color-background-base` | `#111111` |
| `--nav-link-color` | `--color-text-secondary` | `#AAAAAA` |
| `--nav-link-active` | `--color-text-primary` | `#F5F5F5` |
| `--tab-bar-bg` | `--color-background-surface` | `#1A1A1A` |
| `--tab-bar-item-color` | `--color-text-secondary` | `#AAAAAA` |
| `--tab-bar-item-active` | `--color-interactive-default` | `#F5F5F5` |
| `--tooltip-bg` | `--color-tooltip-bg` → `--color-background-surface` | `#1A1A1A` |
| `--tooltip-border` | `--color-tooltip-border` → `--color-accent-gold` | `#BA8200` |
| `--toast-border` | `--color-accent-gold` | `#BA8200` |
| `--blockquote-border-color` | `--color-quote-border` → `--color-accent-pink` | `#A9407C` |
| `--code-border-color` | `--color-code-border` → `--color-accent-gold` | `#BA8200` |
| `--divider-color` | `--color-divider-accent` → `--color-accent-gold` | `#BA8200` |

