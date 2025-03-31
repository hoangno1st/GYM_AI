function goBack() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function sendMessage() {
    const input = document.getElementById("chat-input");
    const output = document.getElementById("chat-output");
    const message = input.value.trim();
    if (message) {
        output.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
        input.value = "";
        setTimeout(() => {
            output.innerHTML += `<p><strong>Bot:</strong> I'm here to help with your workout and nutrition!</p>`;
        }, 500);
    }
}

function getNutrition() {
    const meal = document.getElementById("meal").value.trim();
    const info = document.getElementById("nutrition-info");
    if (meal) {
        info.innerHTML = `<p>Nutrition info for ${meal}: 200 kcal, 20g protein, 5g fat.</p>`;
    }
}

function getWorkout() {
    const goal = document.getElementById("goal").value;
    const plan = document.getElementById("workout-plan");
    let workoutPlan = "";
    switch (goal) {
        case "strength":
            workoutPlan = "Deadlifts, Squats, Bench Press";
            break;
        case "endurance":
            workoutPlan = "Running, Jump Rope, Cycling";
            break;
        case "weight_loss":
            workoutPlan = "HIIT, Cardio, Strength Training";
            break;
    }
    plan.innerHTML = `<p>Recommended workout: ${workoutPlan}</p>`;
}
