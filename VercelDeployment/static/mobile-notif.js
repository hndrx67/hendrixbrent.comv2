// Mobile notice handling
document.addEventListener('DOMContentLoaded', function() {
    const mobileNotice = document.getElementById('mobile-notice');
    const closeNoticeBtn = document.getElementById('close-mobile-notice');
    
    // Check if the user has previously dismissed the notice
    const hasSeenNotice = localStorage.getItem('hasSeenMobileNotice');
    
    // Only show notice on mobile devices and if not previously dismissed
    if (window.innerWidth <= 768 && !hasSeenNotice) {
        setTimeout(() => {
            mobileNotice.classList.add('show');
        }, 1000);
    }
    
    // Handle notice dismissal
    closeNoticeBtn.addEventListener('click', function() {
        mobileNotice.classList.remove('show');
        localStorage.setItem('hasSeenMobileNotice', 'true');
    });
});