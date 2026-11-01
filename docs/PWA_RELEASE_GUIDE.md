# 🚀 HƯỚNG DẪN PHÁT HÀNH ĐA NỀN TẢNG & PWA (PHASE 23)
## TONY MATH HERO – THE LEGEND OF SEVEN KINGDOMS
**Phiên bản: 23.0.0 (Cross-Platform PWA & Offline Release)**  
*Dành cho Người chơi Tony, Phụ huynh và Đội ngũ Kỹ thuật*

---

### 1. Tổng quan Kiến trúc Đa Nền Tảng (PWA & Offline-First)

Phiên bản **Tony Math Hero Phase 23** được đóng gói hoàn thiện để người chơi có thể trải nghiệm mượt mà trên **4 môi trường chính**:
1. **Điện thoại thông minh (Android & iPhone):** Tối ưu giao diện cảm ứng, nút bấm lớn, an toàn vùng tai thỏ (Safe Area), hỗ trợ cài đặt PWA ra Màn hình chính (Home Screen).
2. **Máy tính bảng (iPad & Android Tablet):** Hỗ trợ cảm ứng đa điểm, xoay ngang/dọc, camera 3D tối ưu không gian rộng.
3. **Máy tính PC & Laptop (Windows, macOS, Linux):** Điều khiển linh hoạt bằng bàn phím (số 1-4, Space, phím điều hướng) và chuột, đồ họa sắc nét 60 FPS.
4. **Chế độ Chạy Độc lập Ngoại tuyến (Single-File HTML):** Tệp `tony-math-hero.html` tự thân 100%, không cần kết nối mạng hay cài máy chủ web.

---

### 2. Cấu trúc Thư mục Đóng gói (Build Outputs)

Sau khi chạy lệnh `npm run build`, hệ thống tạo ra 2 định dạng phát hành:

```
tony-math-hero/
├── dist/                                 # THƯ MỤC TRIỂN KHAI HOSTING PWA
│   ├── index.html                        # App Shell PWA đã đóng gói (~3.9 MB)
│   ├── manifest.webmanifest              # Web App Manifest tiêu chuẩn
│   ├── manifest.json                     # Fallback Manifest
│   ├── sw.js                             # Service Worker quản lý bộ nhớ đệm
│   ├── _redirects                        # Cấu hình SPA routing cho Netlify/Cloudflare
│   ├── favicon.svg                       # Biểu tượng Hero Shield cho tab trình duyệt
│   ├── icons/                            # Bộ icon đa kích thước chuẩn PWA
│   │   ├── icon-192.png                  # Icon 192x192 cho Android / Web
│   │   ├── icon-512.png                  # Icon 512x512 cho Splash screen
│   │   ├── icon-maskable-512.png         # Icon thích ứng viền tròn cho Android
│   │   ├── apple-touch-icon.png          # Icon 180x180 cho iPhone & iPad
│   │   ├── icon.svg                      # Vector icon sắc nét mọi kích thước
│   │   └── icon-maskable.svg
│   └── tony-math-hero.html               # Bản HTML dự phòng trong dist
│
├── tony-math-hero.html                   # TỆP THỰC THI OFFLINE ĐỘC LẬP TẠI GỐC
├── vercel.json                           # Cấu hình triển khai tự động Vercel
└── docs/PWA_RELEASE_GUIDE.md             # Tài liệu này
```

---

### 3. Hướng dẫn Khởi chạy trên Máy tính

#### Cách 1: Chơi Ngay Lập Tức (Không cần cài đặt, không cần mạng)
1. Mở thư mục dự án trên máy tính.
2. Nhấp đúp chuột trực tiếp vào tệp `tony-math-hero.html`.
3. Trò chơi sẽ khởi động tức thì trong trình duyệt mặc định (Chrome, Edge, Firefox, Safari).

#### Cách 2: Chạy qua Máy chủ Phát triển (Development Server)
Dành cho việc trải nghiệm và kiểm thử tính năng qua mạng nội bộ:
```bash
# Điều hướng vào thư mục
cd tony-math-hero

# Cài đặt thư viện (nếu mới clone)
npm install

# Khởi chạy server phát triển
npm run dev
```
Trình duyệt sẽ mở tại `http://localhost:3388/`. Điện thoại và tablet cùng mạng Wi-Fi có thể truy cập qua IP hiển thị trên terminal (ví dụ `http://192.168.x.x:3388/`).

---

### 4. Hướng dẫn Triển khai lên Hosting Trực tuyến

Để Tony và bạn bè có thể truy cập qua đường link web và cài đặt PWA:

#### A. Triển khai lên Vercel (Khuyến nghị)
1. Dự án đã được tạo sẵn tệp `vercel.json` định cấu hình tự động SPA routing và cache headers cho `sw.js`.
2. Đẩy mã nguồn lên GitHub/GitLab.
3. Đăng nhập [vercel.com](https://vercel.com) -> Nhấn **"Add New Project"** -> Chọn repository.
4. Cấu hình build:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Nhấn **"Deploy"**. Trong vòng 30 giây, website PWA với chứng chỉ bảo mật HTTPS sẽ sẵn sàng!

#### B. Triển khai lên Netlify
1. Đăng nhập [netlify.com](https://www.netlify.com).
2. Kéo thả trực tiếp thư mục `dist/` vào khung tải lên của Netlify (Drop to deploy).
3. Tệp `public/_redirects` đã được copy sẵn vào `dist/` để tự động xử lý điều hướng URL.

#### C. Triển khai lên GitHub Pages
1. Trong `vite.config.ts`, kiểm tra `base: './'` (đã cấu hình sẵn).
2. Tải toàn bộ nội dung trong thư mục `dist/` lên nhánh `gh-pages` của repository.

---

### 5. Hướng dẫn Cài đặt PWA trên Điện thoại Android

1. Mở liên kết game trên trình duyệt **Google Chrome** hoặc **Cốc Cốc**.
2. Trên màn hình game, nhấn nút **"📲 CÀI ĐẶT ỨNG DỤNG (PWA)"** tại màn hình chính hoặc thanh công cụ trên cùng.
3. Hộp thoại hệ thống sẽ xuất hiện -> Nhấn **"Cài đặt"** (Install).
4. Biểu tượng **TONY MATH HERO** với Khiên Vàng Hoàng Gia sẽ xuất hiện trực tiếp trên Màn hình chính của điện thoại.
5. Khi mở từ icon này, game sẽ chạy ở chế độ **Toàn Màn Hình (Standalone)**, ẩn thanh địa chỉ và thanh công cụ của trình duyệt.

---

### 6. Hướng dẫn Cài đặt PWA trên iPhone & iPad (iOS Safari)

Hệ điều hành iOS của Apple sử dụng cơ chế riêng của trình duyệt Safari:
1. Mở trang web game bằng trình duyệt **Safari** (Lưu ý: Không dùng trình duyệt nhúng bên trong Facebook/Zalo).
2. Nhấn vào biểu tượng **Chia sẻ (Share)** hình ô vuông có mũi tên hướng lên `⎋` ở thanh điều hướng dưới cùng của Safari.
3. Cuộn danh sách tác vụ xuống và chọn **"Thêm vào Màn hình chính" (Add to Home Screen)** có biểu tượng dấu cộng `⊞`.
4. Nhấn nút **"Thêm" (Add)** ở góc trên bên phải màn hình.
5. Biểu tượng **Tony Math Hero** sẽ xuất hiện trên màn hình điện thoại, hoạt động mượt mà và độc lập như một ứng dụng từ App Store.

---

### 7. Hướng dẫn Cài đặt PWA trên Máy tính (Windows / macOS)

1. Mở game bằng trình duyệt **Google Chrome** hoặc **Microsoft Edge**.
2. Nhìn vào thanh địa chỉ (URL bar) ở góc trên bên phải:
   - Trên Chrome: Xuất hiện biểu tượng **Cài đặt TONY MATH HERO** (hình màn hình máy tính có mũi tên xuống).
   - Trên Edge: Xuất hiện biểu tượng **App Available (⊕)**.
3. Nhấp vào biểu tượng đó và chọn **"Cài đặt"**.
4. Ứng dụng sẽ được mở trong cửa sổ game độc lập, tự động tạo shortcut ngoài màn hình Desktop và trong Start Menu của Windows/Mac.

---

### 8. Hướng dẫn Chuẩn bị Tài nguyên Chơi Ngoại Tuyến (Offline Mode)

Mặc dù trò chơi đã tích hợp sẵn toàn bộ 115+ bộ đề, mô hình 3D thủ tục và công cụ tổng hợp âm thanh Web Audio API, phụ huynh và Tony có thể chủ động kiểm tra và lưu cache:
1. Tại Màn hình chính hoặc Menu Cài đặt, nhấn nút **"⚡ CHẾ ĐỘ NGOẠI TUYẾN"**.
2. Bảng điều khiển sẽ hiển thị:
   - Trạng thái kết nối: `🟢 Online` hoặc `🟡 Offline`.
   - Dung lượng bộ nhớ cache: hiển thị chính xác dung lượng lưu trữ trên máy.
   - Danh sách 5 phân hệ cốt lõi.
3. Nhấn nút **"TẢI TÀI NGUYÊN OFFLINE"**:
   - Hệ thống Service Worker sẽ nạp toàn bộ App Shell, icon và font chữ tiếng Việt vào Cache Storage.
   - Khi thanh tiến trình đạt 100%, thông báo xác nhận thành công sẽ xuất hiện.
   - Giờ đây bạn có thể hoàn toàn tắt Wi-Fi, bật chế độ máy bay và cho Tony chơi tự do!

---

### 9. Hướng dẫn Sao lưu & Khôi phục Dữ liệu Học tập (Backup & Restore)

Để đảm bảo dữ liệu không bị mất khi chuyển từ máy tính sang điện thoại hoặc đổi thiết bị:
1. **Cách xuất bản sao lưu:**
   - Mở **Cài đặt** (Settings) -> Kéo xuống mục **Sao lưu & Khôi phục dữ liệu (Schema 22.0.0)**.
   - Nhấn **"Tải file sao lưu (.json)"**.
   - Lưu tệp `tony-math-hero-backup-[ngày].json` về máy hoặc gửi qua email/Zalo.
2. **Cách nạp bản sao lưu trên thiết bị mới:**
   - Mở game trên điện thoại/máy tính mới.
   - Vào **Cài đặt** -> Chọn **"Nhập file khôi phục (.json)"** và chọn tệp đã lưu.
   - Dữ liệu cấp độ, Knowledge Crystals, điểm EXP và trang bị của Tony sẽ được khôi phục nguyên vẹn 100%!

---

### 10. Danh sách Giới hạn Hiện tại & Lưu ý Kỹ thuật

| Vấn đề | Tình trạng thực tế | Hướng dẫn xử lý |
| :--- | :--- | :--- |
| **Đồng bộ đám mây tự động** | Dữ liệu lưu cục bộ trong IndexedDB/LocalStorage của từng trình duyệt, chưa tự động đồng bộ xuyên thiết bị qua tài khoản cloud. | Phụ huynh dùng tính năng Xuất/Nhập file `.json` để chuyển dữ liệu giữa các máy rất nhanh chóng. |
| **Trình duyệt nhúng trên iOS** | Nếu mở link trong trình duyệt nhúng của app bên thứ ba (như Zalo, Facebook, Messenger), Apple chặn tính năng Service Worker và PWA Install. | Chọn "Mở trong trình duyệt Safari" để được hỗ trợ PWA đầy đủ nhất. |
| **Hiệu năng trên điện thoại đời cũ** | Các thiết bị di động cấu hình yếu có thể bị giảm khung hình nếu bật hiệu ứng tối đa. | Game đã tự động kích hoạt cấu hình đồ họa `MEDIUM` cho điện thoại. Phụ huynh có thể vào Cài đặt chuyển sang `LOW` hoặc bật `Giảm chuyển động` nếu cần tiết kiệm pin tối đa. |

---
*TONY MATH HERO – The Legend of Seven Kingdoms*  
*Bản quyền phát triển dành riêng cho hành trình chinh phục Toán học của Tony!*
