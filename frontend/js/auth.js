// ========== AUTHENTICATION FUNCTIONS ==========
//<!-- Made by: Team PUC HUB | Internet Programming Lab Project -->
//<!--Rahul-->

let currentUser = null;

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userData = localStorage.getItem('userData');

    if (isLoggedIn === 'true' && userData) {
        try {
            currentUser = JSON.parse(userData);
            updateNavbarForLoggedInUser();
            return true;
        } catch (e) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userData');
            updateNavbarForLoggedOutUser();
            return false;
        }
    } else {
        updateNavbarForLoggedOutUser();
        return false;
    }
}

function getNavPrefix() {
    const path = window.location.pathname;
    const isIndex = path.endsWith('index.html') || path.endsWith('/') || path === '';
    return isIndex ? '' : 'index.html';
}

// ── লগইন করা অবস্থায় নেভবার (Admin বাদ, My Activity যোগ) ──
function updateNavbarForLoggedInUser() {
    const navLinks = document.getElementById('navLinks');
    if (!navLinks) return;

    let user = currentUser;
    if (!user) {
        try {
            user = JSON.parse(localStorage.getItem('userData'));
        } catch (e) { logout(); return; }
    }

    const profileImage = (user.profileImage && user.profileImage.startsWith('data:image'))
        ? user.profileImage
        : 'assets/default-avatar.png';
    const prefix = getNavPrefix();

    const homeHref    = prefix ? prefix + '#home'     : '#home';
    const serviceHref = prefix ? prefix + '#services' : '#services';
    const teamHref    = prefix ? prefix + '#team'     : '#team';
    const homeTarget  = prefix ? '' : 'data-target="home"';
    const svcTarget   = prefix ? '' : 'data-target="services"';
    const teamTarget  = prefix ? '' : 'data-target="team"';

    navLinks.innerHTML = `
        <li><a href="${homeHref}" class="nav-link" ${homeTarget}>Home</a></li>
        <li><a href="${serviceHref}" class="nav-link" ${svcTarget}>Services</a></li>
        <li><a href="${teamHref}" class="nav-link" ${teamTarget}>Team</a></li>
        <li>
            <a href="history.html" class="my-activity-btn">📊 My Activity</a>
        </li>
        <li>
            <div class="profile-dropdown">
                <button class="profile-btn" onclick="window.location.href='profile.html'">
                    <img src="${profileImage}" alt="Profile" class="profile-thumb" onerror="this.src='assets/p.png'">
                    <span>${user.username || 'Profile'}</span>
                </button>
                <div class="dropdown-content">
                    <a href="profile.html">👤 My Profile</a>
                    <a href="history.html">📊 My Activity</a>
                    <a href="#" onclick="logout(); return false;">🚪 Logout</a>
                </div>
            </div>
        </li>
    `;

    if (typeof initializeNavigation === 'function') {
        initializeNavigation();
    }
}

// ── লগইন না করা অবস্থায় নেভবার (Admin বাদ) ──
function updateNavbarForLoggedOutUser() {
    const navLinks = document.getElementById('navLinks');
    if (!navLinks) return;

    const prefix = getNavPrefix();
    const homeHref    = prefix ? prefix + '#home'     : '#home';
    const serviceHref = prefix ? prefix + '#services' : '#services';
    const teamHref    = prefix ? prefix + '#team'     : '#team';
    const homeTarget  = prefix ? '' : 'data-target="home"';
    const svcTarget   = prefix ? '' : 'data-target="services"';
    const teamTarget  = prefix ? '' : 'data-target="team"';

    navLinks.innerHTML = `
        <li><a href="${homeHref}" class="nav-link active" ${homeTarget}>Home</a></li>
        <li><a href="${serviceHref}" class="nav-link" ${svcTarget}>Services</a></li>
        <li><a href="${teamHref}" class="nav-link" ${teamTarget}>Team</a></li>
        <li><button class="login-btn" onclick="goToLogin()">Login</button></li>
    `;

    if (typeof initializeNavigation === 'function') {
        initializeNavigation();
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userData');
        currentUser = null;
        window.location.href = 'index.html';
    }
}

function goToLogin() {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});