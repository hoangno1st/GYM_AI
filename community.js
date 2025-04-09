document.addEventListener('DOMContentLoaded', function() {
    // User dropdown functionality
    const userProfile = document.getElementById('user-profile');
    const userDropdown = document.getElementById('user-dropdown');
    
    userProfile.addEventListener('click', function(e) {
        e.preventDefault();
        userDropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!userProfile.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.classList.remove('show');
        }
    });
    
    // Logout functionality
    const logoutLink = document.getElementById('logout-link');
    
    logoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        // In a real app, you would have logout logic here
        alert('Logging out...');
        // Then redirect to login page
        // window.location.href = 'login.html';
    });
    
    // Enhanced Category selection with improved interaction
    const categories = document.querySelectorAll('.category');
    
    categories.forEach(category => {
        category.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add visual feedback when clicked
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 300);
            
            // Remove active class from all categories
            categories.forEach(cat => cat.classList.remove('active'));
            
            // Add active class to clicked category
            this.classList.add('active');
            
            // Get the target section id from the href attribute
            const targetId = this.getAttribute('href').substring(1);
            
            // Hide all group sections with fade-out effect
            const groupSections = document.querySelectorAll('.groups-section');
            groupSections.forEach(section => {
                section.classList.add('fade-out');
                setTimeout(() => {
                    section.style.display = 'none';
                    section.classList.remove('fade-out');
                }, 200);
            });
            
            // Show the target section with fade-in effect
            setTimeout(() => {
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.style.display = 'block';
                    setTimeout(() => {
                        targetSection.classList.add('fade-in');
                        setTimeout(() => {
                            targetSection.classList.remove('fade-in');
                        }, 300);
                    }, 50);
                }
                
                // Scroll to section (optional - smoother UX)
                const featuredGroups = document.getElementById('featured-groups');
                if (featuredGroups) {
                    featuredGroups.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 250);
            
            // Update URL hash (optional)
            window.history.pushState(null, null, `#${targetId}`);
        });
        
        // Add hover effects
        category.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.classList.add('hover');
            }
        });
        
        category.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });
    
    // Initialize: Handle hash in URL or show first category's content, hide others
    function initCategories() {
        const hash = window.location.hash;
        let activeCategory = null;
        
        if (hash && document.getElementById(hash.substring(1))) {
            activeCategory = document.querySelector(`.category[href="${hash}"]`);
        }
        
        if (!activeCategory) {
            activeCategory = document.querySelector('.category');
        }
        
        if (activeCategory) {
            // Trigger a click on the active category
            activeCategory.click();
        } else {
            // Fallback: show first section
            const groupSections = document.querySelectorAll('.groups-section');
            groupSections.forEach((section, index) => {
                section.style.display = index === 0 ? 'block' : 'none';
            });
        }
    }
    
    // Initialize categories
    initCategories();
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', initCategories);
    
    // Search functionality with enhanced feedback
    const searchInput = document.getElementById('group-search');
    const allGroups = document.querySelectorAll('.group-card');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        let matchCount = 0;
        
        allGroups.forEach(group => {
            const groupTitle = group.querySelector('h3').textContent.toLowerCase();
            const groupDescription = group.querySelector('p').textContent.toLowerCase();
            const groupTags = Array.from(group.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
            
            // Check if search term is in title, description or tags
            const matchesSearch = 
                groupTitle.includes(searchTerm) || 
                groupDescription.includes(searchTerm) || 
                groupTags.some(tag => tag.includes(searchTerm));
            
            // Show or hide based on search with animation
            if (matchesSearch || searchTerm === '') {
                group.style.display = 'block';
                setTimeout(() => {
                    group.classList.add('visible');
                }, 10);
                matchCount++;
            } else {
                group.classList.remove('visible');
                setTimeout(() => {
                    group.style.display = 'none';
                }, 300);
            }
        });
        
        // Show no results message if needed
        const noResultsMsg = document.getElementById('no-results-message');
        if (searchTerm !== '' && matchCount === 0) {
            if (!noResultsMsg) {
                const message = document.createElement('div');
                message.id = 'no-results-message';
                message.className = 'no-results';
                message.innerHTML = `No groups found matching "${searchTerm}". Try another search term.`;
                
                const container = document.querySelector('.groups-grid');
                if (container) {
                    container.parentNode.insertBefore(message, container);
                }
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    });
    
    // Enhanced Join Group functionality
    const joinButtons = document.querySelectorAll('.join-button');
    
    joinButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const groupCard = this.closest('.group-card');
            const groupName = groupCard.querySelector('h3').textContent;
            
            // Add visual feedback for click
            this.classList.add('button-clicked');
            setTimeout(() => {
                this.classList.remove('button-clicked');
            }, 300);
            
            // Toggle button text and style with animation
            if (this.textContent === 'Join Group') {
                this.textContent = 'Leave Group';
                this.classList.add('joined');
                
                // Visual feedback for the card
                groupCard.classList.add('joined-group');
                
                // Update member count (optional)
                const membersElement = groupCard.querySelector('.group-members');
                if (membersElement) {
                    const currentText = membersElement.textContent;
                    const match = currentText.match(/(\d+,?\d*)/);
                    if (match) {
                        const count = parseInt(match[0].replace(',', '')) + 1;
                        membersElement.innerHTML = `<i class="fas fa-users"></i> ${count.toLocaleString()} members`;
                    }
                }
                
                showNotification(`You've successfully joined ${groupName}!`);
            } else {
                this.textContent = 'Join Group';
                this.classList.remove('joined');
                groupCard.classList.remove('joined-group');
                
                // Update member count (optional)
                const membersElement = groupCard.querySelector('.group-members');
                if (membersElement) {
                    const currentText = membersElement.textContent;
                    const match = currentText.match(/(\d+,?\d*)/);
                    if (match) {
                        const count = parseInt(match[0].replace(',', '')) - 1;
                        membersElement.innerHTML = `<i class="fas fa-users"></i> ${count.toLocaleString()} members`;
                    }
                }
                
                showNotification(`You've left ${groupName}.`);
            }
        });
    });
    
    // Enhanced Event registration functionality
    const registerButtons = document.querySelectorAll('.register-button');
    
    registerButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const eventCard = this.closest('.event-card');
            const eventName = eventCard.querySelector('h3').textContent;
            
            // Add visual feedback
            this.classList.add('button-clicked');
            setTimeout(() => {
                this.classList.remove('button-clicked');
            }, 300);
            
            // Toggle button text and style with animation
            if (this.textContent === 'Register') {
                this.textContent = 'Registered';
                this.classList.add('registered');
                eventCard.classList.add('registered-event');
                
                // Add confirmation icon
                const confirmIcon = document.createElement('div');
                confirmIcon.className = 'event-registered-icon';
                confirmIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
                
                if (!eventCard.querySelector('.event-registered-icon')) {
                    eventCard.appendChild(confirmIcon);
                }
                
                showNotification(`You've registered for ${eventName}!`);
            } else {
                this.textContent = 'Register';
                this.classList.remove('registered');
                eventCard.classList.remove('registered-event');
                
                // Remove confirmation icon
                const confirmIcon = eventCard.querySelector('.event-registered-icon');
                if (confirmIcon) {
                    confirmIcon.remove();
                }
                
                showNotification(`You've canceled your registration for ${eventName}.`);
            }
        });
    });
    
    // Get modal elements
    const modal = document.getElementById('createGroupModal');
    const createGroupBtn = document.querySelector('.create-button');
    const closeBtn = document.querySelector('.close');
    const createGroupForm = document.getElementById('createGroupForm');

    // Open modal when clicking create group button
    createGroupBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Close modal when clicking the close button
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Function to create a new group card
    function createGroupCard(name, category, description, image) {
        const groupCard = document.createElement('div');
        groupCard.className = 'group-card';

        // Create image URL (in a real app, this would be handled by a server)
        const imageUrl = image ? URL.createObjectURL(image) : 'images/default-group.jpg';

        groupCard.innerHTML = `
            <div class="group-img">
                <img src="${imageUrl}" alt="${name}">
                <div class="group-members"><i class="fas fa-users"></i> 1 member</div>
                <button class="delete-group-btn"><i class="fas fa-trash"></i></button>
            </div>
            <div class="group-info">
                <h3>${name}</h3>
                <div class="group-tags">
                    <span class="tag">${category}</span>
                </div>
                <p>${description}</p>
                <a href="#join-group" class="join-button">Join Group</a>
            </div>
        `;

        // Add delete button functionality
        const deleteBtn = groupCard.querySelector('.delete-group-btn');
        deleteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (confirm('Are you sure you want to delete this group?')) {
                groupCard.remove();
                showNotification('Group has been deleted successfully!');
            }
        });

        return groupCard;
    }
    
    // Handle form submission
    createGroupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const groupName = document.getElementById('groupName').value;
        const groupCategory = document.getElementById('groupCategory').value;
        const groupDescription = document.getElementById('groupDescription').value;
        const groupImage = document.getElementById('groupImage').files[0];

        // Create new group card
        const newGroup = createGroupCard(groupName, groupCategory, groupDescription, groupImage);

        // Add new group to the appropriate category section
        const categorySection = document.getElementById(groupCategory);
        if (categorySection) {
            const groupsGrid = categorySection.querySelector('.groups-grid');
            if (groupsGrid) {
                groupsGrid.insertBefore(newGroup, groupsGrid.firstChild);
            }
        }

        // Add new group to featured groups section
        const featuredGroups = document.querySelector('#featured-groups .groups-grid');
        if (featuredGroups) {
            const featuredGroup = createGroupCard(groupName, groupCategory, groupDescription, groupImage);
            featuredGroups.insertBefore(featuredGroup, featuredGroups.firstChild);
        }

        // Close modal and reset form
        modal.style.display = 'none';
        createGroupForm.reset();
        showNotification('Group has been created successfully!');
    });
    
    // Enhanced notification system
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-info-circle"></i>
                <p>${message}</p>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Fade in with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Set timeout to remove
        const notificationTimeout = setTimeout(() => {
            closeNotification(notification);
        }, 5000);
        
        // Store the timeout ID so we can clear it if closed manually
        notification.dataset.timeoutId = notificationTimeout;
        
        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', function() {
            clearTimeout(parseInt(notification.dataset.timeoutId));
            closeNotification(notification);
        });
    }
    
    function closeNotification(notification) {
        notification.classList.remove('show');
        notification.classList.add('hide');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }
    
    // Enhanced modal functionality
    function showModal(title, content) {
        // Create modal element if it doesn't exist
        let modal = document.getElementById('app-modal');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'app-modal';
            modal.className = 'modal';
            document.body.appendChild(modal);
        }
        
        // Set modal content
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="modal-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
            <div class="modal-overlay"></div>
        `;
        
        // Add to body and show with animation
        document.body.classList.add('modal-open');
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // Close modal when clicking close button or overlay
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
        
        // Close modal when pressing Escape key
        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape') {
                document.removeEventListener('keydown', escapeHandler);
                closeModal();
            }
        });
    }
    
    function closeModal() {
        const modal = document.getElementById('app-modal');
        if (modal) {
            modal.classList.remove('show');
            document.body.classList.remove('modal-open');
            setTimeout(() => {
                if (document.body.contains(modal)) {
                    modal.remove();
                }
            }, 300);
        }
    }
    
    // Enhanced events slider functionality
    let currentSlide = 0;
    const eventCards = document.querySelectorAll('.event-card');
    
    function updateEventsPerPage() {
        return window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
    }
    
    let eventsPerPage = updateEventsPerPage();
    
    // Add navigation buttons if there are more events than can be displayed
    if (eventCards.length > eventsPerPage) {
        const eventsSlider = document.querySelector('.events-slider');
        
        // Create navigation arrows
        const prevArrow = document.createElement('button');
        prevArrow.className = 'slider-arrow prev';
        prevArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevArrow.setAttribute('aria-label', 'Previous events');
        
        const nextArrow = document.createElement('button');
        nextArrow.className = 'slider-arrow next';
        nextArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextArrow.setAttribute('aria-label', 'Next events');
        
        // Add them to the DOM
        eventsSlider.parentNode.insertBefore(prevArrow, eventsSlider);
        eventsSlider.parentNode.appendChild(nextArrow);
        
        // Add event listeners with visual feedback
        prevArrow.addEventListener('click', function() {
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 300);
            navigateSlider(-1);
        });
        
        nextArrow.addEventListener('click', function() {
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 300);
            navigateSlider(1);
        });
        
        // Add touch swipe for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        eventsSlider.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        eventsSlider.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const minSwipeDistance = 50;
            if (touchEndX < touchStartX - minSwipeDistance) {
                // Swipe left
                navigateSlider(1);
            }
            if (touchEndX > touchStartX + minSwipeDistance) {
                // Swipe right
                navigateSlider(-1);
            }
        }
        
        // Update the slider initially
        updateSlider();
        
        // Update slider on window resize
        window.addEventListener('resize', function() {
            const newEventsPerPage = updateEventsPerPage();
            if (newEventsPerPage !== eventsPerPage) {
                eventsPerPage = newEventsPerPage;
                currentSlide = Math.min(currentSlide, eventCards.length - eventsPerPage);
                updateSlider();
            }
        });
    }
    
    function navigateSlider(direction) {
        const maxSlide = eventCards.length - eventsPerPage;
        const oldSlide = currentSlide;
        currentSlide = Math.max(0, Math.min(currentSlide + direction, maxSlide));
        
        // Only update if there was an actual change
        if (oldSlide !== currentSlide) {
            updateSlider(direction);
        }
    }
    
    function updateSlider(direction) {
        const cardWidth = eventCards[0].offsetWidth;
        const margin = parseInt(window.getComputedStyle(eventCards[0]).marginRight);
        const offset = currentSlide * (cardWidth + margin);
        
        const slider = document.querySelector('.events-slider');
        
        // Add animation class based on direction
        if (direction) {
            slider.classList.add(direction > 0 ? 'slide-left' : 'slide-right');
            setTimeout(() => {
                slider.style.transform = `translateX(-${offset}px)`;
                setTimeout(() => {
                    slider.classList.remove('slide-left', 'slide-right');
                }, 300);
            }, 50);
        } else {
            slider.style.transform = `translateX(-${offset}px)`;
        }
        
        // Update the visibility of navigation arrows
        const prevArrow = document.querySelector('.slider-arrow.prev');
        const nextArrow = document.querySelector('.slider-arrow.next');
        
        if (prevArrow && nextArrow) {
            prevArrow.classList.toggle('disabled', currentSlide === 0);
            nextArrow.classList.toggle('disabled', currentSlide >= eventCards.length - eventsPerPage);
        }
    }

    // Chat functionality
    const chatModal = document.getElementById('chatModal');
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessage');
    const chatGroupName = document.getElementById('chatGroupName');
    const chatMemberCount = document.getElementById('chatMemberCount');
    const chatCloseBtn = chatModal.querySelector('.close');

    // Close chat modal when clicking close button
    chatCloseBtn.addEventListener('click', () => {
        chatModal.style.display = 'none';
    });

    // Close chat modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === chatModal) {
            chatModal.style.display = 'none';
        }
    });

    // Close chat modal when pressing Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && chatModal.style.display === 'block') {
            chatModal.style.display = 'none';
        }
    });

    // Add click event to all group cards
    document.querySelectorAll('.group-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't open chat if clicking delete button
            if (e.target.closest('.delete-group-btn')) return;
            
            const groupName = this.querySelector('h3').textContent;
            const memberCount = this.querySelector('.group-members').textContent;
            
            chatGroupName.textContent = groupName;
            chatMemberCount.textContent = memberCount;
            chatModal.style.display = 'block';
            
            // Add some sample messages
            chatMessages.innerHTML = `
                <div class="message received">
                    <div class="sender">Admin</div>
                    Welcome to ${groupName}! Feel free to chat with other members.
                    <div class="time">10:00 AM</div>
                </div>
                <div class="message sent">
                    <div class="sender">You</div>
                    Hello everyone!
                    <div class="time">10:01 AM</div>
                </div>
            `;
        });
    });

    // Send message functionality
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const messageElement = document.createElement('div');
            messageElement.className = 'message sent';
            messageElement.innerHTML = `
                <div class="sender">You</div>
                ${message}
                <div class="time">${time}</div>
            `;
            chatMessages.appendChild(messageElement);
            messageInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    sendMessageBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Delete group functionality for all groups
    document.querySelectorAll('.delete-group-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const groupCard = this.closest('.group-card');
            const groupName = groupCard.querySelector('h3').textContent;
            
            if (confirm(`Are you sure you want to delete ${groupName}?`)) {
                groupCard.remove();
                showNotification(`${groupName} has been deleted successfully!`);
            }
        });
    });

    // Update createGroupCard function to include delete button
    function createGroupCard(name, category, description, image) {
        const groupCard = document.createElement('div');
        groupCard.className = 'group-card';

        const imageUrl = image ? URL.createObjectURL(image) : 'images/default-group.jpg';

        groupCard.innerHTML = `
            <div class="group-img">
                <img src="${imageUrl}" alt="${name}">
                <div class="group-members"><i class="fas fa-users"></i> 1 member</div>
                <button class="delete-group-btn"><i class="fas fa-trash"></i></button>
            </div>
            <div class="group-info">
                <h3>${name}</h3>
                <div class="group-tags">
                    <span class="tag">${category}</span>
                </div>
                <p>${description}</p>
                <a href="#join-group" class="join-button">Join Group</a>
            </div>
        `;

        // Add click event for chat
        groupCard.addEventListener('click', function(e) {
            if (e.target.closest('.delete-group-btn')) return;
            
            chatGroupName.textContent = name;
            chatMemberCount.textContent = '1 member';
            chatModal.style.display = 'block';
            
            chatMessages.innerHTML = `
                <div class="message received">
                    <div class="sender">Admin</div>
                    Welcome to ${name}! Feel free to chat with other members.
                    <div class="time">10:00 AM</div>
                </div>
                <div class="message sent">
                    <div class="sender">You</div>
                    Hello everyone!
                    <div class="time">10:01 AM</div>
                </div>
            `;
        });

        // Add delete button functionality
        const deleteBtn = groupCard.querySelector('.delete-group-btn');
        deleteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (confirm(`Are you sure you want to delete ${name}?`)) {
                groupCard.remove();
                showNotification(`${name} has been deleted successfully!`);
            }
        });

        return groupCard;
    }
});