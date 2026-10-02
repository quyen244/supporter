import Link from "next/link";
import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import LessonForm from "@/components/LessonForm";
import LessonList from "@/components/LessonList";
import StudentInfo from "@/components/StudentInfo";
import { IconSheet } from "@/components/icons";
import { requireUser } from "@/lib/session";
import { getStudent } from "@/app/actions";

export const dynamic = "force-dynamic";

function Stat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="card p-4">
      <p className="text-xs font-semibold tracking-wide text-ink-soft">{label}</p>
      <p className="mt-2 text-2xl font-bold text-ink">
        {value}
        {unit && <span className="ml-1 text-sm font-medium text-ink-faint">{unit}</span>}
      </p>
    </div>
  );
}

export default async function HocVien({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const data = await getStudent(id);
  if (!data) notFound();
  const { student, lessons } = data;

  const last = lessons[lessons.length - 1];

  return (
    <AppShell
      title={student.name}
      user={user}
      studentId={student.id}
      breadcrumb={
        <span className="flex items-center gap-2">
          <Link href="/" className="transition hover:text-sage">
            Học viên
          </Link>
          <span className="text-ink-faint">/</span>
          <span className="rounded-md bg-sand px-1.5 py-0.5 text-xs font-medium">
            {student.class_code || "chưa có mã lớp"}
          </span>
        </span>
      }
      actions={
        <Link
          href={`/phieu/${student.id}`}
          className="flex items-center gap-1.5 rounded-xl bg-sage px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-600"
        >
          <IconSheet />
          Xem phiếu &amp; gửi
        </Link>
      }
    >
      <StudentInfo student={student} />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Stat label="Số buổi đã nhận xét" value={String(lessons.length)} unit="buổi" />
        <Stat label="Buổi gần nhất" value={last?.day_label || "–"} unit={last ? "" : undefined} />
        <Stat label="Bài học gần nhất" value={last?.lesson_name || "–"} />
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-base font-bold text-ink">Thêm buổi học</h2>
        <LessonForm studentId={student.id} nextDay={String(lessons.length + 1).padStart(2, "0")} />
      </section>

      <section>
        <h2 className="mb-3 text-base font-bold text-ink">Các buổi đã nhận xét</h2>
        <LessonList studentId={student.id} lessons={lessons} />
      </section>
    </AppShell>
  );
}
