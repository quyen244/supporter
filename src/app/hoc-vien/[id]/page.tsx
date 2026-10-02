import Link from "next/link";
import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import LessonForm from "@/components/LessonForm";
import LessonList from "@/components/LessonList";
import StudentInfo from "@/components/StudentInfo";
import { SheetCapacity, StatTile } from "@/components/Stats";
import { IconSheet } from "@/components/icons";
import { requireUser } from "@/lib/session";
import { getStudent } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function HocVien({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const data = await getStudent(id);
  if (!data) notFound();
  const { student, lessons } = data;

  const last = lessons[lessons.length - 1];
  const withTest = lessons.filter((l) => l.test_link).length;

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
          <span className="rounded-sm bg-sand px-1.5 py-0.5 text-xs font-medium">
            {student.class_code || "chưa có mã lớp"}
          </span>
        </span>
      }
      actions={
        <Link
          href={`/phieu/${student.id}`}
          className="flex items-center gap-1.5 rounded-md bg-sage px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-600"
        >
          <IconSheet />
          Xem phiếu &amp; gửi
        </Link>
      }
    >
      {/*
       * Hai cột: cột trái là việc làm hằng ngày (viết nhận xét), cột phải là
       * thông tin tra cứu. Trước đây tất cả xếp dọc nên form bị kéo ngang quá
       * rộng mà màn hình vẫn thừa chỗ trống hai bên.
       */}
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-6">
          <section>
            <h2 className="mb-3 text-base font-bold text-ink">Thêm buổi học</h2>
            <LessonForm studentId={student.id} nextDay={String(lessons.length + 1).padStart(2, "0")} />
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-ink">
              Các buổi đã nhận xét
              {lessons.length > 0 && (
                <span className="ml-2 text-sm font-normal text-ink-soft">{lessons.length} buổi</span>
              )}
            </h2>
            <LessonList studentId={student.id} lessons={lessons} />
          </section>
        </div>

        <aside className="min-w-0 space-y-4 xl:sticky xl:top-6">
          <div className="grid grid-cols-2 gap-3">
            <StatTile label="Buổi đã nhận xét" value={String(lessons.length)} unit="buổi" />
            <StatTile label="Buổi gần nhất" value={last?.day_label || "–"} hint={last?.lesson_name || undefined} />
          </div>

          <SheetCapacity used={lessons.length} />

          <StatTile
            label="Buổi có link kết quả test"
            value={`${withTest}/${lessons.length || 0}`}
            hint={
              lessons.length === 0
                ? "chưa có buổi nào"
                : withTest === lessons.length
                  ? "đủ cả, phụ huynh xem được hết"
                  : `${lessons.length - withTest} buổi chưa gắn link`
            }
          />

          <StudentInfo student={student} />
        </aside>
      </div>
    </AppShell>
  );
}
