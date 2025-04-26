// mobile-responsive.js - Makes the Windows 95 maintenance page responsive for mobile devices

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize responsive features
    initResponsive();
    
    // Re-check on window resize
    window.addEventListener('resize', debounce(initResponsive, 250));
});

// Debounce function to prevent excessive resize calculations
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
}

// Main function for handling mobile responsiveness
function initResponsive() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const mainWindow = document.getElementById('mainWindow');
    const desktop = document.querySelector('.desktop');
    
    // Check if we're on mobile (width < 768px is a common breakpoint for mobile)
    const isMobile = windowWidth < 768;
    
    if (isMobile) {
        // Apply mobile optimizations
        applyMobileStyles(windowWidth, windowHeight);
    } else {
        // Reset to desktop styles
        resetToDesktopStyles();
    }
    
    // Reposition the main window for both mobile and desktop
    centerMainWindow(mainWindow, windowWidth, windowHeight, isMobile);
    
    // Adjust desktop icons
    arrangeDesktopIcons(desktop, windowWidth, isMobile);
}

// Apply mobile-specific styles
function applyMobileStyles(windowWidth, windowHeight) {
    const mainWindow = document.getElementById('mainWindow');
    const windowContent = document.querySelector('.window-content');
    const progressContainer = document.querySelector('.progress-container');
    const transferDetails = document.querySelector('.transfer-details');
    const buttonGroup = document.querySelector('.button-group');
    const taskbar = document.querySelector('.taskbar');
    
    // Scale window size based on screen width
    const windowWidthPercentage = 95; // 95% of screen width on mobile
    const newWindowWidth = (windowWidth * windowWidthPercentage / 100);
    
    // Main window adjustments
    mainWindow.style.width = `${newWindowWidth}px`;
    mainWindow.style.maxWidth = '100%';
    
    // Content adjustments
    windowContent.style.padding = '10px';
    
    // Progress bar adjustments
    progressContainer.style.width = '100%';
    
    // Transfer details adjustments
    transferDetails.style.width = '100%';
    transferDetails.style.flexDirection = windowWidth < 400 ? 'column' : 'row';
    transferDetails.style.alignItems = windowWidth < 400 ? 'center' : 'flex-start';
    
    // Button group adjustments
    buttonGroup.style.flexDirection = windowWidth < 350 ? 'column' : 'row';
    buttonGroup.style.width = windowWidth < 350 ? '80%' : 'auto';
    
    // Taskbar adjustments
    taskbar.style.height = '40px';
    
    // Add mobile-specific class to body for additional CSS hooks
    document.body.classList.add('mobile-view');
    
    // Adjust font sizes
    adjustFontSizes(true);
    
    // Fix touch events for dragging on mobile
    enableMobileDragging();
}

// Reset to desktop styles
function resetToDesktopStyles() {
    const mainWindow = document.getElementById('mainWindow');
    const windowContent = document.querySelector('.window-content');
    const progressContainer = document.querySelector('.progress-container');
    const transferDetails = document.querySelector('.transfer-details');
    const buttonGroup = document.querySelector('.button-group');
    const taskbar = document.querySelector('.taskbar');
    
    // Reset main window
    mainWindow.style.width = '500px';
    
    // Reset content padding
    windowContent.style.padding = '20px';
    
    // Reset progress container
    progressContainer.style.width = '90%';
    
    // Reset transfer details
    transferDetails.style.width = '90%';
    transferDetails.style.flexDirection = 'row';
    transferDetails.style.alignItems = 'flex-start';
    
    // Reset button group
    buttonGroup.style.flexDirection = 'row';
    buttonGroup.style.width = 'auto';
    
    // Reset taskbar
    taskbar.style.height = '30px';
    
    // Remove mobile class
    document.body.classList.remove('mobile-view');
    
    // Reset font sizes
    adjustFontSizes(false);
}

// Center the main window
function centerMainWindow(mainWindow, windowWidth, windowHeight, isMobile) {
    // If maximized, keep it maximized
    if (mainWindow.style.width === '100%') {
        return;
    }
    
    // For non-dragged windows, center them
    if (!mainWindow.style.left || !mainWindow.style.top || 
        mainWindow.style.left === '50%' || mainWindow.style.top === '50%') {
        mainWindow.style.left = '50%';
        mainWindow.style.top = '50%';
        mainWindow.style.transform = 'translate(-50%, -50%)';
    }
    
    // For mobile in landscape, ensure the window isn't too tall
    if (isMobile && windowWidth > windowHeight) {
        const windowHeight = mainWindow.offsetHeight;
        const viewHeight = window.innerHeight - 40; // Minus taskbar
        
        if (windowHeight > viewHeight) {
            mainWindow.style.height = `${viewHeight}px`;
            mainWindow.style.overflowY = 'auto';
        }
    }
}

// Arrange desktop icons for available screen space
function arrangeDesktopIcons(desktop, windowWidth, isMobile) {
    const icons = document.querySelectorAll('.desktop-icon');
    
    if (isMobile) {
        // For mobile, arrange icons horizontally at the top
        icons.forEach((icon, index) => {
            icon.style.position = 'absolute';
            icon.style.top = '5px';
            icon.style.left = `${index * 80 + 10}px`;
        });
    } else {
        // For desktop, reset to default positioning
        icons.forEach((icon) => {
            icon.style.position = '';
            icon.style.top = '';
            icon.style.left = '';
        });
    }
}

// Adjust font sizes for readability on different screens
function adjustFontSizes(isMobile) {
    const elements = {
        '.maintenance-text': isMobile ? '14px' : '16px',
        '.status-text': isMobile ? '12px' : '14px',
        '.transfer-file': isMobile ? '11px' : '12px',
        '.transfer-size': isMobile ? '11px' : '12px',
        '.win95-button': isMobile ? '11px' : '12px',
        '.window-title': isMobile ? '12px' : '14px'
    };
    
    for (const selector in elements) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.style.fontSize = elements[selector];
        });
    }
}

// Enable proper touch dragging for mobile devices
function enableMobileDragging() {
    const mainWindow = document.getElementById('mainWindow');
    const windowTitle = document.getElementById('windowTitle');
    
    // Remove any existing touch event listeners to prevent duplicates
    windowTitle.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
    
    // Add touch event listeners
    windowTitle.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    
    let isDragging = false;
    let startX, startY;
    let initialLeft, initialTop;
    
    function handleTouchStart(e) {
        if (e.touches.length === 1) {
            isDragging = true;
            
            // Get initial touch position
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            
            // Get initial window position
            const rect = mainWindow.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
            
            // Prevent default to avoid scrolling while dragging
            e.preventDefault();
        }
    }
    
    function handleTouchMove(e) {
        if (!isDragging) return;
        
        if (e.touches.length === 1) {
            // Calculate how far the touch has moved
            const deltaX = e.touches[0].clientX - startX;
            const deltaY = e.touches[0].clientY - startY;
            
            // Apply the new position
            mainWindow.style.left = `${initialLeft + deltaX}px`;
            mainWindow.style.top = `${initialTop + deltaY}px`;
            mainWindow.style.transform = 'none';
            
            // Prevent default to avoid scrolling
            e.preventDefault();
        }
    }
    
    function handleTouchEnd() {
        isDragging = false;
        
        // Keep window within viewport bounds
        const rect = mainWindow.getBoundingClientRect();
        const viewWidth = window.innerWidth;
        const viewHeight = window.innerHeight;
        
        if (rect.left < 0) mainWindow.style.left = '0px';
        if (rect.top < 0) mainWindow.style.top = '0px';
        if (rect.right > viewWidth) mainWindow.style.left = `${viewWidth - rect.width}px`;
        if (rect.bottom > viewHeight) mainWindow.style.top = `${viewHeight - rect.height}px`;
    }
}

// Fix for iPhone/iPad scrolling issues
function preventIOSOverscroll() {
    document.body.addEventListener('touchmove', function(e) {
        if (e.target.closest('.window-content')) {
            // Allow scrolling inside the window content
            return;
        }
        e.preventDefault();
    }, { passive: false });
}

// Check if device is iOS (iPhone/iPad)
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// Initialize iOS-specific fixes if needed
if (isIOS()) {
    preventIOSOverscroll();
}

// Fix for button click on mobile
document.querySelectorAll('.win95-button, .window-button').forEach(button => {
    button.addEventListener('touchend', function(e) {
        // Prevent ghost clicks
        e.preventDefault();
        
        // Manually trigger the click event
        this.click();
    });
});

// Fix for scaling on orientation change
window.addEventListener('orientationchange', function() {
    // Small delay to let the orientation change complete
    setTimeout(initResponsive, 300);
});