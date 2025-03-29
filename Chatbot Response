document.addEventListener('DOMContentLoaded', function() {
    // User dropdown functionality
    const userProfile = document.getElementById('user-profile');
    const userDropdown = document.getElementById('user-dropdown');
    
    userProfile.addEventListener('click', function(e) {
        e.preventDefault();
        userDropdown.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!userProfile.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.classList.remove('active');
        }
    });
    
    // Logout functionality
    const logoutLink = document.getElementById('logout-link');
    logoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('currentUser'); // Xóa thông tin người dùng hiện tại
        window.location.href = 'index.html'; // Chuyển hướng về trang đăng nhập
    });

    // Carousel functionality
    const tips = document.querySelectorAll('.tip');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prev-tip');
    const nextBtn = document.getElementById('next-tip');
    let currentTip = 0;
    
    function showTip(index) {
        tips.forEach(tip => tip.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        tips[index].classList.add('active');
        dots[index].classList.add('active');
    }
    
    nextBtn.addEventListener('click', function() {
        currentTip = (currentTip + 1) % tips.length;
        showTip(currentTip);
    });
    
    prevBtn.addEventListener('click', function() {
        currentTip = (currentTip - 1 + tips.length) % tips.length;
        showTip(currentTip);
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentTip = index;
            showTip(currentTip);
        });
    });
    
    setInterval(function() {
        currentTip = (currentTip + 1) % tips.length;
        showTip(currentTip);
    }, 5000);
    
    // Chatbot functionality
    const chatButton = document.getElementById('chat-button');
    const chatbotContainer = document.getElementById('chatbot-container');
    const closeChat = document.getElementById('close-chat');
    const chatMessages = document.getElementById('chatbot-messages');
    const chatInput = document.getElementById('chat-input');
    const sendMessage = document.getElementById('send-message');
    
    chatButton.addEventListener('click', function() {
        chatbotContainer.classList.add('active');
        chatInput.focus();
    });
    
    closeChat.addEventListener('click', function() {
        chatbotContainer.classList.remove('active');
    });
    
    function handleSendMessage() {
        const message = chatInput.value.trim();
        
        if (message !== '') {
            addMessage(message, 'user');
            chatInput.value = '';
            setTimeout(() => {
                const response = generateResponse(message);
                addMessage(response, 'bot');
            }, 600);
        }
    }
    
    sendMessage.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });
    
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.textContent = text;
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    
    
    
    // Check for user authentication
    function checkAuthentication() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const currentUser = localStorage.getItem('currentUser');
        if (users.length === 0 || !currentUser) {
            window.location.href = 'index.html';
        }
    }
    
    checkAuthentication();
});
//HOME.HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gym Bro - Home</title>

    <!-- Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

    <!-- External CSS -->
    <link rel="stylesheet" href="home.css">
</head>
<body>
    <header>
        <div class="logo-container">
            <img src="images/logo.png" alt="Gym Bro Logo" width="150px">
        </div>
        <nav>
            <ul>
                <li class="active"><a href="home.html"><i class="fas fa-home"></i> Home</a></li>
                <li><a href="workouts.html"><i class="fas fa-dumbbell"></i> Workouts</a></li>
                <li><a href="nutrition.html"><i class="fas fa-apple-alt"></i> Nutrition</a></li>
                <li><a href="progress.html"><i class="fas fa-chart-line"></i> Progress</a></li>
                <li><a href="community.html"><i class="fas fa-users"></i> Community</a></li>
            </ul>
        </nav>
        <!-- Trong phần header, sửa đổi user-dropdown -->
<div class="user-actions">
    <a href="#" id="user-profile"><i class="fas fa-user-circle"></i></a>
    <div class="user-dropdown" id="user-dropdown">
        <a href="settings.html"><i class="fas fa-cog"></i> Settings</a>
        <a href="profile.html"><i class="fas fa-user"></i> Profile</a>
        <a href="#" id="logout-link"><i class="fas fa-sign-out-alt"></i> Logout</a>
    </div>
</div>
    </header>

    <main>
        <section class="hero">
            <h1>Welcome to Gym Bro</h1>
            <p>Your ultimate fitness companion</p>
            <div class="cta-buttons">
                <a href="workouts.html" class="cta-button">Start Workout</a>
                <a href="#daily-tips" class="cta-button secondary">Today's Tips</a>
            </div>
        </section>

        <section id="daily-tips" class="daily-tips">
            <h2>Daily Fitness Tips</h2>
            <div class="tips-carousel">
                <div class="tip active">
                    <div class="tip-icon"><i class="fas fa-water"></i></div>
                    <h3>Stay Hydrated</h3>
                    <p>Drink at least 8 glasses of water daily for optimal performance.</p>
                </div>
                <div class="tip">
                    <div class="tip-icon"><i class="fas fa-bed"></i></div>
                    <h3>Quality Sleep</h3>
                    <p>Aim for 7-8 hours of sleep for better recovery and growth.</p>
                </div>
                <div class="tip">
                    <div class="tip-icon"><i class="fas fa-carrot"></i></div>
                    <h3>Protein Intake</h3>
                    <p>Consume 1.6-2.2g of protein per kg of bodyweight daily.</p>
                </div>
                <div class="carousel-controls">
                    <button id="prev-tip"><i class="fas fa-chevron-left"></i></button>
                    <div class="carousel-dots">
                        <span class="dot active"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                    </div>
                    <button id="next-tip"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
        </section>

        <section class="quick-access">
            <h2>Quick Access</h2>
            <div class="quick-access-grid">
                <a href="workouts.html" class="quick-access-card">
                    <i class="fas fa-dumbbell"></i>
                    <h3>Workouts</h3>
                    <p>Access your custom workouts</p>
                </a>
                <a href="nutrition.html" class="quick-access-card">
                    <i class="fas fa-apple-alt"></i>
                    <h3>Nutrition</h3>
                    <p>Track your meals and nutrition</p>
                </a>
                <a href="progress.html" class="quick-access-card">
                    <i class="fas fa-chart-line"></i>
                    <h3>Progress</h3>
                    <p>See your fitness journey</p>
                </a>
                <a href="community.html" class="quick-access-card">
                    <i class="fas fa-users"></i>
                    <h3>Community</h3>
                    <p>Connect with fitness buddies</p>
                </a>
            </div>
        </section>
    </main>

    <footer>
        <div class="footer-content">
            <div class="footer-logo">
                <img src="images/logo.png" alt="Gym Bro Logo" width="100px">
                <p>Your Ultimate Fitness Companion</p>
            </div>
            <div class="footer-links">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="home.html">Home</a></li>
                    <li><a href="workouts.html">Workouts</a></li>
                    <li><a href="nutrition.html">Nutrition</a></li>
                    <li><a href="progress.html">Progress</a></li>
                    <li><a href="community.html">Community</a></li>
                </ul>
            </div>
            <div class="footer-contact">
                <h3>Contact Us</h3>
                <p><i class="fas fa-envelope"></i> support@gymbro.com</p>
                <p><i class="fas fa-phone"></i> +1 234 567 8900</p>
                <div class="social-links">
                    <a href="#"><i class="fab fa-facebook"></i></a>
                    <a href="#"><i class="fab fa-instagram"></i></a>
                    <a href="#"><i class="fab fa-twitter"></i></a>
                    <a href="#"><i class="fab fa-youtube"></i></a>
                </div>
            </div>
        </div>
        <div class="copyright">
            <p>&copy; 2025 Gym Bro. All rights reserved.</p>
        </div>
    </footer>
    
    <!-- Chatbot TuDongChat -->
    <script src="https://app.tudongchat.com/js/chatbox.js"></script>
    <script>
        const tudong_chatbox = new TuDongChat('1ICbI-QN42_nETFL-xNzc');
        tudong_chatbox.initial();
    </script>

    <!-- JavaScript Files -->
    <script src="home.js"></script>
</body>
</html>
