document.addEventListener('DOMContentLoaded', function() {
    // Category selection
    const categoryCards = document.querySelectorAll('.category-card');
    const workoutPlansSection = document.getElementById('workout-plans');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Scroll to workout plans section
            workoutPlansSection.scrollIntoView({ behavior: 'smooth' });
            
            // Filter workouts by category
            filterWorkouts('category', category);
            
            // Update active category
            categoryCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Filter buttons functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter workouts by level
            if (filter === 'all') {
                showAllWorkouts();
            } else {
                filterWorkouts('level', filter);
            }
        });
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    
    searchButton.addEventListener('click', function() {
        searchWorkouts(searchInput.value);
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchWorkouts(searchInput.value);
        }
    });
    
    // Load more button
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    loadMoreBtn.addEventListener('click', function() {
        loadMoreWorkouts();
    });
    
    // View workout buttons
    const viewWorkoutButtons = document.querySelectorAll('.view-workout');
    
    viewWorkoutButtons.forEach(button => {
        button.addEventListener('click', function() {
            const workoutCard = this.closest('.workout-card');
            const workoutName = workoutCard.querySelector('h3').textContent;
            
            // For demonstration purposes, just show an alert
            alert(`You selected the "${workoutName}" workout. This would open the detailed workout page.`);
            
            // In a real application, you would redirect to the workout detail page
            // window.location.href = `workout-detail.html?id=${workoutId}`;
        });
    });
    
    // Helper Functions
    
    function filterWorkouts(filterType, filterValue) {
        const workoutCards = document.querySelectorAll('.workout-card');
        
        workoutCards.forEach(card => {
            const cardValue = card.getAttribute(`data-${filterType}`);
            
            if (filterValue === 'all' || cardValue === filterValue) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    function showAllWorkouts() {
        const workoutCards = document.querySelectorAll('.workout-card');
        workoutCards.forEach(card => {
            card.style.display = 'block';
        });
    }
    
    function searchWorkouts(query) {
        if (!query) {
            showAllWorkouts();
            return;
        }
        
        query = query.toLowerCase();
        const workoutCards = document.querySelectorAll('.workout-card');
        
        workoutCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(query) || description.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    function loadMoreWorkouts() {
        // This function would typically fetch more workouts from a server
        // For demonstration, we'll just show a message
        alert('In a real application, this would load more workouts from the server.');
        
        // Example of how you might add more workouts dynamically:
        /*
        const workoutCardsContainer = document.querySelector('.workout-cards');
        
        // Sample new workout data
        const newWorkouts = [
            {
                level: 'intermediate',
                category: 'bodyweight',
                image: 'path/to/image.jpg',
                title: 'Calisthenics Fundamentals',
                description: 'Master bodyweight exercises with progressive overload',
                duration: '45 min',
                frequency: '3x / week',
                calories: '350 cal'
            },
            // More workout objects...
        ];
        
        // Create and append new workout cards
        newWorkouts.forEach(workout => {
            const workoutCard = createWorkoutCard(workout);
            workoutCardsContainer.appendChild(workoutCard);
        });
        */
    }
    
    // Helper function to create a workout card (would be used in loadMoreWorkouts)
    function createWorkoutCard(workout) {
        const card = document.createElement('div');
        card.className = 'workout-card';
        card.setAttribute('data-level', workout.level);
        card.setAttribute('data-category', workout.category);
        
        card.innerHTML = `
            <div class="workout-image">
                <img src="${workout.image}" alt="${workout.title}">
                <div class="workout-level">${workout.level}</div>
            </div>
            <div class="workout-details">
                <h3>${workout.title}</h3>
                <p>${workout.description}</p>
                <div class="workout-meta">
                    <span><i class="far fa-clock"></i> ${workout.duration}</span>
                    <span><i class="fas fa-calendar-alt"></i> ${workout.frequency}</span>
                    <span><i class="fas fa-fire"></i> ${workout.calories}</span>
                </div>
                <button class="view-workout">View Workout</button>
            </div>
        `;
        
        // Add event listener to the new button
        card.querySelector('.view-workout').addEventListener('click', function() {
            alert(`You selected the "${workout.title}" workout. This would open the detailed workout page.`);
        });
        
        return card;
    }
});
