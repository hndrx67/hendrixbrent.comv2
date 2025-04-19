document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on desktop
    if (window.innerWidth <= 768) return;

    const profileImage = document.querySelector('.profile-image');
    let hoverTimer;
    let easterEggTriggered = false;

    // Create initial dialog
    const dialog = document.createElement('div');
    dialog.className = 'easter-egg-dialog';
    dialog.innerHTML = `
        <h3>Destroy the Website?</h3>
        <div class="easter-egg-buttons">
            <button class="easter-egg-button yes">Yes</button>
            <button class="easter-egg-button no">No</button>
        </div>
    `;

    // Create reconstruction dialog
    const reconstructDialog = document.createElement('div');
    reconstructDialog.className = 'easter-egg-dialog';
    reconstructDialog.innerHTML = `
        <h3>Reconstruct the Website?</h3>
        <div class="easter-egg-buttons">
            <button class="easter-egg-button yes">Yes</button>
            <button class="easter-egg-button no">No</button>
        </div>
    `;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'destroy-overlay';

    // Add elements to body
    document.body.appendChild(dialog);
    document.body.appendChild(reconstructDialog);
    document.body.appendChild(overlay);

    // Get loading screen elements
    const loadingScreen = document.querySelector('.loading-screen');

    // Hover timer functionality
    profileImage.addEventListener('mouseenter', () => {
        if (easterEggTriggered) return;
        
        hoverTimer = setTimeout(() => {
            dialog.style.display = 'block';
            overlay.style.display = 'block';
        }, 10000); // 10 seconds
    });

    profileImage.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimer);
    });

    // Handle initial dialog buttons
    const yesButton = dialog.querySelector('.yes');
    const noButton = dialog.querySelector('.no');

    yesButton.addEventListener('click', () => {
        dialog.style.display = 'none';
        overlay.style.display = 'none';
        destroyWebsite();
        easterEggTriggered = true;
    });

    noButton.addEventListener('click', () => {
        dialog.style.display = 'none';
        overlay.style.display = 'none';
        easterEggTriggered = true;
    });

    // Handle reconstruction dialog buttons
    const reconstructYesButton = reconstructDialog.querySelector('.yes');
    const reconstructNoButton = reconstructDialog.querySelector('.no');

    reconstructYesButton.addEventListener('click', () => {
        reconstructDialog.style.display = 'none';
        overlay.style.display = 'none';
        showLoadingScreen(1000, () => {
            reconstructWebsite();
        });
    });

    reconstructNoButton.addEventListener('click', () => {
        reconstructDialog.style.display = 'none';
        overlay.style.display = 'none';
        showLoadingScreen(1000, () => {
            window.location.href = '404.html';
        });
    });

    function showLoadingScreen(duration, callback) {
        loadingScreen.classList.add('active');
        setTimeout(() => {
            loadingScreen.classList.remove('active');
            if (callback) callback();
        }, duration);
    }

    function destroyWebsite() {
        // Get all major sections and elements
        const elements = document.querySelectorAll('section, header, footer, .toggle-wrapper');
        
        // Add falling animation with slight delay for each element
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('falling');
            }, index * 200);
        });

        // After elements have fallen, show reconstruction dialog
        setTimeout(() => {
            showLoadingScreen(1000, () => {
                reconstructDialog.style.display = 'block';
                overlay.style.display = 'block';
            });
        }, elements.length * 200 + 2000);
    }

    function reconstructWebsite() {
        // Remove falling class from all elements
        const elements = document.querySelectorAll('.falling');
        elements.forEach(element => element.classList.remove('falling'));

        // Add reconstruction animation class to each element
        const allElements = document.querySelectorAll('section, header, footer, .toggle-wrapper');
        allElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(50px)';
            setTimeout(() => {
                element.style.transition = 'all 0.5s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
});