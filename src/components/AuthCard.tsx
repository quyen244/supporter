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
         * Nửa trái tràn viền: ảnh phủ kín khung nên tỉ lệ ảnh nào cũng dùng được,
         * chỉ khác mức cắt cạnh. Thay ảnh tại public/img/login.webp.
         * Chưa có ảnh thì còn lại nền chuyển sắc, không vỡ bố cục.
         */}
        <section className="relative hidden min-h-[560px] bg-sage-100 md:block">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/img/login.webp')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sage-900/85 via-sage-900/30 to-sage-900/5" />
          <div className="relative flex h-full flex-col justify-end p-10">
            <h2 className="text-[34px] font-bold leading-none tracking-tight text-white">Teachly</h2>
            <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-white/85">
              Nhận xét xong một buổi dạy trong vài chạm, xuất phiếu gửi phụ huynh ngay.
            </p>
          </div>
        </section>

        <section className="flex flex-col justify-center p-8 sm:p-12">
          <div className="mb-8 flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-sage text-white">
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
