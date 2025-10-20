// Audio Modal Manager - Dynamically creates and manages the music player modal

(function() {
    'use strict';

    // Create the modal HTML structure
    const modalHTML = `
    <div id="music-modal" class="music-modal">
        <div class="music-modal-overlay"></div>
        <div class="music-modal-content">
            <button class="close-modal" id="close-music-modal">&times;</button>
            <div id="wrap">
                <div id="album">
                    <div id="cover"></div>
                    <div id="vinyl">
                        <div id="print"></div>
                    </div>
                </div>
            </div>
            <div class="music-controls">
                <h2 class="now-playing">Now Playing</h2>
                <p class="track-title" id="track-title">Track 1</p>
                <div class="control-buttons">
                    <button class="control-btn" id="prev-track" title="Previous Track">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                        </svg>
                    </button>
                    <button class="control-btn play-pause" id="play-pause" title="Play/Pause">
                        <svg class="play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                        <svg class="pause-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                        </svg>
                    </button>
                    <button class="control-btn" id="next-track" title="Next Track">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                        </svg>
                    </button>
                </div>
                <div class="progress-container">
                    <span class="time-current" id="time-current">0:00</span>
                    <input type="range" class="progress-bar" id="progress-bar" min="0" max="100" value="0">
                    <span class="time-total" id="time-total">0:00</span>
                </div>
                <div class="volume-container">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="volume-icon">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    </svg>
                    <input type="range" class="volume-slider" id="volume-slider" min="0" max="100" value="70">
                </div>
            </div>
        </div>
    </div>

    <audio id="bg-music">
        <source src="./static/audio/Twilight Serenity.mp3" type="audio/mpeg">
        <source src="./static/audio/Legend of the Wind.mp3" type="audio/mpeg">
    </audio>
    `;

    // Inject modal into page when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initModal);
    } else {
        initModal();
    }

    function initModal() {
        // Create a container and insert the modal
        const container = document.createElement('div');
        container.innerHTML = modalHTML;
        
        // Insert at the beginning of body
        document.body.insertBefore(container.firstElementChild, document.body.firstChild);
        
        // Insert audio element
        const audioElements = container.querySelectorAll('audio');
        audioElements.forEach(audio => {
            document.body.appendChild(audio);
        });

        console.log('%c🎵 Audio Modal Loaded', 'color: #4a9d7e; font-size: 14px; font-weight: bold;');
    }

    // Modal control functions
    window.AudioModal = {
        open: function() {
            const modal = document.getElementById('music-modal');
            const mainContent = document.querySelector('.main-content');
            const navbar = document.querySelector('.navbar');
            const audio = document.getElementById('bg-music');
            const playPauseBtn = document.getElementById('play-pause');
            const vinyl = document.getElementById('vinyl');
            
            if (modal) {
                modal.classList.add('active');
                // Prevent scrolling but don't change layout
                document.documentElement.style.overflow = 'hidden';
                
                // Add blur to main content
                if (mainContent) mainContent.classList.add('blurred');
                if (navbar) navbar.classList.add('blurred');
                
                // Sync UI with current audio state
                if (audio && playPauseBtn && vinyl) {
                    if (!audio.paused) {
                        playPauseBtn.classList.add('playing');
                        vinyl.classList.add('spinning');
                        vinyl.classList.add('playing');
                    } else {
                        playPauseBtn.classList.remove('playing');
                        vinyl.classList.remove('spinning');
                    }
                }
            }
        },
        
        close: function() {
            const modal = document.getElementById('music-modal');
            const mainContent = document.querySelector('.main-content');
            const navbar = document.querySelector('.navbar');
            
            if (modal) {
                modal.classList.remove('active');
                // Restore scrolling
                document.documentElement.style.overflow = '';
                
                // Remove blur
                if (mainContent) mainContent.classList.remove('blurred');
                if (navbar) navbar.classList.remove('blurred');
            }
        }
    };

})();
