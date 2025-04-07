// Common foods list with nutritional information
const commonFoods = {
    // Breakfast items
    "Pho (Beef Noodle Soup)": { calories: 400, protein: 20, carbs: 65, fat: 8 },
    "Banh Mi (Vietnamese Sandwich)": { calories: 350, protein: 15, carbs: 45, fat: 12 },
    "Sticky Rice with Meat": { calories: 450, protein: 18, carbs: 70, fat: 15 },
    "Spicy Beef Noodle Soup": { calories: 420, protein: 22, carbs: 60, fat: 10 },
    "Rice with Grilled Pork": { calories: 550, protein: 25, carbs: 80, fat: 15 },
    
    // Main dishes
    "Chicken Rice": { calories: 450, protein: 28, carbs: 55, fat: 12 },
    "Braised Pork with Rice": { calories: 500, protein: 30, carbs: 60, fat: 15 },
    "Grilled Pork with Noodles": { calories: 480, protein: 25, carbs: 58, fat: 18 },
    "Braised Fish": { calories: 300, protein: 28, carbs: 5, fat: 18 },
    "Stir-fried Beef": { calories: 350, protein: 35, carbs: 8, fat: 20 },
    
    // Vegetables and salads
    "Steamed Vegetables": { calories: 50, protein: 3, carbs: 8, fat: 1 },
    "Mixed Salad": { calories: 100, protein: 4, carbs: 12, fat: 5 },
    "Vegetable Soup": { calories: 60, protein: 2, carbs: 10, fat: 1 },
    
    // Snacks
    "Yogurt": { calories: 150, protein: 8, carbs: 20, fat: 4 },
    "Fresh Fruits": { calories: 80, protein: 1, carbs: 20, fat: 0 },
    "Smoothie": { calories: 200, protein: 5, carbs: 35, fat: 3 },
    
    // Protein supplements
    "Boiled Chicken Breast": { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    "Boiled Eggs": { calories: 70, protein: 6, carbs: 0, fat: 5 },
    "Whey Protein": { calories: 120, protein: 24, carbs: 3, fat: 1 },
    "Tofu": { calories: 80, protein: 8, carbs: 2, fat: 4 }
};

// Initialize user data
let userNutrition = {
    dailyGoals: {
        calories: 2000,
        protein: 120,
        carbs: 200,
        fat: 60
    },
    meals: [],
    waterIntake: 0
};

// Update nutrition overview
function updateNutritionSummary() {
    const totals = calculateDailyTotals();
    
    // Update calories
    document.querySelector('#calories-progress').innerHTML = `
        <span>${totals.calories} / ${userNutrition.dailyGoals.calories} kcal</span>
        <span>${Math.round((totals.calories / userNutrition.dailyGoals.calories) * 100)}%</span>
    `;
    document.querySelector('#calories-bar').style.width = 
        `${Math.min((totals.calories / userNutrition.dailyGoals.calories) * 100, 100)}%`;

    // Update protein
    document.querySelector('#protein-progress').innerHTML = `
        <span>${totals.protein}g / ${userNutrition.dailyGoals.protein}g</span>
        <span>${Math.round((totals.protein / userNutrition.dailyGoals.protein) * 100)}%</span>
    `;
    document.querySelector('#protein-bar').style.width = 
        `${Math.min((totals.protein / userNutrition.dailyGoals.protein) * 100, 100)}%`;

    // Update carbs
    document.querySelector('#carbs-progress').innerHTML = `
        <span>${totals.carbs}g / ${userNutrition.dailyGoals.carbs}g</span>
        <span>${Math.round((totals.carbs / userNutrition.dailyGoals.carbs) * 100)}%</span>
    `;
    document.querySelector('#carbs-bar').style.width = 
        `${Math.min((totals.carbs / userNutrition.dailyGoals.carbs) * 100, 100)}%`;

    // Update fat
    document.querySelector('#fat-progress').innerHTML = `
        <span>${totals.fat}g / ${userNutrition.dailyGoals.fat}g</span>
        <span>${Math.round((totals.fat / userNutrition.dailyGoals.fat) * 100)}%</span>
    `;
    document.querySelector('#fat-bar').style.width = 
        `${Math.min((totals.fat / userNutrition.dailyGoals.fat) * 100, 100)}%`;
}

// Calculate daily nutrition totals
function calculateDailyTotals() {
    return userNutrition.meals.reduce((totals, meal) => {
        totals.calories += meal.calories;
        totals.protein += meal.protein;
        totals.carbs += meal.carbs;
        totals.fat += meal.fat;
        return totals;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
}

// Add meal to the list
function addMeal(mealData) {
    userNutrition.meals.push(mealData);
    updateNutritionSummary();
    updateMealsList();
    saveToStorage();
}

// Update meals list display
function updateMealsList() {
    const mealList = document.querySelector('.meal-list');
    mealList.innerHTML = '';
    
    userNutrition.meals.forEach((meal, index) => {
        const mealElement = document.createElement('div');
        mealElement.className = 'meal-item';
        mealElement.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h5 class="mb-1">${meal.name}</h5>
                    <p class="text-muted mb-0">${meal.time}</p>
                </div>
                <div class="text-end">
                    <h6>${meal.calories} kcal</h6>
                    <button class="btn btn-sm btn-outline-danger" onclick="removeMeal(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        mealList.appendChild(mealElement);
    });
}

// Remove meal
function removeMeal(index) {
    userNutrition.meals.splice(index, 1);
    updateNutritionSummary();
    updateMealsList();
    saveToStorage();
}

// Save data to localStorage
function saveToStorage() {
    localStorage.setItem('userNutrition', JSON.stringify(userNutrition));
}

// Load data from localStorage
function loadFromStorage() {
    const saved = localStorage.getItem('userNutrition');
    if (saved) {
        userNutrition = JSON.parse(saved);
        updateNutritionSummary();
        updateMealsList();
    }
}

// Initialize food list in form
function initializeFoodList() {
    const foodSelect = document.querySelector('#food-select');
    Object.keys(commonFoods).forEach(food => {
        const option = document.createElement('option');
        option.value = food;
        option.textContent = food;
        foodSelect.appendChild(option);
    });
}

// Update nutrition info when food is selected
function updateNutritionInfo() {
    const selectedFood = document.querySelector('#food-select').value;
    const food = commonFoods[selectedFood];
    if (food) {
        document.querySelector('#calories-input').value = food.calories;
        document.querySelector('#protein-input').value = food.protein;
        document.querySelector('#carbs-input').value = food.carbs;
        document.querySelector('#fat-input').value = food.fat;
    }
}

// Handle meal form submission
document.getElementById('addMealForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const mealData = {
        name: document.querySelector('#food-select').value,
        time: document.querySelector('#meal-time').value,
        type: document.querySelector('#meal-type').value,
        calories: parseInt(document.querySelector('#calories-input').value),
        protein: parseInt(document.querySelector('#protein-input').value),
        carbs: parseInt(document.querySelector('#carbs-input').value),
        fat: parseInt(document.querySelector('#fat-input').value),
        notes: document.querySelector('#meal-notes').value
    };
    
    addMeal(mealData);
    
    // Show success message
    Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'New meal added',
        showConfirmButton: false,
        timer: 1500
    });
    
    // Close modal
    $('#addMealModal').modal('hide');
    this.reset();
});

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeFoodList();
    loadFromStorage();
    
    // Add event listener for food selection
    document.querySelector('#food-select').addEventListener('change', updateNutritionInfo);
}); 