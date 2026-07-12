# Design System — Component Specifications
**Version:** 2.0.0
**Last Updated:** 2026-07-08
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
- Displaying skill labels in the Profile card

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
--tag-bg-hover:         color-mix(in srgb, var(--color-tag-primary) 80%, black);
--tag-text:             var(--color-tag-text);
--tag-padding-x:        var(--space-3);
--tag-padding-y:        var(--space-1);
--tag-font-size:        var(--font-size-sm);
--tag-font-weight:      var(--font-weight-medium);
--tag-letter-spacing:   var(--letter-spacing-wide);
--tag-radius:           var(--border-radius-sm);
--tag-line-height:      var(--line-height-normal);

/* Secondary variant overrides */
--tag-secondary-bg:       var(--color-tag-secondary);
--tag-secondary-bg-hover: color-mix(in srgb, var(--color-tag-secondary) 80%, black);
```

### Anatomy

```
[ Label text ]
```

- Container: `<span class="tag">` or `<span class="tag tag--secondary">`
- No icons inside tags
- No interactive states — tags are not clickable in this version

### States

| State | Background | Notes |
|---|---|---|
| Default | `--tag-bg` | — |
| Hover | `--tag-bg-hover` | Decorative — tags are not interactive, but hover is styled for visual polish |

### Accessibility

- Decorative tags: `aria-hidden="true"` — screen reader skips entirely
- Meaningful tags (when the category is required context): `aria-label="Category: {label}"`
- Default for this site: `aria-hidden="true"` on all tags — heading text carries the content meaning

### Responsive Behaviour

- Same size at all breakpoints
- Tags wrap to new line when they exceed container width — never truncate
- Gap between tags: `var(--space-2)`

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
| Profile | `.card--profile` | `Style=Profile` | Profile card in left column on Home page |

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
--card-border-hover:    var(--color-border-strong);
--card-radius:          var(--border-radius-md);
--card-padding:         var(--space-6);
--card-image-bg:        var(--color-background-subtle);
--card-image-ratio:     16 / 9;
--card-gap:             var(--space-4);
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

### States

| State | Card Border | Card Background | Transition |
|---|---|---|---|
| Default | `--card-border` | `--card-bg` | — |
| Hover | `--card-border-hover` | `--card-bg` | `--card-transition` |
| Focus (keyboard) | Focus ring on `.card-cta` | `--card-bg` | Focus ring appears |

---

### Variant: Feature (Card/Feature)

**CSS Class:** `.card.card--feature`
**Usage:** Work / portfolio cards

#### Anatomy

```
[ .card-block-link — empty, aria-hidden, tabindex=-1 ]
[ .card-image — 16:9 decorative background ]
[ .card-content ]
  [ h3.card-title ]
  [ .card-tags ]
    [ .tag ] [ .tag--secondary ]
  [ p description ]
  [ a.card-cta ]
```

```html
<article class="card card--feature">
    <a href="{url}" class="card-block-link" aria-hidden="true" tabindex="-1"></a>
    <div class="card-image" role="presentation"></div>
    <div class="card-content">
        <h3 class="card-title">{Title}</h3>
        <div class="card-tags">
            <span class="tag" aria-hidden="true">{Tag}</span>
        </div>
        <p>{Description}</p>
        <a href="{url}" class="card-cta" aria-label="{Title} — view this project">View</a>
    </div>
</article>
```

#### Accessibility

- `<article>` announces as a landmark to screen readers
- `.card-block-link` is `aria-hidden="true"` and `tabindex="-1"` — skipped entirely by keyboard and AT
- `.card-cta` is the sole focusable element — carries full `aria-label`
- Screen reader output: "Article. View. Link." (with aria-label: "{Title} — view this project")
- Image: CSS background — no alt text needed
- Tags: `aria-hidden="true"`

---

### Variant: Thought (Card/Thought)

**CSS Class:** `.card.card--thought`
**Usage:** Blog / writing entries. No thumbnail image — content only.

#### Anatomy

```
[ .card-block-link — empty, aria-hidden, tabindex=-1 ]
[ .card-content ]
  [ h3.card-title ]
  [ p summary ]
  [ .card-tags ]
    [ .tag ] [ .tag--secondary ]
  [ p.card-meta — Published {date} · {author} ]
  [ a.card-cta ]
```

```html
<article class="card card--thought">
    <a href="{url}" class="card-block-link" aria-hidden="true" tabindex="-1"></a>
    <div class="card-content">
        <h3 class="card-title">{Title}</h3>
        <p>{Summary — max 3 lines}</p>
        <div class="card-tags">
            <span class="tag" aria-hidden="true">{Tag}</span>
        </div>
        <p class="card-meta">Published {date} · {author}</p>
        <a href="{url}" class="card-cta" aria-label="{Title} — read this thought">Read</a>
    </div>
</article>
```

#### Accessibility

- `.card-cta` `aria-label` action: "read this thought"
- Screen reader output: "Article. Read. Link." (with aria-label: "{Title} — read this thought")

---

### Variant: Profile (Card/Profile)

**CSS Class:** `.card.card--profile`
**Usage:** Profile card in the left column of the Home page. Desktop: sticky. Mobile: static, appears first in source order.

The Profile variant does not use the block link / CTA pattern. It has multiple action buttons (LinkedIn, About) and is not a single-destination card.

#### Anatomy

```
[ .card-image — illustration, full width ]
[ p.card-image-caption ]
[ .card-content ]
  [ h2.card-profile-name ]
  [ .card-tags ]
    [ .tag ] [ .tag--secondary ]
  [ p bio ]
  [ .card-profile-actions ]
    [ a.btn — LinkedIn ]
    [ a.btn--ghost — About ]
```

```html
<article class="card card--profile">
    <div class="card-image">
        <img src="assets/images/C-Rex-by-Bob-Nelson-2017.png" alt="" aria-hidden="true" width="300" height="300" loading="lazy">
    </div>
    <p class="card-image-caption">{Caption}</p>
    <div class="card-content">
        <h2 class="card-profile-name">{Name}</h2>
        <div class="card-tags">
            <span class="tag" aria-hidden="true">{Skill}</span>
            <span class="tag tag--secondary" aria-hidden="true">{Skill}</span>
        </div>
        <p>{Bio}</p>
        <div class="card-profile-actions">
            <a href="{linkedin-url}" class="btn">Connect on LinkedIn</a>
            <a href="about.html" class="btn btn--ghost">Read More about Chris<span class="sr-only"> on the About page</span></a>
        </div>
    </div>
</article>
```

#### Component Tokens (Profile-specific)

```css
--card-profile-name-size:       var(--font-size-2xl);
--card-profile-name-weight:     var(--font-weight-bold);
--card-profile-caption-size:    var(--font-size-xs);
--card-profile-caption-color:   var(--color-text-secondary);
--card-profile-sticky-top:      80px;
```

#### States

- Desktop: `position: sticky; top: var(--card-profile-sticky-top)`
- Mobile: `position: static`

#### Accessibility

- `<article>` announces as a landmark
- Illustration: `alt=""` and `aria-hidden="true"` — decorative
- "Read More about Chris" has `.sr-only` context: "on the About page"
- LinkedIn button is a standard `<a>` — opens in same tab by default

#### Responsive Behaviour

| Breakpoint | Layout | Image Column | Content Column |
|---|---|---|---|
| Desktop 1024px+ | Two column — Auto left, Fill right | 348px auto width, full height, object-fit cover | Fills remaining space, 24px padding, flex column |
| Tablet 768px–1023px | Two column — Auto left, Fill right | 220px auto width, full height, object-fit cover | Fills remaining space, 20px padding, flex column |
| Mobile below 768px | Single column stacked | Max 300px, centred, 16px top padding | Full width below image |

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

## 5. Navigation — Mobile Tab Bar

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

- Mobile: visible — `position: fixed`, `bottom: 0`
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
  [ icon ] [ "URL copied to clipboard!" ]
```

- Container: `<div role="status" aria-live="polite" class="toast">`
- Icon: `<i class="ti ti-check" aria-hidden="true"></i>`
- Text: "URL copied to clipboard!"

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

## 9. Divider

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
- Mobile: centred above bottom tab bar — ensure it clears the tab bar height

---

## 13. Share Button

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
**HTML File:** `standard-page.html`
**Used for:** Individual Work entries and Thoughts entries (blog posts, project writeups)

### Design Intent
The standard page template provides a consistent reading experience for all long-form content. It is single column, centred, and optimised for sustained reading. The metadata block identifies authorship and allows sharing. The Previous / Next navigation at the bottom keeps users moving through content.

### Anatomy

```
[ nav.breadcrumb ]
[ .standard-page-banner — 3:1 ratio, full width ]
[ p.standard-page-caption ]
[ h1.standard-page-title — centre aligned ]
[ .standard-page-meta ]
  [ .standard-page-meta-author ]
  [ .standard-page-meta-dates ]
  [ .standard-page-meta-tags ]
  [ button.share-btn ]
[ hr.standard-page-divider — max-width 65ch, centred ]
[ .standard-page-content ]
  [ h2 headings, h3 subheadings, p body text ]
  [ blockquote, code blocks as needed ]
[ hr.standard-page-divider — max-width 65ch, centred ]
[ nav.standard-page-nav ]
  [ a.standard-page-nav-prev.btn.btn--ghost — ← Previous + title ]
  [ a.standard-page-nav-next.btn.btn--ghost — Next + title → ]
[ .back-to-top-row > button.back-to-top ]
```

### Notes

- **Bottom tags and share button removed.** Tags and share are in the top metadata only — not repeated at the bottom.
- **Gold divider** (`hr.standard-page-divider`) is constrained to `max-width: 65ch` and centred, matching the content width. It appears both above and below the content.
- **Previous / Next navigation** uses `.btn.btn--ghost` with direction label (`Previous` / `Next`) and article title stacked vertically inside `.standard-page-nav-label`. Arrow characters (`←` / `→`) are `aria-hidden="true"`.
- Navigation stacks to single column at mobile (≤767px).

### Previous / Next Navigation Anatomy

```html
<nav class="standard-page-nav" aria-label="Article navigation">
    <a href="{prev-url}" class="standard-page-nav-prev btn btn--ghost">
        <span aria-hidden="true">←</span>
        <span class="standard-page-nav-label">
            <span class="standard-page-nav-direction">Previous</span>
            <span class="standard-page-nav-title">{Previous Article Title}</span>
        </span>
    </a>
    <a href="{next-url}" class="standard-page-nav-next btn btn--ghost">
        <span class="standard-page-nav-label">
            <span class="standard-page-nav-direction">Next</span>
            <span class="standard-page-nav-title">{Next Article Title}</span>
        </span>
        <span aria-hidden="true">→</span>
    </a>
</nav>
```

### Accessibility

- `<nav aria-label="Article navigation">` distinguishes this nav from the main site nav and breadcrumb
- Arrow characters are `aria-hidden="true"` — direction labels carry the semantic meaning
- Each link has a descriptive visible label (direction + title)
- Toast notification on share uses `aria-live="polite"` and temporary `aria-label` update on the button

### Responsive Behaviour

| Breakpoint | Layout |
|---|---|
| Desktop (≥1024px) | Two-column nav, Previous left, Next right |
| Tablet (768–1023px) | Two-column nav (collapses if titles are long) |
| Mobile (<768px) | Single column, full-width buttons stacked |

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
| `--card-radius` | `--border-radius-md` | `8px` |
| `--card-image-bg` | `--color-background-subtle` | `#2A2A2A` |
| `--card-block-link-z` | — | `1` |
| `--card-cta-z` | — | `2` |
| `--tag-bg` | `--color-tag-primary` → `--color-accent-gold` | `#BA8200` |
| `--tag-bg-hover` | `color-mix(in srgb, --color-tag-primary 80%, black)` | ~`#945E00` |
| `--tag-secondary-bg` | `--color-tag-secondary` → `--color-accent-pink` | `#A9407C` |
| `--tag-secondary-bg-hover` | `color-mix(in srgb, --color-tag-secondary 80%, black)` | ~`#873363` |
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

---

## Next Claude Code Fix List

Tracked fixes and enhancements queued for future Claude Code sessions.

| # | Item | Status |
|---|---|---|
| 6 | Remove Tabler Icons CDN from all pages, remove all icon elements, text-only tab bar and back to top button, update any CSS that sizes or positions icons | ✅ Done 2026-07-05 |
