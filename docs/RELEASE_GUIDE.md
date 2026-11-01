# 🌟 HƯỚNG DẪN PHÁT HÀNH VÀ VẬN HÀNH DỰ ÁN
## TONY MATH HERO – THE LEGEND OF SEVEN KINGDOMS
**Phiên bản: 22.0.0 (Official Release)**  
*Dành riêng cho Tony & Phụ huynh*

---

### 1. Giới thiệu tổng quan

**Tony Math Hero – The Legend of Seven Kingdoms** là tựa game nhập vai giáo dục 3D (3D RPG EdTech) được thiết kế đặc biệt cho Tony, tích hợp toàn diện chương trình Toán học Lớp 2 và Lớp 3 (Việt Nam & Quốc tế).

- **7 Vương quốc tri thức:**
  1. *Cộng Trừ Kỳ Bí* (Addition & Subtraction Kingdom)
  2. *Bảng Nhân Huyền Thoại* (Multiplication Realm)
  3. *Vương Quốc Phép Chia* (Division Realm)
  4. *Hình Học & Đo Lường* (Geometry & Measurement Kingdom)
  5. *Tư Duy Số & Phân Số* (Number Sense & Fractions Adventure)
  6. *Thời Gian & Tiền Tệ* (Time, Calendar, Money & Shopping)
  7. *Mê Cung Logic & Đấu Trường Tổng Hợp* (Logic Thinking & Advanced Arena)
- **Chiến dịch cuối cùng:** Trận đại chiến 3 giai đoạn chống lại **Lord Zero** để giải phóng Vùng đất Tri thức (Land of Mathtopia).

---

### 2. Hướng dẫn khởi chạy dự án

Dự án hỗ trợ 2 phương thức vận hành linh hoạt:

#### Cách 1: Chạy bản độc lập Single-File (Khuyến nghị cho Tony sử dụng hàng ngày)
- **Tệp thực thi:** `tony-math-hero.html` nằm tại thư mục gốc của dự án hoặc thư mục `dist/`.
- **Cách mở:** Nhấp đúp chuột trực tiếp vào file `tony-math-hero.html` bằng bất kỳ trình duyệt hiện đại nào (Google Chrome, Microsoft Edge, Mozilla Firefox, Apple Safari).
- **Đặc điểm:**
  - Hoạt động **100% Offline**, không cần kết nối mạng Internet.
  - Không cần cài đặt Node.js hay môi trường phát triển.
  - Toàn bộ mã nguồn, thư viện 3D Three.js, CSS, âm thanh tổng hợp Web Audio API và dữ liệu câu hỏi được đóng gói trọn vẹn trong một file duy nhất.

#### Cách 2: Chạy trong môi trường Phát triển (Development Mode)
Dành cho lập trình viên muốn mở rộng thêm tính năng hoặc tùy chỉnh mã nguồn:
```bash
# 1. Điều hướng vào thư mục dự án
cd tony-math-hero

# 2. Cài đặt các thư viện phụ thuộc (nếu chưa cài)
npm install

# 3. Khởi chạy máy chủ phát triển Vite với Hot Module Replacement
npm run dev
```
Trình duyệt sẽ tự động mở hoặc truy cập địa chỉ: `http://localhost:3388/`.

---

### 3. Hướng dẫn Đóng gói Sản phẩm (Production Build)

Để biên dịch và đóng gói toàn bộ dự án từ mã nguồn TypeScript/React thành file HTML duy nhất:
```bash
npm run build
```
- **Quy trình build:**
  1. Vite biên dịch mã nguồn TypeScript (`.ts`, `.tsx`) và tối ưu hóa CSS Tailwind.
  2. Plugin `vite-plugin-singlefile` tự động nén và inline toàn bộ JavaScript, CSS, hình ảnh SVG/base64 vào tệp duy nhất: `dist/tony-math-hero.html`.
  3. Script hậu xử lý sẽ sao chép file này ra thư mục gốc `tony-math-hero.html` để tiện truy cập ngay lập tức.

---

### 4. Hệ thống Lưu trữ & Sao lưu Dữ liệu Học tập (Backup & Restore)

Để đảm bảo toàn bộ tiến trình học tập, huân chương, điểm kinh nghiệm, Knowledge Crystals và vật phẩm của Tony không bao giờ bị mất:

#### Cơ chế lưu trữ kép (Dual Persistence)
- **Ưu tiên 1:** Sử dụng `IndexedDB` để lưu trữ dữ liệu chi tiết, lịch sử làm bài và tiến trình 7 vương quốc.
- **Dự phòng (Fallback):** Tự động đồng bộ sang `LocalStorage` với tiền tố `tmh_` để chống lỗi crash trình duyệt hoặc trường hợp xóa cookie tạm thời.

#### Hướng dẫn Sao lưu dữ liệu (Xuất file JSON Schema 22.0.0):
1. Tại màn hình chính hoặc thanh công cụ trên cùng, nhấn vào biểu tượng **Bánh răng (Cài đặt)**.
2. Kéo xuống mục **Sao lưu & Khôi phục dữ liệu (Schema 22.0.0)**.
3. Nhấn nút **"Tải file sao lưu (.json)"**.
4. Trình duyệt sẽ tải về file có định dạng: `tony-math-hero-backup-YYYY-MM-DD.json`.
5. *Khuyến cáo phụ huynh:* Nên tải file sao lưu này mỗi tuần một lần hoặc sau khi Tony hoàn thành một vương quốc quan trọng.

#### Hướng dẫn Khôi phục dữ liệu:
1. Mở Cài đặt (Settings) trên máy mới hoặc trình duyệt mới.
2. Trong mục **Khôi phục dữ liệu từ file**, nhấn **"Chọn file sao lưu"** và chọn file JSON đã lưu trước đó.
3. Hệ thống sẽ kiểm tra chữ ký và tính hợp lệ của dữ liệu, nạp lại toàn bộ thành tích của Tony và tự động làm mới trang.

---

### 5. Cấu hình thiết bị & Tối ưu hiệu năng

Dự án được tối ưu hóa mượt mà ở mức 60 FPS trên đa dạng thiết bị:

#### Cấu hình khuyến nghị:
- **PC / Laptop:**
  - Hệ điều hành: Windows 10/11, macOS 11+, Ubuntu 20.04+.
  - Trình duyệt: Google Chrome, Microsoft Edge, Opera, Firefox.
  - Chuột và bàn phím (hỗ trợ phím số 1-4 để chọn đáp án và phím Space để thi triển kỹ năng).
- **Tablet / iPad:**
  - Màn hình từ 9.7 inch trở lên.
  - Hỗ trợ thao tác cảm ứng chạm mượt mà (Touch Controls).
  - Tự động co giãn giao diện tương thích với tỷ lệ màn hình máy tính bảng.

#### Thiết lập chất lượng đồ họa trong Menu Cài đặt:
- **CINEMATIC (Mặc định cho máy tính mạnh):** Hiển thị đầy đủ hiệu ứng đổ bóng, hạt phép thuật lấp lánh (Particles), camera 3D điện ảnh.
- **HIGH:** Đồ họa sắc nét, bóng mờ nhẹ, tối ưu cho laptop văn phòng.
- **MEDIUM / LOW:** Tắt bớt hạt phép thuật và hiệu ứng bóng phức tạp, đảm bảo 60 FPS trên các máy tính cấu hình khiêm tốn hoặc tablet đời cũ.
- **Giảm chuyển động (Reduce Motion):** Dành cho Tony khi mắt cần nghỉ ngơi hoặc muốn tập trung hoàn toàn vào việc giải toán mà không bị phân tâm bởi hiệu ứng chuyển động.

---

### 6. Âm thanh & Âm nhạc (Web Audio Engine)

- Game sử dụng **Web Audio API** tích hợp sẵn trong trình duyệt để tự động tổng hợp sóng âm (Oscillator Synthesis).
- **Ưu điểm vượt trội:**
  - Không tải bất kỳ file MP3/WAV bên ngoài nào giúp game tải tức thì 0 giây và không lo lỗi "404 Audio Not Found".
  - Có 3 thanh trượt điều chỉnh âm lượng riêng biệt: **Tổng (Master)**, **Nhạc nền (BGM)**, **Hiệu ứng (SFX)**.
  - Có nút Tắt tiếng nhanh (Mute) ngay trên thanh tiêu đề góc trên cùng.

---

### 7. Tính an toàn & Bảo vệ quyền riêng tư cho trẻ em (Child-Safe & Privacy)

1. **Zero External Tracking:** Game không thu thập bất kỳ dữ liệu cá nhân nào, không có Google Analytics, không có quảng cáo, không liên kết mạng xã hội của bên thứ ba.
2. **Offline First:** Dữ liệu hoàn toàn thuộc về Tony và gia đình, lưu trữ cục bộ trên máy tính của gia đình.
3. **Phản hồi giáo dục tích cực:** Khi làm sai, hệ thống gợi ý phương pháp tư duy và động viên Tony kiên trì (Resilience Mindset), không trừ phạt gây áp lực tâm lý.
4. **Báo cáo học tập chuẩn A4:** Phụ huynh có thể mở Báo cáo Phân tích Học tập (Learning Analytics) và nhấn **In Báo cáo A4** để in ra giấy hoặc lưu thành file PDF theo dõi sự tiến bộ của con.

---
*Chúc Tony có những giờ phút phiêu lưu kỳ thú và trở thành Hiệp sĩ Toán học vĩ đại nhất Mathtopia!*
