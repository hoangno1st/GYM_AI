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
