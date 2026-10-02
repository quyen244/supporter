import { IconCap } from "@/components/icons";

export default async function DangNhap({
  searchParams,
}: {
  searchParams: Promise<{ loi?: string; tiep?: string }>;
}) {
  const { loi, tiep } = await searchParams;

  return (
    <main className="grid min-h-dvh place-items-center bg-sand p-4 sm:p-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-line bg-white shadow-[0_24px_60px_-30px_rgba(47,51,39,0.35)] md:grid-cols-2">
        {/*
         * Nửa trái: thả ảnh minh hoạ vào public/img/login.png là nó hiện ra.
         * Chưa có ảnh thì chỉ thấy nền chuyển sắc, không vỡ bố cục.
         */}
        <section className="relative hidden flex-col justify-end bg-sage-50 p-10 md:flex">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url('/img/login.png'), radial-gradient(circle at 50% 38%, var(--color-sage-100), var(--color-sage-50) 62%)",
              backgroundSize: "contain, cover",
              backgroundPosition: "center 38%, center",
              backgroundRepeat: "no-repeat, no-repeat",
            }}
          />
          <div className="relative">
            <h2 className="text-[32px] font-bold leading-tight tracking-tight text-sage-900">
              Phiếu học tập
            </h2>
            <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-ink-soft">
              Nhận xét xong một buổi dạy trong vài chạm, xuất phiếu gửi phụ huynh ngay.
            </p>
          </div>
        </section>

        <section className="flex flex-col justify-center p-8 sm:p-12">
          <div className="mb-8 flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-sage text-white">
              <IconCap />
            </span>
            <span className="text-lg font-semibold tracking-tight text-ink">
              Phiếu <span className="text-sage">học tập</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-ink">Chào mừng trở lại</h1>
          <p className="mt-1.5 text-sm text-ink-soft">Nhập mật khẩu để vào sổ nhận xét của bạn.</p>

          <form action="/api/dang-nhap" method="post" className="mt-7">
            <input type="hidden" name="tiep" value={tiep ?? "/"} />
            <label htmlFor="pw" className="label">
              Mật khẩu
            </label>
            <input
              id="pw"
              type="password"
              name="password"
              autoFocus
              required
              placeholder="••••••••"
              aria-invalid={loi ? true : undefined}
              className={`field ${loi ? "border-alert" : ""}`}
            />
            {loi && <p className="mt-2 text-sm text-alert">Mật khẩu không đúng. Thử lại nhé.</p>}

            <button className="mt-6 w-full rounded-xl bg-sage px-4 py-3 font-semibold text-white transition hover:bg-sage-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage">
              Đăng nhập
            </button>
          </form>

          <p className="mt-8 text-xs leading-relaxed text-ink-faint">
            Chỉ giáo viên phụ trách lớp mới có mật khẩu này. Phụ huynh nhận phiếu qua Zalo, không cần đăng nhập.
          </p>
        </section>
      </div>
    </main>
  );
}
