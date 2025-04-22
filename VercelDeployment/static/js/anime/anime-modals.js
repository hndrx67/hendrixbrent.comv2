document.addEventListener('DOMContentLoaded', () => {
    const animeCards = document.querySelectorAll('.anime-card');
    const animeModals = document.querySelectorAll('.anime-modal');
    const closeButtons = document.querySelectorAll('.close-modal');

    // Open modal when clicking a card
    animeCards.forEach(card => {
        card.addEventListener('click', () => {
            const animeClass = Array.from(card.classList).find(cls => 
                ['hotd', 'aot', 'jjk'].includes(cls)
            );
            const modal = document.getElementById(`${animeClass}-modal`);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Add the anime class to the modal for theme-specific styling
                modal.querySelector('.modal-content').classList.add(animeClass);
            }
        });
    });

    // Close modal when clicking close button or outside
    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = button.closest('.anime-modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
                
                // Remove any anime-specific classes
                modal.querySelector('.modal-content').classList.remove('hotd', 'aot', 'jjk');
            }
        });
    });

    animeModals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
                
                // Remove any anime-specific classes
                modal.querySelector('.modal-content').classList.remove('hotd', 'aot', 'jjk');
            }
        });
    });
});