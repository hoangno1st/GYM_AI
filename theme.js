// Theme management
class ThemeManager {
    constructor() {
        this.init();
        this.setupLogout();
    }

    init() {
        // Load saved theme settings
        this.loadThemeSettings();
        
        // Apply theme settings when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.applyThemeSettings();
            this.setupLogout();
        });
    }

    setupLogout() {
        // Find all logout links
        const logoutLinks = document.querySelectorAll('#logout-link');
        logoutLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        });
    }

    handleLogout() {
        // Clear user data
        localStorage.removeItem('userSettings');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        
        // Show logout notification
        this.showNotification('Logging out...', () => {
            // Redirect to home page after notification
            window.location.href = 'home.html';
        });
    }

    showNotification(message, callback, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Remove notification and execute callback after 2 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => {
                notification.remove();
                if (callback) callback();
            }, 300);
        }, 2000);
    }

    loadThemeSettings() {
        // Load dark mode setting
        const darkMode = localStorage.getItem('darkMode') === 'true';
        this.applyDarkMode(darkMode);

        // Load color scheme
        const colorScheme = localStorage.getItem('colorScheme') || 'default';
        this.applyColorScheme(colorScheme);

        // Load font size
        const fontSize = localStorage.getItem('fontSize') || 'medium';
        this.applyFontSize(fontSize);
    }

    applyThemeSettings() {
        const darkMode = localStorage.getItem('darkMode') === 'true';
        const colorScheme = localStorage.getItem('colorScheme') || 'default';
        const fontSize = localStorage.getItem('fontSize') || 'medium';

        this.applyDarkMode(darkMode);
        this.applyColorScheme(colorScheme);
        this.applyFontSize(fontSize);
    }

    applyDarkMode(enabled) {
        if (enabled) {
            document.body.classList.add('dark-mode');
            document.documentElement.setAttribute('data-theme', 'dark');
            
            // Update meta theme-color for dark mode
            this.updateMetaThemeColor('#1a1a1a');
            
            // Apply dark mode to all frames if they exist
            try {
                const frames = document.querySelectorAll('iframe');
                frames.forEach(frame => {
                    try {
                        if (frame.contentDocument) {
                            frame.contentDocument.body.classList.add('dark-mode');
                            frame.contentDocument.documentElement.setAttribute('data-theme', 'dark');
                        }
                    } catch (e) {
                        // Silently fail for cross-origin frames
                    }
                });
            } catch (e) {
                console.warn('Could not apply dark mode to frames:', e);
            }
        } else {
            document.body.classList.remove('dark-mode');
            document.documentElement.setAttribute('data-theme', 'light');
            
            // Update meta theme-color for light mode
            this.updateMetaThemeColor('#ffffff');
            
            // Remove dark mode from all frames if they exist
            try {
                const frames = document.querySelectorAll('iframe');
                frames.forEach(frame => {
                    try {
                        if (frame.contentDocument) {
                            frame.contentDocument.body.classList.remove('dark-mode');
                            frame.contentDocument.documentElement.setAttribute('data-theme', 'light');
                        }
                    } catch (e) {
                        // Silently fail for cross-origin frames
                    }
                });
            } catch (e) {
                console.warn('Could not remove dark mode from frames:', e);
            }
        }
    }

    applyColorScheme(scheme) {
        // Remove all color scheme classes
        document.body.classList.remove('color-blue', 'color-green', 'color-purple');
        
        // Add new color scheme class if not default
        if (scheme !== 'default') {
            document.body.classList.add(`color-${scheme}`);
        }
    }

    applyFontSize(size) {
        // Remove all font size classes
        document.body.classList.remove('font-small', 'font-medium', 'font-large');
        
        // Add new font size class
        document.body.classList.add(`font-${size}`);
    }

    updateMetaThemeColor(color) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.content = color;
    }

    // Static method to get instance
    static getInstance() {
        if (!ThemeManager.instance) {
            ThemeManager.instance = new ThemeManager();
        }
        return ThemeManager.instance;
    }
}

// Initialize theme manager
const themeManager = ThemeManager.getInstance();

// Export for use in other files
window.themeManager = themeManager; 