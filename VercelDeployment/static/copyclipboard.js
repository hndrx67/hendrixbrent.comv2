// Notification system for copy functionality
function showNotification(message, type = 'success') {
    // Remove existing notification if present
    const existingNotification = document.querySelector('.copy-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `copy-notification ${type}`;
    notification.textContent = message;

    // Add notification to body
    document.body.appendChild(notification);

    // Remove notification after delay
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

// Copy to clipboard functionality
function copyToClipboard(url) {
    // Get the current page URL if no specific URL is provided
    const textToCopy = url || window.location.href;

    // Use the modern clipboard API
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            showNotification('Link copied to clipboard! 📋');
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
            showNotification('Failed to copy link!', 'error');

            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            
            try {
                document.execCommand('copy');
                showNotification('Link copied to clipboard! 📋');
            } catch (err) {
                console.error('Fallback: Could not copy text: ', err);
                showNotification('Failed to copy link!', 'error');
            }
            
            document.body.removeChild(textarea);
        });
}

// Add styles for notifications
const style = document.createElement('style');
style.textContent = `
    .copy-notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 24px;
        border-radius: 4px;
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
        background-color: #333;
        color: white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }

    .copy-notification.success {
        background-color: #4CAF50;
    }

    .copy-notification.error {
        background-color: #f44336;
    }

    .copy-notification.fade-out {
        animation: fadeOut 0.3s ease-out forwards;
    }

    @keyframes slideIn {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @keyframes fadeOut {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);