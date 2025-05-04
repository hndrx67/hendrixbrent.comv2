/**
 * Age Verification Script
 * 
 * This script creates an age verification overlay that must be completed
 * before users can access the main site content.
 * 
 * How to use:
 * 1. Include this script in your HTML file: <script src="path/to/age-verification.js"></script>
 * 2. The script will automatically run when the page loads
 * 3. Customize the redirect URL by setting a data attribute on the script tag:
 *    <script src="path/to/age-verification.js" data-redirect-url="https://example.com"></script>
 */

(function() {
    // Initialize the age verification system when the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Check if user has already verified age in this session
        if (!sessionStorage.getItem('ageVerified')) {
            createAgeVerificationOverlay();
        }
    });

    // Create and insert the age verification overlay into the DOM
    function createAgeVerificationOverlay() {
        // Prevent scrolling on the main page
        document.body.style.overflow = 'hidden';
        
        // Create overlay container
        const overlay = document.createElement('div');
        overlay.id = 'age-verification-overlay';
        
        // Set overlay styles
        const overlayStyles = {
            'position': 'fixed',
            'top': '0',
            'left': '0',
            'width': '100%',
            'height': '100%',
            'background-color': 'rgba(0, 0, 0, 0.9)',
            'z-index': '9999',
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center'
        };
        
        Object.assign(overlay.style, overlayStyles);
        
        // Create modal content
        const modal = document.createElement('div');
        modal.id = 'age-verification-modal';
        
        // Set modal styles
        const modalStyles = {
            'background-color': '#2a2a2a',
            'color': 'white',
            'padding': '2rem',
            'border-radius': '10px',
            'box-shadow': '0 0 20px rgba(0, 0, 0, 0.5)',
            'text-align': 'center',
            'max-width': '500px',
            'width': '90%'
        };
        
        Object.assign(modal.style, modalStyles);
        
        // Set modal HTML content
        modal.innerHTML = `
            <div style="font-size: 4rem; margin-bottom: 1rem; color: #ff4d4d;">⚠️</div>
            <h1 style="color: #ff4d4d; margin-bottom: 1.5rem; font-family: Arial, sans-serif;">Age Verification Required</h1>
            <p style="margin-bottom: 2rem; font-size: 1.1rem; line-height: 1.5; font-family: Arial, sans-serif;">
                This website contains content that is only suitable for adults aged 18 years or older. 
                By entering this site, you confirm that you are at least 18 years old.
            </p>
            
            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem;">
                <input type="checkbox" id="age-verification-checkbox" style="margin-right: 0.5rem; width: 20px; height: 20px;">
                <label for="age-verification-checkbox" style="font-size: 1.1rem; font-family: Arial, sans-serif;">I confirm I am at least 18 years old</label>
            </div>
            
            <div style="display: flex; justify-content: center; gap: 1rem;">
                <button id="age-verification-proceed" disabled style="padding: 0.8rem 1.5rem; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem; font-weight: bold; background-color: #4CAF50; color: white; opacity: 0.6;">Proceed</button>
                <button id="age-verification-go-back" style="padding: 0.8rem 1.5rem; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem; font-weight: bold; background-color: #f44336; color: white;">Go Back</button>
            </div>
        `;
        
        // Append modal to overlay
        overlay.appendChild(modal);
        
        // Append overlay to body
        document.body.appendChild(overlay);
        
        // Set up event listeners
        setupEventListeners();
    }

    // Set up event listeners for the age verification interface
    function setupEventListeners() {
        const checkbox = document.getElementById('age-verification-checkbox');
        const proceedButton = document.getElementById('age-verification-proceed');
        const goBackButton = document.getElementById('age-verification-go-back');
        
        // Enable/disable proceed button based on checkbox
        checkbox.addEventListener('change', function() {
            proceedButton.disabled = !this.checked;
            proceedButton.style.opacity = this.checked ? '1' : '0.6';
            proceedButton.style.cursor = this.checked ? 'pointer' : 'not-allowed';
        });
        
        // Proceed button action
        proceedButton.addEventListener('click', function() {
            if (!this.disabled) {
                // Mark as verified in session storage
                sessionStorage.setItem('ageVerified', 'true');
                
                // Remove the overlay
                const overlay = document.getElementById('age-verification-overlay');
                if (overlay) {
                    document.body.removeChild(overlay);
                    document.body.style.overflow = '';
                }
                
                // Get redirect URL from script data attribute
                const scripts = document.getElementsByTagName('script');
                let redirectUrl = null;
                
                for (let i = 0; i < scripts.length; i++) {
                    if (scripts[i].src.includes('age-verification.js')) {
                        redirectUrl = scripts[i].getAttribute('data-redirect-url');
                        break;
                    }
                }
                
                // Redirect if URL is specified
                if (redirectUrl) {
                    window.location.href = redirectUrl;
                }
            }
        });
        
        // Go back button action
        goBackButton.addEventListener('click', function() {
            history.back();
        });
    }
})();