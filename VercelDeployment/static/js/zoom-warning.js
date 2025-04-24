class ZoomWarningHandler {
    constructor() {
        // Don't show warning on mobile devices
        if (this.isMobileDevice()) {
            return;
        }
        this.warningTimeout = null;
        this.lastZoom = this.getCurrentZoom();
        this.createWarningElement();
        this.checkZoom();
        this.setupEventListeners();
    }

    isMobileDevice() {
        return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    createWarningElement() {
        const warningDiv = document.createElement('div');
        warningDiv.className = 'zoom-warning';
        warningDiv.innerHTML = `
            <span class="zoom-warning-icon">⚠️</span>
        
            <span>&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;WARNING!<br>For the best viewing experience, please set your browser zoom to <b>80%</b>
           
            </span>
            <button class="zoom-warning-close">&times;</button>
        `;
        document.body.appendChild(warningDiv);

        this.warningElement = warningDiv;
        this.setupCloseButton();
    }

    setupCloseButton() {
        const closeButton = this.warningElement.querySelector('.zoom-warning-close');
        closeButton.addEventListener('click', () => {
            this.hideWarning();
            // Store in session that user has dismissed the warning
            sessionStorage.setItem('zoomWarningDismissed', 'true');
        });
    }

    setupEventListeners() {
        // Check zoom on window resize
        window.addEventListener('resize', () => {
            requestAnimationFrame(() => this.checkZoom());
        });
    }

    getCurrentZoom() {
        // More accurate zoom detection using devicePixelRatio
        return Math.round(window.devicePixelRatio * 100);
    }

    checkZoom() {
        if (this.isMobileDevice()) {
            this.hideWarning();
            return;
        }

        const currentZoom = this.getCurrentZoom();
        
        // Show warning if zoom is greater than 80% and has changed
        if (currentZoom > 80 && currentZoom !== this.lastZoom) {
            this.showWarning();
            // Clear any existing timeout
            if (this.warningTimeout) {
                clearTimeout(this.warningTimeout);
            }
            // Set new timeout to hide warning after 2 seconds
            this.warningTimeout = setTimeout(() => {
                this.hideWarning();
            }, 1500);
        }
        
        this.lastZoom = currentZoom;
    }

    showWarning() {
        this.warningElement.classList.add('show');
    }

    hideWarning() {
        this.warningElement.classList.remove('show');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.zoomWarning = new ZoomWarningHandler();
});