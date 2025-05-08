/**
 * mobile-handler.js - Universal Mobile Optimization Script
 * 
 * This script can be imported to any HTML website to optimize 
 * the viewing experience on mobile devices.
 * 
 * @author BETLOG
 * @version 1.6.9
 */

(function() {
    'use strict';
    
    /**
     * Main MobileHandler class that contains all the optimization features
     */
    class MobileHandler {
      constructor(options = {}) {
        // Default configuration options
        this.config = {
          breakpoint: options.breakpoint || 768, // Mobile breakpoint in pixels
          scaleFonts: options.scaleFonts !== undefined ? options.scaleFonts : true,
          enableTouchOptimization: options.enableTouchOptimization !== undefined ? options.enableTouchOptimization : true,
          adaptiveImages: options.adaptiveImages !== undefined ? options.adaptiveImages : true,
          optimizeForms: options.optimizeForms !== undefined ? options.optimizeForms : true,
          optimizeNavigation: options.optimizeNavigation !== undefined ? options.optimizeNavigation : true,
          enhancePerformance: options.enhancePerformance !== undefined ? options.enhancePerformance : true,
          fixViewport: options.fixViewport !== undefined ? options.fixViewport : true,
          useSystemFonts: options.useSystemFonts !== undefined ? options.useSystemFonts : true,
          disableHover: options.disableHover !== undefined ? options.disableHover : true,
          convertTables: options.convertTables !== undefined ? options.convertTables : true,
          debug: options.debug || false
        };
        
        // Initialize state
        this.state = {
          isMobile: false,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          devicePixelRatio: window.devicePixelRatio || 1,
          isPortrait: window.innerHeight > window.innerWidth,
          touchEnabled: ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)
        };
        
        this.init();
      }
      
      /**
       * Initialize the mobile handler
       */
      init() {
        this.log('Initializing Mobile Handler');
        
        // Check if we're on mobile first
        this.checkMobile();
        
        // Fix viewport if enabled
        if (this.config.fixViewport) {
          this.setupViewport();
        }
        
        // Apply optimizations if on mobile
        if (this.state.isMobile || this.state.touchEnabled) {
          this.applyOptimizations();
        }
        
        // Set up event listeners
        this.setupEventListeners();
        
        this.log('Mobile Handler initialized');
      }
      
      /**
       * Check if the current device is mobile based on screen width
       */
      checkMobile() {
        this.state.isMobile = window.innerWidth <= this.config.breakpoint;
        this.state.isPortrait = window.innerHeight > window.innerWidth;
        this.log(`Device detected as ${this.state.isMobile ? 'mobile' : 'desktop'}`);
        
        // Add appropriate class to html element
        document.documentElement.classList.toggle('mobile-view', this.state.isMobile);
        document.documentElement.classList.toggle('desktop-view', !this.state.isMobile);
        document.documentElement.classList.toggle('portrait', this.state.isPortrait);
        document.documentElement.classList.toggle('landscape', !this.state.isPortrait);
      }
      
      /**
       * Set up the viewport meta tag
       */
      setupViewport() {
        let viewportMeta = document.querySelector('meta[name="viewport"]');
        
        // Create viewport meta if it doesn't exist
        if (!viewportMeta) {
          viewportMeta = document.createElement('meta');
          viewportMeta.name = 'viewport';
          document.head.appendChild(viewportMeta);
        }
        
        // Set proper viewport content
        viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
        
        this.log('Viewport meta tag configured');
      }
      
      /**
       * Apply all mobile optimizations
       */
      applyOptimizations() {
        if (this.config.scaleFonts) {
          this.optimizeFonts();
        }
        
        if (this.config.enableTouchOptimization) {
          this.optimizeForTouch();
        }
        
        if (this.config.adaptiveImages) {
          this.optimizeImages();
        }
        
        if (this.config.optimizeForms) {
          this.optimizeForms();
        }
        
        if (this.config.optimizeNavigation) {
          this.optimizeNavigation();
        }
        
        if (this.config.enhancePerformance) {
          this.enhancePerformance();
        }
        
        if (this.config.useSystemFonts) {
          this.useSystemFonts();
        }
        
        if (this.config.disableHover) {
          this.disableHoverOnTouch();
        }
        
        if (this.config.convertTables) {
          this.convertTables();
        }
      }
      
      /**
       * Set up responsive typography
       */
      optimizeFonts() {
        const createResponsiveTypography = () => {
          // Base font size calculation based on viewport width
          const baseFontSize = Math.max(16, Math.min(18, 16 * (this.state.viewportWidth / 375)));
          document.documentElement.style.fontSize = `${baseFontSize}px`;
          
          // Add responsive typography stylesheet
          const style = document.createElement('style');
          style.id = 'mobile-handler-typography';
          style.textContent = `
            body {
              font-size: 1rem;
              line-height: 1.5;
            }
            h1 { font-size: 1.8rem; line-height: 1.2; }
            h2 { font-size: 1.5rem; line-height: 1.2; }
            h3 { font-size: 1.3rem; line-height: 1.3; }
            h4 { font-size: 1.18rem; line-height: 1.4; }
            h5 { font-size: 1.1rem; line-height: 1.4; }
            h6 { font-size: 1rem; line-height: 1.4; }
            p { margin-bottom: 1rem; }
            
            @media (max-width: 480px) {
              h1 { font-size: 1.6rem; }
              h2 { font-size: 1.4rem; }
              h3 { font-size: 1.2rem; }
            }
          `;
          
          // Only append if not already present
          if (!document.getElementById('mobile-handler-typography')) {
            document.head.appendChild(style);
          }
        };
  
        createResponsiveTypography();
        this.log('Fonts optimized for mobile');
      }
      
      /**
       * Optimize for touch interactions
       */
      optimizeForTouch() {
        // Increase touch target sizes
        const style = document.createElement('style');
        style.id = 'mobile-handler-touch';
        style.textContent = `
          .mobile-view button,
          .mobile-view input,
          .mobile-view select,
          .mobile-view a {
            min-height: 44px;
            min-width: 44px;
          }
          
          .mobile-view a:link {
            text-decoration: none;
          }
          
          .mobile-view li {
            padding: 0.5rem 0;
          }
          
          /* Create more space between interactive elements */
          .mobile-view button + button,
          .mobile-view a + a,
          .mobile-view .btn + .btn {
            margin-left: 0.5rem;
          }
          
          /* Active state for better touch feedback */
          .mobile-view a:active,
          .mobile-view button:active {
            opacity: 0.7;
            transform: scale(0.98);
            transition: all 0.1s ease-in-out;
          }
        `;
        
        // Only append if not already present
        if (!document.getElementById('mobile-handler-touch')) {
          document.head.appendChild(style);
        }
        
        this.log('Touch optimization applied');
      }
      
      /**
       * Optimize images for mobile
       */
      optimizeImages() {
        // Ensure images are responsive
        const style = document.createElement('style');
        style.id = 'mobile-handler-images';
        style.textContent = `
          .mobile-view img,
          .mobile-view video,
          .mobile-view canvas,
          .mobile-view svg {
            max-width: 100%;
            height: auto;
          }
          
          .mobile-view img {
            display: block;
          }
          
          /* Center oversized images */
          .mobile-view img.oversized {
            display: block;
            margin-left: auto;
            margin-right: auto;
          }
        `;
        
        // Only append if not already present
        if (!document.getElementById('mobile-handler-images')) {
          document.head.appendChild(style);
        }
        
        // Handle image loading prioritization
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
          // Add lazy loading except for images at the top of the page
          if (!this.isInViewport(img)) {
            img.loading = 'lazy';
          } else {
            img.loading = 'eager';
          }
          
          // Add basic error handling
          img.onerror = function() {
            this.style.display = 'none';
          };
        });
        
        this.log('Images optimized for mobile');
      }
      
      /**
       * Check if an element is in the current viewport
       */
      isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
      }
      
      /**
       * Optimize forms for mobile
       */
      optimizeForms() {
        // Form styles for better mobile experience
        const style = document.createElement('style');
        style.id = 'mobile-handler-forms';
        style.textContent = `
          .mobile-view input,
          .mobile-view select,
          .mobile-view textarea {
            font-size: 16px; /* Prevents zoom on iOS */
            max-width: 100%;
            border-radius: 8px;
            padding: 0.75rem;
          }
          
          .mobile-view input[type="text"],
          .mobile-view input[type="email"],
          .mobile-view input[type="password"],
          .mobile-view input[type="search"],
          .mobile-view input[type="tel"],
          .mobile-view input[type="url"],
          .mobile-view textarea {
            width: 100%;
            box-sizing: border-box;
            -webkit-appearance: none;
            appearance: none;
          }
          
          .mobile-view select {
            padding-right: 2rem;
            background-position: right 0.5rem center;
            background-repeat: no-repeat;
            background-size: 1rem;
          }
          
          .mobile-view button,
          .mobile-view input[type="submit"] {
            width: auto;
            display: block;
            padding: 0.75rem 1.5rem;
            margin: 1rem 0;
            border-radius: 8px;
            font-weight: bold;
            text-align: center;
            cursor: pointer;
          }
          
          .mobile-view input:focus,
          .mobile-view select:focus,
          .mobile-view textarea:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
          }
          
          .mobile-view label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: bold;
          }
          
          .mobile-view form > * + * {
            margin-top: 1rem;
          }
          
          @media (max-width: 480px) {
            .mobile-view form {
              padding: 1rem;
            }
          }
        `;
        
        // Only append if not already present
        if (!document.getElementById('mobile-handler-forms')) {
          document.head.appendChild(style);
        }
        
        // Set appropriate input types
        const telInputs = document.querySelectorAll('input[type="text"][name*="phone"], input[type="text"][name*="tel"]');
        telInputs.forEach(input => {
          input.type = 'tel';
        });
        
        const emailInputs = document.querySelectorAll('input[type="text"][name*="email"]');
        emailInputs.forEach(input => {
          input.type = 'email';
        });
        
        // Add autocomplete attributes for better UX
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
          const nameInput = form.querySelector('input[name*="name"]');
          const emailInput = form.querySelector('input[type="email"]');
          const telInput = form.querySelector('input[type="tel"]');
          
          if (nameInput) nameInput.setAttribute('autocomplete', 'name');
          if (emailInput) emailInput.setAttribute('autocomplete', 'email');
          if (telInput) telInput.setAttribute('autocomplete', 'tel');
        });
        
        this.log('Forms optimized for mobile');
      }
      
      /**
       * Optimize navigation for mobile
       */
      optimizeNavigation() {
        // Simple check for potential navigation elements
        const potentialNavs = document.querySelectorAll('nav, .nav, .menu, .navigation, header ul, #menu, #nav');
        
        if (potentialNavs.length === 0) {
          this.log('No navigation elements found to optimize');
          return;
        }
        
        // Add mobile navigation styles
        const style = document.createElement('style');
        style.id = 'mobile-handler-navigation';
        style.textContent = `
          .mobile-view .mobile-nav-toggle {
            display: block;
            position: fixed;
            top: 1rem;
            right: 1rem;
            z-index: 1000;
            width: 44px;
            height: 44px;
            background: #fff;
            border: none;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            cursor: pointer;
          }
          
          .mobile-view .mobile-nav-toggle span {
            display: block;
            position: absolute;
            height: 3px;
            width: 24px;
            background: #333;
            border-radius: 3px;
            left: 10px;
            transition: all 0.25s;
          }
          
          .mobile-view .mobile-nav-toggle span:nth-child(1) {
            top: 14px;
          }
          
          .mobile-view .mobile-nav-toggle span:nth-child(2) {
            top: 22px;
          }
          
          .mobile-view .mobile-nav-toggle span:nth-child(3) {
            top: 30px;
          }
          
          .mobile-view .mobile-nav-toggle.active span:nth-child(1) {
            transform: rotate(45deg);
            top: 22px;
          }
          
          .mobile-view .mobile-nav-toggle.active span:nth-child(2) {
            opacity: 0;
          }
          
          .mobile-view .mobile-nav-toggle.active span:nth-child(3) {
            transform: rotate(-45deg);
            top: 22px;
          }
          
          .mobile-view .mobile-nav {
            position: fixed;
            top: 0;
            left: 0;
            width: 85%;
            max-width: 320px;
            height: 100%;
            background: #fff;
            z-index: 999;
            overflow-y: auto;
            box-shadow: 2px 0 10px rgba(0,0,0,0.2);
            transform: translateX(-110%);
            transition: transform 0.3s ease-in-out;
          }
          
          .mobile-view .mobile-nav.active {
            transform: translateX(0);
          }
          
          .mobile-view .mobile-nav-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 998;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s;
          }
          
          .mobile-view .mobile-nav-overlay.active {
            opacity: 1;
            visibility: visible;
          }
          
          .mobile-view .mobile-nav ul {
            list-style: none;
            padding: 1rem;
            margin: 0;
          }
          
          .mobile-view .mobile-nav li {
            border-bottom: 1px solid #eee;
          }
          
          .mobile-view .mobile-nav li:last-child {
            border-bottom: none;
          }
          
          .mobile-view .mobile-nav a {
            display: block;
            padding: 1rem;
            color: #333;
            text-decoration: none;
            font-weight: bold;
          }
          
          .mobile-view .mobile-nav .has-submenu > a {
            position: relative;
          }
          
          .mobile-view .mobile-nav .has-submenu > a::after {
            content: '+';
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
          }
          
          .mobile-view .mobile-nav .has-submenu.open > a::after {
            content: '-';
          }
          
          .mobile-view .mobile-nav .submenu {
            display: none;
            padding-left: 1rem;
          }
          
          .mobile-view .mobile-nav .has-submenu.open .submenu {
            display: block;
          }
        `;
        
        // Only append if not already present
        if (!document.getElementById('mobile-handler-navigation')) {
          document.head.appendChild(style);
        }
        
        // Create mobile navigation if not already created
        if (!document.querySelector('.mobile-nav')) {
          // Find main navigation content to clone
          const mainNav = potentialNavs[0];
          
          // Create mobile navigation structure
          const mobileNavToggle = document.createElement('button');
          mobileNavToggle.className = 'mobile-nav-toggle';
          mobileNavToggle.setAttribute('aria-label', 'Toggle Navigation');
          mobileNavToggle.innerHTML = '<span></span><span></span><span></span>';
          
          const mobileNav = document.createElement('div');
          mobileNav.className = 'mobile-nav';
          
          // Clone navigation content
          const navContent = mainNav.cloneNode(true);
          mobileNav.appendChild(navContent);
          
          // Create overlay
          const overlay = document.createElement('div');
          overlay.className = 'mobile-nav-overlay';
          
          // Append to body
          document.body.appendChild(mobileNavToggle);
          document.body.appendChild(mobileNav);
          document.body.appendChild(overlay);
          
          // Handle toggle click
          mobileNavToggle.addEventListener('click', () => {
            mobileNavToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
            overlay.classList.toggle('active');
            
            // Prevent body scrolling when menu is open
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
          });
          
          // Close menu when overlay is clicked
          overlay.addEventListener('click', () => {
            mobileNavToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
          });
          
          // Handle submenu toggles
          const subMenuParents = mobileNav.querySelectorAll('li:has(ul)');
          subMenuParents.forEach(parent => {
            parent.classList.add('has-submenu');
            const link = parent.querySelector('a');
            const subMenu = parent.querySelector('ul');
            
            if (subMenu) {
              subMenu.classList.add('submenu');
              
              link.addEventListener('click', (e) => {
                e.preventDefault();
                parent.classList.toggle('open');
              });
            }
          });
        }
        
        this.log('Navigation optimized for mobile');
      }
      
      /**
       * Enhance performance on mobile
       */
      enhancePerformance() {
        // Add performance optimizations styles
        const style = document.createElement('style');
        style.id = 'mobile-handler-performance';
        style.textContent = `
          /* Reduce animation on mobile */
          .mobile-view * {
            animation-duration: 0.1s !important;
            transition-duration: 0.1s !important;
          }
          
          /* Use hardware acceleration for smooth scrolling */
          .mobile-view {
            -webkit-overflow-scrolling: touch;
            scroll-behavior: smooth;
          }
          
          /* Optimize background images */
          .mobile-view .bg-image {
            background-attachment: scroll !important;
          }
        `;
        
        // Only append if not already present
        if (!document.getElementById('mobile-handler-performance')) {
          document.head.appendChild(style);
        }
        
        // Check for heavy animations and disable them
        const animatedElements = document.querySelectorAll('[class*="animate"], [class*="animation"]');
        animatedElements.forEach(el => {
          el.style.animation = 'none';
        });
        
        // Convert video backgrounds to images if possible
        const backgroundVideos = document.querySelectorAll('video.background, video.bg, .video-background video');
        backgroundVideos.forEach(video => {
          if (video.poster) {
            const img = document.createElement('img');
            img.src = video.poster;
            img.alt = '';
            img.className = video.className;
            video.parentNode.replaceChild(img, video);
          }
        });
        
        this.log('Performance optimizations applied');
      }
      
      /**
       * Use system fonts for better performance
       */
      useSystemFonts() {
        const style = document.createElement('style');
        style.id = 'mobile-handler-system-fonts';
        style.textContent = `
          .mobile-view body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
          }
          
          .mobile-view h1, 
          .mobile-view h2, 
          .mobile-view h3, 
          .mobile-view h4, 
          .mobile-view h5, 
          .mobile-view h6 {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
          }
          
          .mobile-view code, 
          .mobile-view pre, 
          .mobile-view kbd {
            font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          }
        `;
        
        // Only append if not already present
        if (!document.getElementById('mobile-handler-system-fonts')) {
          document.head.appendChild(style);
        }
        
        this.log('System fonts applied for better performance');
      }
      
      /**
       * Disable hover effects on touch devices
       */
      disableHoverOnTouch() {
        if (this.state.touchEnabled) {
          const style = document.createElement('style');
          style.id = 'mobile-handler-disable-hover';
          style.textContent = `
            .mobile-view * {
              -webkit-tap-highlight-color: transparent;
            }
            
            .mobile-view *:hover {
              transition: none !important;
            }
          `;
          
          // Only append if not already present
          if (!document.getElementById('mobile-handler-disable-hover')) {
            document.head.appendChild(style);
          }
          
          // Add touch-device class to html
          document.documentElement.classList.add('touch-device');
          
          this.log('Hover effects disabled on touch device');
        }
      }
      
      /**
       * Convert tables to a more mobile-friendly format
       */
      convertTables() {
        const style = document.createElement('style');
        style.id = 'mobile-handler-tables';
        style.textContent = `
          /* Responsive tables */
          .mobile-view .table-container {
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            margin-bottom: 1rem;
          }
          
          /* Card-style tables for very small screens */
          @media (max-width: 480px) {
            .mobile-view .card-table thead {
              display: none;
            }
            
            .mobile-view .card-table tbody tr {
              display: block;
              margin-bottom: 1.5rem;
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 0.5rem;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .mobile-view .card-table tbody td {
              display: block;
              text-align: right;
              padding: 0.5rem;
              position: relative;
              border-bottom: 1px solid #eee;
            }
            
            .mobile-view .card-table tbody td:last-child {
              border-bottom: none;
            }
            
            .mobile-view .card-table tbody td:before {
              content: attr(data-label);
              position: absolute;
              left: 0.5rem;
              font-weight: bold;
            }
          }
        `;
        
        // Only append if not already present
        if (!document.getElementById('mobile-handler-tables')) {
          document.head.appendChild(style);
        }
        
        // Process tables for mobile
        const tables = document.querySelectorAll('table');
        tables.forEach((table, index) => {
          // Skip tables that are already processed
          if (table.closest('.table-container')) return;
          
          // Wrap table in container for horizontal scrolling
          const wrapper = document.createElement('div');
          wrapper.className = 'table-container';
          table.parentNode.insertBefore(wrapper, table);
          wrapper.appendChild(table);
          
          // Add card-table class for very small screens
          table.classList.add('card-table');
          
          // Store header text for card view
          const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
          
          // Add data attributes to cells for card view
          const rows = table.querySelectorAll('tbody tr');
          rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, cellIndex) => {
              if (headers[cellIndex]) {
                cell.setAttribute('data-label', headers[cellIndex]);
              }
            });
          });
        });
        
        this.log('Tables optimized for mobile');
      }
      
      /**
       * Set up window event listeners
       */
      setupEventListeners() {
        // Debounce function for resize handler
        const debounce = (func, delay) => {
          let timeout;
          return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
          };
        };
        
        // Handle resize events
        const handleResize = debounce(() => {
          this.state.viewportWidth = window.innerWidth;
          this.state.viewportHeight = window.innerHeight;
          this.state.isPortrait = window.innerHeight > window.innerWidth;
          
          // Check if mobile status changed
          const wasMobile = this.state.isMobile;
          this.checkMobile();
          
          // Apply or remove optimizations based on status change
          if (!wasMobile && this.state.isMobile) {
            this.applyOptimizations();
          }
          
          // Update orientation classes
          document.documentElement.classList.toggle('portrait', this.state.isPortrait);
          document.documentElement.classList.toggle('landscape', !this.state.isPortrait);
        }, 250);
        
        // Add event listeners
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);
        
        // Listen for page load
        window.addEventListener('load', () => {
          // Reapply optimizations after page fully loads
          if (this.state.isMobile) {
            this.applyOptimizations();
          }
        });
      }
      
      /**
       * Log debug information if debug mode is enabled
       */
      log(message) {
        if (this.config.debug) {
          console.log(`[MobileHandler] ${message}`);
        }
      }
    }
    
    /**
     * Factory function to create and initialize MobileHandler
     */
    function createMobileHandler(options = {}) {
      return new MobileHandler(options);
    }
    
    // Expose to global scope
    window.MobileHandler = {
      create: createMobileHandler,
      // Shorthand for quick initialization with default options
      init: function() {
        return createMobileHandler();
      }
    };
    
    // Auto-initialize if data-auto-init attribute is present
    if (document.querySelector('[data-mobile-handler-auto-init]')) {
      window.addEventListener('DOMContentLoaded', () => {
        window.MobileHandler.init();
      });
    }
  })();