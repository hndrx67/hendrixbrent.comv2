document.addEventListener('DOMContentLoaded', function() {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'strip-notification';
    document.body.appendChild(notification);

    // Find HTML/CSS skill tag and add special class
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        if (tag.textContent === 'HTML/CSS') {
            tag.classList.add('html-css-tag');
            tag.style.cursor = 'pointer';
            
            // Add subtle hover effect
            tag.addEventListener('mouseenter', () => {
                if (!document.body.classList.contains('stripped')) {
                    tag.style.transform = 'scale(1.1)';
                }
            });
            
            tag.addEventListener('mouseleave', () => {
                if (!document.body.classList.contains('stripped')) {
                    tag.style.transform = 'scale(1)';
                }
            });

            // Add click handler
            tag.addEventListener('click', toggleStrippedMode);
        }
    });

    let isAnimating = false;

    function toggleStrippedMode() {
        if (isAnimating) return;
        isAnimating = true;

        const isStripped = document.body.classList.contains('stripped');
        document.body.classList.add('strip-transition');

        if (!isStripped) {
            // Strip down the website
            notification.textContent = '< Stripping down to basic HTML />';
            notification.classList.add('show');
            
            document.body.style.animation = 'stripDown 1s forwards';
            setTimeout(() => {
                document.body.classList.add('stripped');
                document.body.style.animation = '';
                
                setTimeout(() => {
                    notification.classList.remove('show');
                    isAnimating = false;
                }, 2000);
            }, 1000);
        } else {
            // Restore the website
            notification.textContent = '< Restoring CSS styles />';
            notification.classList.add('show');
            
            document.body.style.animation = 'restoreUp 1s forwards';
            setTimeout(() => {
                document.body.classList.remove('stripped');
                document.body.style.animation = '';
                
                setTimeout(() => {
                    notification.classList.remove('show');
                    document.body.classList.remove('strip-transition');
                    isAnimating = false;
                }, 2000);
            }, 1000);
        }
    }
});