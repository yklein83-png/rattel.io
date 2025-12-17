/**
 * RATTEL - Authentication Guard
 * Protects pages with beta password and user session
 */

(function() {
    'use strict';

    // Pages that require user login (not just beta access)
    const protectedPages = [
        'dashboard.html',
        'profil.html',
        'documents.html',
        'historique.html',
        'admin.html'
    ];

    // Check if current page requires user login
    function isProtectedPage() {
        const currentPage = window.location.pathname.split('/').pop();
        return protectedPages.some(page => currentPage.includes(page));
    }

    // Check beta access
    function checkBetaAuth() {
        if (sessionStorage.getItem('rattel_auth') !== 'true') {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    // Check user session (Supabase)
    async function checkUserSession() {
        try {
            // Check if supabaseClient is available
            if (typeof supabaseClient !== 'undefined') {
                const { data: { session } } = await supabaseClient.auth.getSession();
                if (!session) {
                    // No active session, redirect to login
                    sessionStorage.removeItem('rattel_user');
                    window.location.href = 'connexion.html';
                    return false;
                }
                return true;
            } else {
                // Fallback to sessionStorage check if Supabase not loaded yet
                const user = sessionStorage.getItem('rattel_user');
                if (!user) {
                    window.location.href = 'connexion.html';
                    return false;
                }
                return true;
            }
        } catch (error) {
            console.error('Session check error:', error);
            // Fallback to sessionStorage
            const user = sessionStorage.getItem('rattel_user');
            if (!user) {
                window.location.href = 'connexion.html';
                return false;
            }
            return true;
        }
    }

    // Logout function
    async function logout() {
        try {
            if (typeof signOut === 'function') {
                await signOut();
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
        sessionStorage.removeItem('rattel_user');
        window.location.href = 'connexion.html';
    }

    // Expose logout globally
    window.rattelLogout = logout;

    // Check auth immediately
    if (checkBetaAuth()) {
        // If on protected page, also check user session
        if (isProtectedPage()) {
            checkUserSession();
        }
    }
})();
