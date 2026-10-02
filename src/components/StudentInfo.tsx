import { archiveStudent, updateStudent } from "@/app/actions";
import type { Student } from "@/lib/db";

export default function StudentInfo({ student }: { student: Student }) {
  return (
    <details className="card group overflow-hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between p-5 font-bold text-ink">
        Thông tin trên phiếu
        <span className="text-sm font-normal text-ink-faint transition group-open:rotate-180">▾</span>
      </summary>

      <div className="border-t border-line p-5">
        <form action={updateStudent} className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="id" value={student.id} />
          <div>
            <label htmlFor="sn" className="label">
              Tên học sinh
            </label>
            <input id="sn" name="name" defaultValue={student.name} className="field" />
          </div>
          <div>
            <label htmlFor="sc" className="label">
              Mã lớp
            </label>
            <input id="sc" name="class_code" defaultValue={student.class_code} className="field" />
          </div>
          <div>
            <label htmlFor="st" className="label">
              Giáo viên
            </label>
            <input id="st" name="teacher_name" defaultValue={student.teacher_name} className="field" />
          </div>
          <div>
            <label htmlFor="sp" className="label">
              Link playlist lớp
            </label>
            <input id="sp" name="playlist_url" defaultValue={student.playlist_url} className="field" />
          </div>
          <div className="sm:col-span-2">
            <button className="rounded-xl bg-sage px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-600">
              Lưu thay đổi
            </button>
          </div>
        </form>

        <form action={archiveStudent} className="mt-5 border-t border-line pt-4">
          <input type="hidden" name="id" value={student.id} />
          <button className="text-sm font-medium text-alert transition hover:underline">
            Ẩn học viên này khỏi danh sách
          </button>
        </form>
      </div>
    </details>
  );
}
