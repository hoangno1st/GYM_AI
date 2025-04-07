# Gym Bro - Ứng dụng Thể hình

Gym Bro là ứng dụng theo dõi thể hình và kết nối cộng đồng giúp người dùng quản lý các bài tập, dinh dưỡng và kết nối với những người khác.

## Tính năng

- Xác thực người dùng và quản lý hồ sơ
- Theo dõi và lập kế hoạch tập luyện
- Ghi nhận và phân tích dinh dưỡng
- Hiển thị tiến độ bằng biểu đồ
- Tích hợp cộng đồng

## Các Framework và Công cụ

Ứng dụng này sử dụng nhiều framework và công cụ hiện đại:

### Frontend Frameworks

- **Bootstrap 5** - Giao diện responsive và hệ thống grid
- **AOS (Animate On Scroll)** - Hiệu ứng animation khi cuộn trang
- **Chart.js** - Hiển thị biểu đồ dữ liệu theo dõi tiến độ
- **Font Awesome** - Thư viện icon phong phú
- **SweetAlert2** - Thay thế alert JavaScript với giao diện đẹp mắt

### Công cụ phát triển

- **Vite** - Server phát triển nhanh và tối ưu build
- **NPM** - Quản lý thư viện
- **Lite Server** - Server nhẹ cho phát triển

## Bắt đầu sử dụng

### Cài đặt

1. Cài đặt Node.js (nếu chưa có): [Tải Node.js](https://nodejs.org/)
2. Mở terminal/command prompt và di chuyển đến thư mục dự án
3. Chạy lệnh cài đặt:

```bash
npm install
```

4. Chạy lệnh thiết lập:

```bash
npm run setup
```

### Chạy ứng dụng

Chạy ứng dụng trong môi trường phát triển:

```bash
npm run dev
```

Hoặc sử dụng lite-server:

```bash
npm start
```

### Build cho production

Để tạo phiên bản production:

```bash
npm run build
```

Output sẽ được lưu trong thư mục `dist`.

## Giải quyết lỗi thường gặp

1. **Lỗi "không chạy được"**:
   - Kiểm tra Node.js đã cài đặt chưa: `node -v`
   - Đảm bảo đã chạy `npm install` để cài đặt các thư viện
   - Nếu gặp lỗi với Vite, thử dùng `npm start` để chạy lite-server

2. **Không hiện logo**:
   - Đảm bảo file logo.png có trong thư mục images
   - Nếu không có, tạo hoặc thêm một hình ảnh logo vào thư mục

3. **Animation không hoạt động**:
   - Kiểm tra console để tìm lỗi
   - Đảm bảo AOS đã được khởi tạo trong file JS

## Cấu trúc dự án

- `index.html` - Trang đăng nhập/đăng ký
- `home.html` - Trang chính
- `workouts.html` - Theo dõi bài tập
- `nutrition.html` - Theo dõi dinh dưỡng
- `profile.html` - Hồ sơ người dùng
- `settings.html` - Cài đặt
- `*.js` - Các file JavaScript cho từng trang
- `*.css` - Các file CSS cho từng trang 