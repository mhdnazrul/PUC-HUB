/**
 * PUC HUB — Universal Shared Navbar Component
 *
 * Include this script at the TOP of any page (after config.js).
 * It renders the full navbar automatically, handles:
 *   - Auth state (logged in / logged out)
 *   - Mobile hamburger menu
 *   - Active page highlighting
 *   - Admin panel link for admin users
 *   - Logout with refresh token revocation
 *
 * Required DOM element: <nav id="puc-navbar"></nav>
 */

(function () {
  'use strict';

  // ── Config ────────────────────────────────────────────────────────────────
  const PAGES = {
    'index.html':              'home',
    '/':                       'home',
    '':                        'home',
    'questionbank.html':       'services',
    'ai.html':                 'services',
    'ai-study-tracker.html':   'services',
    'ai-notes-summarizer.html':'services',
    'code-debugger.html':      'services',
    'ai-assignment-writer.html':'services',
    'cgpa.html':               'services',
    'fee-calculator.html':     'services',
    'studyplanner.html':       'services',
    'Coverpages.html':         'services',
    'coverpages.html':         'services',
    'Blooddonation.html':      'services',
    'blooddonation.html':      'services',
    'Messnhousing.html':       'services',
    'messnhousing.html':       'services',
    'faculty.html':            'services',
    'notices.html':            'services',
    'holiday.html':            'services',
    'examroutine.html':        'services',
    'classroutine.html':       'services',
    'clubinfo.html':           'services',
    'study-partner-finder.html':'services',
    'university-room-info.html':'services',
    'youtube-playlists.html':  'services',
    'learning-resources.html': 'services',
    'Questionbank.html':       'services',
    'profile.html':            'profile',
    'history.html':            'activity',
    'admin.html':              'admin',
    'login.html':              'none',
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
    // Best-effort: revoke refresh token on server
    try {
      await fetch((window.API_BASE || 'https://puc-hub-api.onrender.com/api/v1') + '/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (_) {}
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    window.location.href = getRootPrefix() + 'index.html';
  };

  function getRootPrefix() {
    // Calculate relative path back to root from current page
    const depth = window.location.pathname.split('/').length - 2;
    return depth > 0 ? '../'.repeat(depth) : '';
  }

  // ── Render ────────────────────────────────────────────────────────────────
  function render() {
    const navbar = document.getElementById('puc-navbar');
    if (!navbar) return;

    const user = tryParseUser();
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' && !!user;
    const { file, section } = getCurrentPage();
    const root = getRootPrefix();

    const activeClass = (s) => section === s ? 'active' : '';

    // Service items for dropdown
    const serviceLinks = [
      { emoji: '⭐', label: 'Premium', type: 'divider' },
      { href: 'questionbank.html',        emoji: '📚', label: 'Question Bank' },
      { href: 'ai.html',                  emoji: '🤖', label: 'PUC AI Assistant' },
      { href: 'Coverpages.html',          emoji: '📝', label: 'Cover Page Generator' },
      { href: 'Blooddonation.html',       emoji: '🩸', label: 'Blood Donation' },
      { href: 'studyplanner.html',        emoji: '⚙️', label: 'Routine Generator' },
      { emoji: '🔵', label: 'Standard', type: 'divider' },
      { href: 'Messnhousing.html',        emoji: '🏠', label: 'Mess & Housing' },
      { href: 'fee-calculator.html',      emoji: '💰', label: 'Fee Calculator' },
      { href: 'faculty.html',             emoji: '📞', label: 'Faculty Contacts' },
      { href: 'cgpa.html',               emoji: '🎓', label: 'CGPA Calculator' },
      { href: 'holiday.html',            emoji: '🏖', label: 'Holiday Calendar' },
      { emoji: '⚪', label: 'General', type: 'divider' },
      { href: 'classroutine.html',        emoji: '📅', label: 'Class Routine' },
      { href: 'examroutine.html',         emoji: '📋', label: 'Exam Routine' },
      { href: 'notices.html',             emoji: '📢', label: 'Notice Board' },
      { href: 'clubinfo.html',            emoji: '🏛', label: 'Club Information' },
      { emoji: '🟢', label: 'Normal', type: 'divider' },
      { href: 'study-partner-finder.html',emoji: '👥', label: 'Study Partner Finder' },
      { href: 'university-room-info.html',emoji: '🏫', label: 'University Room Info' },
      { href: 'youtube-playlists.html',   emoji: '🎬', label: 'YouTube Playlists' },
      { href: 'learning-resources.html',  emoji: '📚', label: 'Learning Resources' },
      { emoji: '🤖', label: 'AI Tools', type: 'divider' },
      { href: 'ai-study-tracker.html',    emoji: '📊', label: 'AI Study Tracker' },
      { href: 'ai-notes-summarizer.html', emoji: '🧠', label: 'Notes Summarizer' },
      { href: 'code-debugger.html',       emoji: '🐛', label: 'Code Debugger' },
      { href: 'ai-assignment-writer.html',emoji: '✍️', label: 'Assignment Writer' },
    ];

    const dropdownItemsHTML = serviceLinks.map(item => {
      if (item.type === 'divider') {
        return `<div class="puc-drop-label">${item.emoji} ${item.label}</div>`;
      }
      return `<a href="${root}${item.href}" class="puc-drop-item">${item.emoji} ${item.label}</a>`;
    }).join('');

    // Profile image
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

        <div class="puc-nav-links" id="puc-nav-links" role="navigation" aria-label="Main navigation">
          <a href="${root}index.html#home" class="puc-nav-link ${activeClass('home')}">Home</a>

          <div class="puc-dropdown" role="none">
            <button class="puc-nav-link puc-dropdown-btn" aria-haspopup="true" aria-expanded="false" id="puc-services-btn">
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

        <button class="puc-hamburger" id="puc-hamburger" aria-label="Toggle menu" aria-expanded="false" aria-controls="puc-nav-links puc-nav-right">
          <span></span><span></span><span></span>
        </button>
      </div>
    `;

    attachEvents();
  }

  // ── Event Handlers ────────────────────────────────────────────────────────
  function attachEvents() {
    // Hamburger toggle
    const ham = document.getElementById('puc-hamburger');
    const navLinks = document.getElementById('puc-nav-links');
    const navRight = document.getElementById('puc-nav-right');

    if (ham) {
      ham.addEventListener('click', () => {
        const open = ham.classList.toggle('open');
        ham.setAttribute('aria-expanded', open);
        navLinks && navLinks.classList.toggle('open', open);
        navRight && navRight.classList.toggle('open', open);
      });
    }

    // Services dropdown — click toggle (works on both touch & mouse)
    const svcBtn = document.getElementById('puc-services-btn');
    const svcMenu = document.getElementById('puc-services-menu');
    if (svcBtn && svcMenu) {
      svcBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = svcMenu.classList.toggle('open');
        svcBtn.setAttribute('aria-expanded', open);
      });
    }

    // Profile dropdown — click toggle
    const profBtn = document.getElementById('puc-profile-toggle');
    const profMenu = document.getElementById('puc-profile-menu');
    if (profBtn && profMenu) {
      profBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = profMenu.classList.toggle('open');
        profBtn.setAttribute('aria-expanded', open);
      });
    }

    // Close all dropdowns when clicking outside
    document.addEventListener('click', () => {
      svcMenu && svcMenu.classList.remove('open');
      svcBtn && svcBtn.setAttribute('aria-expanded', 'false');
      profMenu && profMenu.classList.remove('open');
      profBtn && profBtn.setAttribute('aria-expanded', 'false');
    });

    // Close mobile menu on nav link click
    document.querySelectorAll('#puc-nav-links .puc-nav-link, #puc-nav-right a').forEach(link => {
      link.addEventListener('click', () => {
        ham && ham.classList.remove('open');
        ham && ham.setAttribute('aria-expanded', 'false');
        navLinks && navLinks.classList.remove('open');
        navRight && navRight.classList.remove('open');
      });
    });

    // Scroll navbar effect
    const navbar = document.getElementById('puc-navbar');
    window.addEventListener('scroll', () => {
      if (!navbar) return;
      navbar.classList.toggle('scrolled', window.scrollY > 60);
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
        --puc-bg: rgba(43, 24, 15, 0.92);
        --puc-border: rgba(243, 156, 18, 0.25);
        --puc-text: #ddd;
        --puc-nav-h: 62px;
      }

      #puc-navbar {
        position: fixed;
        top: 0; left: 0; right: 0;
        z-index: 1000;
        height: var(--puc-nav-h);
        background: var(--puc-bg);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border-bottom: 1px solid var(--puc-border);
        transition: box-shadow 0.3s;
      }
      #puc-navbar.scrolled {
        box-shadow: 0 4px 24px rgba(0,0,0,0.4);
        background: rgba(43, 24, 15, 0.98);
      }
      body { padding-top: var(--puc-nav-h); }

      .puc-nav-inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 100%;
        padding: 0 24px;
        gap: 12px;
      }

      /* Logo */
      .puc-logo {
        display: flex;
        align-items: center;
        gap: 9px;
        text-decoration: none;
        flex-shrink: 0;
      }
      .puc-logo img {
        width: 34px; height: 34px;
        border-radius: 50%;
        border: 2px solid var(--puc-orange);
        object-fit: cover;
      }
      .puc-logo span {
        font-size: 18px;
        font-weight: 800;
        color: var(--puc-orange);
        letter-spacing: 1px;
      }

      /* Center links */
      .puc-nav-links {
        display: flex;
        align-items: center;
        gap: 4px;
        flex: 1;
        justify-content: center;
      }

      .puc-nav-link, .puc-dropdown-btn {
        padding: 7px 14px;
        background: transparent;
        border: 1px solid transparent;
        border-radius: 8px;
        color: var(--puc-text);
        text-decoration: none;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        letter-spacing: 0.4px;
        transition: color 0.2s, border-color 0.2s, background 0.2s;
        font-family: inherit;
        white-space: nowrap;
      }
      .puc-nav-link:hover, .puc-dropdown-btn:hover,
      .puc-nav-link.active {
        color: var(--puc-orange);
        border-color: var(--puc-border);
        background: rgba(243, 156, 18, 0.08);
      }

      /* Services Dropdown */
      .puc-dropdown { position: relative; }
      .puc-dropdown-menu {
        display: none;
        position: absolute;
        top: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%);
        background: #1a0d07;
        border: 1px solid var(--puc-border);
        border-radius: 14px;
        padding: 8px;
        min-width: 220px;
        max-height: 360px;
        overflow-y: auto;
        z-index: 999;
        box-shadow: 0 12px 40px rgba(0,0,0,0.55);
        animation: pucDropIn 0.18s ease;
      }
      .puc-dropdown-menu.open { display: block; }
      @keyframes pucDropIn {
        from { opacity: 0; transform: translateX(-50%) translateY(-6px); }
        to   { opacity: 1; transform: translateX(-50%) translateY(0); }
      }
      .puc-dropdown-menu::-webkit-scrollbar { width: 5px; }
      .puc-dropdown-menu::-webkit-scrollbar-track { background: transparent; }
      .puc-dropdown-menu::-webkit-scrollbar-thumb { background: rgba(243,156,18,0.3); border-radius: 10px; }

      .puc-drop-item {
        display: flex;
        align-items: center;
        gap: 9px;
        padding: 8px 12px;
        border-radius: 8px;
        color: #aaa;
        text-decoration: none;
        font-size: 13px;
        white-space: nowrap;
        transition: background 0.15s, color 0.15s;
      }
      .puc-drop-item:hover { background: rgba(243,156,18,0.08); color: var(--puc-orange); }

      .puc-drop-label {
        font-size: 10px;
        color: #555;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        padding: 8px 12px 4px;
        font-weight: 700;
      }

      /* Right side */
      .puc-nav-right {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
      }

      .puc-nav-btn {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 7px 14px;
        border-radius: 22px;
        font-size: 12.5px;
        font-weight: 700;
        text-decoration: none;
        border: 1px solid var(--puc-border);
        color: var(--puc-text);
        background: transparent;
        white-space: nowrap;
        transition: 0.2s;
        cursor: pointer;
      }
      .puc-nav-btn:hover, .puc-nav-btn.active {
        border-color: var(--puc-orange);
        color: var(--puc-orange);
        background: rgba(243,156,18,0.08);
      }
      .puc-admin-btn {
        background: rgba(108,99,255,0.12);
        border-color: rgba(108,99,255,0.4);
        color: #a78bfa;
      }
      .puc-admin-btn:hover {
        background: rgba(108,99,255,0.2);
        border-color: #a78bfa;
        color: #a78bfa;
      }

      /* Login button */
      .puc-login-btn {
        background: linear-gradient(135deg, var(--puc-orange), var(--puc-orange-dark));
        color: #fff;
        border: none;
        padding: 8px 22px;
        border-radius: 22px;
        font-size: 12.5px;
        font-weight: 700;
        cursor: pointer;
        text-decoration: none;
        letter-spacing: 0.4px;
        transition: transform 0.2s, box-shadow 0.2s;
        box-shadow: 0 3px 12px rgba(243,156,18,0.25);
        white-space: nowrap;
      }
      .puc-login-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 5px 20px rgba(243,156,18,0.4);
      }

      /* Profile dropdown */
      .puc-profile-wrap { position: relative; }
      .puc-profile-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        background: rgba(243,156,18,0.1);
        border: 1px solid rgba(243,156,18,0.35);
        color: var(--puc-orange);
        padding: 6px 14px 6px 6px;
        border-radius: 22px;
        font-size: 12.5px;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.2s;
        font-family: inherit;
        white-space: nowrap;
      }
      .puc-profile-btn:hover { background: rgba(243,156,18,0.2); }
      .puc-thumb {
        width: 26px; height: 26px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid rgba(243,156,18,0.5);
        flex-shrink: 0;
      }
      .puc-profile-menu {
        display: none;
        position: absolute;
        top: calc(100% + 10px);
        right: 0;
        background: #1a0d07;
        border: 1px solid var(--puc-border);
        border-radius: 12px;
        padding: 6px;
        min-width: 180px;
        z-index: 999;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        animation: pucDropIn 0.18s ease;
      }
      .puc-profile-menu.open { display: block; }
      .puc-profile-menu a {
        display: flex;
        align-items: center;
        gap: 9px;
        padding: 9px 13px;
        border-radius: 8px;
        color: #aaa;
        text-decoration: none;
        font-size: 13px;
        transition: 0.15s;
        white-space: nowrap;
      }
      .puc-profile-menu a:hover { background: rgba(243,156,18,0.08); color: var(--puc-orange); }
      .puc-logout-link:hover { color: #ef4444 !important; background: rgba(239,68,68,0.08) !important; }
      .puc-menu-divider { height: 1px; background: rgba(243,156,18,0.1); margin: 4px 0; }

      /* Hamburger */
      .puc-hamburger {
        display: none;
        flex-direction: column;
        justify-content: space-between;
        width: 28px; height: 20px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        flex-shrink: 0;
      }
      .puc-hamburger span {
        display: block;
        height: 2px;
        background: var(--puc-text);
        border-radius: 2px;
        transition: transform 0.25s, opacity 0.25s, background 0.2s;
      }
      .puc-hamburger.open span:nth-child(1) { transform: translateY(9px) rotate(45deg); background: var(--puc-orange); }
      .puc-hamburger.open span:nth-child(2) { opacity: 0; }
      .puc-hamburger.open span:nth-child(3) { transform: translateY(-9px) rotate(-45deg); background: var(--puc-orange); }

      /* ── Mobile Responsive ─────────────────────────────── */
      @media (max-width: 768px) {
        .puc-hamburger { display: flex; }

        .puc-nav-links,
        .puc-nav-right {
          display: none;
          flex-direction: column;
          align-items: stretch;
          width: 100%;
          padding: 12px 16px;
          gap: 6px;
        }
        .puc-nav-links.open,
        .puc-nav-right.open { display: flex; }

        .puc-nav-inner {
          flex-wrap: wrap;
          height: auto;
          padding: 12px 16px;
        }
        #puc-navbar { height: auto; }
        body { padding-top: 62px; }

        .puc-nav-link, .puc-dropdown-btn {
          width: 100%;
          text-align: left;
        }

        .puc-dropdown-menu {
          position: static;
          transform: none;
          width: 100%;
          max-height: 260px;
          margin-top: 4px;
          animation: none;
        }

        .puc-profile-menu {
          position: static;
          width: 100%;
          margin-top: 4px;
          animation: none;
        }

        .puc-nav-right {
          border-top: 1px solid var(--puc-border);
          margin-top: 4px;
          padding-top: 12px;
        }

        .puc-login-btn, .puc-nav-btn { width: 100%; justify-content: center; }
        .puc-profile-wrap { width: 100%; }
        .puc-profile-btn { width: 100%; }
      }

      /* ── Loading skeleton ────────────────────────────────── */
      .puc-skeleton {
        background: linear-gradient(90deg,
          rgba(43,24,15,0.4) 25%,
          rgba(243,156,18,0.08) 50%,
          rgba(43,24,15,0.4) 75%);
        background-size: 200% 100%;
        animation: pucSkeleton 1.5s ease infinite;
        border-radius: 8px;
      }
      @keyframes pucSkeleton {
        0%   { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }

      /* ── Toast system ────────────────────────────────────── */
      #puc-toast-container {
        position: fixed;
        bottom: 24px;
        right: 24px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        z-index: 9999;
        pointer-events: none;
      }
      .puc-toast {
        padding: 12px 20px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 500;
        animation: pucToastIn 0.3s ease;
        pointer-events: auto;
        max-width: 340px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.45);
      }
      .puc-toast.success { background: #16a34a; color: #fff; }
      .puc-toast.error   { background: #dc2626; color: #fff; }
      .puc-toast.info    { background: #6c63ff; color: #fff; }
      @keyframes pucToastIn {
        from { opacity: 0; transform: translateX(60px); }
        to   { opacity: 1; transform: translateX(0); }
      }
    `;
    document.head.appendChild(style);
  }

  // ── Global Toast API ─────────────────────────────────────────────────────
  window.pucToast = function (msg, type = 'info', duration = 4000) {
    let container = document.getElementById('puc-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'puc-toast-container';
      document.body.appendChild(container);
    }
    const el = document.createElement('div');
    el.className = `puc-toast ${type}`;
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => el.remove(), duration);
  };

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
