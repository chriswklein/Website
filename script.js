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
