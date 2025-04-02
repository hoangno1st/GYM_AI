document.addEventListener('DOMContentLoaded', function() {
    // Get theme manager instance
    const themeManager = window.themeManager;

    // Setup form submissions
    setupSettingsForms();
    
    // Setup dark mode toggle
    setupThemeToggles();

    // Setup user dropdown
    setupUserDropdown();

    // Setup carousel
    setupTipsCarousel();

    // Function to handle all settings forms
    function setupSettingsForms() {
        const forms = document.querySelectorAll('.settings-form');
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form ID to determine which settings to save
                const formId = this.id;
                
                if (formId === 'themeForm') {
                    // Theme settings are handled by specific event listeners
                    themeManager.showNotification('Theme settings applied');
                } else if (formId === 'notificationForm') {
                    // Save notification preferences
                    const settings = {
                        emailNotifications: document.getElementById('emailNotifications').checked,
                        workoutReminders: document.getElementById('workoutReminders').checked,
                        nutritionTips: document.getElementById('nutritionTips').checked,
                        communityUpdates: document.getElementById('communityUpdates').checked
                    };
                    
                    localStorage.setItem('notificationSettings', JSON.stringify(settings));
                    themeManager.showNotification('Notification preferences saved');
                } else if (formId === 'privacyForm') {
                    // Save privacy settings
                    const settings = {
                        profileVisibility: document.getElementById('profileVisibility').value,
                        showProgress: document.getElementById('showProgress').checked,
                        showWorkouts: document.getElementById('showWorkouts').checked
                    };
                    
                    localStorage.setItem('privacySettings', JSON.stringify(settings));
                    themeManager.showNotification('Privacy settings saved');
                }
            });
        });
    }

    // Function to setup theme toggles
    function setupThemeToggles() {
        // Dark mode toggle
        const darkModeToggle = document.getElementById('darkMode');
        if (darkModeToggle) {
            // Set initial state
            darkModeToggle.checked = localStorage.getItem('darkMode') === 'true';
            
            // Add change event listener
            darkModeToggle.addEventListener('change', function() {
                themeManager.applyDarkMode(this.checked);
                localStorage.setItem('darkMode', this.checked);
                themeManager.showNotification(this.checked ? 'Dark mode enabled' : 'Dark mode disabled');
            });
        }
        
        // Color scheme select
        const colorSchemeSelect = document.getElementById('colorScheme');
        if (colorSchemeSelect) {
            // Set initial value
            colorSchemeSelect.value = localStorage.getItem('colorScheme') || 'default';
            
            // Add change event listener
            colorSchemeSelect.addEventListener('change', function() {
                themeManager.applyColorScheme(this.value);
                localStorage.setItem('colorScheme', this.value);
                themeManager.showNotification(`Color scheme set to ${this.value}`);
            });
        }
        
        // Font size select
        const fontSizeSelect = document.getElementById('fontSize');
        if (fontSizeSelect) {
            // Set initial value
            fontSizeSelect.value = localStorage.getItem('fontSize') || 'medium';
            
            // Add change event listener
            fontSizeSelect.addEventListener('change', function() {
                themeManager.applyFontSize(this.value);
                localStorage.setItem('fontSize', this.value);
                themeManager.showNotification(`Font size set to ${this.value}`);
            });
        }
    }

    // Function to handle user dropdown
    function setupUserDropdown() {
        const userProfileBtn = document.getElementById('user-profile');
        const userDropdown = document.getElementById('user-dropdown');
        
        if (userProfileBtn && userDropdown) {
            userProfileBtn.addEventListener('click', function(e) {
                e.preventDefault();
                userDropdown.classList.toggle('show');
            });
            
            // Close dropdown when clicking elsewhere
            document.addEventListener('click', function(e) {
                if (!userProfileBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                    userDropdown.classList.remove('show');
                }
            });
        }
    }

    // Function to handle tips carousel
    function setupTipsCarousel() {
        const prevButton = document.getElementById('prev-tip');
        const nextButton = document.getElementById('next-tip');
        const tips = document.querySelectorAll('.tip');
        const dots = document.querySelectorAll('.dot');
        
        if (!prevButton || !nextButton || tips.length === 0) return;
        
        let currentIndex = 0;
        
        // Function to show a specific tip
        function showTip(index) {
            // Hide all tips and remove active class from dots
            tips.forEach(tip => tip.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Show current tip and add active class to current dot
            tips[index].classList.add('active');
            if (dots[index]) dots[index].classList.add('active');
        }
        
        // Previous button click
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + tips.length) % tips.length;
            showTip(currentIndex);
        });
        
        // Next button click
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % tips.length;
            showTip(currentIndex);
        });
        
        // Dot clicks
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                showTip(currentIndex);
            });
        });
        
        // Auto rotate tips
        setInterval(() => {
            if (document.visibilityState === 'visible') {
                currentIndex = (currentIndex + 1) % tips.length;
                showTip(currentIndex);
            }
        }, 5000);
    }
});

// Load saved settings from localStorage
function loadSettings() {
    // Load dark mode
    const darkMode = localStorage.getItem('darkMode') === 'true';
    document.getElementById('darkMode').checked = darkMode;
    document.body.classList.toggle('dark-mode', darkMode);

    // Load color scheme
    const colorScheme = localStorage.getItem('colorScheme') || 'default';
    document.getElementById('colorScheme').value = colorScheme;
    if (colorScheme !== 'default') {
        document.body.classList.add(`color-${colorScheme}`);
    }

    // Load font size
    const fontSize = localStorage.getItem('fontSize') || 'medium';
    document.getElementById('fontSize').value = fontSize;
    document.body.classList.add(`font-${fontSize}`);

    // Load other settings
    const settings = {
        username: localStorage.getItem('username'),
        email: localStorage.getItem('email'),
        emailNotifications: localStorage.getItem('emailNotifications') === 'true',
        workoutReminders: localStorage.getItem('workoutReminders') === 'true',
        nutritionTips: localStorage.getItem('nutritionTips') === 'true',
        communityUpdates: localStorage.getItem('communityUpdates') === 'true',
        profileVisibility: localStorage.getItem('profileVisibility') || 'public',
        showProgress: localStorage.getItem('showProgress') === 'true',
        showWorkouts: localStorage.getItem('showWorkouts') === 'true'
    };

    // Populate form fields
    Object.keys(settings).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = settings[key];
            } else {
                element.value = settings[key];
            }
        }
    });
}

// Handle form submissions
function handleAccountSettings(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;

    // Save to localStorage
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);

    // Handle password change if both fields are filled
    if (currentPassword && newPassword) {
        // Here you would typically make an API call to update the password
        console.log('Password update requested');
    }

    showNotification('Account settings saved successfully!');
}

function handleNotificationSettings(e) {
    e.preventDefault();
    
    const settings = {
        emailNotifications: document.getElementById('emailNotifications').checked,
        workoutReminders: document.getElementById('workoutReminders').checked,
        nutritionTips: document.getElementById('nutritionTips').checked,
        communityUpdates: document.getElementById('communityUpdates').checked
    };

    // Save to localStorage
    Object.keys(settings).forEach(key => {
        localStorage.setItem(key, settings[key]);
    });

    showNotification('Notification preferences updated!');
}

function handlePrivacySettings(e) {
    e.preventDefault();
    
    const settings = {
        profileVisibility: document.getElementById('profileVisibility').value,
        showProgress: document.getElementById('showProgress').checked,
        showWorkouts: document.getElementById('showWorkouts').checked
    };

    // Save to localStorage
    Object.keys(settings).forEach(key => {
        localStorage.setItem(key, settings[key]);
    });

    showNotification('Privacy settings updated!');
}

function handleThemeSettings(e) {
    e.preventDefault();
    
    const darkMode = document.getElementById('darkMode').checked;
    const colorScheme = document.getElementById('colorScheme').value;
    const fontSize = document.getElementById('fontSize').value;

    // Save to localStorage
    localStorage.setItem('darkMode', darkMode);
    localStorage.setItem('colorScheme', colorScheme);
    localStorage.setItem('fontSize', fontSize);

    showNotification('Theme settings applied!');
}

// Show notification message
function showNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
} 