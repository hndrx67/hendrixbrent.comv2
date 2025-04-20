document.addEventListener('DOMContentLoaded', () => {
    // Filter buttons and blog cards functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            // Handle filtering with animation
            blogCards.forEach(card => {
                card.classList.add('fade-out');
                
                setTimeout(() => {
                    if (filter === 'all' || card.dataset.category.includes(filter)) {
                        card.classList.remove('hidden');
                        setTimeout(() => {
                            card.classList.remove('fade-out');
                            card.classList.add('fade-in');
                        }, 50);
                    } else {
                        card.classList.add('hidden');
                    }
                }, 300);

                setTimeout(() => {
                    card.classList.remove('fade-in');
                }, 600);
            });
        });
    });

    // Modal functionality
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');

    blogCards.forEach(card => {
        card.addEventListener('click', function() {
            const modalId = `${this.dataset.modal}-modal`;
            document.getElementById(modalId).classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Loading screen
    window.addEventListener('load', () => {
        const loadingScreen = document.querySelector('.loading-screen');
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 300);
        }, 500);
    });
});