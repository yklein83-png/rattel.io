/**
 * Theme Toggle for RATTEL
 * Handles dark/light mode switching with localStorage persistence
 * Light mode is default, dark mode uses [data-theme="dark"]
 */
(function() {
    'use strict';

    // Apply saved theme immediately to prevent flash
    const savedTheme = localStorage.getItem('rattel_theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Initialize theme toggle when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        // Create and insert theme toggle button if not present
        if (!document.getElementById('themeToggle')) {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'theme-toggle';
            toggleBtn.id = 'themeToggle';
            toggleBtn.setAttribute('aria-label', 'Changer le theme');
            toggleBtn.innerHTML = '<span class="icon-sun">☀️</span><span class="icon-moon">🌙</span>';
            document.body.appendChild(toggleBtn);
        }

        const themeToggle = document.getElementById('themeToggle');
        const html = document.documentElement;

        themeToggle.addEventListener('click', function() {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            if (newTheme === 'dark') {
                html.setAttribute('data-theme', 'dark');
            } else {
                html.removeAttribute('data-theme');
            }

            localStorage.setItem('rattel_theme', newTheme);
        });
    });
})();
