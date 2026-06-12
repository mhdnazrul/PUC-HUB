// ========== MAIN APPLICATION FUNCTIONS ==========

// ── Smooth scroll to named section (used by nav dropdown) ──
function scrollToSection(sectionId) {
    const el = document.getElementById(sectionId);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ── Counter animation ──
function initializeCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 300;

    const startCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const count = parseInt(counter.innerText);
        const inc = Math.ceil(target / speed);

        if (count < target) {
            counter.innerText = Math.min(count + inc, target);
            setTimeout(() => startCounter(counter), 50);
        } else {
            counter.innerText = target;
        }
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                counter.innerText = '0';
                startCounter(counter);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// ── Back-to-top button ──
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', function () {
        backToTopBtn.classList.toggle('show', window.scrollY > 300);
    }, { passive: true });

    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ── Exam countdown ──
function initializeCountdown() {
    const examDate = new Date('2026-06-26T09:00:00');

    function updateCountdown() {
        const now = new Date();
        const diff = examDate - now;

        if (diff <= 0) {
            ['cd-days', 'cd-hours', 'cd-minutes', 'cd-seconds'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = '0';
            });
            return;
        }

        const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = String(val).padStart(2, '0'); };
        set('cd-days',    days);
        set('cd-hours',   hours);
        set('cd-minutes', minutes);
        set('cd-seconds', seconds);
    }

    if (document.getElementById('cd-days')) {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
}

// ── Upcoming modal ──
function showUpcoming() {
    const modal = document.getElementById('upcomingModal');
    if (modal) { modal.style.display = 'flex'; }
}
function closeUpcoming() {
    const modal = document.getElementById('upcomingModal');
    if (modal) { modal.style.display = 'none'; }
}
function showVIPModal() {
    const modal = document.getElementById('vipModal');
    if (modal) { modal.style.display = 'flex'; }
}
function closeVIPModal() {
    const modal = document.getElementById('vipModal');
    if (modal) { modal.style.display = 'none'; }
}
function copyNumber(method) {
    const number = '01885-134402';
    if (navigator.clipboard) {
        navigator.clipboard.writeText(number).then(() => {
            const el = document.getElementById('copyMsg');
            if (el) { el.style.display = 'block'; el.textContent = method + ' number copied: ' + number; }
        });
    }
}

// ── Page init ──
document.addEventListener('DOMContentLoaded', function () {
    initializeCounters();
    initializeBackToTop();
    initializeCountdown();

    // Close modals on backdrop click
    ['upcomingModal', 'vipModal'].forEach(id => {
        const modal = document.getElementById(id);
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.style.display = 'none';
            });
        }
    });
});