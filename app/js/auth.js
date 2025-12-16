/**
 * RATTEL - Authentication Guard
 * Protects pages with password access
 */

(function() {
    'use strict';

    // Check authentication on page load
    function checkAuth() {
        if (sessionStorage.getItem('rattel_auth') !== 'true') {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    // Logout function
    function logout() {
        sessionStorage.removeItem('rattel_auth');
        window.location.href = 'login.html';
    }

    // Expose logout globally
    window.rattelLogout = logout;

    // Check auth immediately
    checkAuth();
})();
