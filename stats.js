// Initialize stats data structure
let statsData = {
    today: {
        caloriesBurned: 0,
        workoutTime: 0,
        achievements: 0,
        streak: 0
    },
    week: {
        caloriesBurned: 0,
        workoutTime: 0,
        achievements: 0,
        streak: 0
    },
    month: {
        caloriesBurned: 0,
        workoutTime: 0,
        achievements: 0,
        streak: 0
    }
};

// Load stats from localStorage
function loadStats() {
    const savedStats = localStorage.getItem('gymBroStats');
    if (savedStats) {
        statsData = JSON.parse(savedStats);
        
        // Check if it's a new day
        const lastUpdate = localStorage.getItem('lastStatsUpdate');
        const today = new Date().toISOString().split('T')[0];
        
        if (lastUpdate !== today) {
            // Reset daily stats but keep the streak
            const currentStreak = statsData.today.streak;
            
            // Check if yesterday was the last workout day
            const lastWorkout = localStorage.getItem('lastWorkoutDate');
            const yesterday = new Date(Date.now() - 86400000).toDateString();
            
            if (lastWorkout !== yesterday) {
                // If didn't work out yesterday, reset streak
                statsData.today.streak = 0;
                statsData.week.streak = 0;
                statsData.month.streak = 0;
            } else {
                // Keep the streak if worked out yesterday
                statsData.today.streak = currentStreak;
                statsData.week.streak = currentStreak;
                statsData.month.streak = currentStreak;
            }
            
            // Reset other daily stats
            statsData.today.caloriesBurned = 0;
            statsData.today.workoutTime = 0;
            statsData.today.achievements = 0;
            
            // Save the reset stats
            saveStats();
        }
        
        // Check if we need to reset weekly stats (on a new week)
        const currentDate = new Date();
        const startOfWeek = getStartOfWeek(currentDate);
        const lastWeekReset = localStorage.getItem('lastWeekReset');
        
        if (!lastWeekReset || new Date(lastWeekReset) < startOfWeek) {
            // Reset weekly stats
            statsData.week.caloriesBurned = 0;
            statsData.week.workoutTime = 0;
            statsData.week.achievements = 0;
            // Keep the streak
            
            // Save the week reset date
            localStorage.setItem('lastWeekReset', startOfWeek.toISOString());
            saveStats();
        }
        
        // Check if we need to reset monthly stats (on a new month)
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastMonthReset = localStorage.getItem('lastMonthReset');
        
        if (!lastMonthReset || new Date(lastMonthReset) < startOfMonth) {
            // Reset monthly stats
            statsData.month.caloriesBurned = 0;
            statsData.month.workoutTime = 0;
            statsData.month.achievements = 0;
            // Keep the streak
            
            // Save the month reset date
            localStorage.setItem('lastMonthReset', startOfMonth.toISOString());
            saveStats();
        }
        
        updateStatsDisplay('today'); // Default to showing today's stats
    }
}

// Helper function to get the start of the week (Monday)
function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
}

// Save stats to localStorage
function saveStats() {
    localStorage.setItem('gymBroStats', JSON.stringify(statsData));
}

// Check if user has already checked in today
function hasCheckedInToday() {
    const checkedInDates = JSON.parse(localStorage.getItem('checkedInDates')) || [];
    const today = new Date().toISOString().split('T')[0];
    return checkedInDates.includes(today);
}

// Update stats when workout is completed
function updateWorkoutStats(workoutData) {
    // Check if user has already checked in today
    if (hasCheckedInToday()) {
        return false; // Don't update stats if already checked in
    }

    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    
    // Get last stats update date
    const lastStatsUpdate = localStorage.getItem('lastStatsUpdate');
    
    // If this is the first update of the day, reset today's stats
    if (lastStatsUpdate !== today) {
        statsData.today.caloriesBurned = 0;
        statsData.today.workoutTime = 0;
        statsData.today.achievements = 0;
    }

    // Update today's stats
    statsData.today.caloriesBurned += workoutData.calories || 0;
    statsData.today.workoutTime += workoutData.duration || 0;
    
    // Update weekly stats
    statsData.week.caloriesBurned += workoutData.calories || 0;
    statsData.week.workoutTime += workoutData.duration || 0;
    
    // Update monthly stats
    statsData.month.caloriesBurned += workoutData.calories || 0;
    statsData.month.workoutTime += workoutData.duration || 0;
    
    // Update streak
    updateStreak();
    
    // Save last stats update date
    localStorage.setItem('lastStatsUpdate', today);
    
    // Save and display updated stats
    saveStats();
    updateStatsDisplay('today');

    return true; // Stats were updated successfully
}

// Update streak count
function updateStreak() {
    const lastWorkout = localStorage.getItem('lastWorkoutDate');
    const today = new Date().toDateString();
    
    if (lastWorkout === today) {
        return; // Already worked out today
    }
    
    if (lastWorkout === new Date(Date.now() - 86400000).toDateString()) {
        // Last workout was yesterday, increment streak
        statsData.today.streak++;
        statsData.week.streak = statsData.today.streak;
        statsData.month.streak = statsData.today.streak;
    } else if (!lastWorkout || new Date(lastWorkout) < new Date(Date.now() - 86400000)) {
        // More than one day missed, reset streak to 1
        statsData.today.streak = 1;
        statsData.week.streak = 1;
        statsData.month.streak = 1;
    }
    
    localStorage.setItem('lastWorkoutDate', today);
}

// Update achievements
function updateAchievements(achievement) {
    if (!hasCheckedInToday()) {
        statsData.today.achievements++;
        statsData.week.achievements++;
        statsData.month.achievements++;
        saveStats();
        updateStatsDisplay('today');
    }
}

// Reset all stats to zero
function resetAllStats() {
    Swal.fire({
        title: 'Reset tất cả thống kê?',
        text: 'Bạn có chắc muốn đặt lại tất cả thống kê về 0?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Có, Reset!',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            // Reset all stats to zero
            statsData.today.caloriesBurned = 0;
            statsData.today.workoutTime = 0;
            statsData.today.achievements = 0;
            statsData.today.streak = 0;

            statsData.week.caloriesBurned = 0;
            statsData.week.workoutTime = 0;
            statsData.week.achievements = 0;
            statsData.week.streak = 0;

            statsData.month.caloriesBurned = 0;
            statsData.month.workoutTime = 0;
            statsData.month.achievements = 0;
            statsData.month.streak = 0;

            // Clear checked in dates
            localStorage.setItem('checkedInDates', JSON.stringify([]));
            localStorage.removeItem('lastWorkoutDate');
            localStorage.removeItem('lastStatsUpdate');

            // Save and update display
            saveStats();
            
            // Get current active period
            const activePeriod = document.querySelector('.btn-group .btn.active').id.replace('stats-', '');
            updateStatsDisplay(activePeriod);

            Swal.fire(
                'Đã reset!',
                'Tất cả thống kê đã được đặt về 0.',
                'success'
            );
        }
    });
}

// Update the stats display
function updateStatsDisplay(period) {
    const stats = statsData[period];
    
    // Update the period text
    document.getElementById('calories-period').textContent = getPeriodText(period);
    document.getElementById('time-period').textContent = getPeriodText(period);
    
    // Update the stats values with animation
    animateValue('calories-burned', stats.caloriesBurned);
    animateValue('workout-time', stats.workoutTime);
    animateValue('achievements', stats.achievements);
    animateValue('current-streak', stats.streak);
    
    // Update active button
    document.querySelectorAll('.btn-group .btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`stats-${period}`).classList.add('active');
}

// Helper function to get period text
function getPeriodText(period) {
    switch(period) {
        case 'today':
            return 'hôm nay';
        case 'week':
            return 'tuần này';
        case 'month':
            return 'tháng này';
        default:
            return '';
    }
}

// Animate value changes
function animateValue(elementId, value) {
    const element = document.getElementById(elementId);
    const start = parseInt(element.textContent) || 0;
    const duration = 1000;
    const steps = 60;
    const increment = (value - start) / steps;
    let current = start;
    let step = 0;
    
    const animation = setInterval(() => {
        step++;
        current += increment;
        element.textContent = Math.round(current);
        
        if (step >= steps) {
            element.textContent = value;
            clearInterval(animation);
        }
    }, duration / steps);
}

// Event listeners for period buttons
document.getElementById('stats-today').addEventListener('click', () => updateStatsDisplay('today'));
document.getElementById('stats-week').addEventListener('click', () => updateStatsDisplay('week'));
document.getElementById('stats-month').addEventListener('click', () => updateStatsDisplay('month'));

// Event listener for reset button
document.addEventListener('DOMContentLoaded', function() {
    const resetButton = document.getElementById('reset-stats');
    if (resetButton) {
        resetButton.addEventListener('click', resetAllStats);
    }
    
    // Event listeners for individual reset buttons
    const singleResetButtons = document.querySelectorAll('.reset-single-stat');
    singleResetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const statType = this.getAttribute('data-stat');
            resetSingleStat(statType);
        });
    });
});

// Event listener for workout completion
document.getElementById('checkin-workout').addEventListener('click', function() {
    // Check if already checked in today
    if (hasCheckedInToday()) {
        // Show already checked in message
        Swal.fire({
            icon: 'info',
            title: 'Đã điểm danh hôm nay',
            text: 'Bạn đã điểm danh cho ngày hôm nay rồi',
            timer: 2000,
            showConfirmButton: false
        });
        return;
    }

    // Calculate workout data
    const workoutData = {
        calories: Math.floor(Math.random() * 200) + 300, // Random calories between 300-500
        duration: 1, // 1 hour
    };
    
    // Update stats
    if (updateWorkoutStats(workoutData)) {
        // Add today to checked in dates
        const checkedInDates = JSON.parse(localStorage.getItem('checkedInDates')) || [];
        const today = new Date().toISOString().split('T')[0];
        checkedInDates.push(today);
        localStorage.setItem('checkedInDates', JSON.stringify(checkedInDates));
        
        // Show success message
        Swal.fire({
            icon: 'success',
            title: 'Điểm danh thành công!',
            text: `Bạn đã đốt ${workoutData.calories} calories hôm nay!`,
            timer: 2000,
            showConfirmButton: false
        });
    }
});

// Reset a single stat type across all time periods
function resetSingleStat(statType) {
    if (!statType) return;
    
    Swal.fire({
        title: `Reset ${getStatName(statType)}?`,
        text: `Bạn có chắc muốn đặt lại thống kê ${getStatName(statType)} về 0?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Có, Reset!',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            // Reset this specific stat for all time periods
            statsData.today[statType] = 0;
            statsData.week[statType] = 0;
            statsData.month[statType] = 0;
            
            // If resetting streak, also update related data
            if (statType === 'streak') {
                localStorage.removeItem('lastWorkoutDate');
            }
            
            // Save updated stats
            saveStats();
            
            // Update display for current period
            const activePeriod = document.querySelector('.btn-group .btn.active').id.replace('stats-', '');
            updateStatsDisplay(activePeriod);
            
            Swal.fire({
                icon: 'success',
                title: 'Đã reset!',
                text: `Thống kê ${getStatName(statType)} đã được đặt về 0.`,
                timer: 1500,
                showConfirmButton: false
            });
        }
    });
}

// Helper function to get user-friendly stat name
function getStatName(statType) {
    switch(statType) {
        case 'caloriesBurned':
            return 'Calo đã đốt';
        case 'workoutTime':
            return 'Thời gian tập';
        case 'achievements':
            return 'Thành tích';
        case 'streak':
            return 'Streak';
        default:
            return statType;
    }
}

// Load stats when page loads
document.addEventListener('DOMContentLoaded', loadStats); 