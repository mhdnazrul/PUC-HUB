/**
 * PUC HUB — Universal Shared Navbar Component (PRO Version)
 * Fully Responsive: Desktop, Tablet, and Mobile
 */

(function () {
  'use strict';

  // ── Config ────────────────────────────────────────────────────────────────
  const PAGES = {
    'index.html': 'home',
    '/': 'home',
    '': 'home',
    'questionbank.html': 'services',
    'ai.html': 'services',
    'ai-study-tracker.html': 'services',
    'ai-notes-summarizer.html': 'services',
    'code-debugger.html': 'services',
    'ai-assignment-writer.html': 'services',
    'cgpa.html': 'services',
    'fee-calculator.html': 'services',
    'studyplanner.html': 'services',
    'Coverpages.html': 'services',
    'coverpages.html': 'services',
    'Blooddonation.html': 'services',
    'blooddonation.html': 'services',
    'Messnhousing.html': 'services',
    'messnhousing.html': 'services',
    'faculty.html': 'services',
    'notices.html': 'services',
    'holiday.html': 'services',
    'examroutine.html': 'services',
    'classroutine.html': 'services',
    'clubinfo.html': 'services',
    'study-partner-finder.html': 'services',
    'university-room-info.html': 'services',
    'youtube-playlists.html': 'services',
    'learning-resources.html': 'services',
    'Questionbank.html': 'services',
    'profile.html': 'profile',
    'history.html': 'activity',
    'admin.html': 'admin',
    'login.html': 'none',
  };

  function getCurrentPage() {
    const path = window.location.pathname;
    const file = path.split('/').pop() || '';
    return { file, section: PAGES[file] || PAGES[path] || 'home' };
  }

  function tryParseUser() {
    try { return JSON.parse(localStorage.getItem('userData')); }
    catch { return null; }
  }

  // ── Logout ────────────────────────────────────────────────────────────────
  window.pucLogout = async function () {
    if (!confirm('Are you sure you want to logout?')) return;
    try {
      await fetch((window.API_BASE || 'https://puc-hub-api.onrender.com/api/v1') + '/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (_) { }
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    window.location.href = getRootPrefix() + 'index.html';
  };

  function getRootPrefix() {
    const depth = window.location.pathname.split('/').length - 2;
    return depth > 0 ? '../'.repeat(depth) : '';
  }

  // ── Render ────────────────────────────────────────────────────────────────
  function render() {
    const navbar = document.getElementById('puc-navbar');
    if (!navbar) return;

    const user = tryParseUser();
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' && !!user;
    const { section } = getCurrentPage();
    const root = getRootPrefix();

    const activeClass = (s) => section === s ? 'active' : '';

    // Service items
    const serviceLinks = [
      { emoji: '⭐', label: 'Premium', type: 'divider' },
      { href: 'questionbank.html', emoji: '📚', label: 'Question Bank' },
      { href: 'ai.html', emoji: '🤖', label: 'PUC AI Assistant' },
      { href: 'Coverpages.html', emoji: '📝', label: 'Cover Page Generator' },
      { href: 'Blooddonation.html', emoji: '🩸', label: 'Blood Donation' },
      { href: 'studyplanner.html', emoji: '⚙️', label: 'Routine Generator' },
      { emoji: '🔵', label: 'Standard', type: 'divider' },
      { href: 'Messnhousing.html', emoji: '🏠', label: 'Mess & Housing' },
      { href: 'fee-calculator.html', emoji: '💰', label: 'Fee Calculator' },
      { href: 'faculty.html', emoji: '📞', label: 'Faculty Contacts' },
      { href: 'cgpa.html', emoji: '🎓', label: 'CGPA Calculator' },
      { href: 'holiday.html', emoji: '🏖', label: 'Holiday Calendar' },
      { emoji: '⚪', label: 'General', type: 'divider' },
      { href: 'classroutine.html', emoji: '📅', label: 'Class Routine' },
      { href: 'examroutine.html', emoji: '📋', label: 'Exam Routine' },
      { href: 'notices.html', emoji: '📢', label: 'Notice Board' },
      { href: 'clubinfo.html', emoji: '🏛', label: 'Club Information' },
      { emoji: '🟢', label: 'Normal', type: 'divider' },
      { href: 'study-partner-finder.html', emoji: '👥', label: 'Study Partner Finder' },
      { href: 'university-room-info.html', emoji: '🏫', label: 'University Room Info' },
      { href: 'youtube-playlists.html', emoji: '🎬', label: 'YouTube Playlists' },
      { href: 'learning-resources.html', emoji: '📚', label: 'Learning Resources' },
      { emoji: '🤖', label: 'AI Tools', type: 'divider' },
      { href: 'ai-study-tracker.html', emoji: '📊', label: 'AI Study Tracker' },
      { href: 'ai-notes-summarizer.html', emoji: '🧠', label: 'Notes Summarizer' },
      { href: 'code-debugger.html', emoji: '🐛', label: 'Code Debugger' },
      { href: 'ai-assignment-writer.html', emoji: '✍️', label: 'Assignment Writer' },
    ];

    const dropdownItemsHTML = serviceLinks.map(item => {
      if (item.type === 'divider') {
        return `<div class="puc-drop-label">${item.emoji} ${item.label}</div>`;
      }
      return `<a href="${root}${item.href}" class="puc-drop-item">${item.emoji} ${item.label}</a>`;
    }).join('');

    const thumb = (user && user.profileImage && user.profileImage.startsWith('data:image'))
      ? user.profileImage
      : root + 'assets/default-avatar.png';

    const rightHTML = isLoggedIn ? `
      <a href="${root}history.html" class="puc-nav-btn ${activeClass('activity')}">📊 Activity</a>
      ${user && user.isAdmin ? `<a href="${root}admin.html" class="puc-nav-btn puc-admin-btn ${activeClass('admin')}">⚡ Admin</a>` : ''}
      <div class="puc-profile-wrap">
        <button class="puc-profile-btn" id="puc-profile-toggle" aria-haspopup="true" aria-expanded="false">
          <img src="${thumb}" alt="Profile" class="puc-thumb" onerror="this.src='${root}assets/p.png'" />
          <span>${user.username || 'Profile'}</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><path d="M1 3l4 4 4-4"/></svg>
        </button>
        <div class="puc-profile-menu" id="puc-profile-menu" role="menu">
          <a href="${root}profile.html" role="menuitem">👤 My Profile</a>
          <a href="${root}history.html" role="menuitem">📊 My Activity</a>
          <div class="puc-menu-divider"></div>
          <a href="#" onclick="pucLogout(); return false;" role="menuitem" class="puc-logout-link">🚪 Logout</a>
        </div>
      </div>
    ` : `
      <a href="${root}login.html" class="puc-login-btn">Login</a>
    `;

    navbar.innerHTML = `
      <div class="puc-nav-inner">
        <a href="${root}index.html" class="puc-logo" aria-label="PUC HUB Home">
          <img src="${root}assets/p.png" alt="PUC Logo" onerror="this.src='${root}assets/p.png'" />
          <span>PUC HUB</span>
        </a>

        <button class="puc-hamburger" id="puc-hamburger" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>

        <div class="puc-menu-collapse" id="puc-menu-collapse">
          <div class="puc-nav-links" id="puc-nav-links" role="navigation">
            <a href="${root}index.html#home" class="puc-nav-link ${activeClass('home')}">Home</a>

            <div class="puc-dropdown">
              <button class="puc-nav-link puc-dropdown-btn" id="puc-services-btn">
                Services <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" style="margin-left:2px"><path d="M1 3l4 4 4-4"/></svg>
              </button>
              <div class="puc-dropdown-menu" id="puc-services-menu" role="menu">
                ${dropdownItemsHTML}
              </div>
            </div>

            <a href="${root}index.html#team" class="puc-nav-link">Team</a>
          </div>

          <div class="puc-nav-right" id="puc-nav-right">
            ${rightHTML}
          </div>
        </div>
      </div>
    `;

    attachEvents();
  }

  // ── Event Handlers ────────────────────────────────────────────────────────
  function attachEvents() {
    const ham = document.getElementById('puc-hamburger');
    const menuCollapse = document.getElementById('puc-menu-collapse');
    const svcBtn = document.getElementById('puc-services-btn');
    const svcMenu = document.getElementById('puc-services-menu');
    const profBtn = document.getElementById('puc-profile-toggle');
    const profMenu = document.getElementById('puc-profile-menu');

    // Toggle Mobile Menu
    if (ham && menuCollapse) {
      ham.addEventListener('click', (e) => {
        e.stopPropagation();
        ham.classList.toggle('open');
        menuCollapse.classList.toggle('open');
      });
    }

    // Toggle Services
    if (svcBtn && svcMenu) {
      svcBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = svcMenu.classList.contains('open');
        closeAllDropdowns();
        if (!isOpen) svcMenu.classList.add('open');
      });
    }

    // Toggle Profile
    if (profBtn && profMenu) {
      profBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = profMenu.classList.contains('open');
        closeAllDropdowns();
        if (!isOpen) profMenu.classList.add('open');
      });
    }

    function closeAllDropdowns() {
      if (svcMenu) svcMenu.classList.remove('open');
      if (profMenu) profMenu.classList.remove('open');
    }

    // Close menus when clicking outside
    document.addEventListener('click', (e) => {
      // Don't close mobile menu if clicking inside it
      if (menuCollapse && !menuCollapse.contains(e.target) && !ham.contains(e.target)) {
        ham && ham.classList.remove('open');
        menuCollapse.classList.remove('open');
      }
      closeAllDropdowns();
    });

    // Scroll effect
    const navbar = document.getElementById('puc-navbar');
    window.addEventListener('scroll', () => {
      if (!navbar) return;
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // ── Inject Styles ────────────────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('puc-navbar-styles')) return;
    const style = document.createElement('style');
    style.id = 'puc-navbar-styles';
    style.textContent = `
      :root {
        --puc-orange: #f39c12;
        --puc-orange-dark: #e67e22;
        --puc-bg: rgba(26, 13, 7, 0.95);
        --puc-border: rgba(243, 156, 18, 0.2);
        --puc-text: #e2e8f0;
        --puc-nav-h: 64px;
      }

      #puc-navbar {
        position: fixed;
        top: 0; left: 0; right: 0;
        z-index: 9999;
        height: var(--puc-nav-h);
        background: var(--puc-bg);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-bottom: 1px solid var(--puc-border);
        transition: all 0.3s ease;
      }
      #puc-navbar.scrolled {
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        background: rgba(20, 10, 5, 0.98);
      }
      body { padding-top: var(--puc-nav-h); }

      .puc-nav-inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 100%;
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 20px;
      }

      .puc-logo {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
        z-index: 100;
      }
      .puc-logo img {
        width: 36px; height: 36px;
        border-radius: 50%;
        border: 2px solid var(--puc-orange);
        object-fit: cover;
      }
      .puc-logo span {
        font-size: 1.15rem;
        font-weight: 800;
        color: var(--puc-orange);
        letter-spacing: 0.5px;
      }

      /* Desktop Layout Wrapper */
      .puc-menu-collapse {
        display: flex;
        flex: 1;
        justify-content: space-between;
        align-items: center;
      }

      .puc-nav-links {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0 auto;
      }

      .puc-nav-link, .puc-dropdown-btn {
        padding: 8px 16px;
        background: transparent;
        border: 1px solid transparent;
        border-radius: 8px;
        color: var(--puc-text);
        text-decoration: none;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: inherit;
        display: flex;
        align-items: center;
      }
      .puc-nav-link:hover, .puc-dropdown-btn:hover, .puc-nav-link.active {
        color: var(--puc-orange);
        background: rgba(243, 156, 18, 0.1);
      }

      /* Services Dropdown */
      .puc-dropdown { position: relative; }
      .puc-dropdown-menu {
        display: none;
        position: absolute;
        top: calc(100% + 10px);
        left: 50%;
        transform: translateX(-50%);
        background: #1f110a;
        border: 1px solid var(--puc-border);
        border-radius: 12px;
        padding: 8px;
        width: 260px;
        max-height: 400px;
        overflow-y: auto;
        z-index: 1000;
        box-shadow: 0 10px 40px rgba(0,0,0,0.6);
        animation: pucFadeIn 0.2s ease;
      }
      .puc-dropdown-menu.open { display: block; }

      /* Custom Scrollbar */
      .puc-dropdown-menu::-webkit-scrollbar { width: 6px; }
      .puc-dropdown-menu::-webkit-scrollbar-track { background: transparent; }
      .puc-dropdown-menu::-webkit-scrollbar-thumb { background: rgba(243,156,18,0.4); border-radius: 10px; }

      .puc-drop-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 8px;
        color: #d1d5db;
        text-decoration: none;
        font-size: 13.5px;
        transition: all 0.15s ease;
      }
      .puc-drop-item:hover { background: rgba(243,156,18,0.12); color: var(--puc-orange); transform: translateX(3px); }

      .puc-drop-label {
        font-size: 11px;
        color: #888;
        letter-spacing: 1px;
        text-transform: uppercase;
        padding: 12px 12px 4px;
        font-weight: 700;
      }

      /* Right Elements */
      .puc-nav-right {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .puc-nav-btn {
        padding: 8px 16px;
        border-radius: 24px;
        font-size: 13px;
        font-weight: 600;
        text-decoration: none;
        border: 1px solid var(--puc-border);
        color: var(--puc-text);
        background: transparent;
        transition: all 0.2s;
        cursor: pointer;
      }
      .puc-nav-btn:hover { border-color: var(--puc-orange); color: var(--puc-orange); background: rgba(243,156,18,0.1); }
      
      .puc-login-btn {
        background: linear-gradient(135deg, var(--puc-orange), var(--puc-orange-dark));
        color: #fff;
        padding: 8px 24px;
        border-radius: 24px;
        font-size: 14px;
        font-weight: 700;
        text-decoration: none;
        box-shadow: 0 4px 15px rgba(243,156,18,0.3);
        transition: all 0.2s;
      }
      .puc-login-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(243,156,18,0.5); }

      /* Profile Styling */
      .puc-profile-wrap { position: relative; }
      .puc-profile-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        background: rgba(243,156,18,0.1);
        border: 1px solid var(--puc-border);
        color: var(--puc-orange);
        padding: 4px 14px 4px 4px;
        border-radius: 24px;
        font-size: 13.5px;
        font-weight: 600;
        cursor: pointer;
        transition: 0.2s;
      }
      .puc-profile-btn:hover { background: rgba(243,156,18,0.2); }
      .puc-thumb {
        width: 28px; height: 28px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid var(--puc-orange);
      }
      .puc-profile-menu {
        display: none;
        position: absolute;
        top: calc(100% + 12px);
        right: 0;
        background: #1f110a;
        border: 1px solid var(--puc-border);
        border-radius: 12px;
        padding: 8px;
        width: 200px;
        z-index: 1000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        animation: pucFadeIn 0.2s ease;
      }
      .puc-profile-menu.open { display: block; }
      .puc-profile-menu a {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 8px;
        color: #d1d5db;
        text-decoration: none;
        font-size: 14px;
        transition: 0.2s;
      }
      .puc-profile-menu a:hover { background: rgba(243,156,18,0.1); color: var(--puc-orange); }
      .puc-logout-link:hover { color: #ff6b6b !important; background: rgba(255,107,107,0.1) !important; }
      .puc-menu-divider { height: 1px; background: var(--puc-border); margin: 6px 0; }

      /* Hamburger Menu */
      .puc-hamburger {
        display: none;
        flex-direction: column;
        justify-content: space-between;
        width: 26px; height: 18px;
        background: none; border: none;
        cursor: pointer; z-index: 100;
      }
      .puc-hamburger span {
        display: block; height: 2px; width: 100%;
        background: var(--puc-text);
        border-radius: 2px;
        transition: all 0.3s ease;
      }
      .puc-hamburger.open span:nth-child(1) { transform: translateY(8px) rotate(45deg); background: var(--puc-orange); }
      .puc-hamburger.open span:nth-child(2) { opacity: 0; }
      .puc-hamburger.open span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); background: var(--puc-orange); }

      @keyframes pucFadeIn {
        from { opacity: 0; transform: translateY(-10px) translateX(-50%); }
        to { opacity: 1; transform: translateY(0) translateX(-50%); }
      }

      /* ── Mobile Responsive ─────────────────────────────── */
      @media (max-width: 992px) {
        .puc-hamburger { display: flex; }
        
        .puc-menu-collapse {
          display: none;
          position: absolute;
          top: var(--puc-nav-h);
          left: 0;
          width: 100%;
          background: rgba(20, 10, 5, 0.98);
          backdrop-filter: blur(15px);
          flex-direction: column;
          align-items: flex-start;
          padding: 20px;
          border-bottom: 1px solid var(--puc-border);
          max-height: calc(100vh - var(--puc-nav-h));
          overflow-y: auto;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .puc-menu-collapse.open { display: flex; }

        .puc-nav-links { flex-direction: column; width: 100%; align-items: flex-start; gap: 4px; }
        .puc-nav-right { flex-direction: column; width: 100%; align-items: flex-start; margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--puc-border); }

        .puc-nav-link, .puc-dropdown-btn, .puc-nav-btn, .puc-login-btn { width: 100%; text-align: left; justify-content: flex-start; }
        
        .puc-dropdown { width: 100%; }
        .puc-dropdown-menu {
          position: static;
          transform: none;
          width: 100%;
          background: transparent;
          box-shadow: none;
          border: none;
          border-left: 2px solid var(--puc-border);
          border-radius: 0;
          margin-top: 5px;
          max-height: max-content; /* Let it flow naturally in mobile menu */
          animation: none;
          padding-left: 10px;
        }

        .puc-profile-wrap { width: 100%; }
        .puc-profile-menu {
          position: static;
          width: 100%;
          background: transparent;
          border: none; box-shadow: none;
          border-left: 2px solid var(--puc-border);
          border-radius: 0;
          padding-left: 10px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // ── Init ─────────────────────────────────────────────────────────────────
  function init() {
    injectStyles();
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();