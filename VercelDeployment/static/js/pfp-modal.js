document.addEventListener('DOMContentLoaded', function() {
    const profileCard = document.querySelector('.profile-card');
    const pfpModal = document.querySelector('.pfp-modal');
    const closeModalBtn = document.querySelector('.close-pfp-modal');
    let isAnimating = false;

    // Function to animate timeline items
    function animateTimelineItems() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.2}s`;
        });

        const achievementItems = document.querySelectorAll('.achievement-item');
        achievementItems.forEach((item, index) => {
            item.style.animationDelay = `${(index * 0.2) + 0.5}s`;
        });
    }

    // Open modal
    function openModal() {
        if (isAnimating) return;
        isAnimating = true;
        
        // Animate profile card
        profileCard.style.transform = 'scale(0.8)';
        profileCard.style.opacity = '0';
        
        // Show modal
        pfpModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animate timeline items
        animateTimelineItems();
        
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }

    // Close modal
    function closeModal() {
        if (isAnimating) return;
        isAnimating = true;
        
        // Hide modal
        pfpModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Animate profile card back
        profileCard.style.transform = 'scale(1)';
        profileCard.style.opacity = '1';
        
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }

    // Event listeners
    if (profileCard && pfpModal && closeModalBtn) {
        profileCard.addEventListener('click', openModal);
        closeModalBtn.addEventListener('click', closeModal);
        
        // Close modal when clicking outside
        pfpModal.addEventListener('click', (e) => {
            if (e.target === pfpModal) {
                closeModal();
            }
        });

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && pfpModal.classList.contains('active')) {
                closeModal();
            }
        });
    }
});