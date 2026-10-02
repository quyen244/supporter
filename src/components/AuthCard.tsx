import { IconCap } from "@/components/icons";

/* ----------------------------------------------------------------------------
 * CHỈNH TAY Ở ĐÂY - đổi mấy giá trị dưới rồi lưu là thấy ngay, không cần sửa
 * chỗ nào khác. Phải ghi nguyên tên lớp Tailwind (ví dụ "max-w-3xl"), đừng ghép
 * chuỗi, vì Tailwind quét theo chữ có sẵn trong file.
 * ------------------------------------------------------------------------- */

/** Bề ngang thẻ đăng nhập. Nhỏ dần: max-w-5xl > max-w-4xl > max-w-3xl > max-w-2xl */
const CARD_WIDTH = "max-w-4xl";

/** Chiều cao tối thiểu nửa trái, cũng là chiều cao ảnh. min-h-120 ~ 480px, min-h-140 ~ 560px */
const PANEL_HEIGHT = "min-h-140";

/** Cách ảnh lấp khung: bg-cover phủ kín và cắt bớt cạnh, bg-contain hiện trọn ảnh nhưng chừa viền */
const IMAGE_FIT = "bg-cover";

/** Vị trí ảnh khi bị cắt: bg-center, bg-top, bg-bottom, bg-left, bg-right */
const IMAGE_POSITION = "bg-center";

/** Độ đậm lớp phủ tối dưới chân ảnh, để chữ trắng đọc được. Nhạt dần: /85 > /70 > /50 */
const SCRIM = "from-sage-900/85";

export default function AuthCard({
  heading,
  sub,
  children,
  footer,
}: {
  heading: string;
  sub: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main
      // Nền trang: hoạ tiết nằm ở viền và chừa trống phần giữa, nên thẻ đăng
      // nhập đặt chính giữa vừa khít khoảng trống đó. Màu nền giữ làm dự phòng
      // khi ảnh chưa tải xong.
      className="grid min-h-dvh place-items-center bg-sand bg-cover bg-center bg-no-repeat p-4 sm:p-8"
      style={{ backgroundImage: "url('/img/login-bg.webp')" }}
    >
      <div
        className={`grid w-full ${CARD_WIDTH} overflow-hidden rounded-lg border border-line bg-white md:grid-cols-2`}
      >
        {/* Nửa trái tràn viền. Thay ảnh tại public/img/login.webp, nên dùng ảnh dọc 9:16. */}
        <section className={`relative hidden ${PANEL_HEIGHT} bg-sage-100 md:block`}>
          <div
            className={`absolute inset-0 ${IMAGE_FIT} ${IMAGE_POSITION} bg-no-repeat`}
            style={{ backgroundImage: "url('/img/login.webp')" }}
          />
          <div className={`absolute inset-0 bg-linear-to-t ${SCRIM} via-sage-900/30 to-sage-900/5`} />
          <div className="relative flex h-full flex-col justify-end p-10">
            <h2 className="text-[34px] font-bold leading-none tracking-tight text-white">Teachly</h2>
            <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-white/85">
              Nhận xét xong một buổi dạy trong vài chạm, xuất phiếu gửi phụ huynh ngay.
            </p>
          </div>
        </section>

        <section className="flex flex-col justify-center p-8 sm:p-12">
          <div className="mb-8 flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-sage text-white">
              <IconCap />
            </span>
            <span className="text-lg font-bold tracking-tight text-ink">
              Teach<span className="text-sage">ly</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-ink">{heading}</h1>
          <p className="mt-1.5 text-sm text-ink-soft">{sub}</p>

          {children}

          <div className="mt-7 text-sm text-ink-soft">{footer}</div>
        </section>
      </div>
    </main>
  );
}
