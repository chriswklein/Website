// Inject shared components, then wire up behavior that depends on them
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('nav-placeholder', 'nav.html', initNav);
    loadComponent('footer-placeholder', 'footer.html');
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
