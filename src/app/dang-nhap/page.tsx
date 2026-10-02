export default async function DangNhap({
  searchParams,
}: {
  searchParams: Promise<{ loi?: string; tiep?: string }>;
}) {
  const { loi, tiep } = await searchParams;
  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-100 p-6">
      <form
        action="/api/dang-nhap"
        method="post"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200"
      >
        <h1 className="text-lg font-semibold text-slate-900">Phiếu học tập</h1>
        <p className="mt-1 text-sm text-slate-500">Nhập mật khẩu để tiếp tục.</p>
        <input type="hidden" name="tiep" value={tiep ?? "/"} />
        <input
          type="password"
          name="password"
          autoFocus
          required
          placeholder="Mật khẩu"
          className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
        {loi && <p className="mt-2 text-sm text-rose-600">Mật khẩu không đúng.</p>}
        <button className="mt-4 w-full rounded-lg bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-700">
          Đăng nhập
        </button>
      </form>
    </main>
  );
}
