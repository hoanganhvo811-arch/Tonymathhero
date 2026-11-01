# ⚔️ TONY MATH HERO – THE LEGEND OF SEVEN KINGDOMS
### *PREMIUM 3D FANTASY REALISTIC RPG GAME UI (Lớp 2 & Lớp 3)*

> **Thông điệp:** *"THE POWER OF KNOWLEDGE. THE COURAGE OF A HERO."*

---

## 🌟 1. TỔNG QUAN DỰ ÁN

**Tony Math Hero – The Legend of Seven Kingdoms** là trò chơi nhập vai phiêu lưu RPG giả tưởng 3D trên Web, biến hành trình học Toán tiểu học (Lớp 2 và Lớp 3) thành một chuyến viễn chinh diệt quái, giải cứu vương quốc và thu thập 7 Viên Ngọc Tri Thức.

Toàn bộ giao diện được xây dựng theo chuẩn mực **Premium 3D Fantasy Realistic RPG**:
- **Bộ Nhận Diện Game:** Logo kim loại vàng chiseled, thanh kiếm song đấu runic và Đại Ngọc Tri Thức phát quang.
- **Nhân Vật Chiến Binh Tony:** Hình ảnh 3D realistic với tỷ lệ cơ thể chuẩn mực, gương mặt anh hùng thân thiện, giáp chiến binh, kiếm ánh bạc, khiên và áo choàng.
- **Hai Bộ Trang Phục Nhận Diện:**
  - **Grade 2 (The Little Hero):** Giáp bạc kết hợp xanh lục, phong cách chiến binh khám phá giữa rừng thiêng và vương quốc khởi nguyên.
  - **Grade 3 (The Legendary Hero):** Giáp xanh lam kết hợp vàng kim, phong cách chiến binh huyền thoại chinh phục núi cao và lâu đài huyền thoại.
- **Hệ Thống Hai Hành Trình Độc Lập:** Tiến trình, nhiệm vụ, ngân hàng câu hỏi và thành tích của Lớp 2 và Lớp 3 được lưu trữ riêng biệt trên IndexedDB và không bao giờ ghi đè lên nhau.

---

## 🚀 2. CÔNG NGHỆ SỬ DỤNG

| Công nghệ | Vai trò trong hệ thống |
|---|---|
| **React 19 + TypeScript** | Giao diện component hóa, quản lý kiểu dữ liệu chặt chẽ |
| **Vite 8** | Đóng gói siêu tốc, chạy trên cổng chuyên dụng **`3388`** tránh xung đột |
| **Three.js & Canvas Scenery** | Khung cảnh 3D thời gian thực: Đại Ngọc Tri Thức, vòng xuyến quang năng và 700 hạt sao |
| **React Router v7** | Điều hướng màn hình mượt mà với hoạt ảnh chuyển cảnh (FadeIn, CardEntrance) |
| **Zustand** | Quản lý trạng thái đa tầng: `PlayerStore`, `CampaignStore`, `ProgressStore`, `SettingsStore`, `InventoryStore` |
| **IndexedDB (`idb`)** | Lưu trữ hồ sơ hiệp sĩ và tiến trình độc lập với khóa tổng hợp `${playerId}_${campaignId}` |
| **Web Audio API Engine** | Tổng hợp âm thanh SFX kim loại, chime lướt chuột và nhạc nền RPG thuần túy |
| **HTML5 Fullscreen API** | Hỗ trợ chơi game toàn màn hình không viền trên PC và Tablet |

---

## 🎮 3. CÁC MÀN HÌNH NỀN TẢNG (PROMPT 02 ENHANCEMENTS)

### 🏰 1. Màn hình Home (Cinematic Home Screen)
- **Bối cảnh vương quốc:** Bầu trời hoàng hôn chiều sâu, lâu đài lớn ở phía xa, rặng núi, rừng cây và dòng sông phản chiếu ánh vàng.
- **Tiền cảnh:** Chiến binh Tony trong tư thế anh hùng với hiệu ứng chuyển động lơ lửng nhẹ nhàng.
- **Logo chính thức:** `GameLogo` phong cách kim loại vàng 3D, thanh kiếm hiệp sĩ, ngọc tri thức và khẩu hiệu *"THE POWER OF KNOWLEDGE. THE COURAGE OF A HERO."*
- **5 Nút bấm kim loại vàng fantasy:**
  1. `NEW ADVENTURE`: Mở lựa chọn hành trình mới, bảo toàn dữ liệu cũ không tự ý xóa.
  2. `CONTINUE ADVENTURE`: Tự động khôi phục chiến dịch gần nhất (vô hiệu hóa an toàn nếu chưa có dữ liệu).
  3. `SELECT CAMPAIGN`: Chuyển đến màn hình chọn Lớp 2 hoặc Lớp 3.
  4. `PLAYER PROFILE`: Mở bảng chỉ số nhân vật RPG & trang bị.
  5. `SETTINGS`: Mở bảng cài đặt âm thanh, đồ họa và toàn màn hình.

### 🛡️ 2. Màn hình Select Campaign (Dedicated Screen)
- **Campaign 01 – The Little Hero (Grade 2):**
  - Màu chủ đạo: **Xanh lục & Bạc** (`#10b981`, `#34d399`).
  - Hình ảnh Tony mặc giáp bạc xanh lục khám phá.
  - Bối cảnh: Rừng thiêng và vương quốc khởi nguyên.
  - Cấp độ hiện tại, phần trăm hoàn thành (%), số vương quốc đã mở khóa (X/7).
  - Nút **ENTER KINGDOM**.
- **Campaign 02 – The Legendary Hero (Grade 3):**
  - Màu chủ đạo: **Xanh lam & Vàng kim** (`#38bdf8`, `#facc15`).
  - Hình ảnh Tony mặc giáp xanh lam vàng kim huyền thoại.
  - Bối cảnh: Núi cao và lâu đài huyền thoại.
  - Cấp độ hiện tại, phần trăm hoàn thành (%), số vương quốc đã mở khóa (X/7).
  - Nút **ENTER KINGDOM**.

### 👤 3. Màn hình Player Profile (RPG Character Sheet)
- Hình ảnh đại diện Tony theo đúng trang phục của chiến dịch đang chọn.
- Tên hiệp sĩ (cho phép chỉnh sửa trực tiếp và lưu ngay lập tức).
- Cấp độ & thanh EXP phát sáng.
- Thanh máu **HP** (tính theo cấp và trang bị: ví dụ 235 HP cho Lớp 2, 395 HP cho Lớp 3).
- Thanh năng lượng tri thức **MP** (100 - 160 MP).
- Chỉ số **GOLD**, số quái vật đã đánh bại, số nhiệm vụ hoàn thành.
- **Khu vực Trang bị Hiệp Sĩ (Equipment Slots):**
  - **Vũ khí (Weapon):** Kiếm Ánh Sáng Tập Sự / Thần Kiếm Mặt Trời Thái Cổ.
  - **Khiên (Shield):** Khiên Dũng Khí Bạc / Khiên Quang Năng Vạn Số.
  - **Giáp (Armor):** Chiến Giáp Bạc Khám Phá / Chiến Giáp Xanh Lam Hoàng Kim.
  - **Phụ kiện (Accessory):** Dây Chuyền Tinh Tú Khởi Nguyên.
  - Hiển thị trạng thái "Chưa sở hữu trang bị" nếu ô còn trống; nhấp vào để soi chi tiết trang bị.
- Danh sách huy hiệu thành tích đã mở khóa.

### ⚙️ 4. Màn hình Settings
- **Background Music:** BẬT / TẮT & thanh trượt âm lượng 0–100%.
- **Sound Effects:** BẬT / TẮT & thanh trượt âm lượng 0–100%.
- **Toàn màn hình (Fullscreen):** Nút bật/tắt toàn màn hình tức thì qua HTML5 API.
- **Ngôn ngữ (Language):** Tiếng Việt / English.
- **Chất lượng 3D:** Điện ảnh (Cinematic) / Cao (High) / Tiết kiệm (Medium).
- **Hạt sao ma thuật:** BẬT / TẮT.
- **Bảo toàn dữ liệu:** Đặt lại từng chiến dịch hoặc xóa sạch an toàn với hộp thoại xác nhận.

---

## 🛠️ 4. HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY ỨNG DỤNG

### Bước 1: Di chuyển vào thư mục dự án
```bash
cd C:\Users\Admin\.gemini\antigravity\scratch\tony-math-hero
```

### Bước 2: Chạy ứng dụng ở chế độ Development (Cổng chuyên dụng 3388)
```bash
npm run dev
```
Truy cập qua trình duyệt:
- **Máy tính (Local):** [http://localhost:3388/](http://localhost:3388/)
- **Mạng LAN (Tablet / Điện thoại):** `http://<IP-máy-bạn>:3388/`

### Bước 3: Chạy kịch bản kiểm tra hệ thống độc lập
```bash
npx tsx src/utils/testPersistence.ts
```

### Bước 4: Tạo bản build hoàn chỉnh
```bash
npm run build
```
Bản build tối ưu hóa nằm tại thư mục `dist/`.
