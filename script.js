// Inject shared components, then wire up behavior that depends on them
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('nav-placeholder', 'nav.html', () => {
        initNav();
        setActiveNavLink();
    });
    loadComponent('footer-placeholder', 'footer.html');
    initBackToTop();
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

// Mobile Navigation Toggle
function initNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-links');

    navToggle.addEventListener('click', () => {
        const isOpen = navToggle.getAttribute('aria-expanded') === 'true';

        navToggle.setAttribute('aria-expanded', !isOpen);
        navMenu.classList.toggle('is-open');
        navToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('is-open');
            navToggle.setAttribute('aria-label', 'Open navigation menu');
        });
    });
}

// Mark the nav link matching the current page as active
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav-links a').forEach(link => {
        const linkPage = link.getAttribute('href');

        if (linkPage === currentPage) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
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

// Back to Top button
function initBackToTop() {
    const button = document.querySelector('.back-to-top');
    if (!button) return;

    window.addEventListener('scroll', () => {
        button.classList.toggle('is-visible', window.scrollY > 400);
    });

    button.addEventListener('click', () => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
    });
}
