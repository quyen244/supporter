import Link from "next/link";
import { notFound } from "next/navigation";
import { archiveStudent, getStudent, updateStudent } from "@/app/actions";
import LessonForm from "@/components/LessonForm";
import LessonList from "@/components/LessonList";

export const dynamic = "force-dynamic";

export default async function HocVien({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getStudent(id);
  if (!data) notFound();
  const { student, lessons } = data;

  const input = "w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500";

  return (
    <main className="mx-auto w-full max-w-3xl p-4 sm:p-6">
      <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">
        ‹ Danh sách
      </Link>

      <header className="mt-2 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{student.name}</h1>
          <p className="text-sm text-slate-500">
            {student.class_code || "chưa có mã lớp"} · {lessons.length} buổi
          </p>
        </div>
        <Link
          href={`/phieu/${student.id}`}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Xem phiếu &amp; gửi
        </Link>
      </header>

      <section className="mb-8">
        <h2 className="mb-2 font-semibold text-slate-900">Thêm buổi học</h2>
        <LessonForm studentId={student.id} nextDay={String(lessons.length + 1).padStart(2, "0")} />
      </section>

      <section className="mb-8">
        <h2 className="mb-2 font-semibold text-slate-900">Các buổi đã nhận xét</h2>
        <LessonList studentId={student.id} lessons={lessons} />
      </section>

      <details className="rounded-xl border border-slate-200 bg-white p-4">
        <summary className="cursor-pointer font-semibold text-slate-900">Thông tin phiếu</summary>
        <form action={updateStudent} className="mt-3 grid gap-3 sm:grid-cols-2">
          <input type="hidden" name="id" value={student.id} />
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-600">Tên học sinh</span>
            <input name="name" defaultValue={student.name} className={input} />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-600">Mã lớp</span>
            <input name="class_code" defaultValue={student.class_code} className={input} />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-600">Giáo viên</span>
            <input name="teacher_name" defaultValue={student.teacher_name} className={input} />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-600">Link playlist</span>
            <input name="playlist_url" defaultValue={student.playlist_url} className={input} />
          </label>
          <div className="sm:col-span-2">
            <button className="rounded-lg bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-700">Lưu</button>
          </div>
        </form>
        <form action={archiveStudent} className="mt-4 border-t border-slate-200 pt-3">
          <input type="hidden" name="id" value={student.id} />
          <button className="text-sm text-rose-600 hover:underline">Ẩn học viên này</button>
        </form>
      </details>
    </main>
  );
}
