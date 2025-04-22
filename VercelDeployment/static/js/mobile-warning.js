class MobileWarningHandler {
    constructor() {
        if (this.isMobileDevice()) {
            this.createWarningElement();
            this.showWarning();
            this.autoCloseWarning();
        }
    }

    isMobileDevice() {
        return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    createWarningElement() {
        const warningDiv = document.createElement('div');
        warningDiv.className = 'mobile-warning';
        warningDiv.innerHTML = `
            <span class="mobile-warning-icon">📱</span>
            <span>Attention! Experience is Reduced In mobile</span>
        `;
        
        // Add styles
        warningDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #ff9800;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            text-align: center;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;

        document.body.appendChild(warningDiv);
        this.warningElement = warningDiv;
    }

    showWarning() {
        setTimeout(() => {
            this.warningElement.style.opacity = '1';
        }, 100);
    }

    hideWarning() {
        this.warningElement.style.opacity = '0';
        setTimeout(() => {
            this.warningElement.remove();
        }, 300);
    }

    autoCloseWarning() {
        setTimeout(() => {
            this.hideWarning();
        }, 2000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mobileWarning = new MobileWarningHandler();
});