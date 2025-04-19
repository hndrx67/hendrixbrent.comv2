document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on desktop
    if (window.innerWidth <= 768) return;

    let toggleCount = 0;
    let lastToggleTime = Date.now();
    const TOGGLE_TIMEOUT = 5000; // 5 seconds timeout between toggles
    const REQUIRED_TOGGLES = 10;

    // Create blood theme notification
    const notification = document.createElement('div');
    notification.className = 'blood-theme-notification';
    notification.innerHTML = `
        <h3>🩸 Blood Theme Unlocked 🩸</h3>
        <p>You cliked Light and Dark Mode 10 Times!</p>
    `;
    document.body.appendChild(notification);

    // Listen for theme toggle clicks
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', handleThemeToggle);

    function handleThemeToggle() {
        const currentTime = Date.now();
        
        // Reset count if too much time has passed since last toggle
        if (currentTime - lastToggleTime > TOGGLE_TIMEOUT) {
            toggleCount = 0;
        }
        
        toggleCount++;
        lastToggleTime = currentTime;

        // Check if we've reached the required number of toggles
        if (toggleCount === REQUIRED_TOGGLES) {
            activateBloodTheme();
        }
    }

    function activateBloodTheme() {
        // Add transition class for smooth color changes
        document.body.classList.add('blood-theme-transition');
        
        // Show notification
        notification.classList.add('active');
        
        // Add blood theme class
        setTimeout(() => {
            document.body.classList.add('blood-theme');
            
            // Play activation sound
            const audio = new Audio('/static/sounds/blood-theme.mp3');
            audio.volume = 0.3;
            audio.play().catch(() => {}); // Ignore if audio fails to play
        }, 100);

        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('active');
        }, 3000);

        // Remove transition class after colors have changed
        setTimeout(() => {
            document.body.classList.remove('blood-theme-transition');
        }, 600);

        // Save blood theme state to session storage
        sessionStorage.setItem('bloodThemeUnlocked', 'true');
    }

    // Check if blood theme was previously unlocked in this session
    if (sessionStorage.getItem('bloodThemeUnlocked') === 'true') {
        document.body.classList.add('blood-theme');
    }
});