document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading screen
    const loadingScreen = document.querySelector('.loading-screen');
    const loadingText = loadingScreen.querySelector('.loading-text');
    let loadingTimeout = null;
    let loadingInterval = null;

    // VTuber trigger handler
    const marineTrigger = document.getElementById('marine-trigger');
    if (marineTrigger) {
        marineTrigger.addEventListener('mouseup', () => {
            const selectedText = window.getSelection().toString();
            if (selectedText === 'Houshou Marine') {
                showLoadingScreen('vtubers-wiki.html');
            }
        });
    }

    // Handle navigation links
    document.querySelectorAll('a').forEach(link => {
        // Only handle internal navigation links (same domain)
        if (link.href && link.href.startsWith(window.location.origin) && 
            !link.href.includes('#') && // Exclude anchor links
            link.href !== window.location.href) { // Exclude current page
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showLoadingScreen(link.href);
            });
        }
    });

    function showLoadingScreen(targetUrl) {
        // Show loading screen with fade in
        loadingScreen.classList.add('active');

        // Animate loading text with dots
        let dots = '';
        loadingInterval = setInterval(() => {
            dots = dots.length >= 3 ? '' : dots + '.';
            loadingText.textContent = 'Loading' + dots;
        }, 500);

        // Add random delay between 800ms and 1500ms for visual effect
        loadingTimeout = setTimeout(() => {
            clearInterval(loadingInterval);
            window.location.href = targetUrl;
        }, Math.random() * 700 + 800);
    }

    function clearLoadingScreen() {
        if (loadingTimeout) {
            clearTimeout(loadingTimeout);
            loadingTimeout = null;
        }
        if (loadingInterval) {
            clearInterval(loadingInterval);
            loadingInterval = null;
        }
        loadingScreen.classList.remove('active');
    }

    // Hide loading screen when back button is pressed
    window.addEventListener('popstate', () => {
        clearLoadingScreen();
    });

    // Hide loading screen on page load
    clearLoadingScreen();
});