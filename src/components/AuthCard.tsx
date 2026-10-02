import { IconCap } from "@/components/icons";

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
            <h2 className="text-[32px] font-bold leading-tight tracking-tight text-sage-900">Phiếu học tập</h2>
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

          <h1 className="text-2xl font-bold tracking-tight text-ink">{heading}</h1>
          <p className="mt-1.5 text-sm text-ink-soft">{sub}</p>

          {children}

          <div className="mt-7 text-sm text-ink-soft">{footer}</div>
        </section>
      </div>
    </main>
  );
}
