// Uma Musume Pretty Derby JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen first
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.remove('active');
    }
    
    // Initialize all components
    initializeModals();
    initializeAnimations();
    initializeProgressBars();
    initializeScrollAnimations();
});

// Modal functionality
function initializeModals() {
    const umaCards = document.querySelectorAll('.uma-card');
    const modals = document.querySelectorAll('.uma-modal');
    const closeButtons = document.querySelectorAll('.close-modal');

    // Open modal when card is clicked
    umaCards.forEach(card => {
        card.addEventListener('click', function() {
            const umaType = this.getAttribute('data-uma');
            const modal = document.getElementById(`${umaType}-modal`);
            
            if (modal) {
                openModal(modal);
            }
        });
    });

    // Close modal with close button
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.uma-modal');
            closeModal(modal);
        });
    });

    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.uma-modal.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
}

function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Animate progress bars in modal
    setTimeout(() => {
        animateModalProgressBars(modal);
    }, 300);
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset progress bars
    const progressBars = modal.querySelectorAll('.stat-fill');
    progressBars.forEach(bar => {
        bar.style.width = '0%';
    });
}

// Initialize animations
function initializeAnimations() {
    // Animate cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all uma cards
    const umaCards = document.querySelectorAll('.uma-card');
    umaCards.forEach(card => {
        observer.observe(card);
    });
}

// Initialize progress bars
function initializeProgressBars() {
    const progressBars = document.querySelectorAll('.progress');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const value = entry.target.getAttribute('data-value');
                entry.target.style.width = `${value}%`;
            }
        });
    }, observerOptions);

    progressBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Animate progress bars in modal
function animateModalProgressBars(modal) {
    const progressBars = modal.querySelectorAll('.stat-fill');
    
    progressBars.forEach((bar, index) => {
        setTimeout(() => {
            const value = bar.getAttribute('data-value');
            bar.style.width = `${value}%`;
        }, index * 200); // Stagger animation
    });
}

// Initialize scroll animations
function initializeScrollAnimations() {
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroImage = document.querySelector('.hero-image');
        
        if (heroImage) {
            const rate = scrolled * -0.5;
            heroImage.style.transform = `translateY(${rate}px)`;
        }
    });

    // Smooth scroll for navigation
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add hover effects for uma cards
function addHoverEffects() {
    const umaCards = document.querySelectorAll('.uma-card');
    
    umaCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Add loading animation for images
function initializeImageLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
            this.style.opacity = '0.5';
            console.warn('Failed to load image:', this.src);
        });
    });
}

// Add keyboard navigation for modals
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        const activeModal = document.querySelector('.uma-modal.active');
        
        if (!activeModal) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                navigateModal('prev');
                break;
            case 'ArrowRight':
                navigateModal('next');
                break;
        }
    });
}

function navigateModal(direction) {
    const activeModal = document.querySelector('.uma-modal.active');
    const allModals = Array.from(document.querySelectorAll('.uma-modal'));
    const currentIndex = allModals.indexOf(activeModal);
    
    let nextIndex;
    if (direction === 'next') {
        nextIndex = (currentIndex + 1) % allModals.length;
    } else {
        nextIndex = (currentIndex - 1 + allModals.length) % allModals.length;
    }
    
    closeModal(activeModal);
    setTimeout(() => {
        openModal(allModals[nextIndex]);
    }, 300);
}

// Add touch gestures for mobile
function initializeTouchGestures() {
    let startX = 0;
    let startY = 0;
    
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(e) {
        const activeModal = document.querySelector('.uma-modal.active');
        if (!activeModal) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Swipe left/right to navigate modals
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                navigateModal('next');
            } else {
                navigateModal('prev');
            }
        }
    });
}

// Performance optimization
function optimizePerformance() {
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            // Handle scroll events
        }, 16); // ~60fps
    });
    
    // Preload modal images
    const modalImages = document.querySelectorAll('.uma-modal img');
    modalImages.forEach(img => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = img.src;
        document.head.appendChild(link);
    });
}

// Initialize all features
document.addEventListener('DOMContentLoaded', function() {
    addHoverEffects();
    initializeImageLoading();
    initializeKeyboardNavigation();
    initializeTouchGestures();
    optimizePerformance();
});

// Ensure loading screen is hidden when page fully loads
window.addEventListener('load', function() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.remove('active');
    }
});

// Add Easter egg - Konami code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.length === konamiSequence.length) {
        if (konamiCode.every((code, index) => code === konamiSequence[index])) {
            // Konami code activated!
            activateEasterEgg();
        }
    }
});

function activateEasterEgg() {
    // Add a fun animation or effect
    const umaCards = document.querySelectorAll('.uma-card');
    umaCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transform = 'rotate(360deg) scale(1.1)';
            setTimeout(() => {
                card.style.transform = 'rotate(0deg) scale(1)';
            }, 500);
        }, index * 200);
    });
    
    // Reset konami code
    konamiCode = [];
} 