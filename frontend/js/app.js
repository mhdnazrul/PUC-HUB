// ========== MAIN APPLICATION FUNCTIONS ==========

// কাউন্টার ফাংশনালিটি
//<!-- Made by: Team PUC HUB | Internet Programming Lab Project -->
 //<!--Rahul-->

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

// ✅ FIX: initializeNavigation — auth.js navbar update করার পরেও call করা যায়
function initializeNavigation() {
    // সব .nav-link নতুন করে নিন (innerHTML বদলের পর)
    const navLinkElements = document.querySelectorAll('.nav-link[data-target]');
    const sections = {
        home: document.getElementById('home'),
        services: document.getElementById('services'),
        team: document.getElementById('team')
    };

    navLinkElements.forEach(link => {
        // পুরানো listener remove করতে clone করুন
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);

        newLink.addEventListener('click', function (e) {
            const targetId = this.getAttribute('data-target');
            if (targetId && sections[targetId]) {
                e.preventDefault();
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                sections[targetId].scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Active link on scroll
    window.addEventListener('scroll', highlightActiveNav, { passive: true });
}

// স্ক্রল করলে active nav link আপডেট
function highlightActiveNav() {
    const sections = ['home', 'services', 'team'];
    let current = 'home';

    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
            current = id;
        }
    });

    document.querySelectorAll('.nav-link[data-target]').forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-target') === current);
    });
}

// ব্যাক টু টপ বাটন
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

// নেভবার স্ক্রল ইফেক্ট
function initializeNavbarEffect() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(43, 24, 15, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(43, 24, 15, 0.4)';
            navbar.style.backdropFilter = 'blur(15px)';
        }
    }, { passive: true });
}

// পেজ লোড হলে সব ইনিশিয়ালাইজ করুন
document.addEventListener('DOMContentLoaded', function () {
    initializeCounters();
    initializeNavigation();
    initializeBackToTop();
    initializeNavbarEffect();
});