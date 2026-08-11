// Inject shared components, then wire up behaviour that depends on them
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('nav-placeholder', '/nav.html', () => {
        initNav();
        setActiveNavLink();
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
// Works for .filter-drawer-trigger (header, tablet/mobile), .action-rail-trigger (floating, all breakpoints),
// and the internal close trigger inside the drawer itself.
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
        window.scrollTo(0, savedScrollY);
    }

    // Elements to inert while the drawer is open — prevents focus leaking to duplicate controls
    function getInertTargets() {
        return [
            document.getElementById('archive-sticky-header'),
            document.getElementById('archive-header-sentinel'),
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
        // is the natural first stop; otherwise land on the first primary chip
        // rather than falling through to the search input, which would
        // immediately trigger the search-focus auto-collapse and hide the
        // very filter chips this dialog is meant to show on open.
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

        drawer.addEventListener('transitionend', () => {
            drawer.setAttribute('hidden', '');
            if (scrim) scrim.setAttribute('hidden', '');
            // Re-evaluate condensed state on next genuine scroll after drawer close
            const header = document.getElementById('archive-sticky-header');
            const sent   = document.getElementById('archive-header-sentinel');
            if (header && sent) {
                window.addEventListener('scroll', () => {
                    const rect = sent.getBoundingClientRect();
                    header.classList.toggle('is-condensed', rect.bottom <= 0);
                }, { once: true, passive: true });
            }
            // Restore rail group visibility based on current scroll position
            const railGrp = document.querySelector('.action-rail-group');
            if (railGrp && sent) {
                railGrp.classList.toggle('action-rail-group--visible', sent.getBoundingClientRect().bottom <= 0);
            }
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) themeToggle.classList.add('theme-toggle-rail--visible');
        }, { once: true });

        if (openerBtn) openerBtn.focus();
    }

    function handleEscape(event) {
        if (event.key === 'Escape') closeDrawer();
    }

    allTriggers.forEach(btn => {
        // Same fix as the search field's X button: without this, mousedown
        // on Close (while search is focused) blurs the input first, which
        // re-expands the collapsed rows and shifts this fixed-bottom drawer's
        // layout — moving the button out from under the cursor before
        // mouseup/click land, so the first press silently misses it.
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
    const searchInputs     = document.querySelectorAll('.archive-search-input');
    const railGroup        = document.querySelector('.action-rail-group');
    const primaryChips     = document.querySelectorAll('[data-filter-type]');
    const activeChipsEl    = document.getElementById('archive-active-chips');
    const drawerActiveChipsEl = document.getElementById('filter-drawer-active-chips');
    const inlineFiltersEl  = document.getElementById('archive-secondary-chips');
    const drawerChipsEl    = document.getElementById('filter-drawer-chips');
    const primaryChipsEl   = document.querySelector('.archive-primary-chips');
    const drawerPrimaryChipsEl = document.querySelector('.filter-drawer-primary-chips');
    const loadMoreBtn      = document.querySelector('.archive-load-more-btn');

    // State
    let allEntries         = [];
    let activeType         = null;
    const activeSecondary  = new Set();
    let currentSort        = 'latest';
    let currentQuery       = '';
    let visibleCount       = 25;
    let secondaryExpanded  = false; // Filter Drawer "+N more" disclosure (mobile/tablet) — persists for the page load
    let moreFiltersOpen    = false; // desktop secondary tag row — hidden by default, revealed via "More Filters"
    let debounceTimer;

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

    // Build secondary chips in both inline (desktop) and drawer (tablet/mobile)
    function buildSecondaryChips(entries) {
        const seen = new Set();
        const tags = [];
        entries.forEach(e => (e.tags || []).forEach(t => {
            const slug = slugify(t);
            if (!seen.has(slug)) { seen.add(slug); tags.push({ label: t, slug }); }
        }));

        tags.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));

        [inlineFiltersEl, drawerChipsEl].filter(Boolean).forEach(container => {
            container.innerHTML = '';
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
                    visibleCount = 25;
                    render();
                });
                container.appendChild(btn);
            });
        });

        // Filter Drawer (mobile/tablet) "Show More" / "Show Less" progressive
        // disclosure toggle — appended after the Work/Thoughts chips in the
        // drawer's primary row (not inside the secondary tag container it
        // controls). Unaffected by the desktop More Filters toggle below.
        if (drawerPrimaryChipsEl) {
            const moreToggle = document.createElement('button');
            moreToggle.type = 'button';
            moreToggle.className = 'tag-chip tag-chip-more';
            moreToggle.hidden = true;
            moreToggle.addEventListener('click', () => {
                secondaryExpanded = !secondaryExpanded;
                render();
            });
            drawerPrimaryChipsEl.appendChild(moreToggle);
        }

        // Desktop "More Filters" / "Less Filters" toggle — appended after the
        // Work/Thoughts chips in the desktop inline primary row. Reveals or
        // hides the entire secondary tag row (#archive-secondary-chips) as a
        // block; reuses the existing "Filters" trigger's button styling
        // (.filter-drawer-trigger) via a shared CSS selector, not a new
        // aria-controls="filter-drawer" trigger, so it never opens the drawer.
        if (primaryChipsEl) {
            const moreFiltersToggle = document.createElement('button');
            moreFiltersToggle.type = 'button';
            moreFiltersToggle.className = 'more-filters-toggle';
            moreFiltersToggle.hidden = true;
            moreFiltersToggle.setAttribute('aria-expanded', 'false');
            moreFiltersToggle.setAttribute('aria-controls', 'archive-secondary-chips');
            moreFiltersToggle.textContent = 'More Filters';
            moreFiltersToggle.addEventListener('click', () => {
                moreFiltersOpen = !moreFiltersOpen;
                render();
            });
            primaryChipsEl.appendChild(moreFiltersToggle);
        }
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

    // Update active secondary chips row (shown above secondary list)
    function updateActiveChipsRow() {
        [activeChipsEl, drawerActiveChipsEl].filter(Boolean).forEach(container => {
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
                    visibleCount = 25;
                    render();
                });
                container.appendChild(btn);
            });
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
    // list (#archive-secondary-chips on desktop, #filter-drawer-chips in the
    // Filter Drawer), where an active tag is already shown separately in its
    // context's own active-chips row (#archive-active-chips /
    // #filter-drawer-active-chips) — that duplicate must render Dim, not
    // Active, so only the true active-chips-row instance ever shows the
    // Active state for a given slug. aria-pressed/×/aria-label stay driven by
    // the real isActive value regardless of this distinction, since the
    // underlying toggle state (and its removability) is unchanged — only the
    // visual Active/Dim classing differs for the duplicate.
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
        const slice    = filtered.slice(0, visibleCount);

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

        // Disable Clear buttons when no filters are active (search text alone does not count)
        document.querySelectorAll('.archive-clear-btn').forEach(btn => {
            btn.disabled = filterCount === 0;
        });

        // Secondary tag chips (inline + drawer)
        document.querySelectorAll('[data-filter-tag]').forEach(btn => {
            const slug     = btn.dataset.filterTag;
            const isActive = activeSecondary.has(slug);
            const anyActive = activeSecondary.size > 0;
            const isDuplicateOfActiveRow = !!btn.closest('#archive-secondary-chips, #filter-drawer-chips');
            applyChipState(btn, { isActive, anyActive, isDuplicateOfActiveRow });
            const count = getChipCountForTag(slug);
            const tagCountEl = btn.querySelector('.chip-count');
            if (tagCountEl) tagCountEl.textContent = ` ${count}`;
            btn.classList.toggle('tag-chip--zero-count', count === 0);
        });

        // Filter Drawer (mobile/tablet) "Show More" / "Show Less" progressive
        // disclosure — collapses the visible secondary tag list (already
        // alphabetically sorted; zero-count tags already excluded above) to
        // the first 10. Unaffected by the desktop More Filters toggle below —
        // this is the pre-existing drawer behaviour, untouched.
        if (drawerChipsEl) {
            const visibleTags = [...drawerChipsEl.querySelectorAll('[data-filter-tag]')]
                .filter(btn => !btn.classList.contains('tag-chip--zero-count'));
            const overflowCount = visibleTags.length - 10;

            visibleTags.forEach((btn, i) => {
                btn.classList.toggle('tag-chip--collapsed', i >= 10 && !secondaryExpanded);
            });

            const moreToggle = drawerPrimaryChipsEl ? drawerPrimaryChipsEl.querySelector('.tag-chip-more') : null;
            if (moreToggle) {
                moreToggle.hidden = overflowCount <= 0;
                moreToggle.textContent = secondaryExpanded ? 'Show Less' : 'Show More';
                moreToggle.setAttribute('aria-expanded', String(secondaryExpanded));
            }
        }

        // Desktop "More Filters" / "Less Filters" — the entire secondary tag
        // row is hidden by default (on load and on every fresh navigation,
        // since moreFiltersOpen always starts false) and revealed as one
        // block, rather than the drawer's first-10-then-overflow disclosure.
        // A currently-active secondary tag (e.g. from a ?tag= URL param)
        // still shows in #archive-active-chips regardless of this state —
        // that row is separate from #archive-secondary-chips.
        if (inlineFiltersEl) {
            const hasSecondaryTags = !!inlineFiltersEl.querySelector('[data-filter-tag]:not(.tag-chip--zero-count)');
            inlineFiltersEl.hidden = !moreFiltersOpen;

            const moreFiltersToggle = primaryChipsEl ? primaryChipsEl.querySelector('.more-filters-toggle') : null;
            if (moreFiltersToggle) {
                moreFiltersToggle.hidden = !hasSecondaryTags;
                moreFiltersToggle.textContent = moreFiltersOpen ? 'Less Filters' : 'More Filters';
                moreFiltersToggle.setAttribute('aria-expanded', String(moreFiltersOpen));
            }
        }

        updateActiveChipsRow();

        // Results
        resultsEl.innerHTML = '';
        if (slice.length === 0) {
            const msg = document.createElement('p');
            msg.className = 'archive-empty';
            msg.textContent = 'No entries match the current filters.';
            resultsEl.appendChild(msg);
        } else {
            slice.forEach(e => resultsEl.appendChild(buildCard(e)));
        }

        // Load More
        if (loadMoreBtn) loadMoreBtn.hidden = filtered.length <= visibleCount;
    }

    // Wire primary type chips (exclusive toggle — replace, not stack)
    primaryChips.forEach(btn => {
        btn.dataset.label = btn.textContent.trim();
        btn.addEventListener('click', () => {
            const type = btn.dataset.filterType;
            activeType = activeType === type ? null : type;
            visibleCount = 25;
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
            visibleCount = 25;
            render();
        });
    });

    // Shows/hides a search input's own inline Clear (X) button — visible only
    // while the field is both focused AND has text. Purely a display concern,
    // no filter state involved. Called from the input's own input/focus/blur
    // listeners so all three events funnel through this one check.
    function updateSearchClearVisibility(input) {
        const wrap = input.closest('.archive-search-wrap');
        const clearBtn = wrap ? wrap.querySelector('.archive-search-clear') : null;
        if (clearBtn) clearBtn.hidden = !(document.activeElement === input && input.value.length > 0);
    }

    // Wire search inputs (header + drawer), debounced 250ms, synced
    searchInputs.forEach(input => {
        input.addEventListener('input', () => {
            updateSearchClearVisibility(input);
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                currentQuery = input.value.trim().toLowerCase();
                searchInputs.forEach(other => {
                    if (other !== input) {
                        other.value = input.value;
                        updateSearchClearVisibility(other);
                    }
                });
                visibleCount = 25;
                render();
            }, 250);
        });

        // Enter/Return dismisses the keyboard only — live search already
        // updates as the user types, so this doesn't submit or filter again.
        // No visible button triggers this anymore — the virtual keyboard's
        // own Return/Search key and the physical Enter key are the only
        // affordances, and both already fire this same 'keydown' listener.
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                input.blur();
            }
        });

        // X button visibility depends on focus as well as text — update on
        // both, in addition to the 'input' listener above, so all three
        // events funnel through the same updateSearchClearVisibility() check.
        input.addEventListener('focus', () => updateSearchClearVisibility(input));
        input.addEventListener('blur', () => updateSearchClearVisibility(input));
    });

    // Wire inline Clear (X) buttons — clears this field's text only (both
    // instances stay synced), leaves activeType/activeSecondary untouched,
    // and keeps focus in the field so the user can immediately retype. This
    // is distinct from .archive-clear-btn, which resets everything.
    document.querySelectorAll('.archive-search-clear').forEach(btn => {
        const input = btn.closest('.archive-search-wrap')?.querySelector('.archive-search-input');
        if (!input) return;

        // Without this, mousedown on the button blurs the input first (the
        // browser's default focus-shift behaviour), which hides this button
        // via updateSearchClearVisibility() before 'click' ever fires — so
        // the click silently never registers. Prevent the default mousedown
        // action so the input never loses focus in the first place.
        btn.addEventListener('mousedown', (e) => e.preventDefault());

        btn.addEventListener('click', () => {
            input.value = '';
            currentQuery = '';
            searchInputs.forEach(other => {
                if (other !== input) {
                    other.value = '';
                    updateSearchClearVisibility(other);
                }
            });
            updateSearchClearVisibility(input);
            visibleCount = 25;
            clearTimeout(debounceTimer);
            render();
            input.focus();
        });
    });

    // Auto-collapse the Filter Drawer's chip rows on search focus — mobile
    // only (max-width: 767px, matching style.css's mobile breakpoint).
    // Deliberately independent of the sticky header's scroll-driven
    // .is-condensed state (a different element, a different trigger) — this
    // only toggles .filter-drawer--search-focused on #filter-drawer itself.
    const filterDrawerEl = document.getElementById('filter-drawer');
    if (filterDrawerEl) {
        searchInputs.forEach(input => {
            input.addEventListener('focus', () => {
                if (window.matchMedia('(max-width: 767px)').matches) {
                    filterDrawerEl.classList.add('filter-drawer--search-focused');
                }
            });
            input.addEventListener('blur', () => {
                filterDrawerEl.classList.remove('filter-drawer--search-focused');
            });
        });
    }

    function doReset() {
        activeType = null;
        activeSecondary.clear();
        currentQuery = '';
        currentSort = 'latest';
        visibleCount = 25;
        searchInputs.forEach(input => {
            input.value = '';
            updateSearchClearVisibility(input);
        });
        const url = new URL(window.location.href);
        url.searchParams.delete('type');
        window.history.replaceState({}, '', url.toString());
        render();
    }

    // Wire clear buttons (header + drawer)
    document.querySelectorAll('.archive-clear-btn').forEach(btn => {
        btn.addEventListener('click', doReset);
    });

    // Wire Load More
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            visibleCount += 25;
            render();
        });
    }

    // IntersectionObserver — show action-rail-group and condense header when sentinel leaves viewport
    const sentinel = document.getElementById('archive-header-sentinel');
    const archiveHeader = document.getElementById('archive-sticky-header');
    if (sentinel && railGroup) {
        const headerObserver = new IntersectionObserver(entries => {
            const headerInView = entries[0].isIntersecting;
            // Drawer-open guard: don't update rail visibility or condensed state while drawer is open
            if (!document.querySelector('.filter-drawer--open')) {
                railGroup.classList.toggle('action-rail-group--visible', !headerInView);
                if (archiveHeader) archiveHeader.classList.toggle('is-condensed', !headerInView);
            }
        }, { threshold: 0 });
        headerObserver.observe(sentinel);
    }

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
                    // Filter Drawer (mobile/tablet) arrival state — arriving via a
                    // topic tag link keeps the drawer closed (see below), but
                    // pre-expands its secondary tag row so that when the user
                    // does open it manually, the active tag is shown in full
                    // context immediately — no extra "Show More" tap needed.
                    secondaryExpanded = true;
                }
            }

            buildSecondaryChips(entries);
            render();

            // Filter Drawer (mobile/tablet) arrival state — desktop's inline
            // filters have no open/closed concept, so this never applies there.
            // Scenario 2 only: arrived via a "View more Work/Thoughts" style
            // link (?type= present, no ?tag=) — open the drawer on arrival with
            // that primary filter already active. Direct navigation (no params)
            // and tag-link arrivals (Scenario 3, handled above) stay closed.
            const isDrawerBreakpoint = !window.matchMedia('(min-width: 1024px)').matches;
            if (isDrawerBreakpoint && filterDrawer && activeType && !arrivedViaValidTag) {
                const opener = document.querySelector('[aria-controls="filter-drawer"]');
                filterDrawer.openDrawer(opener);
            }
        })
        .catch(err => console.error('Error loading archive-entries.json:', err));
}
