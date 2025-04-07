// Initialize language selector functionality
function initLanguageSelector() {
  const langButtons = document.querySelectorAll(".lang-btn");
  console.log("Language buttons found:", langButtons.length);

  if (langButtons.length === 0) {
    console.error("No language buttons found. Check your HTML structure.");
    return;
  }

  // Add click event handlers to language buttons
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.onclick = function (e) {
      e.preventDefault();
      const lang = this.getAttribute("data-lang");
      console.log("Language button clicked:", lang);

      // Update visual state
      document.querySelectorAll(".lang-btn").forEach((b) => {
        b.classList.remove("active");
      });
      this.classList.add("active");

      // Save preference
      localStorage.setItem("gymBroLanguage", lang);

      // Apply translations
      try {
        applyTranslations(lang);

        // Show notification if SweetAlert2 is available
        if (typeof Swal !== "undefined") {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title:
              lang === "en"
                ? "Language changed to English"
                : "Đã chuyển sang Tiếng Việt",
            showConfirmButton: false,
            timer: 1500,
            toast: true,
          });
        }
      } catch (error) {
        console.error("Error applying translations:", error);
        if (typeof Swal !== "undefined") {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Error changing language",
            text: error.message,
            showConfirmButton: true,
            toast: true,
          });
        }
      }

      return false;
    };
  });

  // Set initial language from localStorage or default to 'en'
  const savedLang = localStorage.getItem("gymBroLanguage") || "en";
  console.log("Initial language:", savedLang);

  // Apply initial language
  try {
    applyTranslations(savedLang);
    // Update active button
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      if (btn.getAttribute("data-lang") === savedLang) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  } catch (error) {
    console.error("Error applying initial translations:", error);
  }
}

// Apply translations based on selected language
function applyTranslations(lang) {
  const translations = {
    en: {
      home: "HOME",
      workouts: "WORKOUTS",
      nutrition: "NUTRITION",
      community: "COMMUNITY",
      settings: "Settings",
      profile: "Profile",
      logout: "Logout",
      welcome: "Welcome to Gym Bro",
      companion: "Your ultimate fitness companion",
      startWorkout: "Start Workout",
      todaysTips: "Today's Tips",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
      dailyTips: "Daily Fitness Tips",
      personalGoals: "Personal Goals",
      weight: "Weight",
      current: "Current",
      target: "Target",
      update: "Update",
      syncDevice: "Sync from device",
      workoutSessions: "Workout Sessions",
      remaining: "remaining to reach goal",
      water: "Water",
      drank: "Drank",
      reset: "Reset",
      sync: "Sync",
      workoutCalendar: "Workout Calendar",
      quickStats: "Quick Stats",
      caloriesBurned: "Calories Burned",
      workoutTime: "Workout Time",
      achievements: "Achievements",
      currentStreak: "Current Streak",
      quickLinks: "Quick Links",
      contactUs: "Contact Us",
    },
    vi: {
      home: "TRANG CHỦ",
      workouts: "BÀI TẬP",
      nutrition: "DINH DƯỠNG",
      community: "CỘNG ĐỒNG",
      settings: "Cài đặt",
      profile: "Hồ sơ",
      logout: "Đăng xuất",
      welcome: "Chào mừng đến Gym Bro",
      companion: "Người bạn tập luyện của bạn",
      startWorkout: "Bắt đầu tập",
      todaysTips: "Mẹo hôm nay",
      hours: "Giờ",
      minutes: "Phút",
      seconds: "Giây",
      dailyTips: "Mẹo tập luyện hàng ngày",
      personalGoals: "Mục tiêu cá nhân",
      weight: "Cân nặng",
      current: "Hiện tại",
      target: "Mục tiêu",
      update: "Cập nhật",
      syncDevice: "Đồng bộ từ thiết bị",
      workoutSessions: "Buổi tập",
      remaining: "còn lại để đạt mục tiêu",
      water: "Nước",
      drank: "Đã uống",
      reset: "Đặt lại",
      sync: "Đồng bộ",
      workoutCalendar: "Lịch tập luyện",
      quickStats: "Thống kê nhanh",
      caloriesBurned: "Calo đã đốt",
      workoutTime: "Thời gian tập",
      achievements: "Thành tích",
      currentStreak: "Chuỗi ngày hiện tại",
      quickLinks: "Liên kết nhanh",
      contactUs: "Liên hệ",
    },
  };

  // Get the translation for this language
  const t = translations[lang] || translations.en;

  try {
    // Helper function to safely update text content
    function updateTextSafely(selector, text) {
      try {
        const element = document.querySelector(selector);
        if (element) {
          element.textContent = text;
        }
      } catch (err) {
        console.warn(`Failed to update ${selector}:`, err);
      }
    }

    // Navigation
    const navHome = document.querySelector(
      '.nav-link[href="home.html"] i + span'
    );
    if (navHome) navHome.textContent = ` ${t.home}`;

    const navWorkouts = document.querySelector(
      '.nav-link[href="workouts.html"] i + span'
    );
    if (navWorkouts) navWorkouts.textContent = ` ${t.workouts}`;

    const navNutrition = document.querySelector(
      '.nav-link[href="nutrition.html"] i + span'
    );
    if (navNutrition) navNutrition.textContent = ` ${t.nutrition}`;

    const navCommunity = document.querySelector(
      '.nav-link[href="community.html"] i + span'
    );
    if (navCommunity) navCommunity.textContent = ` ${t.community}`;

    // Settings menu
    const settingsLink = document.querySelector(
      'a[href="settings.html"] i + span'
    );
    if (settingsLink) settingsLink.textContent = ` ${t.settings}`;

    const profileLink = document.querySelector(
      'a[href="profile.html"] i + span'
    );
    if (profileLink) profileLink.textContent = ` ${t.profile}`;

    const logoutLink = document.querySelector("#logout-link i + span");
    if (logoutLink) logoutLink.textContent = ` ${t.logout}`;

    // Page specific translations
    // Only translate elements that exist on the current page

    // Home page elements
    const heroTitle = document.querySelector(".hero-content h1");
    if (heroTitle) heroTitle.textContent = t.welcome;

    const heroSubtitle = document.querySelector(".hero-content p");
    if (heroSubtitle) heroSubtitle.textContent = t.companion;

    const startBtn = document.querySelector(".btn-start");
    if (startBtn) startBtn.textContent = t.startWorkout;

    const tipsBtn = document.querySelector(".btn-tips");
    if (tipsBtn) tipsBtn.textContent = t.todaysTips;

    // Time labels
    const timeLabels = document.querySelectorAll(".time-label");
    if (timeLabels && timeLabels.length >= 3) {
      timeLabels[0].textContent = t.hours;
      timeLabels[1].textContent = t.minutes;
      timeLabels[2].textContent = t.seconds;
    }

    // Section titles
    updateTextSafely("#daily-tips h2", t.dailyTips);
    updateTextSafely(".goals-section h2", t.personalGoals);
    updateTextSafely(".calendar-section h2", t.workoutCalendar);
    updateTextSafely(".stats-section h2", t.quickStats);

    console.log("Translation applied successfully to language:", lang);
    return true;
  } catch (error) {
    console.error("Error in applyTranslations:", error);
    throw new Error(`Translation error: ${error.message}`);
  }
}

// Initialize language selector when DOM is loaded
document.addEventListener("DOMContentLoaded", initLanguageSelector);
