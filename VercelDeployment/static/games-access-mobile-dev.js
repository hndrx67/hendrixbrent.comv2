// Mobile Device Detection and Optimization
const isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.iOS());
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile optimizations
    if (isMobile.any()) {
        initializeMobileOptimizations();
    }

    // Handle orientation changes
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', debounce(handleResize, 250));
});

function initializeMobileOptimizations() {
    // Add mobile-specific classes
    document.body.classList.add('mobile-device');
    
    // Optimize game cards for touch
    const gameCards = document.querySelectorAll('.project-card');
    gameCards.forEach(card => {
        card.addEventListener('touchstart', handleTouchStart, {passive: true});
        card.addEventListener('touchend', handleTouchEnd);
    });

    // Adjust game filters for mobile
    optimizeGameFilters();
    
    // Add swipe navigation if needed
    initializeSwipeNavigation();
    
    // Optimize loading for mobile
    optimizeMobileLoading();
}

function optimizeGameFilters() {
    const filterContainer = document.querySelector('.game-filters');
    if (filterContainer) {
        // Create mobile-friendly dropdown for filters
        const select = document.createElement('select');
        select.className = 'mobile-filter-select';
        
        // Get all filter buttons and convert to options
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            const option = document.createElement('option');
            option.value = btn.getAttribute('data-filter');
            option.textContent = btn.textContent;
            if (btn.classList.contains('active')) {
                option.selected = true;
            }
            select.appendChild(option);
        });

        // Handle filter change
        select.addEventListener('change', function(e) {
            const selectedFilter = this.value;
            const gameCards = document.querySelectorAll('.project-card');
            
            gameCards.forEach(card => {
                if (selectedFilter === 'all' || card.getAttribute('data-category').includes(selectedFilter)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });

        // Replace buttons with select on mobile
        if (window.innerWidth <= 768) {
            filterContainer.innerHTML = '';
            filterContainer.appendChild(select);
        }
    }
}

// Touch event handlers
function handleTouchStart(e) {
    this.classList.add('touch-active');
}

function handleTouchEnd(e) {
    this.classList.remove('touch-active');
}

// Orientation change handler
function handleOrientationChange() {
    const gameGrid = document.querySelector('.projects-grid');
    if (gameGrid) {
        if (window.orientation === 90 || window.orientation === -90) {
            // Landscape
            gameGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
        } else {
            // Portrait
            gameGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
        }
    }
}

// Resize handler with debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function handleResize() {
    const filterContainer = document.querySelector('.game-filters');
    if (filterContainer) {
        if (window.innerWidth <= 768) {
            if (!document.querySelector('.mobile-filter-select')) {
                optimizeGameFilters();
            }
        } else {
            // Restore original filter buttons if needed
            if (document.querySelector('.mobile-filter-select')) {
                location.reload(); // Reload to restore original layout
            }
        }
    }
}

// Mobile loading optimization
function optimizeMobileLoading() {
    // Preload critical images
    const gameImages = document.querySelectorAll('.project-img img');
    if (gameImages.length > 0) {
        gameImages.forEach(img => {
            if (img.getAttribute('data-src')) {
                img.src = img.getAttribute('data-src');
            }
        });
    }

    // Add smooth scrolling for mobile
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

// Initialize swipe navigation
function initializeSwipeNavigation() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});

    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});

    function handleSwipe() {
        const swipeThreshold = 50;
        const difference = touchEndX - touchStartX;
        
        if (Math.abs(difference) > swipeThreshold) {
            // Implement category switching based on swipe direction
            const currentFilter = document.querySelector('.filter-btn.active, .mobile-filter-select option:checked');
            const filters = document.querySelectorAll('.filter-btn, .mobile-filter-select option');
            const filterArray = Array.from(filters);
            const currentIndex = filterArray.indexOf(currentFilter);
            
            if (difference > 0 && currentIndex > 0) {
                // Swipe right - previous category
                filterArray[currentIndex - 1].click();
            } else if (difference < 0 && currentIndex < filterArray.length - 1) {
                // Swipe left - next category
                filterArray[currentIndex + 1].click();
            }
        }
    }
}

// Export functions for potential use in other scripts
window.mobileGameAccess = {
    isMobile,
    initializeMobileOptimizations,
    optimizeGameFilters,
    handleOrientationChange
};