// optimized-age-verification.js

// Create a self-executing function that runs immediately
(function() {
    // Function to create and set up the age verification overlay
    function setupAgeVerification() {
      // Create and inject CSS - placed at the top for immediate styling
      const style = document.createElement('style');
      style.textContent = `
        .age-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
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
  
        /* Hide all body content by default */
        body {
          visibility: hidden;
          overflow: hidden;
        }
  
        /* Only the age verification will be visible */
        .age-overlay {
          visibility: visible;
        }
  
        @media (max-width: 600px) {
          .age-buttons {
            flex-direction: column;
          }
          
          .btn {
            width: 100%;
            margin-bottom: 10px;
          }
        }
      `;
      document.head.appendChild(style);
  
      // Create overlay HTML
      const overlay = document.createElement('div');
      overlay.className = 'age-overlay';
      overlay.id = 'ageVerification';
      
      overlay.innerHTML = `
        <div class="age-dialog">
          <div class="age-title">AGE VERIFICATION REQUIRED</div>
          <div class="age-warning">
            <p>This website contains adult content that is only suitable for individuals who are at least 18 years of age or the legal age in your jurisdiction.</p>
            <br>
            <p>Contact <u>Hendrix F.</u> if you have questions.</p>
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
      `;
      
      // Add the overlay to the body
      document.body.appendChild(overlay);
      
      // Get elements
      const ageVerification = document.getElementById('ageVerification');
      const proceedButton = document.getElementById('proceedButton');
      const leaveButton = document.getElementById('leaveButton');
      const ageCheckbox = document.getElementById('ageConfirmation');
      
      // Enable proceed button only when checkbox is checked
      ageCheckbox.addEventListener('change', function() {
        proceedButton.disabled = !this.checked;
      });
      
      // When user clicks proceed
      proceedButton.addEventListener('click', function() {
        if (ageCheckbox.checked) {
          // Remove the overlay
          ageVerification.remove();
          
          // Make the body content visible again
          document.body.style.visibility = 'visible';
          document.body.style.overflow = 'auto';
          
          // Fire an event that the site can listen for to initialize other components
          document.dispatchEvent(new CustomEvent('ageVerificationComplete'));
        }
      });
      
      // When user clicks leave
      leaveButton.addEventListener('click', function() {
        window.history.back(); // Go back to previous page
        // Fallback if there's no history
        setTimeout(function() {
          window.location.href = 'https://www.google.com';
        }, 100);
      });
    }
  
    // Run before any content loads
    if (document.readyState === 'loading') {
      // If the document is still loading, add event listener
      document.addEventListener('DOMContentLoaded', setupAgeVerification);
    } else {
      // If the document is already loaded (unlikely for a script in the head)
      setupAgeVerification();
    }
  })();