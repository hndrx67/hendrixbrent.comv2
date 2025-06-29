document.addEventListener('DOMContentLoaded', () => {
    // Header scroll effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Modal functionality
    const vtuberCards = document.querySelectorAll('.vtuber-card');
    const modals = document.querySelectorAll('.vtuber-modal');
    const closeButtons = document.querySelectorAll('.close-modal');

    // Card click for main vtubers
    vtuberCards.forEach(card => {
        card.addEventListener('click', () => {
            const vtuberClass = Array.from(card.classList)
                .find(className => ['gura', 'marine', 'mori', 'kronii', 'fauna', 'nerissa','rin'].includes(className));
            const modal = document.getElementById(`${vtuberClass}-modal`);
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                setTimeout(() => {
                    modal.classList.add('active');
                    modal.querySelector('.modal-content').style.opacity = '1';
                    modal.querySelector('.modal-content').style.transform = 'translateY(0)';
                }, 10);
            }
        });
    });

    // Special handler for "open-modal-btn" buttons (for Sameko Saba and future use)
    document.querySelectorAll('.open-modal-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            var modalId = btn.getAttribute('data-modal');
            var modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                setTimeout(() => {
                    modal.classList.add('active');
                    modal.querySelector('.modal-content').style.opacity = '1';
                    modal.querySelector('.modal-content').style.transform = 'translateY(0)';
                }, 10);
            }
        });
    });

    function closeModal(modal) {
        modal.classList.remove('active');
        modal.querySelector('.modal-content').style.opacity = '0';
        modal.querySelector('.modal-content').style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.vtuber-modal');
            closeModal(modal);
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.vtuber-modal.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
});