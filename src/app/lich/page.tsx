import Link from "next/link";
import AppShell from "@/components/AppShell";
import Calendar from "@/components/Calendar";
import { requireUser } from "@/lib/session";
import { addDays, startOfWeek, todayISO, weekLabel } from "@/lib/week";
import { listMyStudents, listWeek } from "./actions";

export const dynamic = "force-dynamic";

const ISO = /^\d{4}-\d{2}-\d{2}$/;

export default async function Lich({ searchParams }: { searchParams: Promise<{ tuan?: string }> }) {
  const { tuan } = await searchParams;
  const user = await requireUser();

  const monday = startOfWeek(tuan && ISO.test(tuan) ? tuan : todayISO());
  const [slots, students] = await Promise.all([listWeek(monday), listMyStudents()]);

  const taught = slots.filter((s) => s.done).length;
  const nav = "grid h-9 w-9 place-items-center rounded-md border border-line bg-white text-ink-soft transition hover:border-sage-300 hover:text-sage";

  return (
    <AppShell
      title="Lịch dạy"
      user={user}
      breadcrumb={`${slots.length} buổi trong tuần · ${taught} đã dạy`}
      actions={
        <div className="flex items-center gap-2">
          <Link href={`/lich?tuan=${addDays(monday, -7)}`} aria-label="Tuần trước" className={nav}>
            ‹
          </Link>
          <Link
            href="/lich"
            className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-ink transition hover:border-sage-300"
          >
            Tuần này
          </Link>
          <Link href={`/lich?tuan=${addDays(monday, 7)}`} aria-label="Tuần sau" className={nav}>
            ›
          </Link>
        </div>
      }
    >
      <p className="mb-3 text-sm font-medium text-ink-soft">{weekLabel(monday)}</p>

      <Calendar monday={monday} slots={slots} students={students} />

      <p className="mt-3 text-xs leading-relaxed text-ink-faint">
        Bấm vào ô trống trên lưới để thêm buổi dạy đúng khung giờ đó. Bấm vào một buổi để sửa, đánh dấu đã dạy hoặc
        xoá. Buổi lặp hàng tuần được tạo thành nhiều buổi riêng, nên sửa một buổi không ảnh hưởng các buổi còn lại.
      </p>
    </AppShell>
  );
}
