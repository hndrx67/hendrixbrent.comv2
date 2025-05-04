
// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;
const moonIcon = document.getElementById('moonIcon');
const sunIcon = document.getElementById('sunIcon');
const sunLines = [
    document.getElementById('sunLine1'),
    document.getElementById('sunLine2'),
    document.getElementById('sunLine3'),
    document.getElementById('sunLine4'),
    document.getElementById('sunLine5'),
    document.getElementById('sunLine6'),
    document.getElementById('sunLine7'),
    document.getElementById('sunLine8')
];

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlElement.setAttribute('data-theme', newTheme);
    
    // Toggle icon
    if (newTheme === 'light') {
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'block';
        sunLines.forEach(line => line.style.display = 'block');
    } else {
        moonIcon.style.display = 'block';
        sunIcon.style.display = 'none';
        sunLines.forEach(line => line.style.display = 'none');
    }
});

// Modal Functionality
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    document.querySelectorAll('.modal').forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

// Scroll animation for elements
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply to section titles and cards
    document.querySelectorAll('.section-title, .card, .about-image, .about-content, .quotes').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        fadeInObserver.observe(el);
    });
});