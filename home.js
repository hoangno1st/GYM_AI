document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animations
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
    
    // Add custom CSS for new features
    addCustomStyles();
    
    // User dropdown functionality - now handled by Bootstrap
    
    // Logout functionality with SweetAlert2
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            Swal.fire({
                title: 'Bạn muốn đăng xuất?',
                text: "Bạn sẽ cần đăng nhập lại để tiếp tục!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Đăng xuất',
                cancelButtonText: 'Hủy'
            }).then((result) => {
                if (result.isConfirmed) {
            localStorage.removeItem('currentUser');
                    
                    Swal.fire({
                        title: 'Đã đăng xuất!',
                        text: 'Đang chuyển hướng...',
                        icon: 'success',
                        timer: 1500,
                        timerProgressBar: true,
                        showConfirmButton: false
                    }).then(() => {
            window.location.href = 'index.html';
                    });
                }
            });
        });
    }

    // Bootstrap carousel is now handled automatically
    // We can add extra functionality for the tips carousel if needed
    const tipsCarousel = document.getElementById('tipsCarousel');
    if (tipsCarousel) {
        // Initialize the Bootstrap carousel with options
        const carousel = new bootstrap.Carousel(tipsCarousel, {
            interval: 5000,
            wrap: true,
            touch: true
        });
    }
    
    // NEW FEATURE: Goal Tracking
    initGoalTracking();
    
    // NEW FEATURE: Calendar
    initWorkoutCalendar();
    
    // NEW FEATURE: Stats
    initRealTimeStats();
    
    // Hide progress chart section
    const progressSection = document.querySelector('.progress-chart');
    if (progressSection) {
        progressSection.style.display = 'none';
    }
    
    // Check for user authentication
    checkAuthentication();
    
    // Initialize Device Sync UI
    syncDataWithDevices();
    
    // Check if we need to highlight today in calendar
    const lastCheckIn = localStorage.getItem('last-checkin-date');
    const today = new Date().toDateString();
    if (lastCheckIn === today) {
        highlightTodayInCalendar();
    }

    // Lưu trữ các ngày đã điểm danh
    let checkedInDates = JSON.parse(localStorage.getItem('checkedInDates')) || [];

    // Hàm tạo lịch
    function generateCalendar(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startingDay = firstDay.getDay();
        const monthLength = lastDay.getDate();

        const calendarBody = document.getElementById('calendar-body');
        calendarBody.innerHTML = '';

        let date = 1;
        for (let i = 0; i < 6; i++) {
            const row = document.createElement('div');
            row.className = 'd-flex';

            for (let j = 0; j < 7; j++) {
                const cell = document.createElement('div');
                cell.className = 'calendar-cell position-relative';

                if (i === 0 && j < startingDay) {
                    cell.textContent = '';
                } else if (date > monthLength) {
                    cell.textContent = '';
                } else {
                    cell.textContent = date;
                    
                    // Kiểm tra xem ngày này đã được điểm danh chưa
                    const currentDate = new Date(year, month, date);
                    const dateString = currentDate.toISOString().split('T')[0];
                    
                    if (checkedInDates.includes(dateString)) {
                        const checkmark = document.createElement('i');
                        checkmark.className = 'fas fa-check-circle text-success position-absolute';
                        checkmark.style.top = '2px';
                        checkmark.style.right = '2px';
                        checkmark.style.fontSize = '14px';
                        cell.appendChild(checkmark);
                    }

                    // Thêm class cho ngày hiện tại
                    if (date === new Date().getDate() && 
                        month === new Date().getMonth() && 
                        year === new Date().getFullYear()) {
                        cell.classList.add('current-day');
                        cell.style.backgroundColor = 'rgba(var(--bs-primary-rgb), 0.1)';
                        cell.style.fontWeight = 'bold';
                    }

                    date++;
                }
                row.appendChild(cell);
            }
            calendarBody.appendChild(row);
            if (date > monthLength) break;
        }
    }

    // Khởi tạo calendar khi trang load
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    // Cập nhật tiêu đề tháng
    function updateCalendarTitle() {
        const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
                       'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
        document.getElementById('calendar-month-year').textContent = `${months[currentMonth]}, ${currentYear}`;
    }

    // Xử lý sự kiện điểm danh
    document.getElementById('checkin-workout').addEventListener('click', function() {
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        
        if (!checkedInDates.includes(dateString)) {
            checkedInDates.push(dateString);
            localStorage.setItem('checkedInDates', JSON.stringify(checkedInDates));
            
            // Hiển thị thông báo thành công
            Swal.fire({
                icon: 'success',
                title: 'Điểm danh thành công!',
                text: 'Bạn đã điểm danh thành công cho ngày hôm nay',
                showConfirmButton: false,
                timer: 1500
            });

            // Cập nhật lại calendar để hiển thị dấu tích mới
            generateCalendar(currentYear, currentMonth);
        } else {
            // Thông báo đã điểm danh rồi
            Swal.fire({
                icon: 'info',
                title: 'Đã điểm danh',
                text: 'Bạn đã điểm danh cho ngày hôm nay rồi',
                showConfirmButton: false,
                timer: 1500
            });
        }
    });

    // Xử lý nút Previous Month
    document.getElementById('prev-month').addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendarTitle();
        generateCalendar(currentYear, currentMonth);
    });

    // Xử lý nút Next Month
    document.getElementById('next-month').addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendarTitle();
        generateCalendar(currentYear, currentMonth);
    });

    // Khởi tạo calendar
    document.addEventListener('DOMContentLoaded', function() {
        updateCalendarTitle();
        generateCalendar(currentYear, currentMonth);

        // Thêm CSS cho calendar cells
        const style = document.createElement('style');
        style.textContent = `
            .calendar-cell {
                flex: 1;
                height: 60px;
                border: 1px solid #dee2e6;
                padding: 8px;
                text-align: center;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            .calendar-cell:hover {
                background-color: rgba(var(--bs-primary-rgb), 0.05);
            }
            .current-day {
                color: var(--primary-color);
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);
    });

    // Khởi tạo biến theo dõi nước uống
    let waterIntake = parseFloat(localStorage.getItem('waterIntake')) || 0;
    const WATER_GOAL = 2.5; // Mục tiêu uống nước (lít)
    const WATER_INCREMENT = 0.25; // Mỗi lần thêm 250ml

    // Hàm cập nhật hiển thị lượng nước
    function updateWaterDisplay() {
        const waterProgress = document.getElementById('water-progress');
        const waterAmount = document.getElementById('water-amount');
        const waterPercentage = document.getElementById('water-percentage');
        
        // Tính phần trăm hoàn thành
        const percentage = Math.min((waterIntake / WATER_GOAL) * 100, 100);
        
        // Cập nhật thanh progress
        waterProgress.style.width = `${percentage}%`;
        waterAmount.textContent = `${waterIntake.toFixed(2)}L`;
        waterPercentage.textContent = `${Math.round(percentage)}%`;
        
        // Thay đổi màu dựa trên tiến độ
        if (percentage < 30) {
            waterProgress.style.backgroundColor = '#ff6b6b';
        } else if (percentage < 70) {
            waterProgress.style.backgroundColor = '#ffd93d';
        } else {
            waterProgress.style.backgroundColor = '#51cf66';
        }
        
        // Lưu vào localStorage
        localStorage.setItem('waterIntake', waterIntake);
    }

    // Hàm thêm nước
    function addWater() {
        // Kiểm tra giới hạn (không cho phép vượt quá 150% mục tiêu)
        if (waterIntake >= WATER_GOAL * 1.5) {
            Swal.fire({
                icon: 'warning',
                title: 'Cảnh báo',
                text: 'Bạn đã uống khá nhiều nước. Hãy đợi một lúc trước khi uống thêm!',
                timer: 2000,
                showConfirmButton: false
            });
            return;
        }
        
        // Thêm nước và animation
        waterIntake += WATER_INCREMENT;
        
        // Animation khi thêm nước
        const waterProgress = document.getElementById('water-progress');
        waterProgress.classList.add('water-added');
        setTimeout(() => {
            waterProgress.classList.remove('water-added');
        }, 500);
        
        // Cập nhật hiển thị
        updateWaterDisplay();
        
        // Kiểm tra nếu đạt mục tiêu
        if (waterIntake >= WATER_GOAL) {
            Swal.fire({
                icon: 'success',
                title: 'Chúc mừng! 🎉',
                text: 'Bạn đã đạt mục tiêu uống nước hôm nay!',
                timer: 2000,
                showConfirmButton: false
            });
        }
    }

    // Hàm reset lượng nước
    function resetWater() {
        Swal.fire({
            title: 'Đặt lại lượng nước?',
            text: 'Bạn có chắc muốn đặt lại lượng nước về 0?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                waterIntake = 0;
                updateWaterDisplay();
                Swal.fire({
                    icon: 'success',
                    title: 'Đã đặt lại',
                    text: 'Lượng nước đã được đặt lại về 0',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    }

    // Thêm CSS cho animation
    const style = document.createElement('style');
    style.textContent = `
        .water-progress {
            transition: width 0.3s ease-in-out, background-color 0.3s;
        }
        
        .water-added {
            animation: waterPulse 0.5s ease-in-out;
        }
        
        @keyframes waterPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .water-tracker {
            background: white;
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin: 20px 0;
        }
        
        .water-controls {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }
        
        .water-btn {
            padding: 8px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .water-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .water-btn.add {
            background-color: var(--primary-color);
            color: white;
        }
        
        .water-btn.reset {
            background-color: #ff6b6b;
            color: white;
        }
    `;
    document.head.appendChild(style);

    // Khởi tạo khi trang load
    document.addEventListener('DOMContentLoaded', function() {
        // Thêm HTML cho water tracker
        const waterTrackerHTML = `
            <div class="water-tracker">
                <h4><i class="fas fa-tint me-2"></i>Theo dõi nước uống</h4>
                <div class="progress mt-3" style="height: 25px;">
                    <div id="water-progress" class="water-progress progress-bar" 
                         role="progressbar" style="width: 0%;">
                    </div>
                </div>
                <div class="d-flex justify-content-between mt-2">
                    <span id="water-amount">0.00L</span>
                    <span id="water-percentage">0%</span>
                </div>
                <div class="water-controls">
                    <button onclick="addWater()" class="water-btn add">
                        <i class="fas fa-plus me-2"></i>Thêm nước (250ml)
                    </button>
                    <button onclick="resetWater()" class="water-btn reset">
                        <i class="fas fa-redo me-2"></i>Đặt lại
                    </button>
                </div>
                <small class="text-muted mt-2 d-block">
                    Mục tiêu: ${WATER_GOAL}L mỗi ngày
                </small>
            </div>
        `;
        
        // Chèn water tracker vào vị trí phù hợp (ví dụ: sau phần thống kê)
        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            statsSection.insertAdjacentHTML('afterend', waterTrackerHTML);
        }
        
        // Cập nhật hiển thị ban đầu
        updateWaterDisplay();
    });
});

// Add custom styles for new features
function addCustomStyles() {
    const customCSS = `
        :root {
            --primary-color: #e31837;
            --primary-light: #ff4d6b;
            --primary-dark: #b30000;
            --white: #ffffff;
            --light-gray: #f8f9fa;
        }

        body {
            background: linear-gradient(135deg, var(--white) 0%, #fff5f5 100%);
        }

        .navbar {
            background-color: var(--primary-color) !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .navbar-brand, .nav-link {
            color: var(--white) !important;
        }

        .nav-link:hover {
            color: rgba(255,255,255,0.9) !important;
        }

        .hero {
            background: linear-gradient(45deg, var(--primary-color), var(--primary-light));
            color: var(--white);
            padding: 1.5rem 0;
            margin-bottom: 1rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .hero-content {
            text-align: center;
        .card, .water-tracker, .stats-section {
            background: var(--white);
            border-radius: 15px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            border: none;
            transition: transform 0.3s ease;
        }

        .card:hover {
            transform: translateY(-5px);
        }

        .btn-custom {
            background: var(--primary-color);
            color: var(--white);
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            transition: all 0.3s ease;
        }

        .btn-custom:hover {
            background: var(--primary-dark);
            color: var(--white);
            transform: translateY(-2px);
        }

        .progress-bar {
            background-color: var(--primary-color);
        }

        .checked-in {
            background-color: rgba(227, 24, 55, 0.1) !important;
            border: 2px solid var(--primary-color) !important;
        }

        .notification-badge {
            background: var(--primary-color) !important;
        }

        .calendar-cell {
            background: var(--white);
            border: 1px solid #eee !important;
        }

        .calendar-cell:hover {
            background-color: rgba(227, 24, 55, 0.05) !important;
        }

        .current-day {
            color: var(--primary-color) !important;
            font-weight: bold;
        }

        .water-btn.add {
            background-color: var(--primary-color);
        }

        .water-btn.add:hover {
            background-color: var(--primary-dark);
        }

        .stats-section {
            background: var(--white);
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 20px;
        }

        .stat-item {
            background: var(--white);
            border: 1px solid rgba(227, 24, 55, 0.1);
            border-radius: 10px;
            padding: 15px;
            transition: all 0.3s ease;
        }

        .stat-item:hover {
            background: rgba(227, 24, 55, 0.05);
            transform: translateY(-3px);
        }

        .goal-card {
            border-left: 4px solid var(--primary-color);
        }

        @keyframes pulse {
            0% {
                transform: scale(1);
                box-shadow: none;
            }
            50% {
                transform: scale(1.05);
                box-shadow: 0 0 15px rgba(227, 24, 55, 0.5);
            }
            100% {
                transform: scale(1);
                box-shadow: none;
            }
        }
    `;
    
    // Create and append style element
    const styleElement = document.createElement('style');
    styleElement.textContent = customCSS;
    document.head.appendChild(styleElement);
}

// Goal tracking initialization
function initGoalTracking() {
    // Load goals from localStorage
    const goals = JSON.parse(localStorage.getItem('fitness-goals')) || {
        weight: { current: 75, target: 70 },
        workouts: { current: 8, target: 12 },
        water: { current: 1.5, target: 2.5 }
    };
    
    // Display goals
    updateGoalDisplay(goals);
    
    // Weight goal updates
    if (document.getElementById('save-weight-goal')) {
        document.getElementById('save-weight-goal').addEventListener('click', function() {
            const currentWeight = parseFloat(document.getElementById('current-weight-input').value);
            const targetWeight = parseFloat(document.getElementById('target-weight-input').value);
            
            if (isNaN(currentWeight) || isNaN(targetWeight)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Vui lòng nhập số hợp lệ'
                });
                return;
            }
            
            // Store starting weight if first time
            if (!localStorage.getItem('starting-weight')) {
                localStorage.setItem('starting-weight', currentWeight);
            }
            
            goals.weight.current = currentWeight;
            goals.weight.target = targetWeight;
            
            localStorage.setItem('fitness-goals', JSON.stringify(goals));
            updateGoalDisplay(goals);
            
            // Close modal
            const weightModal = bootstrap.Modal.getInstance(document.getElementById('weightGoalModal'));
            weightModal.hide();
            
            Swal.fire({
                icon: 'success',
                title: 'Đã cập nhật',
                text: 'Mục tiêu cân nặng đã được cập nhật',
                timer: 1500,
                showConfirmButton: false
            });
            
            // Check goal achievements
            checkGoalAchievements();
        });
    }
    
    // Workout goal updates
    if (document.getElementById('save-workout-goal')) {
        document.getElementById('save-workout-goal').addEventListener('click', function() {
            const currentWorkouts = parseInt(document.getElementById('current-workouts-input').value);
            const targetWorkouts = parseInt(document.getElementById('target-workouts-input').value);
            
            if (isNaN(currentWorkouts) || isNaN(targetWorkouts)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Vui lòng nhập số hợp lệ'
                });
                return;
            }
            
            goals.workouts.current = currentWorkouts;
            goals.workouts.target = targetWorkouts;
            
            localStorage.setItem('fitness-goals', JSON.stringify(goals));
            updateGoalDisplay(goals);
            
            // Close modal
            const workoutModal = bootstrap.Modal.getInstance(document.getElementById('workoutGoalModal'));
            workoutModal.hide();
            
            Swal.fire({
                icon: 'success',
                title: 'Đã cập nhật',
                text: 'Mục tiêu tập luyện đã được cập nhật',
                timer: 1500,
                showConfirmButton: false
            });
            
            // Check goal achievements
            checkGoalAchievements();
        });
    }
    
    // Water goal updates
    if (document.getElementById('add-water')) {
        document.getElementById('add-water').addEventListener('click', function() {
            goals.water.current = Math.min(goals.water.current + 0.25, goals.water.target * 1.5);
            localStorage.setItem('fitness-goals', JSON.stringify(goals));
            updateGoalDisplay(goals);
            
            // Check goal achievements
            checkGoalAchievements();
            
            // Add animation effect
            const waterCard = document.querySelector('.goal-card.water-goal');
            if (waterCard) {
                waterCard.classList.add('goal-updated');
                setTimeout(() => {
                    waterCard.classList.remove('goal-updated');
                }, 1000);
            }
        });
    }
    
    if (document.getElementById('reset-water')) {
        document.getElementById('reset-water').addEventListener('click', function() {
            Swal.fire({
                title: 'Đặt lại lượng nước?',
                text: 'Lượng nước đã uống sẽ được đặt về 0',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Đặt lại',
                cancelButtonText: 'Hủy'
            }).then((result) => {
                if (result.isConfirmed) {
                    goals.water.current = 0;
                    localStorage.setItem('fitness-goals', JSON.stringify(goals));
                    updateGoalDisplay(goals);
                    
                    // Remove achievement flag
                    localStorage.removeItem('water-goal-achieved-today');
                }
            });
        });
    }
    
    // Add sync buttons to modals
    const weightSyncBtn = document.querySelector('#weight-sync-btn');
    if (weightSyncBtn) {
        updateWeightGoalWithSync();
    }
    
    // Setup sync across devices
    setupDeviceSyncButtons();
    
    // Setup notifications for goals
    setupGoalNotifications();
    
    // Modal form initialization
    const weightGoalModal = document.getElementById('weightGoalModal');
    if (weightGoalModal) {
        weightGoalModal.addEventListener('show.bs.modal', function() {
            document.getElementById('current-weight-input').value = goals.weight.current;
            document.getElementById('target-weight-input').value = goals.weight.target;
        });
    }
    
    const workoutGoalModal = document.getElementById('workoutGoalModal');
    if (workoutGoalModal) {
        workoutGoalModal.addEventListener('show.bs.modal', function() {
            document.getElementById('current-workouts-input').value = goals.workouts.current;
            document.getElementById('target-workouts-input').value = goals.workouts.target;
        });
    }
}

// Setup device sync buttons
function setupDeviceSyncButtons() {
    const syncBtn = document.getElementById('sync-devices-btn');
    const enterSyncBtn = document.getElementById('enter-sync-code-btn');
    
    if (syncBtn || enterSyncBtn) {
        syncDataWithDevices();
    }
    
    // Add a sync indicator to the UI if we have synced before
    const lastSyncTime = localStorage.getItem('last-sync-time');
    const syncStatusEl = document.getElementById('last-sync-time');
    
    if (lastSyncTime && syncStatusEl) {
        const syncDate = new Date(lastSyncTime);
        const now = new Date();
        
        let timeDisplay;
        const diffMinutes = Math.round((now - syncDate) / (1000 * 60));
        
        if (diffMinutes < 60) {
            timeDisplay = `${diffMinutes} phút trước`;
        } else if (diffMinutes < 1440) {
            const hours = Math.floor(diffMinutes / 60);
            timeDisplay = `${hours} giờ trước`;
        } else {
            const days = Math.floor(diffMinutes / 1440);
            timeDisplay = `${days} ngày trước`;
        }
        
        syncStatusEl.textContent = `Lần đồng bộ cuối: ${timeDisplay}`;
        syncStatusEl.style.display = 'block';
    }
}

// Setup notifications for goal achievements
function setupGoalNotifications() {
    const notificationBtn = document.getElementById('notification-btn');
    const notificationBadge = document.getElementById('notification-badge');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            // Get achievements from localStorage
            const achievements = JSON.parse(localStorage.getItem('achievements-history')) || [];
            
            if (achievements.length === 0) {
                Swal.fire({
                    title: 'Không có thông báo mới',
                    text: 'Bạn sẽ nhận được thông báo khi đạt được mục tiêu và thành tựu mới.',
                    icon: 'info',
                    confirmButtonText: 'Đóng'
                });
            } else {
                let notificationList = '';
                achievements.forEach((achievement, index) => {
                    const date = new Date(achievement.date);
                    const dateStr = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
                    
                    notificationList += `
                        <div class="notification-item d-flex align-items-start mb-3 ${index >= 3 ? 'old-notification' : ''}">
                            <div class="notification-icon me-3">
                                <i class="fas fa-trophy text-warning fa-2x"></i>
                            </div>
                            <div class="notification-content">
                                <h6 class="mb-1">${achievement.title}</h6>
                                <p class="text-muted mb-1 small">${achievement.message}</p>
                                <small class="text-muted">${dateStr}</small>
                            </div>
                        </div>
                    `;
                });
                
                Swal.fire({
                    title: 'Thông báo & thành tựu',
                    html: `
                        <div class="notifications-container">
                            ${notificationList}
                        </div>
                        <div class="text-center mt-3">
                            <button id="clear-notifications" class="btn btn-sm btn-outline-danger">Xóa tất cả thông báo</button>
                        </div>
                    `,
                    confirmButtonText: 'Đóng',
                    didOpen: () => {
                        // Add click handler for clear button
                        const clearBtn = Swal.getPopup().querySelector('#clear-notifications');
                        if (clearBtn) {
                            clearBtn.addEventListener('click', () => {
                                localStorage.removeItem('achievements-history');
                                updateNotificationBadge(-achievements.length); // Reset badge
                                Swal.close();
                                
                                // Show confirmation
                                Swal.fire({
                                    title: 'Đã xóa thông báo',
                                    text: 'Tất cả thông báo đã được xóa.',
                                    icon: 'success',
                                    timer: 1500,
                                    showConfirmButton: false
                                });
                            });
                        }
                    }
                });
            }
            
            // Reset notification badge if it exists
            if (notificationBadge) {
                notificationBadge.style.display = 'none';
                notificationBadge.setAttribute('data-count', '0');
            }
        });
    }
    
    // Show badge if we have achievements
    if (notificationBadge) {
        const achievements = JSON.parse(localStorage.getItem('achievements-history')) || [];
        if (achievements.length > 0) {
            notificationBadge.textContent = achievements.length;
            notificationBadge.setAttribute('data-count', achievements.length);
            notificationBadge.style.display = 'block';
        } else {
            notificationBadge.style.display = 'none';
        }
    }
}

// Store achievement history
function storeAchievement(achievement) {
    const achievements = JSON.parse(localStorage.getItem('achievements-history')) || [];
    
    // Add timestamp
    achievement.date = new Date().toISOString();
    
    // Add to the beginning of the array
    achievements.unshift(achievement);
    
    // Keep only the 10 most recent
    const trimmedAchievements = achievements.slice(0, 10);
    
    // Save to localStorage
    localStorage.setItem('achievements-history', JSON.stringify(trimmedAchievements));
}

// Update the goal display elements
function updateGoalDisplay(goals) {
    // Weight goal
    if (document.getElementById('current-weight')) {
        document.getElementById('current-weight').textContent = goals.weight.current;
        document.getElementById('target-weight').textContent = goals.weight.target;
        
        const weightRemaining = Math.abs(goals.weight.current - goals.weight.target);
        document.getElementById('weight-remaining').textContent = weightRemaining;
        
        // Calculate progress percentage (different for gain vs loss goals)
        let weightProgress;
        if (goals.weight.current > goals.weight.target) {
            // Weight loss goal
            const startWeight = goals.weight.current + weightRemaining * 0.2; // Assume starting a bit higher
            weightProgress = Math.round(((startWeight - goals.weight.current) / (startWeight - goals.weight.target)) * 100);
        } else {
            // Weight gain goal
            const startWeight = goals.weight.current - weightRemaining * 0.2; // Assume starting a bit lower
            weightProgress = Math.round(((goals.weight.current - startWeight) / (goals.weight.target - startWeight)) * 100);
        }
        
        const weightProgressBar = document.getElementById('weight-progress');
        weightProgressBar.style.width = `${weightProgress}%`;
        weightProgressBar.setAttribute('aria-valuenow', weightProgress);
    }
    
    // Workout goal
    if (document.getElementById('current-workouts')) {
        document.getElementById('current-workouts').textContent = goals.workouts.current;
        document.getElementById('target-workouts').textContent = goals.workouts.target;
        
        const workoutsRemaining = goals.workouts.target - goals.workouts.current;
        document.getElementById('workouts-remaining').textContent = workoutsRemaining > 0 ? workoutsRemaining : 0;
        
        const workoutProgress = Math.round((goals.workouts.current / goals.workouts.target) * 100);
        const workoutProgressBar = document.getElementById('workout-progress');
        workoutProgressBar.style.width = `${workoutProgress}%`;
        workoutProgressBar.setAttribute('aria-valuenow', workoutProgress);
    }
    
    // Water goal
    if (document.getElementById('current-water')) {
        document.getElementById('current-water').textContent = goals.water.current.toFixed(1);
        document.getElementById('target-water').textContent = goals.water.target.toFixed(1);
        
        const waterRemaining = Math.max(0, goals.water.target - goals.water.current).toFixed(1);
        document.getElementById('water-remaining').textContent = waterRemaining;
        
        const waterProgress = Math.round((goals.water.current / goals.water.target) * 100);
        const waterProgressBar = document.getElementById('water-progress');
        waterProgressBar.style.width = `${waterProgress}%`;
        waterProgressBar.setAttribute('aria-valuenow', waterProgress);
    }
}

// Initialize the workout calendar
function initWorkoutCalendar() {
    const calendarBody = document.getElementById('calendar-body');
    const monthYearDisplay = document.getElementById('calendar-month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    
    if (!calendarBody || !monthYearDisplay) return;
    
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    // Generate calendar on load
    generateCalendar(currentMonth, currentYear);
    
    // Month navigation
    prevMonthBtn.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentYear, currentMonth);
    });
    
    nextMonthBtn.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
    });
    
    function generateCalendar(month, year) {
        // Clear previous calendar
        calendarBody.innerHTML = '';
        
        // Update month-year display
        const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
                           'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
        monthYearDisplay.textContent = `${monthNames[month]}, ${year}`;
        
        // Get first day of month and total days in month
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Get workout data (mock data for demo)
        const workouts = getWorkoutData();
        
        // Create calendar grid
        let dayCount = 1;
        const totalCells = 42; // 6 rows x 7 days
        
        // Create a container for calendar rows
        const calendarGrid = document.createElement('div');
        calendarGrid.className = 'calendar-grid';
        
        // Create rows
        for (let i = 0; i < 6; i++) {
            const row = document.createElement('div');
            row.className = 'd-flex';
            
            // Create cells for each row
            for (let j = 0; j < 7; j++) {
                const cell = document.createElement('div');
                cell.className = 'calendar-date';
                
                if (i === 0 && j < firstDay) {
                    // Empty cells before first day
                    cell.classList.add('disabled');
                } else if (dayCount > daysInMonth) {
                    // Empty cells after last day
                    cell.classList.add('disabled');
                } else {
                    // Regular date cell
                    const dateNumber = document.createElement('div');
                    dateNumber.className = 'date-number';
                    dateNumber.textContent = dayCount;
                    cell.appendChild(dateNumber);
                    
                    // Check if it's today
                    const today = new Date();
                    if (dayCount === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                        cell.classList.add('today');
                    }
                    
                    // Check for workouts on this date
                    const dateStr = `${year}-${month+1}-${dayCount}`;
                    const dayWorkouts = workouts.filter(w => w.date === dateStr);
                    
                    if (dayWorkouts.length > 0) {
                        cell.classList.add('has-event');
                        
                        // Add workout indicators
                        dayWorkouts.forEach(workout => {
                            const workoutIndicator = document.createElement('div');
                            workoutIndicator.className = 'workout-indicator';
                            
                            const dot = document.createElement('span');
                            dot.className = `workout-dot workout-${workout.type}`;
                            workoutIndicator.appendChild(dot);
                            
                            const label = document.createElement('div');
                            label.className = 'workout-label';
                            label.textContent = workout.name;
                            workoutIndicator.appendChild(label);
                            
                            cell.appendChild(workoutIndicator);
                        });
                        
                        // Add click event to show workout details
                        cell.addEventListener('click', function() {
                            showWorkoutDetails(dayWorkouts, `${dayCount}/${month+1}/${year}`);
                        });
                    }
                    
                    dayCount++;
                }
                
                row.appendChild(cell);
            }
            
            calendarGrid.appendChild(row);
            
            // Break if we've used all days
            if (dayCount > daysInMonth) break;
        }
        
        calendarBody.appendChild(calendarGrid);
    }
    
    function showWorkoutDetails(workouts, dateStr) {
        let workoutList = '';
        workouts.forEach(workout => {
            workoutList += `<div class="mb-2">
                <div class="d-flex align-items-center">
                    <span class="workout-dot workout-${workout.type} me-2"></span>
                    <strong>${workout.name}</strong>
                </div>
                <div class="text-muted small">${workout.time} - ${workout.duration}</div>
            </div>`;
        });
        
        // Add buttons for tracking or syncing
        const isToday = dateStr === `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}`;
        const buttonHtml = isToday ? 
            `<div class="d-flex justify-content-between mt-3">
                <button id="sync-workout-stats" class="btn btn-sm btn-success">Đồng bộ với thống kê</button>
                <button id="add-calendar-workout" class="btn btn-sm btn-primary">Thêm buổi tập</button>
            </div>` : '';
        
        Swal.fire({
            title: `Lịch tập ngày ${dateStr}`,
            html: (workoutList || 'Không có buổi tập nào') + buttonHtml,
            confirmButtonText: 'Đóng',
            showCancelButton: workouts.length > 0,
            cancelButtonText: 'Chỉnh sửa',
            didOpen: () => {
                // Add event listeners for buttons if it's today
                if (isToday) {
                    // Sync workout stats
                    const syncBtn = Swal.getPopup().querySelector('#sync-workout-stats');
                    if (syncBtn) {
                        syncBtn.addEventListener('click', () => {
                            // Calculate total duration and calories
                            let totalMinutes = 0;
                            let totalCalories = 0;
                            
                            workouts.forEach(workout => {
                                // Extract minutes from duration string (e.g. "45 phút")
                                const durationMatch = workout.duration.match(/^(\d+)/);
                                if (durationMatch) {
                                    const minutes = parseInt(durationMatch[1]);
                                    totalMinutes += minutes;
                                    
                                    // Estimate calories based on workout type and duration
                                    let caloriesPerMinute = 0;
                                    switch(workout.type) {
                                        case 'cardio':
                                            caloriesPerMinute = 8;
                                            break;
                                        case 'strength':
                                            caloriesPerMinute = 6;
                                            break;
                                        case 'flexibility':
                                            caloriesPerMinute = 3;
                                            break;
                                        case 'hiit':
                                            caloriesPerMinute = 10;
                                            break;
                                        default:
                                            caloriesPerMinute = 5;
                                    }
                                    
                                    totalCalories += minutes * caloriesPerMinute;
                                }
                            });
                            
                            // Update stats
                            const stats = JSON.parse(localStorage.getItem('fitness-stats')) || {
                                calories: { today: 0, week: 0, month: 0 },
                                workoutTime: { today: 0, week: 0, month: 0 },
                                steps: { today: 0, week: 0, month: 0 },
                                activeDays: { streak: 0, thisWeek: 0, thisMonth: 0 }
                            };
                            
                            stats.calories.today += totalCalories;
                            stats.calories.week += totalCalories;
                            stats.calories.month += totalCalories;
                            
                            stats.workoutTime.today += totalMinutes;
                            stats.workoutTime.week += totalMinutes;
                            stats.workoutTime.month += totalMinutes;
                            
                            // Save updated stats
                            localStorage.setItem('fitness-stats', JSON.stringify(stats));
                            
                            // Update stats display
                            updateStatsDisplay(stats);
                            
                            Swal.close();
                            Swal.fire({
                                title: 'Đã đồng bộ!',
                                text: `Đã thêm ${totalMinutes} phút tập luyện và ${totalCalories} calo đã đốt`,
                                icon: 'success',
                                timer: 2000,
                                showConfirmButton: false
                            });
                        });
                    }
                    
                    // Add new workout
                    const addBtn = Swal.getPopup().querySelector('#add-calendar-workout');
                    if (addBtn) {
                        addBtn.addEventListener('click', () => {
                            Swal.close();
                            
                            // Show workout form
                            Swal.fire({
                                title: 'Thêm buổi tập',
                                html: `
                                    <div class="mb-3">
                                        <label class="form-label">Tên buổi tập</label>
                                        <input type="text" id="workout-name" class="form-control" placeholder="Ví dụ: Chạy bộ buổi sáng">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Loại bài tập</label>
                                        <select id="workout-type" class="form-select">
                                            <option value="cardio">Cardio</option>
                                            <option value="strength">Sức mạnh</option>
                                            <option value="flexibility">Linh hoạt</option>
                                            <option value="hiit">HIIT</option>
                                        </select>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Thời gian</label>
                                        <input type="text" id="workout-time" class="form-control" placeholder="Ví dụ: 7:00 AM">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Thời lượng (phút)</label>
                                        <input type="number" id="workout-duration" class="form-control" value="30" min="5" max="240">
                                    </div>
                                `,
                                showCancelButton: true,
                                confirmButtonText: 'Thêm',
                                cancelButtonText: 'Hủy',
                                focusConfirm: false,
                                preConfirm: () => {
                                    const name = document.getElementById('workout-name').value;
                                    const type = document.getElementById('workout-type').value;
                                    const time = document.getElementById('workout-time').value;
                                    const duration = parseInt(document.getElementById('workout-duration').value) || 0;
                                    
                                    if (!name || !time || duration <= 0) {
                                        Swal.showValidationMessage('Vui lòng điền đầy đủ thông tin');
                                        return false;
                                    }
                                    
                                    return { name, type, time, duration };
                                }
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    const { name, type, time, duration } = result.value;
                                    
                                    // Get current date in proper format
                                    const now = new Date();
                                    const dateStr = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
                                    
                                    // Create new workout
                                    const newWorkout = {
                                        date: dateStr,
                                        name: name,
                                        type: type,
                                        time: time,
                                        duration: `${duration} phút`
                                    };
                                    
                                    // Add to existing workouts
                                    const allWorkouts = JSON.parse(localStorage.getItem('user-workouts')) || [];
                                    allWorkouts.push(newWorkout);
                                    localStorage.setItem('user-workouts', JSON.stringify(allWorkouts));
                                    
                                    // Refresh calendar
                                    generateCalendar(now.getMonth(), now.getFullYear());
                                    
                                    // Show success message
                                    Swal.fire({
                                        title: 'Đã thêm buổi tập!',
                                        icon: 'success',
                                        timer: 1500,
                                        showConfirmButton: false
                                    });
                                }
                            });
                        });
                    }
                }
            }
        }).then((result) => {
            if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
                // Show workout edit options
                Swal.fire({
                    title: 'Chỉnh sửa buổi tập',
                    text: 'Chọn hành động bạn muốn thực hiện:',
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Thêm buổi tập',
                    denyButtonText: 'Xóa buổi tập',
                    cancelButtonText: 'Hủy'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Add new workout - similar to the today's add functionality
                        Swal.fire({
                            title: 'Chức năng đang phát triển',
                            text: 'Tính năng thêm lịch tập cho ngày khác sẽ sớm ra mắt!',
                            icon: 'info'
                        });
                    } else if (result.isDenied) {
                        // Delete workouts for this day
                        Swal.fire({
                            title: 'Xóa buổi tập?',
                            text: 'Bạn có chắc chắn muốn xóa tất cả buổi tập cho ngày này?',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Xóa',
                            cancelButtonText: 'Hủy'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // Get date from dateStr (format: DD/MM/YYYY)
                                const [day, month, year] = dateStr.split('/');
                                const formattedDate = `${year}-${month}-${day}`;
                                
                                // Remove workouts for this day
                                const allWorkouts = JSON.parse(localStorage.getItem('user-workouts')) || [];
                                const updatedWorkouts = allWorkouts.filter(w => w.date !== formattedDate);
                                localStorage.setItem('user-workouts', JSON.stringify(updatedWorkouts));
                                
                                // Refresh calendar
                                generateCalendar(parseInt(month)-1, parseInt(year));
                                
                                Swal.fire({
                                    title: 'Đã xóa!',
                                    text: 'Buổi tập đã được xóa thành công',
                                    icon: 'success',
                                    timer: 1500,
                                    showConfirmButton: false
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    
    function getWorkoutData() {
        // Get workout data from localStorage or use empty array if none exists
        const workouts = JSON.parse(localStorage.getItem('user-workouts')) || [];
        
        // If no workouts exist yet, add some sample data for the current month
        if (workouts.length === 0) {
            // Get current date information
            const now = new Date();
            const currentMonth = now.getMonth() + 1;
            const currentYear = now.getFullYear();
            const today = now.getDate();
            
            // Create sample workouts for this month (going back 2 weeks)
            const sampleWorkouts = [];
            
            // Add past workouts for the previous 14 days
            for (let i = 14; i > 0; i--) {
                // Skip some days randomly to make it look realistic
                if (Math.random() > 0.6) continue;
                
                const workoutDate = new Date();
                workoutDate.setDate(today - i);
                
                // Only include if it's in the current month
                if (workoutDate.getMonth() + 1 !== currentMonth) continue;
                
                const day = workoutDate.getDate();
                const dateStr = `${currentYear}-${currentMonth}-${day}`;
                
                // Create 1-2 random workouts for this day
                const numWorkouts = Math.random() > 0.7 ? 2 : 1;
                
                for (let j = 0; j < numWorkouts; j++) {
                    // Pick a random workout type
                    const workoutTypes = ['cardio', 'strength', 'flexibility', 'hiit'];
                    const typeIndex = Math.floor(Math.random() * workoutTypes.length);
                    const type = workoutTypes[typeIndex];
                    
                    // Create workout details
                    const workout = {
                        date: dateStr,
                        type: type,
                        name: getRandomWorkoutName(type),
                        time: getRandomTime(),
                        duration: getRandomDuration(type)
                    };
                    
                    sampleWorkouts.push(workout);
                }
            }
            
            // Check if there's a check-in for today
            const lastCheckIn = localStorage.getItem('last-checkin-date');
            const todayStr = new Date().toDateString();
            
            if (lastCheckIn === todayStr) {
                // Add today's workout if checked in
                sampleWorkouts.push({
                    date: `${currentYear}-${currentMonth}-${today}`,
                    type: 'cardio',
                    name: 'Buổi tập hôm nay',
                    time: '7:00 AM',
                    duration: '45 phút'
                });
            }
            
            // Save to localStorage for future use
            localStorage.setItem('user-workouts', JSON.stringify(sampleWorkouts));
            
            return sampleWorkouts;
        }
        
        return workouts;
    }
    
    // Helper functions for generating random workout data
    function getRandomWorkoutName(type) {
        const names = {
            cardio: ['Chạy bộ', 'Đạp xe', 'HIIT Cardio', 'Bơi lội', 'Cardio buổi sáng'],
            strength: ['Tập ngực & vai', 'Tập chân', 'Tập lưng & tay', 'Toàn thân', 'Tập Core'],
            flexibility: ['Yoga buổi sáng', 'Yoga buổi tối', 'Giãn cơ', 'Pilates', 'Yoga Flow'],
            hiit: ['HIIT Circuit', 'HIIT Tabata', 'CrossFit', 'HIIT 7 phút', 'HIIT 30 phút']
        };
        
        const options = names[type];
        return options[Math.floor(Math.random() * options.length)];
    }
    
    function getRandomTime() {
        const hours = [6, 7, 8, 17, 18, 19, 20];
        const hour = hours[Math.floor(Math.random() * hours.length)];
        const minute = Math.random() > 0.5 ? '00' : '30';
        const ampm = hour < 12 ? 'AM' : 'PM';
        return `${hour > 12 ? hour - 12 : hour}:${minute} ${ampm}`;
    }
    
    function getRandomDuration(type) {
        let minutes;
        
        switch(type) {
            case 'cardio':
                minutes = [30, 45, 60][Math.floor(Math.random() * 3)];
                break;
            case 'strength':
                minutes = [45, 60, 75][Math.floor(Math.random() * 3)];
                break;
            case 'flexibility':
                minutes = [30, 45][Math.floor(Math.random() * 2)];
                break;
            case 'hiit':
                minutes = [15, 20, 25, 30][Math.floor(Math.random() * 4)];
                break;
            default:
                minutes = 30;
        }
        
        return `${minutes} phút`;
    }
    }
    
    // Check for user authentication
    function checkAuthentication() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const currentUser = localStorage.getItem('currentUser');
    
    if (users.length === 0 || !currentUser) {
        Swal.fire({
            title: 'Bạn chưa đăng nhập!',
            text: 'Đang chuyển hướng đến trang đăng nhập...',
            icon: 'warning',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
        }).then(() => {
            window.location.href = 'index.html';
        });
    }
}

// Initialize real-time statistics display
function initRealTimeStats() {
    // Cấu trúc dữ liệu thống kê
    const stats = JSON.parse(localStorage.getItem('fitness-stats')) || {
        calories: { today: 0, week: 0, month: 0 },
        steps: { today: 0, week: 0, month: 0 },
        workoutTime: { today: 0, week: 0, month: 0 },
        heartRate: { current: 0, min: 0, max: 0 },
        weight: { current: 0, history: [] }
    };

    // Cập nhật thống kê mỗi phút
    function updateRealTimeStats() {
        // Cập nhật thời gian hiện tại
        const now = new Date();
        document.getElementById('current-time').textContent = 
            now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

        // Kiểm tra và reset số liệu hàng ngày vào lúc 0:00
        const lastUpdate = localStorage.getItem('last-stats-update');
        if (lastUpdate) {
            const lastDate = new Date(lastUpdate);
            if (lastDate.getDate() !== now.getDate()) {
                resetDailyStats();
            }
        }
        localStorage.setItem('last-stats-update', now.toISOString());

        // Cập nhật giao diện
        updateStatsDisplay(stats);
    }

    // Reset số liệu hàng ngày
    function resetDailyStats() {
        // Lưu số liệu cũ vào lịch sử
        const dailyStats = {
            date: new Date().toISOString(),
            calories: stats.calories.today,
            steps: stats.steps.today,
            workoutTime: stats.workoutTime.today
        };
        
        const history = JSON.parse(localStorage.getItem('stats-history')) || [];
        history.unshift(dailyStats);
        localStorage.setItem('stats-history', JSON.stringify(history.slice(0, 30))); // Giữ 30 ngày

        // Reset số liệu hôm nay
        stats.calories.today = 0;
        stats.steps.today = 0;
        stats.workoutTime.today = 0;
        
        // Cập nhật localStorage
        localStorage.setItem('fitness-stats', JSON.stringify(stats));
    }

    // Xử lý click vào các mục thống kê
    function setupStatsClickHandlers() {
        const statItems = document.querySelectorAll('.stat-item');
        statItems.forEach(item => {
            item.addEventListener('click', function() {
                const statType = this.getAttribute('data-stat-type');
                const period = this.getAttribute('data-period') || 'today';
                showDetailedStats(statType, period);
            });
        });
    }

    // Hiển thị chi tiết thống kê
    function showDetailedStats(type, period) {
        const history = JSON.parse(localStorage.getItem('stats-history')) || [];
        let chartData;
        let chartOptions;

        switch(period) {
            case 'today':
                // Hiển thị dữ liệu theo giờ trong ngày
                chartData = generateHourlyData(type);
                chartOptions = {
                    title: `Thống kê ${getStatTypeName(type)} hôm nay`,
                    xAxis: 'Giờ',
                    yAxis: getStatUnit(type)
                };
                break;
            
            case 'week':
                // Hiển thị dữ liệu 7 ngày gần nhất
                chartData = generateWeeklyData(type, history);
                chartOptions = {
                    title: `Thống kê ${getStatTypeName(type)} tuần này`,
                    xAxis: 'Ngày',
                    yAxis: getStatUnit(type)
                };
                break;
            
            case 'month':
                // Hiển thị dữ liệu 30 ngày gần nhất
                chartData = generateMonthlyData(type, history);
                chartOptions = {
                    title: `Thống kê ${getStatTypeName(type)} tháng này`,
                    xAxis: 'Ngày',
                    yAxis: getStatUnit(type)
                };
                break;
        }

        // Hiển thị biểu đồ thống kê
        Swal.fire({
            title: chartOptions.title,
            html: `
                <div class="chart-container" style="position: relative; height:60vh; width:100%">
                    <canvas id="statsChart"></canvas>
                </div>
                <div class="stats-summary mt-3">
                    <div class="row text-center">
                        <div class="col">
                            <h6>Trung bình</h6>
                            <p class="mb-0">${calculateAverage(chartData.data)}</p>
                        </div>
                        <div class="col">
                            <h6>Cao nhất</h6>
                            <p class="mb-0">${Math.max(...chartData.data)}</p>
                        </div>
                        <div class="col">
                            <h6>Thấp nhất</h6>
                            <p class="mb-0">${Math.min(...chartData.data)}</p>
                        </div>
                    </div>
                </div>
            `,
            width: '80%',
            didOpen: () => {
                const ctx = document.getElementById('statsChart').getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: chartData.labels,
                        datasets: [{
                            label: getStatTypeName(type),
                            data: chartData.data,
                            borderColor: getStatColor(type),
                            backgroundColor: getStatColor(type, 0.1),
                            fill: true,
                            tension: 0.4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: chartOptions.yAxis
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: chartOptions.xAxis
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            }
                        }
                    }
                });
            }
        });
    }

    // Tạo dữ liệu theo giờ
    function generateHourlyData(type) {
        const hours = Array.from({length: 24}, (_, i) => i);
        const data = hours.map(() => Math.floor(Math.random() * 100)); // Mô phỏng dữ liệu
        
        return {
            labels: hours.map(h => `${h}:00`),
            data: data
        };
    }

    // Tạo dữ liệu theo tuần
    function generateWeeklyData(type, history) {
        const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        const data = days.map(() => Math.floor(Math.random() * 100)); // Mô phỏng dữ liệu
        
        return {
            labels: days,
            data: data
        };
    }

    // Tạo dữ liệu theo tháng
    function generateMonthlyData(type, history) {
        const daysInMonth = 30;
        const data = Array.from({length: daysInMonth}, () => Math.floor(Math.random() * 100)); // Mô phỏng dữ liệu
        
        return {
            labels: Array.from({length: daysInMonth}, (_, i) => i + 1),
            data: data
        };
    }

    // Các hàm tiện ích
    function getStatTypeName(type) {
        const names = {
            calories: 'Calories',
            steps: 'Số bước chân',
            workoutTime: 'Thời gian tập',
            heartRate: 'Nhịp tim',
            weight: 'Cân nặng'
        };
        return names[type] || type;
    }

    function getStatUnit(type) {
        const units = {
            calories: 'kcal',
            steps: 'bước',
            workoutTime: 'phút',
            heartRate: 'bpm',
            weight: 'kg'
        };
        return units[type] || '';
    }

    function getStatColor(type, alpha = 1) {
        const colors = {
            calories: `rgba(255, 99, 132, ${alpha})`,
            steps: `rgba(54, 162, 235, ${alpha})`,
            workoutTime: `rgba(75, 192, 192, ${alpha})`,
            heartRate: `rgba(255, 159, 64, ${alpha})`,
            weight: `rgba(153, 102, 255, ${alpha})`
        };
        return colors[type] || `rgba(201, 203, 207, ${alpha})`;
    }

    function calculateAverage(numbers) {
        return (numbers.reduce((a, b) => a + b, 0) / numbers.length).toFixed(1);
    }

    // Khởi tạo cập nhật thời gian thực
    updateRealTimeStats();
    setInterval(updateRealTimeStats, 60000); // Cập nhật mỗi phút

    // Thiết lập xử lý click
    setupStatsClickHandlers();
}

// Hàm đồng bộ dữ liệu với thiết bị
function syncDataWithDevices() {
    const syncButton = document.getElementById('sync-devices-btn');
    if (syncButton) {
        syncButton.addEventListener('click', function() {
            // Tạo mã đồng bộ ngẫu nhiên
            const syncCode = generateSyncCode();
            
            Swal.fire({
                title: 'Đồng bộ thiết bị',
                html: `
                    <div class="text-center mb-4">
                        <h5>Mã đồng bộ của bạn:</h5>
                        <div class="sync-code mb-3" style="font-size: 32px; letter-spacing: 5px;">${syncCode}</div>
                        <small class="text-muted">Mã có hiệu lực trong 5 phút</small>
                        <hr>
                        <button class="btn btn-primary mt-3" id="enter-code-btn">
                            <i class="fas fa-key me-2"></i>Nhập mã thiết bị khác
                        </button>
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: 'Đóng',
                cancelButtonText: 'Hủy đồng bộ',
                didOpen: () => {
                    // Xử lý nút nhập mã
                    document.getElementById('enter-code-btn').addEventListener('click', () => {
                        showSyncCodeInput();
                    });
                }
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.cancel) {
                    // Hủy đồng bộ
                    localStorage.removeItem('sync-code');
                    localStorage.removeItem('last-sync-time');
                    
                    Swal.fire({
                        title: 'Đã hủy đồng bộ',
                        text: 'Tất cả kết nối đồng bộ đã được hủy',
                        icon: 'info',
                        timer: 2000,
                        showConfirmButton: false
                    });
                }
            });
        });
    }
}

// Tạo mã đồng bộ ngẫu nhiên
function generateSyncCode() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    // Lưu mã đồng bộ vào localStorage
    localStorage.setItem('sync-code', code);
    localStorage.setItem('sync-code-timestamp', new Date().getTime());
    return code;
}

// Hiển thị form nhập mã đồng bộ
function showSyncCodeInput() {
    Swal.fire({
        title: 'Nhập mã đồng bộ',
        input: 'text',
        inputAttributes: {
            maxlength: 6,
            autocapitalize: 'off',
            autocorrect: 'off',
            placeholder: 'Nhập mã 6 ký tự'
        },
        showCancelButton: true,
        confirmButtonText: 'Đồng bộ',
        cancelButtonText: 'Hủy',
        inputValidator: (value) => {
            if (!value) {
                return 'Vui lòng nhập mã đồng bộ!';
            }
            if (value.length !== 6) {
                return 'Mã đồng bộ phải có 6 ký tự!';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            handleSyncCode(result.value.toUpperCase());
        }
    });
}

// Xử lý mã đồng bộ
function handleSyncCode(code) {
    // Kiểm tra mã đồng bộ
    const storedCode = localStorage.getItem('sync-code');
    const timestamp = localStorage.getItem('sync-code-timestamp');
    const now = new Date().getTime();
    
    // Kiểm tra tính hợp lệ của mã (5 phút)
    if (storedCode && timestamp && (now - timestamp) < 300000) {
        if (code === storedCode) {
            // Đồng bộ thành công
            const syncData = {
                lastSync: now,
                stats: JSON.parse(localStorage.getItem('fitness-stats')),
                workouts: JSON.parse(localStorage.getItem('user-workouts')),
                goals: JSON.parse(localStorage.getItem('fitness-goals'))
            };
            
            // Lưu thời gian đồng bộ
            localStorage.setItem('last-sync-time', now);
            
            // Hiển thị thông báo thành công
            Swal.fire({
                title: 'Đồng bộ thành công!',
                html: `
                    <div class="text-start">
                        <p><i class="fas fa-check-circle text-success me-2"></i>Thống kê tập luyện</p>
                        <p><i class="fas fa-check-circle text-success me-2"></i>Lịch sử buổi tập</p>
                        <p><i class="fas fa-check-circle text-success me-2"></i>Mục tiêu cá nhân</p>
                    </div>
                `,
                icon: 'success',
                timer: 3000,
                showConfirmButton: false
            });
            
            // Cập nhật giao diện
            updateStatsDisplay(syncData.stats);
            generateCalendar(currentYear, currentMonth);
            updateGoalDisplay(syncData.goals);
        } else {
            // Mã không đúng
            Swal.fire({
                title: 'Mã không hợp lệ',
                text: 'Vui lòng kiểm tra lại mã đồng bộ',
                icon: 'error',
                timer: 2000,
                showConfirmButton: false
            });
        }
    } else {
        // Mã hết hạn
        Swal.fire({
            title: 'Mã đã hết hạn',
            text: 'Vui lòng tạo mã đồng bộ mới',
            icon: 'warning',
            timer: 2000,
            showConfirmButton: false
        });
    }
}

// ... existing code ...
