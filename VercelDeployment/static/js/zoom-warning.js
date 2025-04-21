class ZoomWarningHandler {
    constructor() {
        this.createWarningElement();
        this.checkZoom();
        this.setupEventListeners();
    }

    createWarningElement() {
        const warningDiv = document.createElement('div');
        warningDiv.className = 'zoom-warning';
        warningDiv.innerHTML = `
            <span class="zoom-warning-icon">⚠️</span>
        
            <span>&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;WARNING!<br>For the best viewing experience, please set your browser zoom to <b>80%</b><br>
            Page won't work properly if ur zoom is <b>100%</b> or higher.<br>
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
        return Math.round((window.outerWidth / window.innerWidth) * 100);
    }

    checkZoom() {
        const currentZoom = this.getCurrentZoom();
        const hasBeenDismissed = sessionStorage.getItem('zoomWarningDismissed');

        if (currentZoom > 80 && !hasBeenDismissed) {
            this.showWarning();
        } else {
            this.hideWarning();
        }
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