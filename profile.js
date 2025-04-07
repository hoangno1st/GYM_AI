document.addEventListener('DOMContentLoaded', function() {
    // Load saved profile data when page loads
    loadProfileData();
    
    // Load saved avatar and cover images
    loadSavedImages();

    // Handle form submission
    const profileForm = document.getElementById('profileForm');
    const dobInput = document.getElementById('dob');

    // Set up file inputs for avatar and cover
    setupFileInputs();

    // Add date validation
    dobInput.addEventListener('change', function(e) {
        const selectedDate = new Date(e.target.value);
        const maxDate = new Date('2025-12-31');
        
        if (selectedDate > maxDate) {
            showNotification('Date of birth cannot be after 2025!', 'error');
            e.target.value = ''; // Clear invalid date
        }
    });

    // Form submission handler
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate date before submission
        const selectedDate = new Date(dobInput.value);
        const maxDate = new Date('2025-12-31');
        
        if (selectedDate > maxDate) {
            showNotification('Date of birth cannot be after 2025!', 'error');
            return;
        }
        
        // Get form data
        const formData = getFormData();

        // Save to localStorage
        saveProfileData(formData);
        
        // Update confirmed info display
        updateConfirmedInfo(formData);
        
        // Update profile display
        updateProfileDisplay(formData);
        
        // Show success notification
        showNotification('Information has been confirmed successfully!', 'success');
        
        // Expand the confirmed section and scroll to it
        expandAndScrollToConfirmed();
    });

    // Handle update button - Fix to make it properly scroll to confirmed info
    const updateButton = document.querySelector('.update-button');
    updateButton.addEventListener('click', function() {
        // Get current form data
        const formData = getFormData();

        // Save to localStorage
        saveProfileData(formData);
        
        // Update confirmed info display
        updateConfirmedInfo(formData);
        
        // Update profile display
        updateProfileDisplay(formData);
        
        // Show success notification
        showNotification('Information has been updated successfully!', 'success');
        
        // Expand the confirmed section and scroll to it
        expandAndScrollToConfirmed();
    });

    // Handle delete button in form
    const formDeleteButton = document.querySelector('.delete-button');
    if (formDeleteButton) {
        formDeleteButton.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete all entered information?')) {
                // Clear all form fields
                clearFormFields();
                
                // Clear confirmed information display
                clearConfirmedInfo();
                
                // Clear profile display
                clearProfileDisplay();
                
                // Clear data from localStorage
                localStorage.removeItem('profileData');
                
                // Show success notification
                showNotification('All information has been deleted!', 'success');
            }
        });
    }

    // Handle collapsible confirmed information section - Fix for arrow toggle
    const toggleInfoBtn = document.querySelector('.toggle-info-button');
    const confirmedInfoContent = document.querySelector('.confirmed-info');
    
    if (toggleInfoBtn && confirmedInfoContent) {
        toggleInfoBtn.addEventListener('click', function() {
            // Toggle the collapsed class
            confirmedInfoContent.classList.toggle('collapsed');
            
            // Toggle the icon direction
            const icon = this.querySelector('i');
            if (icon) {
                if (confirmedInfoContent.classList.contains('collapsed')) {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                } else {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                }
            }
        });
    }
    
    // Handle delete confirmed information button
    const deleteConfirmedBtn = document.querySelector('.delete-confirmed-button');
    if (deleteConfirmedBtn) {
        deleteConfirmedBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete confirmed information?')) {
                // Clear confirmed information display
                clearConfirmedInfo();
                
                // Clear data from localStorage
                localStorage.removeItem('profileData');
                
                // Clear form data to match
                clearFormFields();
                
                // Clear profile display
                clearProfileDisplay();
                
                // Show success notification
                showNotification('Information has been deleted successfully!', 'success');
            }
        });
    }

    // Set initial collapsed state for Confirmed Information section
    if (confirmedInfoContent) {
        confirmedInfoContent.classList.add('collapsed');
        
        // Set the icon to down arrow
        const icon = toggleInfoBtn ? toggleInfoBtn.querySelector('i') : null;
        if (icon) {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        }
    }
});

function setupFileInputs() {
    // Add event listener for avatar upload
    const editAvatarBtn = document.querySelector('.edit-avatar');
    const avatarInput = document.createElement('input');
    avatarInput.type = 'file';
    avatarInput.accept = 'image/*';
    
    editAvatarBtn.addEventListener('click', function() {
        avatarInput.click();
    });
    
    avatarInput.addEventListener('change', function(e) {
        handleAvatarUpload(e);
    });

    // Add event listener for cover upload
    const editCoverBtn = document.querySelector('.edit-cover');
    const coverInput = document.createElement('input');
    coverInput.type = 'file';
    coverInput.accept = 'image/*';
    
    editCoverBtn.addEventListener('click', function() {
        coverInput.click();
    });
    
    coverInput.addEventListener('change', function(e) {
        handleCoverUpload(e);
    });
}

function getFormData() {
    return {
        fullname: document.getElementById('fullname').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        dob: document.getElementById('dob').value,
        gender: document.getElementById('gender').value,
        location: document.getElementById('location').value,
        bio: document.getElementById('bio').value
    };
}

function clearFormFields() {
    document.getElementById('fullname').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('dob').value = '';
    document.getElementById('gender').value = '';
    document.getElementById('location').value = '';
    document.getElementById('bio').value = '';
}

function clearConfirmedInfo() {
    document.getElementById('confirmed-fullname').textContent = '-';
    document.getElementById('confirmed-email').textContent = '-';
    document.getElementById('confirmed-phone').textContent = '-';
    document.getElementById('confirmed-dob').textContent = '-';
    document.getElementById('confirmed-gender').textContent = '-';
    document.getElementById('confirmed-location').textContent = '-';
    document.getElementById('confirmed-bio').textContent = '-';
}

function clearProfileDisplay() {
    const profileName = document.querySelector('#displayName');
    const profileBio = document.querySelector('#displayBio');
    
    if (profileName) profileName.textContent = '';
    if (profileBio) profileBio.textContent = '';
}

function saveProfileData(data) {
    localStorage.setItem('profileData', JSON.stringify(data));
}

function loadProfileData() {
    const savedData = localStorage.getItem('profileData');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        // Fill form fields
        document.getElementById('fullname').value = data.fullname || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('phone').value = data.phone || '';
        document.getElementById('dob').value = data.dob || '';
        document.getElementById('gender').value = data.gender || '';
        document.getElementById('location').value = data.location || '';
        document.getElementById('bio').value = data.bio || '';
        
        // Update confirmed info display
        updateConfirmedInfo(data);
        
        // Update profile display
        updateProfileDisplay(data);
    }
}

function updateConfirmedInfo(data) {
    // Update each confirmed info field
    document.getElementById('confirmed-fullname').textContent = data.fullname || '-';
    document.getElementById('confirmed-email').textContent = data.email || '-';
    document.getElementById('confirmed-phone').textContent = data.phone || '-';
    document.getElementById('confirmed-dob').textContent = data.dob || '-';
    document.getElementById('confirmed-gender').textContent = data.gender || '-';
    document.getElementById('confirmed-location').textContent = data.location || '-';
    document.getElementById('confirmed-bio').textContent = data.bio || '-';
}

function updateProfileDisplay(data) {
    const profileName = document.querySelector('#displayName');
    const profileBio = document.querySelector('#displayBio');
    
    if (profileName) {
        profileName.textContent = data.fullname || '';
    }
    
    if (profileBio) {
        profileBio.textContent = data.bio || '';
    }
}

function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const avatarImg = document.getElementById('profileAvatar');
        avatarImg.src = e.target.result;
        
        // Save to localStorage
        localStorage.setItem('profileAvatar', e.target.result);
        
        showNotification('Profile picture has been updated!', 'success');
    };
    reader.readAsDataURL(file);
}

function handleCoverUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const coverElement = document.querySelector('.profile-cover');
        coverElement.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('${e.target.result}')`;
        
        // Save to localStorage
        localStorage.setItem('profileCover', e.target.result);
        
        showNotification('Cover image has been updated!', 'success');
    };
    reader.readAsDataURL(file);
}

function loadSavedImages() {
    // Load avatar if it exists
    const savedAvatar = localStorage.getItem('profileAvatar');
    if (savedAvatar) {
        const avatarImg = document.getElementById('profileAvatar');
        avatarImg.src = savedAvatar;
    }
    
    // Load cover if it exists
    const savedCover = localStorage.getItem('profileCover');
    if (savedCover) {
        const coverElement = document.querySelector('.profile-cover');
        coverElement.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('${savedCover}')`;
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Add show class after a small delay to trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function expandAndScrollToConfirmed() {
    // First, make sure the section is expanded
    const confirmedInfoContent = document.querySelector('.confirmed-info');
    if (confirmedInfoContent) {
        confirmedInfoContent.classList.remove('collapsed');
        
        // Update arrow icon
        const toggleBtn = document.querySelector('.toggle-info-button');
        const icon = toggleBtn ? toggleBtn.querySelector('i') : null;
        if (icon) {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        }
        
        // Wait a tiny bit for the section to expand before scrolling
        setTimeout(() => {
            // Get the card header of Confirmed Information
            const confirmedHeader = document.querySelector('.profile-card .card-header');
            if (confirmedHeader) {
                confirmedHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }
}