// Initialize AOS animations
document.addEventListener('DOMContentLoaded', function() {
    AOS.init();
});

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
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Vui lòng điền đầy đủ thông tin!',
            confirmButtonColor: '#3085d6'
        });
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Email không hợp lệ!',
            confirmButtonColor: '#3085d6'
        });
        return;
    }
    
    // Password validation - at least 6 characters
    if (password.length < 6) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Mật khẩu phải có ít nhất 6 ký tự!',
            confirmButtonColor: '#3085d6'
        });
        return;
    }
    
    // Check if user exists
    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some(user => user.email === email)) {
        Swal.fire({
            icon: 'warning',
            title: 'Email đã tồn tại!',
            text: 'Vui lòng sử dụng email khác hoặc đăng nhập.',
            confirmButtonColor: '#3085d6'
        });
        return;
    }
    
    // Save user to localStorage
    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    
    Swal.fire({
        icon: 'success',
        title: 'Đăng ký thành công!',
        text: 'Hãy đăng nhập để tiếp tục.',
        confirmButtonColor: '#3085d6'
    }).then((result) => {
        // Clear form and switch to sign in
        this.reset();
        container.classList.remove("right-panel-active");
    });
});

// Sign In Form Handling
document.querySelector('.sign-in-container form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = this.querySelector('input[type="email"]').value;
    const password = this.querySelector('input[type="password"]').value;
    
    // Validate fields
    if (!email || !password) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Vui lòng điền đầy đủ thông tin!',
            confirmButtonColor: '#3085d6'
        });
        return;
    }
    
    // Check user credentials
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(user => user.email === email && user.password === password);
    
    if (user) {
        // Store current user in localStorage
        localStorage.setItem("currentUser", JSON.stringify(user));
        
        Swal.fire({
            icon: 'success',
            title: 'Đăng nhập thành công!',
            text: 'Đang chuyển hướng...',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false
        }).then(() => {
            // Redirect to home page
            window.location.href = "home.html";
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi đăng nhập',
            text: 'Sai email hoặc mật khẩu!',
            confirmButtonColor: '#3085d6'
        });
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