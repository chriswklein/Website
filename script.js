// Inject shared components, then wire up behaviour that depends on them
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('nav-placeholder', 'nav.html', () => {
        initNav();
        setActiveNavLink();
    });
    loadComponent('footer-placeholder', 'footer.html');
    setActiveTabBar();
    initBackToTop();
    initShareButtons();
    initFilterDrawer();
    initArchiveFilter();
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
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

// Set aria-current="page" on the static tab bar item matching the current page
function setActiveTabBar() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.tab-bar-item').forEach(item => {
        if (item.getAttribute('href') === currentPage) {
            item.setAttribute('aria-current', 'page');
        } else {
            item.removeAttribute('aria-current');
        }
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

// Filter drawer — tablet/mobile only. Desktop shows inline chips.
// Depends on: trapFocus()
function initFilterDrawer() {
    const trigger = document.querySelector('.filter-drawer-trigger');
    const drawer = document.getElementById('filter-drawer');
    if (!trigger || !drawer) return;

    const closeBtn = drawer.querySelector('.filter-drawer-close');
    let removeTrapFocus = null;

    function openDrawer() {
        drawer.removeAttribute('hidden');
        requestAnimationFrame(() => {
            drawer.classList.add('filter-drawer--open');
        });
        trigger.setAttribute('aria-expanded', 'true');

        const firstFocusable = drawer.querySelector(
            'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (firstFocusable) {
            requestAnimationFrame(() => firstFocusable.focus());
        }

        removeTrapFocus = trapFocus(drawer);
        document.addEventListener('keydown', handleEscape);
    }

    function closeDrawer() {
        drawer.classList.remove('filter-drawer--open');
        trigger.setAttribute('aria-expanded', 'false');

        if (removeTrapFocus) {
            removeTrapFocus();
            removeTrapFocus = null;
        }
        document.removeEventListener('keydown', handleEscape);

        drawer.addEventListener('transitionend', () => {
            drawer.setAttribute('hidden', '');
        }, { once: true });

        trigger.focus();
    }

    function handleEscape(event) {
        if (event.key === 'Escape') closeDrawer();
    }

    trigger.addEventListener('click', () => {
        if (drawer.hidden) {
            openDrawer();
        } else {
            closeDrawer();
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeDrawer);
    }
}

// Live archive filtering — shared between inline desktop chips and drawer chips.
// Expects: .archive-search-input, .tag-chip[data-filter], [data-tags] items.
function initArchiveFilter() {
    const searchInput = document.querySelector('.archive-search-input');
    const chipButtons = document.querySelectorAll('.tag-chip[data-filter]');
    const archiveItems = document.querySelectorAll('[data-tags]');

    if (!searchInput && !chipButtons.length) return;

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
