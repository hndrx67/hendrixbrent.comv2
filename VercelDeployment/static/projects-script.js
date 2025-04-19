// Projects filtering functionality
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const projectsGrid = document.querySelector('.projects-grid');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');
            
            // Add transition class to grid
            projectsGrid.style.transition = 'all 0.5s ease';
            
            // Filter and animate projects
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(',');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    // Show card and ensure it's in the flow
                    card.classList.remove('hidden');
                    setTimeout(() => {
                        card.style.transform = 'scale(1)';
                        card.style.opacity = '1';
                    }, 50);
                } else {
                    // Hide card and remove from flow
                    card.style.transform = 'scale(0.8)';
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 500); // Match transition duration
                }
            });

            // Force a reflow to trigger transitions
            projectsGrid.offsetHeight;
        });
    });
});

// Smooth scroll to top when clicking logo
document.querySelector('.logo').addEventListener('click', (e) => {
    if (window.location.pathname.includes('projects.html')) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
});