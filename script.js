// Inject shared components, then wire up behaviour that depends on them
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('nav-placeholder', '/nav.html', () => {
        initNav();
        setActiveNavLink();
        // Deferred until nav.html is actually injected: the sticky header
        // it contains is what scroll-margin-top clears, and initTocRail()
        // both measures heading positions and (if the URL loaded with a
        // #hash) re-corrects the browser's native fragment scroll, which
        // fires before this fetch resolves and so lands short of real
        // clearance — confirmed via direct measurement, not assumed.
        initTocRail();
    });
    loadComponent('footer-placeholder', '/footer.html');
    setActiveTabBar();
    initBackToTop();
    initShareButtons();
    const filterDrawer = initFilterDrawer();
    initArchive(filterDrawer);
    // initThemeToggle(); // dormant — toggle UI disabled pending Action Rail
});

function loadComponent(placeholderId, file, callback) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return;

    fetch(file)
        .then(response => response.text())
        .then(html => {
            placeholder.innerHTML = html;
            if (callback) callback();
        })
        .catch(error => console.error(`Error loading ${file}:`, error));
}

// Mobile nav toggle — guarded since hamburger is hidden on mobile (tab bar replaces it)
function initNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-links');
    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
        const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isOpen);
        navMenu.classList.toggle('is-open');
        navToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('is-open');
            navToggle.setAttribute('aria-label', 'Open navigation menu');
        });
    });
}

// Set aria-current="page" on the injected desktop nav link matching the current page
function setActiveNavLink() {
    const currentPath = window.location.pathname + window.location.search;
    const normalizedPath = currentPath === '/' ? '/index.html' : currentPath;

    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === normalizedPath) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

// Set aria-current="page" on the static tab bar item matching the current page
function setActiveTabBar() {
    const currentPath = window.location.pathname + window.location.search;
    const normalizedPath = currentPath === '/' ? '/index.html' : currentPath;

    document.querySelectorAll('.tab-bar-item').forEach(item => {
        if (item.getAttribute('href') === normalizedPath) {
            item.setAttribute('aria-current', 'page');
        } else {
            item.removeAttribute('aria-current');
        }
    });
}

// Creates the floating rail button, wires theme toggle, persists to localStorage
function initThemeToggle() {
    const btn = document.createElement('button');
    btn.id = 'theme-toggle';
    btn.className = 'theme-toggle-rail';
    btn.type = 'button';
    btn.textContent = '◑';
    document.body.appendChild(btn);
    btn.classList.add('theme-toggle-rail--visible');

    function syncButton() {
        const isTeal = document.documentElement.getAttribute('data-theme') === 'teal';
        btn.setAttribute('aria-label', isTeal ? 'Switch to gold theme' : 'Switch to teal theme');
    }

    syncButton();

    btn.addEventListener('click', () => {
        const isTeal = document.documentElement.getAttribute('data-theme') === 'teal';
        if (isTeal) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.removeItem('theme');
        } else {
            document.documentElement.setAttribute('data-theme', 'teal');
            localStorage.setItem('theme', 'teal');
        }
        syncButton();
    });
}

// Dismiss any visible tooltip when Escape is pressed
document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;

    const openTooltip = document.querySelector('.tooltip-wrapper:focus-within');
    if (openTooltip) {
        document.activeElement.blur();
    }
});

// Share button — copies current page URL to clipboard, shows toast confirmation
function initShareButtons() {
    const buttons = document.querySelectorAll('.share-btn');
    const toast = document.querySelector('.toast');
    if (!buttons.length) return;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                const originalLabel = button.getAttribute('aria-label');
                button.setAttribute('aria-label', 'URL copied to clipboard!');

                if (toast) {
                    toast.classList.add('toast--visible');
                }

                setTimeout(() => {
                    button.setAttribute('aria-label', originalLabel);
                    if (toast) {
                        toast.classList.remove('toast--visible');
                    }
                }, 2000);
            }).catch(() => {
                // Clipboard write failed silently — no fallback needed
            });
        });
    });
}

// Back to Top button
function initBackToTop() {
    const button = document.querySelector('.back-to-top');
    if (!button) return;

    window.addEventListener('scroll', () => {
        button.classList.toggle('back-to-top--visible', window.scrollY > 400);
    });

    button.addEventListener('click', () => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
}

// Matches the NEW-ENTRY-PROCESS.md heading-id convention exactly (strip
// punctuation first, then collapse whitespace/hyphen runs to one hyphen) —
// not the local slugify() inside initArchive below, which is tag-specific
// and produces doubled hyphens on input like "Research & Discovery".
function slugifyHeading(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/[\s-]+/g, '-');
}

// Walks .standard-page-content's H2/H3s in document order and assigns a
// generated id to any heading that doesn't already have one (every entry
// today is hand-authored per NEW-ENTRY-PROCESS.md, so this is a safety net
// for future entries, not something that changes current pages). Existing
// ids — hand-authored or already generated — are never overwritten, and
// collisions get a numeric suffix. Returns the full heading list so
// initTocRail() doesn't need to re-discover it.
function getTocHeadings() {
    const content = document.querySelector('.standard-page-content');
    if (!content) return [];

    const headings = Array.from(content.querySelectorAll('h2, h3'));
    const usedIds = new Set(headings.filter(h => h.id).map(h => h.id));

    headings.forEach(heading => {
        if (heading.id) return;
        const base = slugifyHeading(heading.textContent) || 'section';
        let id = base;
        let suffix = 2;
        while (usedIds.has(id)) {
            id = `${base}-${suffix}`;
            suffix++;
        }
        heading.id = id;
        usedIds.add(id);
    });

    return headings;
}

// Builds one <li><a class="toc-rail-link"> per heading into `container`,
// H3s getting the --sub indent modifier. Shared by the desktop rail and
// the <1024px panel so the two never carry two different copies of this
// markup-building logic — only their outer containers differ.
function buildTocLinks(headings, container) {
    return headings.map(heading => {
        const item = document.createElement('li');
        if (heading.tagName === 'H3') item.className = 'toc-rail-item--sub';

        const link = document.createElement('a');
        link.className = 'toc-rail-link';
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;

        item.appendChild(link);
        container.appendChild(item);
        return link;
    });
}

// Desktop rail (CSS shows it only at >=1024px) plus the <1024px trigger +
// anchored panel (Prompt B) — built together from one shared heading list
// and one shared scrollspy pass, so current-heading tracking never runs
// twice or drifts between the two surfaces. Nothing here is gated behind
// viewport width in JS: both surfaces are always built and scrollspy
// always runs; CSS alone decides which surface is actually visible at a
// given width (mirror-image display:none/block pairs — see style.css),
// so the position badge can read live state even when the rail itself is
// hidden. Inserted right after the skip link so both are reachable early
// in tab order, not after the whole page's content.
function initTocRail() {
    const headings = getTocHeadings();
    if (!headings.length) return;

    const main = document.getElementById('main-content');

    // --- Desktop rail (>=1024px) ---------------------------------------
    const rail = document.createElement('nav');
    rail.className = 'toc-rail';
    rail.setAttribute('aria-label', 'Table of contents');

    const railList = document.createElement('ul');
    railList.className = 'toc-rail-list';
    const railLinks = buildTocLinks(headings, railList);
    rail.appendChild(railList);
    document.body.insertBefore(rail, main);

    // Anchors the rail's fixed top offset to .standard-page-banner's real
    // bottom edge, not the page's fixed chrome. The banner's rendered
    // height comes from its aspect-ratio and the viewport width alone —
    // nothing below it (Details card row count, tag wrapping) affects it —
    // so this position is identical across entries at a given width,
    // unlike a heading-based anchor: confirmed via direct measurement, a
    // 4-row Work entry and a short Thoughts entry land on the exact same
    // pixel at every tested width. Gap reuses --space-8, read from the
    // rail's own computed style rather than duplicated as a number.
    // Recomputed on resize, since the banner's height changes with
    // viewport width; not on scroll — this sets a fixed starting point,
    // it doesn't track the banner as the page scrolls. If an entry has no
    // banner, --toc-rail-top is simply never set and CSS's own
    // var(--toc-rail-top, <fallback>) takes over — no duplicated fallback
    // value to keep in sync here.
    function updateRailTop() {
        const banner = document.querySelector('.standard-page-banner');
        if (!banner) return;
        const gap = parseFloat(getComputedStyle(rail).getPropertyValue('--space-8'));
        const top = banner.getBoundingClientRect().bottom + window.scrollY + gap;
        rail.style.setProperty('--toc-rail-top', `${top}px`);
    }

    updateRailTop();
    window.addEventListener('resize', updateRailTop);

    // --- <1024px trigger + anchored panel (Prompt B) --------------------
    // Trigger reuses .action-rail-group/.action-rail-trigger/
    // .action-rail-badge verbatim (Rule 3a) — same position, shape and
    // badge treatment as Archive's Filter trigger. The two never coexist
    // on the same page (Filter trigger only exists on archive.html, this
    // only on Standard Page entries), so sharing the literal classes
    // carries no collision risk. .toc-trigger-group is an additional
    // class, not a replacement — it only overrides display (see
    // style.css) to invert the breakpoint versus Archive's own always-
    // visible use of the same base classes; show/hide *within* that range
    // is scroll-threshold driven (matching .back-to-top's own mechanism,
    // via .action-rail-group--visible, the same modifier class Archive's
    // trigger already uses) rather than Archive's drawer-open-state
    // toggle, since this trigger has no drawer-open state of its own to
    // key off.
    const triggerGroup = document.createElement('div');
    triggerGroup.className = 'action-rail-group toc-trigger-group';

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'action-rail-trigger';
    trigger.id = 'toc-trigger';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', 'toc-panel');
    trigger.setAttribute('aria-haspopup', 'true');

    const triggerLabel = document.createElement('span');
    triggerLabel.className = 'trigger-label';
    triggerLabel.textContent = 'Contents';

    // aria-hidden: the count is announced via the trigger's own aria-label
    // instead (updated in updateActiveState() below) so it isn't announced
    // twice — matching the "heading X of Y" wording asked for, without a
    // second accessible node nested inside the button's own accessible name.
    const badge = document.createElement('span');
    badge.className = 'action-rail-badge';
    badge.setAttribute('aria-hidden', 'true');

    trigger.append(triggerLabel, badge);
    triggerGroup.appendChild(trigger);
    document.body.insertBefore(triggerGroup, main);

    // Same scroll-threshold value as .back-to-top's own (initBackToTop()
    // above) — not approximated.
    window.addEventListener('scroll', () => {
        triggerGroup.classList.toggle('action-rail-group--visible', window.scrollY > 400);
    }, { passive: true });

    // Panel: <nav>, same landmark type and aria-label as the desktop rail
    // (this is the same navigational content, just rendered differently
    // per breakpoint) — not role="dialog": the Filter Drawer's own
    // role="dialog" belongs to that specific full-screen sheet; this is a
    // small anchored popover, same category of thing as the Desktop
    // Filter Panel it's modelled on, which doesn't carry dialog semantics
    // either.
    //
    // Outside-close now matches the real Filter Drawer pattern exactly
    // (scrim + body-scroll-lock + inert), not the lighter document-click-
    // listener version this shipped with initially — that version let a
    // background click both close the panel AND activate whatever was
    // underneath it, since a listener alone (without stopping the event)
    // can observe a click but not catch it. A real scrim element with
    // pointer-events: auto while open intercepts the click itself, so
    // nothing beneath it ever receives it.
    const panel = document.createElement('nav');
    panel.className = 'toc-panel';
    panel.id = 'toc-panel';
    panel.setAttribute('aria-label', 'Table of contents');
    panel.hidden = true;

    // aria-hidden: redundant with the <nav>'s own aria-label above once
    // announced as a landmark — visible for sighted users only.
    const panelLabel = document.createElement('p');
    panelLabel.className = 'toc-panel-label';
    panelLabel.textContent = 'Table of Contents';
    panelLabel.setAttribute('aria-hidden', 'true');

    const panelList = document.createElement('ul');
    panelList.className = 'toc-panel-list';
    const panelLinks = buildTocLinks(headings, panelList);

    panel.append(panelLabel, panelList);

    const scrim = document.createElement('div');
    scrim.className = 'toc-panel-scrim';
    scrim.setAttribute('aria-hidden', 'true');
    scrim.hidden = true;

    document.body.insertBefore(scrim, main);
    document.body.insertBefore(panel, main);

    let removeTrapFocus = null;
    let savedScrollY = 0;

    // Same technique as initFilterDrawer()'s lockBodyScroll()/
    // unlockBodyScroll() (script.js, above) — position: fixed rather than
    // overflow: hidden, which is known to leak scroll on iOS Safari — and
    // the same .body-scroll-locked class. Not calling into
    // initFilterDrawer() itself: that closure is private to Archive
    // (initFilterDrawer() no-ops entirely on Entry pages — there's no
    // #filter-drawer element here to find), so this is a second instance
    // of the same technique, not a shared one — Rule 3a covers reusing a
    // value/pattern, not literally sharing unrelated closures across
    // unrelated components.
    function lockBodyScroll() {
        savedScrollY = window.scrollY;
        document.body.style.top = `-${savedScrollY}px`;
        document.body.classList.add('body-scroll-locked');
    }

    function unlockBodyScroll() {
        document.body.classList.remove('body-scroll-locked');
        document.body.style.top = '';
        window.scrollTo({ top: savedScrollY, left: 0, behavior: 'instant' });
    }

    // Elements to inert while the panel is open — prevents Tab from
    // reaching background content the scrim already blocks from clicks.
    // .toc-trigger-group isn't included: it's hidden via the
    // action-rail-group--visible toggle below, which already removes it
    // from focus order and the accessibility tree on its own (visibility:
    // hidden), so inerting it too would be redundant.
    function getTocInertTargets() {
        return [
            document.getElementById('nav-placeholder'),
            document.getElementById('main-content'),
            document.querySelector('.toast'),
            document.querySelector('.tab-bar'),
            document.getElementById('footer-placeholder'),
        ].filter(Boolean);
    }

    function openPanel() {
        lockBodyScroll();
        scrim.removeAttribute('hidden');
        panel.hidden = false;
        requestAnimationFrame(() => {
            panel.classList.add('toc-panel--open');
            scrim.classList.add('toc-panel-scrim--open');
        });
        trigger.setAttribute('aria-expanded', 'true');
        trigger.setAttribute('aria-label', 'Close table of contents');

        getTocInertTargets().forEach(el => el.setAttribute('inert', ''));

        // Same visibility mechanism the scroll-threshold show/hide above
        // already uses (.action-rail-group--visible) — one hide method for
        // the trigger, not two. Mirrors exactly how initFilterDrawer()'s
        // openDrawer() hides Archive's own .action-rail-group while its
        // drawer is open (script.js, above).
        triggerGroup.classList.remove('action-rail-group--visible');

        removeTrapFocus = trapFocus(panel);
        document.addEventListener('keydown', handlePanelEscape);

        const firstLink = panelList.querySelector('.toc-rail-link');
        // preventScroll: true — firstLink is inside a position: fixed
        // panel, always on-screen regardless of scrollY, so the browser's
        // default scroll-into-view on focus is not just unneeded but
        // actively wrong here — confirmed via testing, not assumed: without
        // it, focusing the link scrolled the whole page back to top.
        if (firstLink) requestAnimationFrame(() => firstLink.focus({ preventScroll: true }));
    }

    function closePanel({ returnFocus = true } = {}) {
        unlockBodyScroll();
        panel.classList.remove('toc-panel--open');
        scrim.classList.remove('toc-panel-scrim--open');
        trigger.setAttribute('aria-expanded', 'false');
        updateActiveState();

        if (removeTrapFocus) {
            removeTrapFocus();
            removeTrapFocus = null;
        }
        document.removeEventListener('keydown', handlePanelEscape);

        getTocInertTargets().forEach(el => el.removeAttribute('inert'));

        // Restore trigger visibility synchronously, BEFORE trigger.focus()
        // below — not inside the transitionend callback further down,
        // which fires later. A still visibility: hidden element silently
        // refuses .focus(), which would reintroduce the exact keyboard-
        // accessibility regression already fixed once on the Filter
        // Drawer's own trigger (see closeDrawer()'s identical comment,
        // above) — same root cause, same fix: disable the transition just
        // for this one change so it applies instantly and deterministically
        // (confirmed via testing, not assumed), then restore it immediately
        // via a forced reflow.
        triggerGroup.classList.add('action-rail-group--instant');
        triggerGroup.classList.add('action-rail-group--visible');
        void triggerGroup.offsetHeight; // forces the instant change to commit before re-enabling the transition
        triggerGroup.classList.remove('action-rail-group--instant');

        panel.addEventListener('transitionend', () => {
            panel.hidden = true;
            scrim.setAttribute('hidden', '');
        }, { once: true });

        // preventScroll: true — same reasoning as unlockBodyScroll()'s own
        // restore above: trigger is fixed-position, always on-screen
        // regardless of scrollY, so no scroll-into-view is ever needed.
        if (returnFocus) trigger.focus({ preventScroll: true });
    }

    function handlePanelEscape(event) {
        if (event.key === 'Escape') closePanel();
    }

    trigger.addEventListener('mousedown', (e) => e.preventDefault());
    trigger.addEventListener('click', () => {
        if (panel.hidden) openPanel();
        else closePanel();
    });

    scrim.addEventListener('click', () => closePanel({ returnFocus: false }));

    // Selecting a heading closes the panel (per spec) without returning
    // focus to the trigger — the clicked link's own default navigation
    // (scroll + browser's native fragment-focus behavior) already moves
    // focus meaningfully, so pulling it back to the trigger would fight
    // that instead of helping it.
    panelList.addEventListener('click', (event) => {
        if (event.target.closest('.toc-rail-link')) closePanel({ returnFocus: false });
    });

    // --- Shared scrollspy -------------------------------------------------
    // Threshold read from the heading's own computed scroll-margin-top
    // (style.css) rather than a duplicated magic number, so the two never
    // drift out of sync.
    const threshold = parseFloat(getComputedStyle(headings[0]).scrollMarginTop) || 0;

    function updateActiveState() {
        // +1px tolerance absorbs sub-pixel rendering (header's real height
        // is a fractional 64.6667px — see NAVIGATION section, style.css) so
        // a heading landed on via anchor jump doesn't miss its own
        // threshold by a fraction of a pixel and leave the previous
        // heading highlighted instead — confirmed via direct #anchor
        // navigation, not assumed.
        let currentIndex = 0;
        for (let i = 0; i < headings.length; i++) {
            if (headings[i].getBoundingClientRect().top <= threshold + 1) {
                currentIndex = i;
            } else {
                break;
            }
        }
        const current = headings[currentIndex];

        [railLinks, panelLinks].forEach(links => {
            links.forEach(link => {
                const isActive = link.getAttribute('href') === `#${current.id}`;
                link.classList.toggle('toc-rail-link--active', isActive);
                if (isActive) {
                    link.setAttribute('aria-current', 'true');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        });

        badge.textContent = `${currentIndex + 1}/${headings.length}`;
        // Only while closed — while open the label says "Close table of
        // contents" instead (set in openPanel()); background scroll can
        // still move the badge/position while the panel is open (no
        // scroll-lock), but the trigger's own accessible name doesn't
        // need to chase that in real time the way the visible badge does.
        if (trigger.getAttribute('aria-expanded') !== 'true') {
            trigger.setAttribute('aria-label', `Table of contents, heading ${currentIndex + 1} of ${headings.length}`);
        }
    }

    window.addEventListener('scroll', updateActiveState, { passive: true });
    window.addEventListener('resize', updateActiveState);

    // Re-lands on the URL's own #hash now that the header's real height is
    // known, correcting the browser's earlier native fragment scroll (see
    // comment at the call site in the DOMContentLoaded handler above).
    if (location.hash) {
        const target = document.getElementById(location.hash.slice(1));
        if (target && headings.includes(target)) {
            target.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
    }

    updateActiveState();
}

// Traps keyboard focus within element while open.
// Returns a cleanup function that removes the listener.
function trapFocus(element) {
    const FOCUSABLE = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    function handler(event) {
        if (event.key !== 'Tab') return;

        const focusable = [...element.querySelectorAll(FOCUSABLE)];
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey) {
            if (document.activeElement === first) {
                event.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    }

    element.addEventListener('keydown', handler);
    return () => element.removeEventListener('keydown', handler);
}

// Filter drawer — all triggers via [aria-controls="filter-drawer"].
// Works for .action-rail-trigger (the floating trigger, always visible, all
// breakpoints) and the drawer's own internal .filter-drawer-trigger (Close).
// Depends on: trapFocus()
function initFilterDrawer() {
    const drawer = document.getElementById('filter-drawer');
    if (!drawer) return;

    const scrim = document.getElementById('archive-scrim');
    const allTriggers = document.querySelectorAll('[aria-controls="filter-drawer"]');
    let removeTrapFocus = null;
    let openerBtn = null;
    let savedScrollY = 0;

    // Locks background scroll while the drawer is open — inert blocks click/
    // focus/AT interaction on background content, but has no effect on
    // document-level scroll, so touch-drag and wheel gestures over the scrim
    // would otherwise still scroll the page underneath.
    function lockBodyScroll() {
        savedScrollY = window.scrollY;
        document.body.style.top = `-${savedScrollY}px`;
        document.body.classList.add('body-scroll-locked');
    }

    function unlockBodyScroll() {
        document.body.classList.remove('body-scroll-locked');
        document.body.style.top = '';
        // behavior: 'instant' — html has scroll-behavior: smooth sitewide
        // (for the Back to Top button and anchor jumps), which window.scrollTo
        // inherits by default. Confirmed via testing, not assumed: without
        // an explicit override this restore animates over several hundred ms
        // instead of jumping immediately, which is exactly backwards for a
        // state restoration — the user should land back exactly where they
        // were with no perceptible motion, not watch the page scroll past
        // everything in between. This surfaced as a real, visible bug only
        // on long scroll distances (the animation takes longer to finish, so
        // a fixed-delay check samples it mid-flight); short distances looked
        // fine only because the animation had time to complete unnoticed.
        window.scrollTo({ top: savedScrollY, left: 0, behavior: 'instant' });
    }

    // Elements to inert while the drawer is open — prevents focus leaking to duplicate controls
    function getInertTargets() {
        return [
            document.getElementById('archive-sticky-header'),
            document.querySelector('.action-rail-group'),
            document.getElementById('theme-toggle'),
            document.getElementById('main-content'),
            document.querySelector('.toast'),
            document.querySelector('.tab-bar'),
            document.getElementById('nav-placeholder'),
            document.getElementById('footer-placeholder'),
        ].filter(Boolean);
    }

    function updateTriggerLabels(isOpen) {
        allTriggers.forEach(t => {
            const labelSpan = t.querySelector('.trigger-label');
            if (labelSpan) labelSpan.textContent = isOpen ? 'Close' : 'Filters';
            if (t.classList.contains('action-rail-trigger')) {
                t.setAttribute('aria-label', isOpen ? 'Close filters' : 'Open filters');
            }
        });
    }

    function openDrawer(opener) {
        openerBtn = opener;
        lockBodyScroll();
        drawer.removeAttribute('inert');
        drawer.removeAttribute('hidden');
        if (scrim) scrim.removeAttribute('hidden');
        requestAnimationFrame(() => {
            drawer.classList.add('filter-drawer--open');
            if (scrim) scrim.classList.add('archive-scrim--open');
        });
        allTriggers.forEach(t => t.setAttribute('aria-expanded', 'true'));
        updateTriggerLabels(true);

        // Inert all page content outside the drawer — prevents Tab from reaching duplicate controls
        getInertTargets().forEach(el => el.setAttribute('inert', ''));
        const railGrp = document.querySelector('.action-rail-group');
        if (railGrp) railGrp.classList.remove('action-rail-group--visible');
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) themeToggle.classList.remove('theme-toggle-rail--visible');

        // Clear (when enabled — e.g. arriving with a filter already active)
        // is the natural first stop; otherwise land on the first primary chip.
        const firstFocusable =
            drawer.querySelector('.archive-clear-btn:not([disabled])') ||
            drawer.querySelector('.filter-drawer-primary-chips button:not([disabled])') ||
            drawer.querySelector('button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            requestAnimationFrame(() => firstFocusable.focus());
        }

        removeTrapFocus = trapFocus(drawer);
        document.addEventListener('keydown', handleEscape);
    }

    function closeDrawer() {
        unlockBodyScroll();
        drawer.setAttribute('inert', '');
        drawer.classList.remove('filter-drawer--open');
        if (scrim) scrim.classList.remove('archive-scrim--open');
        allTriggers.forEach(t => t.setAttribute('aria-expanded', 'false'));
        updateTriggerLabels(false);

        if (removeTrapFocus) {
            removeTrapFocus();
            removeTrapFocus = null;
        }
        document.removeEventListener('keydown', handleEscape);

        // Remove inert before returning focus so the opener can receive it
        getInertTargets().forEach(el => el.removeAttribute('inert'));

        // Restore rail group visibility synchronously, BEFORE the
        // openerBtn.focus() call below — not inside the transitionend
        // callback, which fires later. openerBtn is frequently this same
        // rail trigger now (the only opener at every breakpoint). The rail
        // is always shown while the drawer is closed (see .action-rail-group
        // in style.css) — unconditional now, no scroll-position check needed.
        //
        // visibility is a discrete-animatable property: switching it to
        // "visible" only takes effect once the browser commits to starting
        // the transition, which — confirmed by testing, not assumed — does
        // NOT reliably happen within a single requestAnimationFrame under
        // real page load (this element's transition competes with the
        // drawer's own simultaneous close transition). A still-hidden
        // element silently refuses .focus(), leaving focus stuck wherever
        // it was until the drawer's hidden attribute lands later and force-
        // blurs it to <body>. Fix: disable the transition just for this one
        // change so it applies instantly and deterministically, then
        // restore it immediately after via a forced reflow — same
        // instant-then-re-enable technique used whenever a transitioned
        // property needs to change without animating.
        const railGrp = document.querySelector('.action-rail-group');
        if (railGrp) {
            railGrp.classList.add('action-rail-group--instant');
            railGrp.classList.add('action-rail-group--visible');
            void railGrp.offsetHeight; // force the instant change to commit before re-enabling the transition
            railGrp.classList.remove('action-rail-group--instant');
        }

        drawer.addEventListener('transitionend', () => {
            drawer.setAttribute('hidden', '');
            if (scrim) scrim.setAttribute('hidden', '');
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) themeToggle.classList.add('theme-toggle-rail--visible');
        }, { once: true });

        // preventScroll: true — focus() defaults to scrolling its target
        // into view if the browser doesn't already consider it visible,
        // which can fight with the scroll position unlockBodyScroll() just
        // restored above. openerBtn is fixed-position (always on-screen
        // regardless of scrollY), so no scroll-into-view is ever actually
        // needed here.
        if (openerBtn) openerBtn.focus({ preventScroll: true });
    }

    function handleEscape(event) {
        if (event.key === 'Escape') closeDrawer();
    }

    allTriggers.forEach(btn => {
        // Prevents mousedown from blurring whatever currently has focus
        // before the click lands — defensive against any focus-driven
        // layout shift moving this button out from under the cursor
        // between mousedown and mouseup.
        btn.addEventListener('mousedown', (e) => e.preventDefault());

        btn.addEventListener('click', () => {
            if (drawer.hidden) openDrawer(btn);
            else closeDrawer();
        });
    });

    if (scrim) {
        scrim.addEventListener('click', closeDrawer);
    }

    return { openDrawer, closeDrawer };
}

// Archive page — fetch manifest, build chips, filter, sort, paginate, sync URL
function initArchive(filterDrawer) {
    const resultsEl        = document.getElementById('archive-results');
    if (!resultsEl) return;

    const titleEl          = document.getElementById('archive-title');
    const countEl          = document.getElementById('archive-count');
    const primaryChips     = document.querySelectorAll('[data-filter-type]');
    const drawerActiveChipsEl = document.getElementById('filter-drawer-active-chips');
    const drawerChipsEl    = document.getElementById('filter-drawer-chips');
    const drawerPrimaryChipsEl = document.querySelector('.filter-drawer-primary-chips');
    const pageNavEl        = document.getElementById('filter-drawer-page-nav');
    const pageDotsEl       = document.getElementById('filter-drawer-page-dots');
    const pagePrevBtn      = document.querySelector('.filter-drawer-page-prev');
    const pageNextBtn      = document.querySelector('.filter-drawer-page-next');
    const pageStatusEl     = document.getElementById('filter-drawer-page-status');
    const SECONDARY_PAGE_SIZE = 12;

    // State
    let allEntries         = [];
    let activeType         = null;
    const activeSecondary  = new Set();
    let currentSort        = 'latest';
    let currentQuery       = '';
    let secondaryPage      = 0; // Filter Drawer paginated secondary tags, 0-indexed
    // The grid page the user was on right before any secondary tag went
    // active (see .filter-drawer--tags-active in style.css) — restored when
    // the last active tag is cleared, so the grid reappears on the same
    // page rather than resetting to page 1. wasSecondaryActive tracks the
    // 0→N / N→0 transition itself, since that's the only moment this
    // should be captured or restored (not on every render while one or
    // more tags stay active).
    let secondaryPageBeforeActive = 0;
    let wasSecondaryActive = false;

    // Current page count for the drawer's secondary tag pagination, derived
    // from the actual (already zero-count-filtered) visible tag count —
    // recomputed on demand rather than cached, since active filters change
    // which tags are non-zero-count from one render to the next.
    function getDrawerSecondaryPageCount() {
        if (!drawerChipsEl) return 1;
        const visibleCount = [...drawerChipsEl.querySelectorAll('[data-filter-tag]')]
            .filter(btn => !btn.classList.contains('tag-chip--zero-count')).length;
        return Math.max(1, Math.ceil(visibleCount / SECONDARY_PAGE_SIZE));
    }

    // Read initial URL params
    const params = new URLSearchParams(window.location.search);
    const typeParam = params.get('type');
    const tagParam  = params.get('tag');
    if (typeParam === 'work' || typeParam === 'thoughts') activeType = typeParam;
    // tagParam is validated against real tag data once the manifest is fetched
    // (below) — adding it here, before allEntries exists, would let any stale
    // or arbitrary URL value become a permanent zero-match filter.

    // Utilities
    function slugify(str) {
        return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    function formatDate(iso) {
        const [y, m, d] = iso.split('-').map(Number);
        return new Date(y, m - 1, d).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    }

    function escapeHTML(str) {
        return String(str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // Build secondary tag chips into the Filter Drawer — the one shared
    // pool of secondary tags at every breakpoint now, paginated 6 per page
    // (see the pagination block in render() and the Previous/Next/dots
    // wiring below).
    function buildSecondaryChips(entries) {
        if (!drawerChipsEl) return;

        const seen = new Set();
        const tags = [];
        entries.forEach(e => (e.tags || []).forEach(t => {
            const slug = slugify(t);
            if (!seen.has(slug)) { seen.add(slug); tags.push({ label: t, slug }); }
        }));

        tags.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));

        drawerChipsEl.innerHTML = '';
        tags.forEach(({ label, slug }) => {
            const btn = document.createElement('button');
            btn.className = 'tag-chip';
            btn.type = 'button';
            btn.dataset.filterTag = slug;
            btn.dataset.label = label;
            btn.setAttribute('aria-pressed', 'false');
            btn.textContent = label;
            const countSpan = document.createElement('span');
            countSpan.className = 'chip-count';
            countSpan.setAttribute('aria-hidden', 'true');
            btn.appendChild(countSpan);
            btn.addEventListener('click', () => {
                if (activeSecondary.has(slug)) {
                    activeSecondary.delete(slug);
                } else {
                    activeSecondary.add(slug);
                }
                render();
            });
            drawerChipsEl.appendChild(btn);
        });
    }

    // Filter + sort the full entry list
    function getFiltered() {
        return allEntries
            .filter(e => {
                if (activeType && e.type !== activeType) return false;
                if (activeSecondary.size) {
                    const slugs = (e.tags || []).map(slugify);
                    if (![...activeSecondary].some(s => slugs.includes(s))) return false;
                }
                if (currentQuery) {
                    const text = [e.title, e.excerpt, ...(e.tags || [])].join(' ').toLowerCase();
                    if (!text.includes(currentQuery)) return false;
                }
                return true;
            })
            .sort((a, b) => {
                const da = new Date(a.date).getTime();
                const db = new Date(b.date).getTime();
                return currentSort === 'latest' ? db - da : da - db;
            });
    }

    // Build a card article element from a manifest entry
    function buildCard(entry) {
        const article = document.createElement('article');
        article.className = entry.type === 'work' ? 'card card--feature' : 'card card--thought';

        const url        = entry.url || '#';
        const date       = formatDate(entry.date);
        const meta       = `${date} · ${escapeHTML(entry.author || '')}`;
        const ctaText    = entry.type === 'work' ? 'View' : 'Read';
        const ctaAction  = entry.type === 'work' ? 'view this project' : 'read this thought';
        const ctaLabel   = `${escapeHTML(entry.title)} — ${ctaAction}`;
        const tagSlugs = (entry.tags || []).map(slugify);

        const tagsHTML = (entry.tags || []).map((t, i) =>
            `<a href="/archive.html?tag=${tagSlugs[i]}" class="tag" aria-label="Filter by ${escapeHTML(t)}">${escapeHTML(t)}</a>`
        ).join('');

        const imageHTML = entry.type === 'work'
            ? `<div class="card-image" role="presentation"></div>`
            : '';

        article.innerHTML = `
            <a href="${escapeHTML(url)}" class="card-block-link" aria-hidden="true" tabindex="-1"></a>
            ${imageHTML}
            <div class="card-content">
                <h3 class="card-title" data-searchable>${escapeHTML(entry.title)}</h3>
                <div class="card-tags">${tagsHTML}</div>
                <p class="card-meta">${meta}</p>
                <p class="card-excerpt">${escapeHTML(entry.excerpt || '')}</p>
                <a href="${escapeHTML(url)}" class="card-cta"
                   aria-label="${ctaLabel}">${ctaText}</a>
            </div>`;

        // Set background image via JS (not an inline HTML style attribute)
        if (entry.type === 'work' && entry.image) {
            const imgDiv = article.querySelector('.card-image');
            if (imgDiv) imgDiv.style.backgroundImage = `url('${entry.image}')`;
        }

        return article;
    }

    // Moves focus to a secondary tag's chip after it's deactivated via its
    // × in the active-chips row, matched by its stable slug — not a
    // captured DOM reference, since the render() this runs after just
    // rebuilt this active-chips row from scratch (destroying the × button
    // that was just clicked/activated) and may also have re-paginated the
    // pool this chip lives in. Without this, no explicit focus target
    // survives the deactivation, so focus silently falls to document.body
    // — confirmed via real click AND real keyboard (Tab to the × button,
    // Enter) testing, not assumed: document.activeElement reads as <body>
    // immediately after, and the *next* Tab press lands on whichever chip
    // happens to be first in DOM order on whatever page is showing —
    // exactly the "different, unrelated tag" symptom reported.
    //
    // Single shared pool now (#filter-drawer-chips, paginated 6 per page) at
    // every breakpoint.
    function focusDeactivatedSecondaryTag(slug) {
        const poolEl = drawerChipsEl;
        if (!poolEl) return;

        let chip = poolEl.querySelector(`[data-filter-tag="${slug}"]`);
        if (!chip) return;

        // secondaryPageBeforeActive (above) restores the page the user was
        // on before the FIRST tag went active, not necessarily where THIS
        // tag sits — with more than one tag cycled through active state
        // those can diverge. If the restored page doesn't actually show
        // this tag, jump to its real page using the same alphabetical-index
        // math the initial ?tag= URL arrival uses (see fetch().then()
        // below), then re-render before focusing, so the focus call fires
        // once that page is actually showing.
        if (chip.classList.contains('tag-chip--collapsed')) {
            const visibleTags = [...poolEl.querySelectorAll('[data-filter-tag]')]
                .filter(b => !b.classList.contains('tag-chip--zero-count'));
            const idx = visibleTags.indexOf(chip);
            if (idx !== -1) {
                secondaryPage = Math.floor(idx / SECONDARY_PAGE_SIZE);
                render();
                chip = poolEl.querySelector(`[data-filter-tag="${slug}"]`);
            }
        }

        if (chip && chip.offsetParent !== null) {
            chip.focus();
            return;
        }

        // Chip still isn't visible — its own zero-count-hidden state changed
        // as a side effect of the deactivation (its count doesn't depend on
        // activeSecondary, but it can already have been 0 while active if
        // activeType/currentQuery excluded it — the active-chips row shows
        // it regardless of zero-count, unlike the main pool).
        if (activeSecondary.size > 0) {
            // Other tags are still active — the pool/pagination stays
            // hidden (.filter-drawer--tags-active), so the active-chips row
            // itself (always visible whenever any tag is active) is the
            // reachable, contextually relevant fallback.
            const firstActive = drawerActiveChipsEl ? drawerActiveChipsEl.querySelector('.tag-chip') : null;
            if (firstActive) { firstActive.focus(); return; }
        } else {
            // This was the last active tag and the pool is visible again
            // (.filter-drawer--tags-active just came off) — first visible
            // chip on the now-current page.
            const firstVisible = poolEl.querySelector('[data-filter-tag]:not(.tag-chip--collapsed):not(.tag-chip--zero-count)');
            if (firstVisible) { firstVisible.focus(); return; }
        }

        // Last resort — pagination Previous, gated on actual visibility:
        // .filter-drawer-page-nav[hidden] uses visibility: hidden, not
        // display: none, specifically to stay out of the tab order (see
        // style.css) — a .focus() call on anything inside it while hidden
        // is a silent no-op, confirmed, not assumed.
        if (pageNavEl && !pageNavEl.hidden && pagePrevBtn) {
            pagePrevBtn.focus();
        }
    }

    // Update active secondary chips row (shown above secondary list)
    function updateActiveChipsRow() {
        if (!drawerActiveChipsEl) return;
        const container = drawerActiveChipsEl;
        container.innerHTML = '';
        container.classList.toggle('is-active', activeSecondary.size > 0);
        activeSecondary.forEach(slug => {
            const sourceBtn = document.querySelector(`[data-filter-tag="${slug}"]`);
            const label = sourceBtn ? sourceBtn.dataset.label : slug;
            const btn = document.createElement('button');
            btn.className = 'tag-chip tag-chip--active';
            btn.type = 'button';
            btn.setAttribute('aria-pressed', 'true');
            btn.setAttribute('aria-label', `Remove ${label} filter`);
            const x = document.createElement('span');
            x.className = 'tag-chip-x';
            x.setAttribute('aria-hidden', 'true');
            x.textContent = '×';
            btn.textContent = label;
            btn.appendChild(x);
            btn.addEventListener('click', () => {
                activeSecondary.delete(slug);
                render();
                focusDeactivatedSecondaryTag(slug);
            });
            container.appendChild(btn);
        });
    }

    // Entry count for a type chip given current secondary + query filters
    function getChipCountForType(type) {
        return allEntries.filter(e => {
            if (e.type !== type) return false;
            if (activeSecondary.size) {
                const slugs = (e.tags || []).map(slugify);
                if (![...activeSecondary].some(s => slugs.includes(s))) return false;
            }
            if (currentQuery) {
                const text = [e.title, e.excerpt, ...(e.tags || [])].join(' ').toLowerCase();
                if (!text.includes(currentQuery)) return false;
            }
            return true;
        }).length;
    }

    // Entry count for a tag chip given current type + query filters
    function getChipCountForTag(slug) {
        return allEntries.filter(e => {
            if (activeType && e.type !== activeType) return false;
            const slugs = (e.tags || []).map(slugify);
            if (!slugs.includes(slug)) return false;
            if (currentQuery) {
                const text = [e.title, e.excerpt, ...(e.tags || [])].join(' ').toLowerCase();
                if (!text.includes(currentQuery)) return false;
            }
            return true;
        }).length;
    }

    // Shared class/aria/× state for a tag-chip button — single source of truth
    // for the primary-chip and secondary-chip render loops below.
    // isDuplicateOfActiveRow: true for chips living in the full secondary
    // list (#filter-drawer-chips), where an active tag is already shown
    // separately in the active-chips row (#filter-drawer-active-chips) —
    // that duplicate must render Dim, not Active, so only the true
    // active-chips-row instance ever shows the Active state for a given
    // slug. aria-pressed/×/aria-label stay driven by the real isActive value
    // regardless of this distinction, since the underlying toggle state
    // (and its removability) is unchanged — only the visual Active/Dim
    // classing differs for the duplicate.
    function applyChipState(btn, { isActive, anyActive, isDuplicateOfActiveRow = false }) {
        const dimAsDuplicate = isDuplicateOfActiveRow && isActive;
        const showAsActive = isActive && !dimAsDuplicate;
        const showAsDim = dimAsDuplicate || (!isActive && anyActive);

        btn.classList.toggle('tag-chip--active', showAsActive);
        btn.classList.toggle('tag-chip--dim', showAsDim);
        btn.setAttribute('aria-pressed', String(isActive));

        const existingX = btn.querySelector('.tag-chip-x');
        if (isActive && !existingX) {
            const x = document.createElement('span');
            x.className = 'tag-chip-x';
            x.setAttribute('aria-hidden', 'true');
            x.textContent = '×';
            btn.appendChild(x);
        } else if (!isActive && existingX) {
            existingX.remove();
        }

        if (isActive) btn.setAttribute('aria-label', `Remove ${btn.dataset.label} filter`);
        else           btn.removeAttribute('aria-label');
    }

    // Main render — updates all UI from current state
    function render() {
        const filtered = getFiltered();

        // Title
        if (titleEl) {
            if (activeType === 'work')         titleEl.textContent = 'Archive / Work';
            else if (activeType === 'thoughts') titleEl.textContent = 'Archive / Thoughts';
            else                                titleEl.textContent = 'Archive';
        }

        // Count (aria-live polite) — "All" when the filtered set equals the
        // full unfiltered entry list (covers the 0-active-filters case, and
        // correctly falls back to the real number if search text narrows
        // results even with 0 chip filters active).
        if (countEl) {
            const displayCount = filtered.length === allEntries.length ? 'All' : filtered.length;
            const entriesWord  = filtered.length === 1 ? 'Entry' : 'Entries';
            countEl.innerHTML = `Showing <span class="archive-count-value">${displayCount}</span> ${entriesWord}`;
        }

        // Primary type chips
        primaryChips.forEach(btn => {
            const type     = btn.dataset.filterType;
            const isActive = activeType === type;
            const anyActive = activeType !== null;
            applyChipState(btn, { isActive, anyActive });
            const typeCountEl = btn.querySelector('.chip-count');
            if (typeCountEl) typeCountEl.textContent = ` ${getChipCountForType(type)}`;
        });

        // Sort toggle — update text to reflect current sort direction
        document.querySelectorAll('.archive-sort-toggle').forEach(btn => {
            btn.textContent = currentSort === 'latest' ? 'Latest ↑' : 'Earliest ↓';
        });

        // Update all trigger badges (header trigger + floating rail trigger) from shared state
        const filterCount = (activeType ? 1 : 0) + activeSecondary.size;
        document.querySelectorAll('.action-rail-badge').forEach(badgeEl => {
            badgeEl.textContent = filterCount;
            badgeEl.hidden = filterCount === 0;
        });

        // Enable Clear buttons when either search text or a filter is active —
        // disabled only when both are empty. Previously checked filterCount
        // alone, so typing search text with no filter active left Clear
        // wrongly disabled even though there was something to clear.
        document.querySelectorAll('.archive-clear-btn').forEach(btn => {
            btn.disabled = filterCount === 0 && currentQuery.length === 0;
        });

        // External Clear (floating action rail) — no empty-state Clear
        // button, unlike the header/drawer instances above which stay
        // present but disabled. Rendered only while a filter is active;
        // hides along with the rest of .action-rail-group while the drawer
        // is open (openDrawer()/closeDrawer() toggle the whole group).
        const railClearBtn = document.querySelector('.action-rail-clear');
        if (railClearBtn) railClearBtn.hidden = filterCount === 0;

        // Secondary tag chips (drawer — the one shared pool at every breakpoint)
        document.querySelectorAll('[data-filter-tag]').forEach(btn => {
            const slug     = btn.dataset.filterTag;
            const isActive = activeSecondary.has(slug);
            const anyActive = activeSecondary.size > 0;
            const isDuplicateOfActiveRow = !!btn.closest('#filter-drawer-chips');
            applyChipState(btn, { isActive, anyActive, isDuplicateOfActiveRow });
            const count = getChipCountForTag(slug);
            const tagCountEl = btn.querySelector('.chip-count');
            if (tagCountEl) tagCountEl.textContent = ` ${count}`;
            btn.classList.toggle('tag-chip--zero-count', count === 0);
        });

        // Filter Drawer secondary tags — paginated 6 per page (already
        // alphabetically sorted; zero-count tags already excluded above) —
        // same drawer, same pagination, at every breakpoint now.
        if (drawerChipsEl) {
            // One or more secondary tags active — collapse the grid +
            // pagination in favour of #filter-drawer-active-chips alone
            // (see .filter-drawer--tags-active in style.css), which already
            // shows every active tag with its own working × removal; no
            // second copy of that UI is built here. Capture secondaryPage
            // exactly once on the 0→N transition (not on every render while
            // active, which would keep overwriting it with pages the user
            // never actually chose), and restore it once on the N→0
            // transition, so clearing the last active tag returns the grid
            // to the page the user was browsing before, not page 1.
            const hasActiveSecondary = activeSecondary.size > 0;
            if (hasActiveSecondary && !wasSecondaryActive) {
                secondaryPageBeforeActive = secondaryPage;
            } else if (!hasActiveSecondary && wasSecondaryActive) {
                secondaryPage = secondaryPageBeforeActive;
            }
            wasSecondaryActive = hasActiveSecondary;
            if (filterDrawerEl) filterDrawerEl.classList.toggle('filter-drawer--tags-active', hasActiveSecondary);

            const visibleTags = [...drawerChipsEl.querySelectorAll('[data-filter-tag]')]
                .filter(btn => !btn.classList.contains('tag-chip--zero-count'));
            const pageCount = getDrawerSecondaryPageCount();
            if (secondaryPage >= pageCount) secondaryPage = pageCount - 1;
            if (secondaryPage < 0) secondaryPage = 0;
            const pageStart = secondaryPage * SECONDARY_PAGE_SIZE;
            const pageEnd = pageStart + SECONDARY_PAGE_SIZE;

            visibleTags.forEach((btn, i) => {
                btn.classList.toggle('tag-chip--collapsed', i < pageStart || i >= pageEnd);
            });

            // Space still reserved when hidden (see the [hidden] rule in
            // style.css) — hidden whenever there's nothing to paginate
            // through (pageCount <= 1) or a tag is active (no grid showing
            // in that state regardless of the underlying pageCount).
            if (pageNavEl) pageNavEl.hidden = pageCount <= 1 || hasActiveSecondary;

            if (pageDotsEl) {
                // Rebuild only when the page count actually changes — avoids
                // destroying/recreating dot buttons (and any focus on them)
                // every render for no reason.
                if (pageDotsEl.children.length !== pageCount) {
                    pageDotsEl.innerHTML = '';
                    for (let p = 0; p < pageCount; p++) {
                        const dot = document.createElement('button');
                        dot.type = 'button';
                        dot.className = 'filter-drawer-page-dot';
                        dot.setAttribute('aria-label', `Page ${p + 1}`);
                        dot.addEventListener('click', () => {
                            secondaryPage = p;
                            render();
                        });
                        pageDotsEl.appendChild(dot);
                    }
                }
                [...pageDotsEl.children].forEach((dot, p) => {
                    dot.setAttribute('aria-current', String(p === secondaryPage));
                });
            }

            // Empty (not "Page 1 of 1") when there's nothing to paginate —
            // an aria-live region announcing pagination that doesn't exist
            // reads as noise to screen reader users.
            if (pageStatusEl) {
                pageStatusEl.textContent = pageCount > 1 ? `Page ${secondaryPage + 1} of ${pageCount}` : '';
            }
        }

        updateActiveChipsRow();

        // Results — all entries matching the current filter state, no cap
        resultsEl.innerHTML = '';
        if (filtered.length === 0) {
            resultsEl.appendChild(buildEmptyState());
        } else {
            filtered.forEach(e => resultsEl.appendChild(buildCard(e)));
        }
    }

    // No-results empty state — mascot + friendly message + a Clear Filters
    // button wired to the same doReset() every other Clear control uses
    // (defined below; safe to reference here — function declarations are
    // hoisted, and render() only ever executes after the full module body,
    // doReset included, has run once).
    function buildEmptyState() {
        const wrap = document.createElement('div');
        wrap.className = 'archive-empty';

        const img = document.createElement('img');
        img.className = 'archive-empty-image';
        img.src = '/assets/images/entries/no-entries/no-entries.png';
        img.alt = '';
        img.setAttribute('aria-hidden', 'true');
        img.width = 300;
        img.height = 300;
        img.loading = 'lazy';
        wrap.appendChild(img);

        const content = document.createElement('div');
        content.className = 'archive-empty-content';

        const msg = document.createElement('p');
        msg.className = 'archive-empty-message';
        msg.textContent = 'Nothing to see here!';
        content.appendChild(msg);

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'archive-clear-btn btn archive-empty-clear-btn';
        btn.textContent = 'Clear Filters!';
        btn.addEventListener('click', doReset);
        content.appendChild(btn);

        wrap.appendChild(content);
        return wrap;
    }

    // Wire primary type chips (exclusive toggle — replace, not stack)
    primaryChips.forEach(btn => {
        btn.dataset.label = btn.textContent.trim();
        btn.addEventListener('click', () => {
            const type = btn.dataset.filterType;
            activeType = activeType === type ? null : type;
            const url = new URL(window.location.href);
            if (activeType) url.searchParams.set('type', activeType);
            else            url.searchParams.delete('type');
            window.history.replaceState({}, '', url.toString());
            render();
        });
    });

    // Wire sort toggles — single button flips between latest and earliest
    document.querySelectorAll('.archive-sort-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            currentSort = currentSort === 'latest' ? 'earliest' : 'latest';
            render();
        });
    });

    // Wire Filter Drawer secondary-tag pagination Previous/Next — cycles at
    // both ends (Previous on page 1 wraps to the last page, Next on the
    // last page wraps to page 1).
    if (pagePrevBtn) {
        pagePrevBtn.addEventListener('click', () => {
            const pageCount = getDrawerSecondaryPageCount();
            secondaryPage = (secondaryPage - 1 + pageCount) % pageCount;
            render();
        });
    }
    if (pageNextBtn) {
        pageNextBtn.addEventListener('click', () => {
            const pageCount = getDrawerSecondaryPageCount();
            secondaryPage = (secondaryPage + 1) % pageCount;
            render();
        });
    }

    // Referenced by render()'s pagination block above (.filter-drawer--tags-active toggle).
    const filterDrawerEl = document.getElementById('filter-drawer');

    function doReset() {
        activeType = null;
        activeSecondary.clear();
        currentQuery = '';
        currentSort = 'latest';
        secondaryPage = 0;
        // Full reset, not a single-tag removal — land back on page 1 like
        // secondaryPage above, not wherever the user was before their most
        // recent tag went active.
        secondaryPageBeforeActive = 0;
        wasSecondaryActive = false;
        const url = new URL(window.location.href);
        url.searchParams.delete('type');
        window.history.replaceState({}, '', url.toString());
        render();
    }

    // Wire clear buttons (header, drawer, and floating external instance)
    document.querySelectorAll('.archive-clear-btn').forEach(btn => {
        // Same fix as the drawer's Close/Filters trigger (see
        // initFilterDrawer) — prevents mousedown from shifting focus/layout
        // before the click lands.
        btn.addEventListener('mousedown', (e) => e.preventDefault());
        btn.addEventListener('click', doReset);
    });

    // The floating action rail is visible by default at every breakpoint
    // now (see .action-rail-group in style.css) — no scroll-position
    // watcher needed. openDrawer()/closeDrawer() (initFilterDrawer above)
    // are what toggle it off/on, on drawer open/close.

    // Fetch manifest and initialise
    fetch('/data/archive-entries.json')
        .then(r => r.json())
        .then(entries => {
            allEntries = entries;

            // Validate the ?tag= URL param now that real tag data exists —
            // an unrecognised slug (stale/renamed tag, typo, hand-edited URL)
            // is treated as if no tag param was given, rather than silently
            // becoming a permanent zero-match filter with a phantom active chip.
            let arrivedViaValidTag = false;
            if (tagParam) {
                const validTagSlugs = new Set();
                entries.forEach(e => (e.tags || []).forEach(t => validTagSlugs.add(slugify(t))));
                if (validTagSlugs.has(tagParam)) {
                    activeSecondary.add(tagParam);
                    arrivedViaValidTag = true;
                }
            }

            buildSecondaryChips(entries);

            // Filter Drawer (mobile/tablet) arrival state — arriving via a
            // topic tag link keeps the drawer closed (see below), but lands
            // its secondary-tag pagination on whichever page contains the
            // active tag, computed from its position in the same
            // alphabetically sorted list buildSecondaryChips() just
            // rendered — so opening the drawer manually shows the active
            // tag immediately, no Next-clicking required.
            if (arrivedViaValidTag && drawerChipsEl) {
                const allSecondaryBtns = [...drawerChipsEl.querySelectorAll('[data-filter-tag]')];
                const idx = allSecondaryBtns.findIndex(btn => btn.dataset.filterTag === tagParam);
                if (idx !== -1) secondaryPage = Math.floor(idx / SECONDARY_PAGE_SIZE);
            }

            render();

            // Filter Drawer arrival state, scoped to mobile/tablet only —
            // pre-existing behaviour, unchanged by the desktop inline-filters
            // removal. Scenario 2 only: arrived via a "View more Work/
            // Thoughts" style link (?type= present, no ?tag=) — open the
            // drawer on arrival with that primary filter already active.
            // Direct navigation (no params) and tag-link arrivals
            // (Scenario 3, handled above) stay closed. Desktop arrivals via
            // the same link now show the same active-filter state (badge
            // count, filtered results) without auto-opening the drawer to
            // reveal it — worth a follow-up look, out of scope here.
            const isDrawerBreakpoint = !window.matchMedia('(min-width: 1024px)').matches;
            if (isDrawerBreakpoint && filterDrawer && activeType && !arrivedViaValidTag) {
                // The floating rail trigger is the only opener now, at every
                // breakpoint — target it explicitly rather than the first
                // generic [aria-controls="filter-drawer"] match, which would
                // resolve to the header's hidden instance and silently fail
                // to receive focus back when the drawer closes.
                const opener = document.querySelector('.action-rail-trigger');
                filterDrawer.openDrawer(opener);
            }
        })
        .catch(err => console.error('Error loading archive-entries.json:', err));
}
