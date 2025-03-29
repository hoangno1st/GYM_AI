// Animation for Sign In/Sign Up form toggle
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

// Sign Up Form Handling
document.querySelector('.sign-up-container form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const password = this.querySelector('input[type="password"]').value;
    
    // Validate all fields
    if (!name || !email || !password) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Email không hợp lệ!");
        return;
    }
    
    // Password validation - at least 6 characters
    if (password.length < 6) {
        alert("Mật khẩu phải có ít nhất 6 ký tự!");
        return;
    }
    
    // Check if user exists
    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some(user => user.email === email)) {
        alert("Email đã tồn tại!");
        return;
    }
    
    // Save user to localStorage
    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    
    alert("Đăng ký thành công! Hãy đăng nhập.");
    
    // Clear form and switch to sign in
    this.reset();
    container.classList.remove("right-panel-active");
});

// Sign In Form Handling
document.querySelector('.sign-in-container form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = this.querySelector('input[type="email"]').value;
    const password = this.querySelector('input[type="password"]').value;
    
    // Validate fields
    if (!email || !password) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }
    
    // Check user credentials
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(user => user.email === email && user.password === password);
    
    if (user) {
        // Store current user in localStorage
        localStorage.setItem("currentUser", JSON.stringify(user));
        
        alert("Đăng nhập thành công!");
        
        // Redirect to home page
        window.location.href = "home.html";
    } else {
        alert("Sai email hoặc mật khẩu!");
    }
});

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    
    if (currentUser) {
        // Redirect to home page if user is already logged in
        window.location.href = "home.html";
    }
});
