class ModalZoomHandler {
    constructor() {
        this.modals = document.querySelectorAll('.vtuber-modal');
        this.lastZoom = 100;
        this.init();
    }

    init() {
        // Initial setup
        this.updateModalSizes();
        
        // Watch for zoom changes
        window.addEventListener('resize', () => {
            requestAnimationFrame(() => this.checkZoomAndUpdate());
        });
    }

    getCurrentZoom() {
        return Math.round((window.outerWidth / window.innerWidth) * 100);
    }

    updateModalSizes() {
        const zoom = this.getCurrentZoom();
        
        this.modals.forEach(modal => {
            const content = modal.querySelector('.modal-content');
            if (!content) return;

            // Adjust modal size based on zoom level
            if (zoom >= 100) {
                content.style.width = '85vw';
                content.style.height = '85vh';
                content.style.transform = 'scale(0.9)';
            } else if (zoom >= 80) {
                content.style.width = '90vw';
                content.style.height = '90vh';
                content.style.transform = 'scale(1)';
            } else {
                content.style.width = '95vw';
                content.style.height = '95vh';
                content.style.transform = 'scale(1.1)';
            }
        });

        this.lastZoom = zoom;
    }

    checkZoomAndUpdate() {
        const currentZoom = this.getCurrentZoom();
        if (currentZoom !== this.lastZoom) {
            this.updateModalSizes();
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.modalZoomHandler = new ModalZoomHandler();
});