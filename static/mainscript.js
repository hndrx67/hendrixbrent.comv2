// must be imported via src
        // Typewriter effect
        const typewriterText = "Hi, I'm Hendrix Brent";
        const typewriter = document.getElementById('typewriter');
        let charIndex = 0;

        function typeCharacter() {
            if (charIndex < typewriterText.length) {
                typewriter.textContent = typewriterText.substring(0, charIndex + 1);
                charIndex++;
                setTimeout(typeCharacter, 100);
            } else {
                // Start next sentence after short pause
                setTimeout(() => {
                    typewriterNext();
                }, 2500);
            }
        }

        function typewriterNext() {
            typewriter.textContent = "";
            const nextText = "Backend Web and Software Developer";
            let nextIndex = 0;

            function typeNext() {
                if (nextIndex < nextText.length) {
                    typewriter.textContent = nextText.substring(0, nextIndex + 1);
                    nextIndex++;
                    setTimeout(typeNext, 60);
                }
            }
            typeNext();
        }

        // Start the typewriter effect when the page loads
        window.addEventListener('load', function() {
            setTimeout(typeCharacter, 1000);
        });

        // Handle scrolling header
        const header = document.getElementById('header');
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        const toggleIcon = document.getElementById('toggle-icon');
        
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-mode');
            if (document.body.classList.contains('light-mode')) {
                toggleIcon.innerHTML = `
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                `;
            } else {
                toggleIcon.innerHTML = `
                    <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 2V4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 20V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M4.93 4.93L6.34 6.34" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M17.66 17.66L19.07 19.07" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M2 12H4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M20 12H22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6.34 17.66L4.93 19.07" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M19.07 4.93L17.66 6.34" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                `;
            }
        });

        // Mobile navigation
        const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
        const nav = document.getElementById('nav');
        
        mobileNavToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            if (nav.classList.contains('active')) {
                mobileNavToggle.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `;
            } else {
                mobileNavToggle.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `;
            }
        });

        // Close mobile nav when clicking on a link
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                mobileNavToggle.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `;
            });
        });

        // Blog modals
        const blogCards = document.querySelectorAll('.blog-card');
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

        // Form submission
        const contactForm = document.querySelector('.contact-form');
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would typically handle the form submission
            alert('Thanks for your message! I will get back to you soon.');
            this.reset();
        });
    