// age-verification.js
(function() {
    // Immediately pause/block other content from loading
    document.addEventListener('DOMContentLoaded', function(event) {
        // We need to act before the window load event
        blockPageLoading();
    });

    // Block page loading by hiding all content
    function blockPageLoading() {
        // Create and inject CSS immediately
        const style = document.createElement('style');
        style.textContent = `
            /* Hide all page content initially */
            body > *:not(#ageVerificationContainer) {
                display: none !important;
            }

            /* Container styles */
            #ageVerificationContainer {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: #000;
                z-index: 99999;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .age-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            }

            .age-dialog {
                background-color: #fff;
                border-radius: 8px;
                padding: 30px;
                width: 90%;
                max-width: 500px;
                text-align: center;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            }

            .age-title {
                color: #e74c3c;
                font-size: 24px;
                margin-bottom: 20px;
                font-weight: bold;
            }

            .age-warning {
                font-size: 16px;
                margin-bottom: 30px;
                line-height: 1.5;
                color: #333;
            }

            .age-buttons {
                display: flex;
                justify-content: center;
                gap: 20px;
            }

            .checkbox-container {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 20px;
            }

            .checkbox-container input {
                margin-right: 10px;
                width: 20px;
                height: 20px;
            }

            .checkbox-container label {
                font-size: 16px;
                color: #333;
            }

            .btn {
                padding: 12px 25px;
                border: none;
                border-radius: 5px;
                font-weight: bold;
                font-size: 16px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .btn-proceed {
                background-color: #2ecc71;
                color: white;
            }

            .btn-proceed:hover {
                background-color: #27ae60;
            }

            .btn-leave {
                background-color: #e74c3c;
                color: white;
            }

            .btn-leave:hover {
                background-color: #c0392b;
            }

            .hidden {
                display: none;
            }

            /* Mobile optimizations */
            @media (max-width: 600px) {
                .age-dialog {
                    padding: 20px;
                    width: 90%;
                    max-width: 90%;
                }

                .age-title {
                    font-size: 20px;
                }

                .age-warning {
                    font-size: 14px;
                }

                .age-buttons {
                    flex-direction: column;
                }
                
                .btn {
                    width: 100%;
                    margin-bottom: 10px;
                    padding: 15px;
                    font-size: 18px;
                }

                .checkbox-container label {
                    font-size: 14px;
                }
            }
        `;
        document.head.appendChild(style);

        // Create container for our verification overlay
        const container = document.createElement('div');
        container.id = 'ageVerificationContainer';
        
        // Create overlay HTML
        container.innerHTML = `
            <div class="age-overlay">
                <div class="age-dialog">
                    <div class="age-title">⚠️ AGE VERIFICATION REQUIRED ⚠️</div>
                    <div class="age-warning">
                        <p>This website contains adult content that is only suitable for individuals who are at least 18 years of age or the legal age in your jurisdiction.</p>
                        <p>By proceeding, you confirm that you are at least 18 years old and legally allowed to view adult content in your location.</p>
                    </div>
                    
                    <div class="checkbox-container">
                        <input type="checkbox" id="ageConfirmation" required>
                        <label for="ageConfirmation">I confirm I am at least 18 years old</label>
                    </div>
                    
                    <div class="age-buttons">
                        <button class="btn btn-proceed" id="proceedButton" disabled>PROCEED</button>
                        <button class="btn btn-leave" id="leaveButton">GO BACK</button>
                    </div>
                </div>
            </div>
        `;
        
        // Prepend overlay to body - this ensures it's the first element
        document.body.prepend(container);
        
        // Set up event listeners
        setupEventListeners();
    }

    // Setup event listeners for the verification dialog
    function setupEventListeners() {
        // Ensure the document is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initListeners);
        } else {
            initListeners();
        }
    }

    function initListeners() {
        const proceedButton = document.getElementById('proceedButton');
        const leaveButton = document.getElementById('leaveButton');
        const ageCheckbox = document.getElementById('ageConfirmation');
        
        if (ageCheckbox) {
            // Enable proceed button only when checkbox is checked
            ageCheckbox.addEventListener('change', function() {
                proceedButton.disabled = !this.checked;
            });
        }
        
        if (proceedButton) {
            // When user clicks proceed, show the content
            proceedButton.addEventListener('click', function() {
                if (ageCheckbox && ageCheckbox.checked) {
                    // Remove the container
                    const container = document.getElementById('ageVerificationContainer');
                    if (container) {
                        container.remove();
                    }
                    
                    // Show all page content
                    const styleTag = document.createElement('style');
                    styleTag.textContent = `
                        body > * {
                            display: block !important;
                        }
                    `;
                    document.head.appendChild(styleTag);
                    
                    // Trigger all deferred scripts and resources to load
                    document.dispatchEvent(new Event('ageVerificationComplete'));
                    window.dispatchEvent(new Event('ageVerificationComplete'));
                }
            });
        }
        
        if (leaveButton) {
            // When user clicks leave, redirect
            leaveButton.addEventListener('click', function() {
                window.history.back(); // Go back to previous page
                // Fallback if there's no history
                setTimeout(function() {
                    window.location.href = 'https://www.google.com';
                }, 100);
            });
        }
    }

    // Run immediately
    blockPageLoading();
})();