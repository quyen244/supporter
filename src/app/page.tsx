import Link from "next/link";
import { createStudent, listStudents } from "./actions";

export const dynamic = "force-dynamic";

export default async function Home() {
  const students = await listStudents();

  return (
    <main className="mx-auto w-full max-w-3xl p-4 sm:p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Phiếu học tập</h1>
        <p className="text-sm text-slate-500">{students.length} học viên</p>
      </header>

      <ul className="space-y-2">
        {students.map((s) => (
          <li key={s.id}>
            <Link
              href={`/hoc-vien/${s.id}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-sky-400 hover:shadow-sm"
            >
              <span className="min-w-0">
                <span className="block truncate font-medium text-slate-900">{s.name}</span>
                <span className="block truncate text-xs text-slate-500">
                  {s.class_code || "chưa có mã lớp"} · {s.lesson_count} buổi
                </span>
              </span>
              <span className="shrink-0 text-slate-400">›</span>
            </Link>
          </li>
        ))}
        {students.length === 0 && (
          <li className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
            Chưa có học viên nào. Thêm học viên đầu tiên bên dưới.
          </li>
        )}
      </ul>

      <form action={createStudent} className="mt-8 rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="mb-3 font-semibold text-slate-900">Thêm học viên</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input name="name" required placeholder="Tên học sinh" className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500" />
          <input name="class_code" placeholder="Mã lớp" className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500" />
          <input name="teacher_name" placeholder="Giáo viên" className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500" />
          <input name="playlist_url" placeholder="Link playlist" className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500" />
        </div>
        <button className="mt-3 rounded-lg bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-700">Thêm</button>
      </form>
    </main>
  );
}
