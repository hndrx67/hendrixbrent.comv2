// Hero Section Mobile Optimization
document.addEventListener('DOMContentLoaded', function() {
    // Function to optimize hero for different screen sizes
    function optimizeHeroForMobile() {
      const heroContainer = document.querySelector('.hero-container');
      const heroImage = document.querySelector('.hero-image');
      
      
      if (!heroContainer || !heroImage) return;
      
      // Get device width
      const screenWidth = window.innerWidth;
      
      if (screenWidth <= 768) { // Tablet and mobile
        // Adjust image height for mobile
        heroImage.style.height = '120%';
        heroImage.style.paddingBottom = '0';
        
        // Adjust container height for better mobile viewing
        heroContainer.style.height = '20vh';
        
        // Adjust gradient height for mobile
        const gradient = document.querySelector('.hero-gradient');
        if (gradient) {
          gradient.style.height = '400px';
        }
      } else {
        // Reset to original values for desktop
        heroImage.style.height = '250%';
        heroImage.style.paddingBottom = '25vh';
        heroContainer.style.height = '70vh';
        
        const gradient = document.querySelector('.hero-gradient');
        if (gradient) {
          gradient.style.height = '200px';
        }
      }
      
      // Fix for iOS Safari 100vh issue
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      
      // Use the custom vh property for height
      if (screenWidth <= 768) {
        heroContainer.style.height = `calc(var(--vh, 1vh) * 40)`; // 50vh for mobile
      } else {
        heroContainer.style.height = `calc(var(--vh, 1vh) * 70)`; // 70vh for desktop
      }
    }
    
    // Run on page load
    optimizeHeroForMobile();
    
    // Run on resize
    window.addEventListener('resize', optimizeHeroForMobile);
    
    // Run on orientation change (important for mobile)
    window.addEventListener('orientationchange', function() {
      // Small delay to ensure the browser has completed the orientation change
      setTimeout(optimizeHeroForMobile, 100);
    });
    
    // Add viewport meta tag if not present
    if (!document.querySelector('meta[name="viewport"]')) {
      const metaTag = document.createElement('meta');
      metaTag.name = 'viewport';
      metaTag.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.getElementsByTagName('head')[0].appendChild(metaTag);
    }
    
    // Prevent zoom on double tap (iOS)
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(e) {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
  });

 