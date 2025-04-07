document.addEventListener('DOMContentLoaded', () => {
    // Category selection
    const categoryCards = document.querySelectorAll('.category-card');
    const workoutPlansSection = document.getElementById('workout-plans');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            workoutPlansSection.scrollIntoView({ behavior: 'smooth' });
            filterWorkouts('category', category);
            categoryCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
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
    
    searchButton.addEventListener('click', () => {
        searchWorkouts(searchInput.value);
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchWorkouts(searchInput.value);
        }
    });
    
    // Load more button
    const loadMoreBtn = document.getElementById('load-more-btn');
    loadMoreBtn.addEventListener('click', loadMoreWorkouts);
    
    // Helper Functions
    function filterWorkouts(filterType, filterValue) {
        const workoutCards = document.querySelectorAll('.workout-card');
        workoutCards.forEach(card => {
            const cardValue = card.getAttribute(`data-${filterType}`);
            card.style.display = (filterValue === 'all' || cardValue === filterValue) ? 'block' : 'none';
        });
    }
    
    function showAllWorkouts() {
        const workoutCards = document.querySelectorAll('.workout-card');
        workoutCards.forEach(card => card.style.display = 'block');
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
            card.style.display = (title.includes(query) || description.includes(query)) ? 'block' : 'none';
        });
    }
    
    function loadMoreWorkouts() {
        alert('Loading more workouts... (This would fetch from a server in a real app)');
    }
});