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

    // Text iteration animation for stats
    const possibleChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ+';
    const iterationSpeed = 80; // milliseconds per iteration
    const iterations = 30; // number of iterations before settling

    function getRandomChar() {
        return possibleChars[Math.floor(Math.random() * possibleChars.length)];
    }

    function animateText(element, finalText) {
        element.classList.add('animating');
        let currentIteration = 0;
        
        const animate = () => {
            if (currentIteration < iterations) {
                // Generate random text of same length as final
                let randomText = '';
                for (let i = 0; i < finalText.length; i++) {
                    randomText += getRandomChar();
                }
                element.textContent = randomText;
                currentIteration++;
                setTimeout(animate, iterationSpeed);
            } else {
                element.textContent = finalText;
            }
        };
        
        animate();
    }

    function startStatsAnimation(container, delay = 0) {
        const statValues = container.querySelectorAll('.stat-value');
        statValues.forEach((value, index) => {
            const finalText = value.textContent;
            value.textContent = '';
            setTimeout(() => {
                animateText(value, finalText);
            }, delay + (index * 200)); // Stagger the animations
        });
    }

    // Animate stats when cards become visible
    const vtuberCards = document.querySelectorAll('.vtuber-card');
    function checkCardVisibility() {
        vtuberCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const isVisible = (
                rect.top >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
            );
            
            if (isVisible && !card.dataset.animated) {
                card.dataset.animated = 'true';
                startStatsAnimation(card);
            }
        });
    }

    // Check visibility on load and scroll
    checkCardVisibility();
    window.addEventListener('scroll', checkCardVisibility);

    // Modal functionality
    const modals = document.querySelectorAll('.vtuber-modal');
    const closeButtons = document.querySelectorAll('.close-modal');

    vtuberCards.forEach(card => {
        card.addEventListener('click', () => {
            const vtuberClass = Array.from(card.classList)
                .find(className => ['gura', 'marine', 'mori'].includes(className));
            const modal = document.getElementById(`${vtuberClass}-modal`);
            
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                
                // Trigger animations after a small delay
                setTimeout(() => {
                    modal.classList.add('active');
                    modal.querySelector('.modal-content').style.opacity = '1';
                    modal.querySelector('.modal-content').style.transform = 'translateY(0)';
                    // Start animation for modal stats
                    startStatsAnimation(modal.querySelector('.modal-stats'), 500);
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