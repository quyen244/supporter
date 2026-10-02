# Hướng dẫn deploy Teachly

Làm một lần, khoảng 20 phút.
Thứ tự các bước có lý do, đừng đảo: database phải có trước, tên miền phải có trước khi khai báo Google.

---

## Bước 1. Tạo database trên Neon

1. Vào [console.neon.tech](https://console.neon.tech), đăng nhập bằng Google.
2. Bấm **Create project**.
   - Project name: `teachly`
   - Postgres version: để mặc định
   - **Region: Asia Pacific (Singapore)** — gần Việt Nam nhất, đừng chọn US
3. Tạo xong, Neon hiện hộp **Connection string**.
   Trong hộp đó bật **Connection pooling**, rồi copy chuỗi.

Chuỗi đúng trông như thế này, để ý đoạn `-pooler`:

```
postgresql://teachly_owner:xxxx@ep-abc-123-pooler.ap-southeast-1.aws.neon.tech/teachly?sslmode=require
```

> **Phải lấy chuỗi có `-pooler`.** Mỗi lần ai đó mở trang, Vercel dựng một tiến trình riêng và mỗi tiến trình giữ một nhóm kết nối. Không qua pooler thì vài người dùng cùng lúc là chạm trần kết nối của Neon và trang báo lỗi.

Dán tạm chuỗi này vào đâu đó, bước 3 cần tới.

---

## Bước 2. Tạo khoá ký phiên đăng nhập

Mở PowerShell, chạy:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy kết quả. Đây là `BETTER_AUTH_SECRET` cho bản chạy thật.

> **Đừng dùng lại khoá trong `.env.local`.** Khoá đó dùng cho máy của bạn. Tách riêng để nếu máy bị lộ thì tài khoản trên bản thật vẫn an toàn.

---

## Bước 3. Đưa code lên Vercel

Mở PowerShell tại thư mục dự án:

```powershell
cd D:\Teaching\phieu-hoc-tap
npx vercel login
```

Trình duyệt mở ra, bấm **Approve**. Rồi:

```powershell
npx vercel link
```

Trả lời các câu hỏi:

| Câu hỏi | Trả lời |
|---|---|
| Set up and deploy? | `Y` |
| Which scope? | chọn tài khoản của bạn |
| Link to existing project? | `N` |
| Project name? | `teachly` |
| In which directory is your code? | `./` (Enter) |
| Modify settings? | `N` |

Lần deploy đầu này sẽ chạy được nhưng **trang chưa dùng được** vì chưa có biến môi trường. Bình thường, bước sau sẽ khai.

---

## Bước 4. Khai biến môi trường

Vào [vercel.com](https://vercel.com) → project `teachly` → **Settings** → **Environment Variables**.

Thêm 5 biến, mỗi biến tích đủ cả ba môi trường **Production, Preview, Development**:

| Tên biến | Giá trị |
|---|---|
| `DATABASE_URL` | chuỗi có `-pooler` ở bước 1 |
| `BETTER_AUTH_SECRET` | chuỗi sinh ở bước 2 |
| `BETTER_AUTH_URL` | `https://teachly.vercel.app` (xem tên miền thật ở tab Domains) |
| `ADMIN_EMAILS` | `quyendep2580@gmail.com` |
| `GOOGLE_CLIENT_ID` | copy từ `.env.local` trên máy bạn |
| `GOOGLE_CLIENT_SECRET` | copy từ `.env.local` trên máy bạn |

> `BETTER_AUTH_URL` phải **khớp từng ký tự** với tên miền thật, có `https://`, **không có dấu `/` ở cuối**. Sai chỗ này là đăng nhập xong bị đá ngược về trang đăng nhập.

---

## Bước 5. Tạo bảng đăng nhập trên database thật

Các bảng `students`, `lessons`, `schedules` tự tạo khi trang chạy lần đầu.
Riêng bảng của Better Auth phải chạy tay một lần.

Trong PowerShell, trỏ tạm biến môi trường sang Neon rồi chạy migration:

```powershell
cd D:\Teaching\phieu-hoc-tap
$env:DATABASE_URL = "<chuoi-pooler-o-buoc-1>"
npx @better-auth/cli migrate --yes
```

Thành công sẽ thấy `migration was completed successfully!` và danh sách bảng `user`, `session`, `account`, `verification`.

Xong thì đóng cửa sổ PowerShell đó để biến môi trường tạm biến mất.

---

## Bước 6. Deploy bản chạy thật

```powershell
npx vercel --prod
```

Chờ khoảng một phút. Kết thúc nó in ra địa chỉ dạng `https://teachly.vercel.app`.

---

## Bước 7. Khai tên miền mới với Google

Nếu bỏ bước này, nút **Tiếp tục với Google** sẽ báo `redirect_uri_mismatch`.

1. Vào [console.cloud.google.com](https://console.cloud.google.com) → **APIs & Services** → **Credentials**
2. Bấm vào OAuth client đã tạo
3. Thêm vào **Authorized JavaScript origins**:
   ```
   https://teachly.vercel.app
   ```
4. Thêm vào **Authorized redirect URIs**:
   ```
   https://teachly.vercel.app/api/auth/callback/google
   ```
5. **Save**. Google cần vài phút để áp dụng.

Giữ nguyên hai dòng `localhost:3000` cũ để máy bạn vẫn chạy được.

---

## Bước 8. Kiểm tra

1. Mở `https://teachly.vercel.app` — phải thấy trang đăng nhập có ảnh nền.
2. Bấm **Đăng ký**, tạo tài khoản bằng `quyendep2580@gmail.com`.
3. Vào được rồi phải thấy **biểu tượng khiên** ở thanh bên trái. Có khiên nghĩa là `ADMIN_EMAILS` đã ăn.
4. Thử **Tiếp tục với Google** bằng chính email đó — phải vào thẳng cùng tài khoản, không tạo tài khoản thứ hai.
5. Thêm một học viên, viết một nhận xét, bấm **Tải PDF để gửi** — mở file ra, bấm thử link playlist.

---

## Khi hỏng thì tra ở đây

| Hiện tượng | Nguyên nhân gần như chắc chắn |
|---|---|
| Đăng nhập xong bị đá về trang đăng nhập | `BETTER_AUTH_URL` sai, thừa dấu `/` cuối, hoặc còn là `http://localhost:3000` |
| `redirect_uri_mismatch` | Chưa làm bước 7, hoặc gõ sai đường dẫn `/api/auth/callback/google` |
| Trang báo `DATABASE_URL chưa được cấu hình` | Quên tích Production khi thêm biến, hoặc chưa deploy lại sau khi thêm |
| Lúc đông người vào thì lỗi kết nối | Dùng nhầm chuỗi không có `-pooler` |
| Đăng nhập được nhưng không có biểu tượng khiên | `ADMIN_EMAILS` khác email bạn đăng ký. Sửa biến rồi **xoá tài khoản trong bảng `user`** và đăng ký lại, vì quyền chỉ gán lúc tạo tài khoản |
| Sửa biến môi trường mà không thấy đổi | Phải **Redeploy** thì biến mới có hiệu lực |

---

## Về sau

**Cập nhật code**: sửa trên máy, rồi `npx vercel --prod`. Không cần làm lại bước nào.

**Tự động deploy khi push**: đưa repo lên GitHub rồi vào Vercel → Settings → Git → Connect. Từ đó mỗi lần `git push` là tự deploy.

**Điều khoản**: gói Hobby của Vercel dành cho mục đích phi thương mại. Bạn tự dùng cho lớp mình thì đúng điều khoản. Khi trung tâm dùng chính thức hoặc có thu phí, phải lên Pro khoảng 20 USD/tháng.

**Nhắc lịch qua email**: chưa làm. Khi làm sẽ cần cron chạy mỗi 5-10 phút, mà gói Hobby chỉ cho cron 1 lần/ngày — lúc đó phải tính lại hạ tầng.
