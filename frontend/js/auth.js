// ========== AUTHENTICATION HELPERS ==========
// This file is kept for backwards compatibility.
// All navbar rendering is now handled by js/navbar.js.
// These functions are still used by inner pages that haven't yet been migrated.

let currentUser = null;

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userData   = localStorage.getItem('userData');

    if (isLoggedIn === 'true' && userData) {
        try {
            currentUser = JSON.parse(userData);
            return true;
        } catch (e) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userData');
            return false;
        }
    }
    return false;
}

/**
 * Logout — revokes refresh token on server, then clears local state.
 * This mirrors pucLogout() in navbar.js but is kept here for pages
 * that call logout() via inline onclick handlers.
 */
function logout() {
    if (!confirm('Are you sure you want to logout?')) return;

    const apiBase = (window.API_BASE || 'https://puc-hub-api.onrender.com/api/v1');
    fetch(apiBase + '/auth/logout', { method: 'POST', credentials: 'include' })
      .catch(() => {})
      .finally(() => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userData');
        currentUser = null;
        window.location.href = 'index.html';
      });
}

function goToLogin() {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', function () {
    checkLoginStatus();
});