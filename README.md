# Teachly

Quản lý lớp dạy thêm: lên lịch, ghi nhận xét sau mỗi buổi, rồi xuất ra phiếu giống hệt bản PDF của trung tâm.

## Chức năng

- Nhiều giáo viên, mỗi người đăng nhập bằng email và chỉ thấy học viên của mình.
- Vai trò quản trị: xem được học viên của mọi giáo viên, đổi quyền, khoá tài khoản.
- Lịch dạy theo tuần: bấm vào ô trống trên lưới để thêm buổi, đánh dấu buổi đã dạy.
- Quản lý nhiều học viên, mỗi học viên một phiếu tích luỹ dần qua các buổi.
- Thư viện mẫu câu cho 6 nhóm: Từ vựng, Nghe, Nói, Đọc, Viết, Thái độ.
  Mỗi câu có ô nhập số ngay trên câu, ví dụ "Đọc hiểu được khoảng __% bài đọc".
  Bấm vào câu là nó được thêm vào ô nhận xét, sau đó vẫn sửa tay được.
- Phiếu tự động chia trang 18 dòng, dòng nào nhận xét dài thì tự cao lên.
- Xuất PNG (216 dpi) hoặc PDF, và nút chia sẻ thẳng sang Zalo trên điện thoại.
- Toàn bộ ứng dụng khoá sau một mật khẩu.

## Về việc gửi Zalo

Zalo không cho phép một web app cá nhân gửi tin nhắn thẳng tới phụ huynh.
Muốn gửi tự động thì phải có Zalo Official Account đã xác thực doanh nghiệp, template được Zalo duyệt trước, và trả phí theo từng tin.

Vì vậy ứng dụng dùng cách thực tế hơn: nút **Gửi qua Zalo** tạo ảnh phiếu rồi mở bảng chia sẻ của hệ điều hành.
Trên điện thoại, chọn Zalo rồi chọn phụ huynh là xong.
Ảnh hiển thị trực tiếp trong khung chat nên phụ huynh xem được ngay, không phải tải file như PDF.

Trên máy tính, nếu trình duyệt không hỗ trợ chia sẻ file thì ứng dụng báo lại và bạn dùng nút **Tải ảnh PNG**.

## Chạy trên máy

Cần Node 20 trở lên và một database PostgreSQL.

```bash
npm install
cp .env.example .env.local   # rồi điền DATABASE_URL và APP_PASSWORD
npm run dev
```

Bảng dữ liệu được tạo tự động ở lần chạy đầu, không cần chạy migration thủ công.

### Biến môi trường

| Biến | Bắt buộc | Ý nghĩa |
|---|---|---|
| `DATABASE_URL` | có | Chuỗi kết nối PostgreSQL. |
| `BETTER_AUTH_SECRET` | có | Khoá ký phiên đăng nhập. Tạo bằng `openssl rand -base64 32`. |
| `BETTER_AUTH_URL` | có | Địa chỉ gốc của ứng dụng, ví dụ `https://phieu.vercel.app`. |
| `ADMIN_EMAILS` | nên có | Email được cấp quyền quản trị ngay khi đăng ký, cách nhau bởi dấu phẩy. |

## Tài khoản và phân quyền

Xác thực dùng [Better Auth](https://better-auth.com) chạy ngay trong database của dự án, không phụ thuộc dịch vụ ngoài.
Neon Auth cũng chạy trên chính thư viện này, nên sau có muốn chuyển sang bản được Neon quản lý cũng không phải viết lại.

Bảng `user`, `session`, `account`, `verification` do Better Auth tạo.
Khi đổi cấu hình auth, chạy `npx @better-auth/cli migrate` để cập nhật.

Mỗi học viên thuộc về một giáo viên qua cột `students.owner_id`.
Mọi thao tác đọc và ghi đều đi qua hàm `ownedStudent()` trong `src/app/actions.ts`.
Nếu thêm truy vấn mới, hãy dùng hàm đó thay vì tìm học viên bằng id trần, nếu không sẽ thủng phân quyền.

Giáo viên đầu tiên có email nằm trong `ADMIN_EMAILS` sẽ thành quản trị viên.
Quản trị viên không tự hạ quyền hoặc tự khoá được chính mình, tránh trường hợp không còn ai vào được trang quản trị.

## Đưa lên mạng (Vercel)

1. Đẩy repo này lên GitHub.
2. Vào Vercel, chọn Import Project và trỏ tới repo.
Các bước đầy đủ nằm ở [DEPLOY.md](DEPLOY.md), kèm phần tra cứu khi hỏng.

Sau đó mở trang web trên điện thoại và thêm vào màn hình chính để dùng như một app.

## Phiếu được dựng như thế nào

Toạ độ trong `src/lib/layout.ts` không phải ước lượng.
Chúng được đo trực tiếp từ file PDF gốc bằng cách render ở 72 dpi rồi dò pixel: vị trí từng đường kẻ, màu nền, biên các cột và biên 18 dòng.
Kết quả là lưới bảng trùng khít từng pixel với bản gốc.

Ba ảnh trong `public/img` (logo, ngôi sao, hình mờ) cũng được trích thẳng từ PDF gốc, kèm kênh trong suốt.

Nếu trung tâm đổi mẫu phiếu, hãy đo lại rồi cập nhật `layout.ts` thay vì chỉnh số bằng cảm tính.

## Đăng nhập bằng Google

Để trống `GOOGLE_CLIENT_ID` và `GOOGLE_CLIENT_SECRET` thì nút Google tự ẩn, app vẫn chạy bằng email và mật khẩu.
Điền đủ hai biến là nút hiện ra, không phải sửa code.

### Các bước trong Google Cloud Console

1. Mở [console.cloud.google.com](https://console.cloud.google.com), tạo project mới hoặc chọn project có sẵn.

2. Vào **APIs & Services > OAuth consent screen**.
   Chọn **External**, rồi điền tên ứng dụng (Teachly), email hỗ trợ và email liên hệ của nhà phát triển.

3. Ở phần **Scopes**, thêm ba scope cơ bản: `openid`, `.../auth/userinfo.email`, `.../auth/userinfo.profile`.
   Không cần scope nào khác, app chỉ lấy email và tên.

4. Nếu app đang ở chế độ **Testing**, thêm email của từng giáo viên vào mục **Test users**.
   Chế độ này giới hạn 100 người và ai không có trong danh sách sẽ bị chặn.
   Khi nào dùng thật thì bấm **Publish app** để chuyển sang Production.

5. Vào **APIs & Services > Credentials > Create Credentials > OAuth client ID**, chọn **Web application**.

6. Điền hai mục sau, đây là chỗ hay sai nhất:

   **Authorized JavaScript origins**

   ```
   http://localhost:3000
   https://ten-mien-that-cua-ban
   ```

   **Authorized redirect URIs**

   ```
   http://localhost:3000/api/auth/callback/google
   https://ten-mien-that-cua-ban/api/auth/callback/google
   ```

   Đường dẫn `/api/auth/callback/google` là do Better Auth quy định, đừng đổi.
   Sai một ký tự là Google trả lỗi `redirect_uri_mismatch`.

7. Bấm **Create**, copy **Client ID** và **Client secret** vào `.env.local`:

   ```
   GOOGLE_CLIENT_ID=...apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=...
   ```

8. Khởi động lại server. Biến môi trường chỉ được đọc lúc khởi động.

### Gộp tài khoản

Người đã đăng ký bằng mật khẩu, sau đó bấm đăng nhập Google cùng email, sẽ được gộp vào một tài khoản thay vì tạo tài khoản thứ hai.
Chỉ Google được tin cậy để gộp, vì Google đã xác minh email hộ.
Quyền quản trị vẫn dựa trên `ADMIN_EMAILS` nên đăng nhập kiểu nào cũng ra đúng vai trò.

## Lịch dạy

Giờ được lưu theo đồng hồ treo tường: cột `on_date` kiểu `date` và `start_min` là số phút tính từ 0h.
Cố tình không dùng `timestamptz`, vì buổi dạy "thứ Hai 14h" phải luôn là 14h bất kể server đặt ở múi giờ nào.
Khi đọc ra phải ép `on_date::text`, nếu không driver trả về đối tượng `Date` và phía client sẽ hỏng.

Buổi lặp hàng tuần được tạo thành nhiều dòng thật thay vì một quy tắc lặp.
Nhờ vậy sửa hoặc đánh dấu đã dạy cho từng buổi không ảnh hưởng các buổi còn lại.

## Ảnh trang đăng nhập

Có hai ảnh, đặt trong `public/img`:

| File | Vai trò | Tỉ lệ nên dùng |
|---|---|---|
| `login.webp` | Ảnh trong nửa trái của thẻ đăng nhập | dọc 9:16 |
| `login-bg.webp` | Nền cả trang, phía sau thẻ | ngang 16:9, chừa trống phần giữa |

Khung nửa trái cao hơn rộng, nên ảnh ngang 16:9 bỏ vào đó sẽ bị cắt chỉ còn khoảng một phần ba ở giữa.

Muốn chỉnh kích thước thẻ hoặc cách ảnh lấp khung thì sửa mấy hằng số đặt ngay đầu `src/components/AuthCard.tsx`.
Chúng được tách riêng kèm chú thích để không phải lần mò trong JSX.

Khi thay ảnh nhớ nén lại: bản PNG gốc thường trên 1.5MB, chuyển sang WebP còn khoảng 50 đến 150KB.
Nếu ảnh gốc hẹp hơn 2000px, hãy phóng gấp đôi bằng LANCZOS trước khi nén, nếu không trình duyệt phải tự kéo giãn và ảnh sẽ nhoè trên màn hình độ phân giải cao.

## Thư viện mẫu câu

Sửa trong `src/lib/phrases.ts`.
Mỗi câu có `tone` quyết định màu chip trên giao diện: `good` xanh lá, `ok` vàng, `work` đỏ.
Ký hiệu `{n}` trong câu sẽ thành một ô nhập số, `defaults` là giá trị gợi ý cho từng ô theo thứ tự.
