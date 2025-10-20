// Genshin Impact Morphology Website - Main JavaScript

// === LOADING ANIMATION ===
document.addEventListener('DOMContentLoaded', function() {
    const loadingOverlay = document.getElementById('loading-overlay');
    
    // Hide loading animation once page is fully loaded
    setTimeout(() => {
        loadingOverlay.classList.add('hidden');
    }, 700);
    
    // Show loading animation when navigating to another page
    document.querySelectorAll('a.nav-link, a.btn-prev, a.btn-next').forEach(link => {
        link.addEventListener('click', function(e) {
            // Only show loading for internal navigation
            const href = this.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#')) {
                e.preventDefault(); // Prevent immediate navigation
                const loadingOverlay = document.getElementById('loading-overlay');
                if (loadingOverlay) {
                    loadingOverlay.classList.remove('hidden');
                    // Navigate after showing the loading overlay
                    setTimeout(() => {
                        window.location.href = href;
                    }, 100);
                }
            }
        });
    });
});

// === MUSIC TOGGLE - Now opens modal instead ===
// The music player modal handles all music functionality
// See music-player.js for implementation

// === ACTIVE NAV LINK ===
// Highlight the current page in navigation
const currentPage = window.location.pathname.split('/').pop() || 'home-morphology.html';
document.querySelectorAll('.nav-link').forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});

// === SMOOTH SCROLL ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// === ANIMATION ON SCROLL ===
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 100);
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all content cards
document.querySelectorAll('.content-card, .objective-card, .comparison-card').forEach(card => {
    observer.observe(card);
});

// === WIND PARTICLES EFFECT (Optional Enhancement) ===
function createWindParticle() {
    const particle = document.createElement('div');
    particle.classList.add('wind-particle');
    particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: rgba(74, 157, 126, 0.6);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        left: ${Math.random() * 100}vw;
        top: ${Math.random() * 100}vh;
        animation: windFloat ${5 + Math.random() * 5}s linear infinite;
    `;
    document.body.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, (5 + Math.random() * 5) * 1000);
}

// Add wind particle animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes windFloat {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 0;
        }
        10% {
            opacity: 0.6;
        }
        90% {
            opacity: 0.6;
        }
        100% {
            transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Create wind particles periodically
setInterval(createWindParticle, 2000);

// === KEYBOARD NAVIGATION ===
document.addEventListener('keydown', function(e) {
    const prevBtn = document.querySelector('.btn-prev');
    const nextBtn = document.querySelector('.btn-next');
    
    // Left arrow key - go to previous page
    if (e.key === 'ArrowLeft' && prevBtn) {
        prevBtn.click();
    }
    
    // Right arrow key - go to next page
    if (e.key === 'ArrowRight' && nextBtn) {
        nextBtn.click();
    }
    
    // M key - toggle music
    if (e.key === 'm' || e.key === 'M') {
        if (musicToggle) {
            musicToggle.click();
        }
    }
});

// === PAGE TRANSITION EFFECT ===
window.addEventListener('pageshow', function(event) {
    // If page is loaded from cache (back/forward button)
    if (event.persisted) {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
    }
});

// === CONSOLE EASTER EGG ===
console.log('%c🍃 Welcome to the Morphology Studies! 🍃', 'color: #4a9d7e; font-size: 20px; font-weight: bold;');
console.log('%cMay the winds of knowledge guide your journey!', 'color: #6bc49d; font-size: 14px; font-style: italic;');
console.log('%c- Venti', 'color: #5fb9a6; font-size: 12px;');

// === PERFORMANCE OPTIMIZATION ===
// Lazy load images if any are added later
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// === ACCESSIBILITY IMPROVEMENTS ===
// Add skip to main content link
const skipLink = document.createElement('a');
skipLink.href = '#main-content';
skipLink.textContent = 'Skip to main content';
skipLink.classList.add('skip-link');
skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--primary-green);
    color: white;
    padding: 8px;
    text-decoration: none;
    z-index: 10000;
`;
skipLink.addEventListener('focus', function() {
    this.style.top = '0';
});
skipLink.addEventListener('blur', function() {
    this.style.top = '-40px';
});
document.body.insertBefore(skipLink, document.body.firstChild);

// Add id to main content if not exists
const mainContent = document.querySelector('.main-content');
if (mainContent && !mainContent.id) {
    mainContent.id = 'main-content';
}

// === MOBILE MENU TOGGLE (If needed for smaller screens) ===
// Add a hamburger menu for mobile if nav links overflow
function checkNavOverflow() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks && window.innerWidth < 768) {
        navLinks.style.flexDirection = 'column';
    } else if (navLinks) {
        navLinks.style.flexDirection = 'row';
    }
}

window.addEventListener('resize', checkNavOverflow);
checkNavOverflow();

// === CURSOR TRAIL EFFECT (Venti Wind Theme) ===
let cursorTrail = [];
const maxTrailLength = 10;

document.addEventListener('mousemove', function(e) {
    if (window.innerWidth > 768) { // Only on desktop
        cursorTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
        
        if (cursorTrail.length > maxTrailLength) {
            cursorTrail.shift();
        }
        
        // Occasionally create a wind effect at cursor position
        if (Math.random() > 0.95) {
            const trail = document.createElement('div');
            trail.style.cssText = `
                position: fixed;
                width: 8px;
                height: 8px;
                background: radial-gradient(circle, rgba(107, 196, 157, 0.6), transparent);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9997;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                animation: cursorFade 1s ease-out forwards;
            `;
            document.body.appendChild(trail);
            
            setTimeout(() => trail.remove(), 1000);
        }
    }
});

// Add cursor fade animation
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    @keyframes cursorFade {
        0% {
            transform: scale(1);
            opacity: 0.8;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(cursorStyle);

// Log page load time for debugging
window.addEventListener('load', function() {
    const loadTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
    console.log(`%cPage loaded in ${loadTime}ms`, 'color: #4a9d7e; font-weight: bold;');
});
