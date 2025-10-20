// Music Player JavaScript

// Music tracks
const tracks = [
    {
        src: './static/audio/Twilight Serenity.mp3',
        title: 'Twilight Serenity'
    },
    {
        src: './static/audio/Legend of the Wind.mp3',
        title: 'Legend of the Wind'
    }
];

let currentTrack = 0;
let isPlaying = false;
let hasAutoPlayed = false;

// Elements (will be set after modal injection)
let musicModal, musicToggle, closeModal, musicModalOverlay;
let bgMusic, playPauseBtn, prevBtn, nextBtn;
let progressBar, timeCurrent, timeTotal, volumeSlider;
let trackTitle, vinyl, cover;

// Restore music state from sessionStorage
function restoreMusicState() {
    const savedState = sessionStorage.getItem('musicPlayerState');
    if (savedState) {
        const state = JSON.parse(savedState);
        currentTrack = state.currentTrack || 0;
        const savedTime = state.currentTime || 0;
        const wasPlaying = state.isPlaying || false;
        
        // Load the saved track
        loadTrack(currentTrack);
        
        // Set the saved time
        if (bgMusic && savedTime > 0) {
            bgMusic.currentTime = savedTime;
        }
        
        // Resume playing if it was playing before
        if (wasPlaying) {
            setTimeout(() => {
                playMusic().catch(err => {
                    console.log('Auto-resume on page navigation blocked, waiting for interaction');
                });
            }, 100);
        }
        
        return true;
    }
    return false;
}

// Save music state to sessionStorage
function saveMusicState() {
    const state = {
        currentTrack: currentTrack,
        currentTime: bgMusic ? bgMusic.currentTime : 0,
        isPlaying: isPlaying
    };
    sessionStorage.setItem('musicPlayerState', JSON.stringify(state));
}

// Auto-save state periodically and before page unload
function setupStatePersistence() {
    // Save state every 2 seconds if playing
    setInterval(() => {
        if (isPlaying) {
            saveMusicState();
        }
    }, 2000);
    
    // Save state before page unload
    window.addEventListener('beforeunload', () => {
        saveMusicState();
    });
    
    // Save state when visibility changes (tab switching)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            saveMusicState();
        }
    });
}

// Wait for modal to be injected, then initialize
function initMusicPlayer() {
    // Get elements
    musicModal = document.getElementById('music-modal');
    musicToggle = document.getElementById('music-toggle');
    closeModal = document.getElementById('close-music-modal');
    musicModalOverlay = document.querySelector('.music-modal-overlay');
    bgMusic = document.getElementById('bg-music');
    playPauseBtn = document.getElementById('play-pause');
    prevBtn = document.getElementById('prev-track');
    nextBtn = document.getElementById('next-track');
    progressBar = document.getElementById('progress-bar');
    timeCurrent = document.getElementById('time-current');
    timeTotal = document.getElementById('time-total');
    volumeSlider = document.getElementById('volume-slider');
    trackTitle = document.getElementById('track-title');
    vinyl = document.getElementById('vinyl');
    cover = document.getElementById('cover');

    if (!bgMusic) {
        console.error('Audio element not found');
        return;
    }

    // Set initial volume and preload
    bgMusic.volume = 0.2; // 20%
    bgMusic.preload = 'auto';
    if (volumeSlider) {
        volumeSlider.value = 20;
    }
    
    // Setup state persistence
    setupStatePersistence();
    
    // Try to restore previous state first
    const wasRestored = restoreMusicState();
    
    // If no previous state, load first track and setup auto-play
    if (!wasRestored) {
        loadTrack(currentTrack);
        
        // Force load the audio
        bgMusic.load();
        
        // Auto-play after 2 seconds on first visit
        console.log('Auto-play will start after 2 seconds (on any user interaction)');
        
        // Enable audio on any user interaction
        const enableAudio = () => {
            if (!hasAutoPlayed) {
                hasAutoPlayed = true;
                bgMusic.muted = false;
                setTimeout(() => {
                    // Check if music is not already playing before auto-playing
                    if (!isPlaying) {
                        playMusic()
                            .then(() => {
                                console.log('✅ Auto-play successful!');
                            })
                            .catch((error) => {
                                console.log('⚠️ Auto-play blocked. Click play button to start music.');
                            });
                    }
                }, 2000);
                
                // Remove listeners after first interaction
                document.removeEventListener('click', enableAudio);
                document.removeEventListener('keydown', enableAudio);
                document.removeEventListener('scroll', enableAudio);
                document.removeEventListener('mousemove', enableAudio);
            }
        };
        
        // Listen for any user interaction - works on every page load
        document.addEventListener('click', enableAudio, { once: true });
        document.addEventListener('keydown', enableAudio, { once: true });
        document.addEventListener('scroll', enableAudio, { once: true });
        document.addEventListener('mousemove', enableAudio, { once: true });
    }
    
    // Setup all event listeners
    setupEventListeners();
    
    console.log('%c🎵 Music Player Ready! 🎵', 'color: #4a9d7e; font-size: 16px; font-weight: bold;');
    console.log('Audio tracks loaded:', tracks.length);
    console.log('Audio element ready:', bgMusic ? 'Yes' : 'No');
}

// Setup all event listeners
function setupEventListeners() {
    // Music toggle - use AudioModal
    if (musicToggle) {
        musicToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            if (window.AudioModal) {
                window.AudioModal.open();
            }
        });
    }
    
    // Close modal - use AudioModal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            if (window.AudioModal) {
                window.AudioModal.close();
            }
        });
    }
    
    if (musicModalOverlay) {
        musicModalOverlay.addEventListener('click', function(e) {
            if (e.target === musicModalOverlay && window.AudioModal) {
                window.AudioModal.close();
            }
        });
    }
    
    // Escape key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && musicModal && musicModal.classList.contains('active')) {
            if (window.AudioModal) {
                window.AudioModal.close();
            }
        }
    });
    
    // Play/Pause button
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', togglePlayPause);
    }
    
    // Previous track
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
            loadTrack(currentTrack);
        });
    }
    
    // Next track
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentTrack = (currentTrack + 1) % tracks.length;
            loadTrack(currentTrack);
        });
    }
    
    // Progress bar updates
    if (bgMusic) {
        bgMusic.addEventListener('timeupdate', function() {
            if (bgMusic.duration) {
                const progress = (bgMusic.currentTime / bgMusic.duration) * 100;
                progressBar.value = progress;
                
                // Update time displays
                timeCurrent.textContent = formatTime(bgMusic.currentTime);
                timeTotal.textContent = formatTime(bgMusic.duration);
            }
        });
        
        // Load metadata
        bgMusic.addEventListener('loadedmetadata', function() {
            if (timeTotal) {
                timeTotal.textContent = formatTime(bgMusic.duration);
            }
        });
        
        // Auto next track - loop through all tracks
        bgMusic.addEventListener('ended', function() {
            currentTrack = (currentTrack + 1) % tracks.length;
            loadTrack(currentTrack);
            // Auto-play next track
            if (isPlaying) {
                playMusic();
            }
        });
        
        // Vinyl animation sync
        bgMusic.addEventListener('play', function() {
            isPlaying = true;
            if (vinyl) {
                vinyl.classList.add('spinning');
                vinyl.classList.add('playing');
                vinyl.classList.remove('hidden');
            }
            if (cover) {
                cover.classList.remove('expanded');
            }
            if (playPauseBtn) {
                playPauseBtn.classList.add('playing');
            }
        });
        
        bgMusic.addEventListener('pause', function() {
            isPlaying = false;
            if (vinyl) {
                vinyl.classList.remove('spinning');
                vinyl.classList.add('hidden');
            }
            if (cover) {
                cover.classList.add('expanded');
            }
            if (playPauseBtn) {
                playPauseBtn.classList.remove('playing');
            }
        });
    }
    
    // Seek in progress bar
    if (progressBar) {
        progressBar.addEventListener('input', function() {
            const seekTime = (progressBar.value / 100) * bgMusic.duration;
            bgMusic.currentTime = seekTime;
        });
    }
    
    // Volume control
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
            bgMusic.volume = volumeSlider.value / 100;
        });
    }
}

// Load track
function loadTrack(index) {
    if (index >= tracks.length || index < 0) return;
    
    const wasPlaying = isPlaying;
    currentTrack = index;
    bgMusic.src = tracks[currentTrack].src;
    if (trackTitle) {
        trackTitle.textContent = tracks[currentTrack].title;
    }
    
    bgMusic.load();
    
    // If music was playing before, continue playing the new track
    if (wasPlaying) {
        playMusic();
    }
}

// Play music
function playMusic() {
    if (!bgMusic) {
        console.error('Audio element not available');
        return Promise.reject('No audio element');
    }
    
    // Ensure audio is ready
    if (bgMusic.readyState < 2) {
        bgMusic.load();
    }
    
    const playPromise = bgMusic.play();
    
    if (playPromise !== undefined) {
        return playPromise
            .then(() => {
                isPlaying = true;
                if (playPauseBtn) {
                    playPauseBtn.classList.add('playing');
                }
                if (vinyl) {
                    vinyl.classList.add('spinning');
                    vinyl.classList.add('playing');
                    vinyl.classList.remove('hidden');
                }
                if (cover) {
                    cover.classList.remove('expanded');
                }
                saveMusicState(); // Save state when playing
                console.log('🎵 Music playing:', tracks[currentTrack].title);
            })
            .catch(error => {
                console.error('Playback failed:', error);
                console.log('Audio src:', bgMusic.src);
                console.log('Audio readyState:', bgMusic.readyState);
                console.log('Audio networkState:', bgMusic.networkState);
                isPlaying = false;
                throw error;
            });
    }
    
    return Promise.resolve();
}

// Pause music
function pauseMusic() {
    bgMusic.pause();
    isPlaying = false;
    if (playPauseBtn) {
        playPauseBtn.classList.remove('playing');
    }
    if (vinyl) {
        vinyl.classList.remove('spinning');
        vinyl.classList.add('hidden');
    }
    if (cover) {
        cover.classList.add('expanded');
    }
    saveMusicState(); // Save state when paused
}

// Toggle play/pause
function togglePlayPause() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

// Format time (seconds to mm:ss)
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // Wait a bit for audio-modal.js to inject the modal
        setTimeout(initMusicPlayer, 150);
    });
} else {
    setTimeout(initMusicPlayer, 150);
}
