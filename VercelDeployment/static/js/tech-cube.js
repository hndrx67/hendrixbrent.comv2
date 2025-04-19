// Tech stack cube animation
document.addEventListener('DOMContentLoaded', () => {
    const cubeContainer = document.querySelector('.cube-container');
    
    // Calculate total typewriter animation time
    const firstTextDuration = "Hi, I'm Hendrix!".length * 100; // 100ms per character
    const pauseDuration = 2500;
    const secondTextDuration = "Backend Web and Software Developer".length * 60; // 60ms per character
    const totalTypewriterDuration = firstTextDuration + pauseDuration + secondTextDuration;

    // Show cube after typewriter finishes
    setTimeout(() => {
        cubeContainer.classList.add('visible');
    }, totalTypewriterDuration + 500); // Add 500ms buffer

    // Handle cube visibility on scroll for mobile
    const handleScroll = () => {
        if (window.innerWidth <= 768) {
            const rect = cubeContainer.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
            cubeContainer.style.opacity = isVisible ? '0.5' : '0';
        }
    };

    window.addEventListener('scroll', handleScroll);
});