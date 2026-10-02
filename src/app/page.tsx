import Link from "next/link";
import AppShell from "@/components/AppShell";
import NewStudent from "@/components/NewStudent";
import { IconChevron, IconSheet } from "@/components/icons";
import { listStudents } from "./actions";

export const dynamic = "force-dynamic";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (parts[parts.length - 1]?.[0] ?? "?").toUpperCase();
}

export default async function Home() {
  const students = await listStudents();
  const totalLessons = students.reduce((s, x) => s + x.lesson_count, 0);

  return (
    <AppShell
      title="Học viên"
      breadcrumb={`${students.length} học viên · ${totalLessons} buổi đã nhận xét`}
      actions={<NewStudent />}
    >
      {students.length === 0 ? (
        <div className="card grid place-items-center px-6 py-16 text-center">
          <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-sage-50 text-sage">
            <IconSheet className="scale-125" />
          </span>
          <p className="font-semibold text-ink">Chưa có học viên nào</p>
          <p className="mt-1 max-w-xs text-sm text-ink-soft">
            Thêm học viên đầu tiên để bắt đầu ghi nhận xét sau mỗi buổi dạy.
          </p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {students.map((s) => (
            <li key={s.id}>
              <Link
                href={`/hoc-vien/${s.id}`}
                className="card group flex items-center gap-4 p-4 transition hover:border-sage-300 hover:shadow-[0_12px_30px_-20px_rgba(47,51,39,0.5)]"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sage-100 text-lg font-bold text-sage-700">
                  {initials(s.name)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-ink">{s.name}</span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-ink-soft">
                    <span className="rounded-md bg-sand px-1.5 py-0.5 font-medium">
                      {s.class_code || "chưa có mã lớp"}
                    </span>
                    <span>{s.lesson_count} buổi</span>
                  </span>
                </span>
                <IconChevron className="shrink-0 text-ink-faint transition group-hover:translate-x-0.5 group-hover:text-sage" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
