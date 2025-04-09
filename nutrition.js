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
    const caloriesPercent = Math.min(100, (dailyNutrition.calories / goals.calories) * 100);
    caloriesProgress.innerHTML = `
        <span>${dailyNutrition.calories} / ${goals.calories} kcal</span>
        <span>${Math.round(caloriesPercent)}%</span>
    `;
    caloriesBar.style.width = `${caloriesPercent}%`;

    // Update protein
    const proteinPercent = Math.min(100, (dailyNutrition.protein / goals.protein) * 100);
    proteinProgress.innerHTML = `
        <span>${dailyNutrition.protein}g / ${goals.protein}g</span>
        <span>${Math.round(proteinPercent)}%</span>
    `;
    proteinBar.style.width = `${proteinPercent}%`;

    // Update carbs
    const carbsPercent = Math.min(100, (dailyNutrition.carbs / goals.carbs) * 100);
    carbsProgress.innerHTML = `
        <span>${dailyNutrition.carbs}g / ${goals.carbs}g</span>
        <span>${Math.round(carbsPercent)}%</span>
    `;
    carbsBar.style.width = `${carbsPercent}%`;

    // Update fat
    const fatPercent = Math.min(100, (dailyNutrition.fat / goals.fat) * 100);
    fatProgress.innerHTML = `
        <span>${dailyNutrition.fat}g / ${goals.fat}g</span>
        <span>${Math.round(fatPercent)}%</span>
    `;
    fatBar.style.width = `${fatPercent}%`;

    // Save to localStorage
    localStorage.setItem('dailyNutrition', JSON.stringify(dailyNutrition));
}

// Update meal list display
function updateMealList() {
    mealList.innerHTML = '';
    meals.forEach((meal, index) => {
        const mealElement = document.createElement('div');
        mealElement.className = 'meal-item d-flex justify-content-between align-items-center';
        mealElement.innerHTML = `
            <div>
                <h5 class="mb-1">${meal.name}</h5>
                <small class="text-muted">
                    ${meal.calories} kcal | P: ${meal.protein}g | C: ${meal.carbs}g | F: ${meal.fat}g
                </small>
            </div>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteMeal(${index})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        mealList.appendChild(mealElement);
    });

    // Save to localStorage
    localStorage.setItem('meals', JSON.stringify(meals));
}

// Add new meal
function addMeal(meal) {
    meals.push(meal);
    
    // Update daily totals
    dailyNutrition.calories += parseInt(meal.calories);
    dailyNutrition.protein += parseInt(meal.protein);
    dailyNutrition.carbs += parseInt(meal.carbs);
    dailyNutrition.fat += parseInt(meal.fat);

    updateNutritionDisplay();
    updateMealList();
}

// Delete meal
function deleteMeal(index) {
    const meal = meals[index];
    
    // Update daily totals
    dailyNutrition.calories -= meal.calories;
    dailyNutrition.protein -= meal.protein;
    dailyNutrition.carbs -= meal.carbs;
    dailyNutrition.fat -= meal.fat;

    meals.splice(index, 1);
    updateNutritionDisplay();
    updateMealList();
}

// Update water display
function updateWaterDisplay() {
    const percentage = Math.min(100, (waterIntake / waterGoal) * 100);
    waterFill.style.width = `${percentage}%`;
    currentAmount.textContent = `${(waterIntake / 1000).toFixed(1)}L`;
    waterPercentage.textContent = `${Math.round(percentage)}%`;

    // Update water bottles
    waterBottles.forEach((bottle, index) => {
        if (index < Math.floor(waterIntake / 250)) {
            bottle.classList.add('filled');
        } else {
            bottle.classList.remove('filled');
        }
    });

    // Save to localStorage
    localStorage.setItem('waterIntake', waterIntake.toString());
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    loadSavedData();
    
    // Reset nutrition button
    const resetNutritionBtn = document.getElementById('reset-nutrition');
    if (resetNutritionBtn) {
        resetNutritionBtn.addEventListener('click', resetNutrition);
    }
});

// Reset nutrition data
function resetNutrition() {
    Swal.fire({
        title: 'Reset nutrition data?',
        text: 'This will reset all your nutrition data for today. Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, reset it!'
    }).then((result) => {
        if (result.isConfirmed) {
            // Reset nutrition data
            dailyNutrition = {
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0
            };
            
            // Clear meals
            meals = [];
            
            // Update progress bars and text displays with explicit 0% values
            document.getElementById('calories-progress').innerHTML = '<span>0 / 2,000 kcal</span><span>0%</span>';
            document.getElementById('protein-progress').innerHTML = '<span>0g / 120g</span><span>0%</span>';
            document.getElementById('carbs-progress').innerHTML = '<span>0g / 200g</span><span>0%</span>';
            document.getElementById('fat-progress').innerHTML = '<span>0g / 60g</span><span>0%</span>';
            
            // Reset progress bars width to exactly 0%
            document.getElementById('calories-bar').style.width = '0%';
            document.getElementById('protein-bar').style.width = '0%';
            document.getElementById('carbs-bar').style.width = '0%';
            document.getElementById('fat-bar').style.width = '0%';
            
            // Clear the meal list in the UI
            document.querySelector('.meal-list').innerHTML = '';
            
            // Reset daily totals in the page script if present
            if (typeof dailyTotals !== 'undefined') {
                dailyTotals.calories = 0;
                dailyTotals.protein = 0;
                dailyTotals.carbs = 0;
                dailyTotals.fat = 0;
            }
            
            // Make sure any cached values are also reset
            if (typeof caloriesPercent !== 'undefined') caloriesPercent = 0;
            if (typeof proteinPercent !== 'undefined') proteinPercent = 0;
            if (typeof carbsPercent !== 'undefined') carbsPercent = 0;
            if (typeof fatPercent !== 'undefined') fatPercent = 0;
            
            // Ensure any displayed percentages in Today's Overview are 0%
            const percentElements = document.querySelectorAll('.progress span:last-child');
            percentElements.forEach(element => {
                element.textContent = '0%';
            });
            
            // Save to localStorage
            localStorage.setItem('dailyNutrition', JSON.stringify(dailyNutrition));
            localStorage.setItem('meals', JSON.stringify(meals));
            localStorage.removeItem('todaysMeals'); // Clear any other cached meals data
            
            Swal.fire({
                icon: 'success',
                title: 'Reset!',
                text: 'Your nutrition data has been reset to 0%.',
                timer: 1500,
                showConfirmButton: false
            });
        }
    });
}

saveMealBtn.addEventListener('click', () => {
    const name = document.getElementById('meal-name').value;
    const calories = document.getElementById('meal-calories').value;
    const protein = document.getElementById('meal-protein').value;
    const carbs = document.getElementById('meal-carbs').value;
    const fat = document.getElementById('meal-fat').value;

    if (name && calories && protein && carbs && fat) {
        addMeal({
            name,
            calories: parseInt(calories),
            protein: parseInt(protein),
            carbs: parseInt(carbs),
            fat: parseInt(fat)
        });

        // Close modal and reset form
        const modal = bootstrap.Modal.getInstance(document.getElementById('addMealModal'));
        modal.hide();
        document.getElementById('add-meal-form').reset();

        // Show success message
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Meal added successfully!',
            showConfirmButton: false,
            timer: 1500,
            toast: true
        });
    }
});

// Water tracking events
addWaterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const amount = parseInt(btn.dataset.amount);
        waterIntake += amount;
        updateWaterDisplay();

        // Show success message
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `Added ${amount}ml of water!`,
            showConfirmButton: false,
            timer: 1500,
            toast: true
        });
    });
});

undoWaterBtn.addEventListener('click', () => {
    if (waterIntake >= 250) {
        waterIntake -= 250;
        updateWaterDisplay();
    }
});

resetWaterBtn.addEventListener('click', () => {
    Swal.fire({
        title: 'Reset water intake?',
        text: 'This will reset your water intake to 0ml',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, reset it!'
    }).then((result) => {
        if (result.isConfirmed) {
            waterIntake = 0;
            updateWaterDisplay();
            Swal.fire(
                'Reset!',
                'Your water intake has been reset.',
                'success'
            );
        }
    });
});

// Water reminder functionality
document.getElementById('toggle-reminder').addEventListener('click', () => {
    const reminderModal = new bootstrap.Modal(document.getElementById('waterReminderModal'));
    reminderModal.show();
});

document.getElementById('save-reminders').addEventListener('click', () => {
    const enabled = document.getElementById('reminder-enabled').checked;
    const interval = document.getElementById('reminder-interval').value;
    const startTime = document.getElementById('reminder-start').value;
    const endTime = document.getElementById('reminder-end').value;

    // Save reminder settings
    localStorage.setItem('waterReminders', JSON.stringify({
        enabled,
        interval,
        startTime,
        endTime
    }));

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('waterReminderModal'));
    modal.hide();

    // Show success message
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Reminder settings saved!',
        showConfirmButton: false,
        timer: 1500,
        toast: true
    });

    // Set up reminders if enabled
    if (enabled) {
        setupWaterReminders(interval, startTime, endTime);
    }
});

function setupWaterReminders(interval, startTime, endTime) {
    // Convert times to Date objects for comparison
    const now = new Date();
    const start = new Date(now.toDateString() + ' ' + startTime);
    const end = new Date(now.toDateString() + ' ' + endTime);

    // Check if current time is within active hours
    if (now >= start && now <= end) {
        // Set up reminder
        setInterval(() => {
            const currentTime = new Date();
            if (currentTime >= start && currentTime <= end) {
                Swal.fire({
                    title: 'Water Reminder!',
                    text: 'Time to drink some water!',
                    icon: 'info',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 5000
                });
            }
        }, interval * 60 * 1000); // Convert minutes to milliseconds
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
    loadSavedData();
    
    // Add event listener for food selection
    document.querySelector('#food-select').addEventListener('change', updateNutritionInfo);
}); 