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
    initFilterDrawer();
    initArchiveFilter();
    initArchive();
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

        const firstFocusable = drawer.querySelector(
            'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (firstFocusable) {
            requestAnimationFrame(() => firstFocusable.focus());
        }

        removeTrapFocus = trapFocus(drawer);
        document.addEventListener('keydown', handleEscape);
    }

    function closeDrawer() {
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
        btn.addEventListener('click', () => {
            if (drawer.hidden) openDrawer(btn);
            else closeDrawer();
        });
    });

    if (scrim) {
        scrim.addEventListener('click', closeDrawer);
    }
}

// Live archive filtering — shared between inline desktop chips and drawer chips.
// Expects: .archive-search-input, .tag-chip[data-filter], [data-tags] items.
function initArchiveFilter() {
    const searchInput = document.querySelector('.archive-search-input');
    const chipButtons = document.querySelectorAll('.tag-chip[data-filter]');
    const archiveItems = document.querySelectorAll('[data-tags]');

    if (!chipButtons.length) return;

    // Cache each chip's original label before any X spans are injected
    chipButtons.forEach(btn => {
        btn.dataset.label = btn.textContent.trim();
    });

    const activeFilters = new Set();
    let debounceTimer;

    function applyFilters() {
        const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

        archiveItems.forEach(item => {
            const tags = (item.dataset.tags || '').split(',').map(t => t.trim()).filter(Boolean);
            const titleEl = item.querySelector('[data-searchable]');
            const text = titleEl ? titleEl.textContent.toLowerCase() : '';

            const matchesSearch = !query || text.includes(query);
            const matchesTags = !activeFilters.size || [...activeFilters].some(f => tags.includes(f));

            item.hidden = !(matchesSearch && matchesTags);
        });

        chipButtons.forEach(btn => {
            const filter = btn.dataset.filter;
            const isActive = activeFilters.has(filter);
            const anyActive = activeFilters.size > 0;

            btn.classList.toggle('tag-chip--active', isActive);
            btn.classList.toggle('tag-chip--dim', !isActive && anyActive);
            btn.setAttribute('aria-pressed', String(isActive));

            // Inject or remove the × indicator
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

            if (isActive) {
                btn.setAttribute('aria-label', `Remove ${btn.dataset.label} filter`);
            } else {
                btn.removeAttribute('aria-label');
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(applyFilters, 250);
        });
    }

    chipButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            if (activeFilters.has(filter)) {
                activeFilters.delete(filter);
            } else {
                activeFilters.add(filter);
            }
            applyFilters();
        });
    });
}

// Archive page — fetch manifest, build chips, filter, sort, paginate, sync URL
function initArchive() {
    const resultsEl        = document.getElementById('archive-results');
    if (!resultsEl) return;

    const titleEl          = document.getElementById('archive-title');
    const countEl          = document.getElementById('archive-count');
    const searchInputs     = document.querySelectorAll('.archive-search-input');
    const railGroup        = document.querySelector('.action-rail-group');
    const primaryChips     = document.querySelectorAll('[data-filter-type]');
    const activeChipsEl    = document.getElementById('archive-active-chips');
    const inlineFiltersEl  = document.getElementById('archive-secondary-chips');
    const drawerChipsEl    = document.getElementById('filter-drawer-chips');
    const loadMoreBtn      = document.querySelector('.archive-load-more-btn');

    // State
    let allEntries         = [];
    let activeType         = null;
    const activeSecondary  = new Set();
    let currentSort        = 'latest';
    let currentQuery       = '';
    let visibleCount       = 25;
    let debounceTimer;

    // Read initial URL params
    const params = new URLSearchParams(window.location.search);
    const typeParam = params.get('type');
    const tagParam  = params.get('tag');
    if (typeParam === 'work' || typeParam === 'thoughts') activeType = typeParam;
    if (tagParam) activeSecondary.add(tagParam);

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
            `<a href="/archive.html?tag=${tagSlugs[i]}" class="tag">${escapeHTML(t)}</a>`
        ).join('');

        const imageHTML = entry.type === 'work'
            ? `<div class="card-image" role="presentation"></div>`
            : '';

        article.innerHTML = `
            <a href="${escapeHTML(url)}" class="card-block-link" aria-hidden="true" tabindex="-1"></a>
            ${imageHTML}
            <div class="card-content">
                <h3 class="card-title" data-searchable>${escapeHTML(entry.title)}</h3>
                <p>${escapeHTML(entry.excerpt || '')}</p>
                <div class="card-tags">${tagsHTML}</div>
                <p class="card-meta">${meta}</p>
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
        if (!activeChipsEl) return;
        activeChipsEl.innerHTML = '';
        activeChipsEl.classList.toggle('is-active', activeSecondary.size > 0);
        if (!activeSecondary.size) return;
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
            activeChipsEl.appendChild(btn);
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

        // Count (aria-live polite)
        if (countEl) {
            countEl.textContent = `${filtered.length} ${filtered.length === 1 ? 'Entry' : 'Entries'}`;
        }

        // Primary type chips
        primaryChips.forEach(btn => {
            const type     = btn.dataset.filterType;
            const isActive = activeType === type;
            const anyActive = activeType !== null;
            btn.classList.toggle('tag-chip--active', isActive);
            btn.classList.toggle('tag-chip--dim', !isActive && anyActive);
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
            else          btn.removeAttribute('aria-label');
            const typeCountEl = btn.querySelector('.chip-count');
            if (typeCountEl) typeCountEl.textContent = ` ${getChipCountForType(btn.dataset.filterType)}`;
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
            btn.classList.toggle('tag-chip--active', isActive);
            btn.classList.toggle('tag-chip--dim', !isActive && anyActive);
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
            else          btn.removeAttribute('aria-label');
            const tagCountEl = btn.querySelector('.chip-count');
            if (tagCountEl) tagCountEl.textContent = ` ${getChipCountForTag(btn.dataset.filterTag)}`;
        });

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

    // Wire search inputs (header + drawer), debounced 250ms, synced
    searchInputs.forEach(input => {
        input.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                currentQuery = input.value.trim().toLowerCase();
                searchInputs.forEach(other => {
                    if (other !== input) other.value = input.value;
                });
                visibleCount = 25;
                render();
            }, 250);
        });
    });

    function doReset() {
        activeType = null;
        activeSecondary.clear();
        currentQuery = '';
        currentSort = 'latest';
        visibleCount = 25;
        searchInputs.forEach(input => { input.value = ''; });
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
            buildSecondaryChips(entries);
            render();
        })
        .catch(err => console.error('Error loading archive-entries.json:', err));
}
