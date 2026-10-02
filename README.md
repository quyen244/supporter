# Phiếu học tập

Nhập nhận xét sau mỗi buổi dạy rồi xuất ra phiếu giống hệt bản PDF của trung tâm, thay cho việc điền tay.

## Chức năng

- Nhiều giáo viên, mỗi người đăng nhập bằng email và chỉ thấy học viên của mình.
- Vai trò quản trị: xem được học viên của mọi giáo viên, đổi quyền, khoá tài khoản.
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
3. Trong tab Storage của project, thêm một database Postgres (Neon có gói miễn phí).
   Vercel tự gắn `DATABASE_URL` vào project.
4. Trong Settings > Environment Variables, thêm `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` và `ADMIN_EMAILS`.
5. Deploy, sau đó chạy `npx @better-auth/cli migrate` một lần với `DATABASE_URL` trỏ tới database thật.

Sau đó mở trang web trên điện thoại và thêm vào màn hình chính để dùng như một app.

## Phiếu được dựng như thế nào

Toạ độ trong `src/lib/layout.ts` không phải ước lượng.
Chúng được đo trực tiếp từ file PDF gốc bằng cách render ở 72 dpi rồi dò pixel: vị trí từng đường kẻ, màu nền, biên các cột và biên 18 dòng.
Kết quả là lưới bảng trùng khít từng pixel với bản gốc.

Ba ảnh trong `public/img` (logo, ngôi sao, hình mờ) cũng được trích thẳng từ PDF gốc, kèm kênh trong suốt.

Nếu trung tâm đổi mẫu phiếu, hãy đo lại rồi cập nhật `layout.ts` thay vì chỉnh số bằng cảm tính.

## Thư viện mẫu câu

Sửa trong `src/lib/phrases.ts`.
Mỗi câu có `tone` quyết định màu chip trên giao diện: `good` xanh lá, `ok` vàng, `work` đỏ.
Ký hiệu `{n}` trong câu sẽ thành một ô nhập số, `defaults` là giá trị gợi ý cho từng ô theo thứ tự.
