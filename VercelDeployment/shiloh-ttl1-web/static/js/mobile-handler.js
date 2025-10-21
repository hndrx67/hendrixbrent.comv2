// Mobile Menu Handler for Morphology Website

document.addEventListener('DOMContentLoaded', function() {
    // Create mobile menu toggle button
    const navbar = document.querySelector('.navbar');
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelector('.nav-links');
    
    // Create hamburger menu button
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.setAttribute('aria-label', 'Toggle mobile menu');
    mobileMenuToggle.innerHTML = `
        <div class="hamburger">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    
    // Insert the toggle button before nav-links
    navContainer.insertBefore(mobileMenuToggle, navLinks);
    
    // Toggle menu on button click
    mobileMenuToggle.addEventListener('click', function() {
        const hamburger = this.querySelector('.hamburger');
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('mobile-menu-open');
    });
    
    // Close menu when clicking on a nav link
    const navLinkElements = document.querySelectorAll('.nav-link');
    navLinkElements.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                const hamburger = mobileMenuToggle.querySelector('.hamburger');
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('mobile-menu-open');
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInside = navContainer.contains(event.target);
        
        if (!isClickInside && navLinks.classList.contains('active')) {
            const hamburger = mobileMenuToggle.querySelector('.hamburger');
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('mobile-menu-open');
        }
    });
    
    // Handle window resize - close menu if resizing to desktop
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
                const hamburger = mobileMenuToggle.querySelector('.hamburger');
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('mobile-menu-open');
            }
        }, 250);
    });
    
    // Prevent scroll propagation on mobile menu
    navLinks.addEventListener('touchmove', function(e) {
        if (navLinks.classList.contains('active')) {
            e.stopPropagation();
        }
    }, { passive: true });
});
