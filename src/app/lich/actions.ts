"use server";

import { revalidatePath } from "next/cache";
import { ready, sql, type Schedule } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { addDays, minutesFromHHMM } from "@/lib/week";

export type SlotRow = Schedule & { student_name: string | null };

function text(form: FormData, key: string): string {
  return String(form.get(key) ?? "").trim();
}

function num(form: FormData, key: string, fallback: number): number {
  const n = Number(form.get(key));
  return Number.isFinite(n) ? n : fallback;
}

/** Ô nhập giờ của trình duyệt trả về "HH:MM", đổi sang số phút để lưu. */
function startMinute(form: FormData): number {
  return minutesFromHHMM(text(form, "start_time") || "08:00");
}

/** Lịch luôn thuộc về người đang đăng nhập, không ai xem lịch của người khác. */
async function ownsSlot(id: string): Promise<boolean> {
  const user = await requireUser();
  const [row] = await sql<{ id: string }[]>`
    select id from schedules where id = ${id} and owner_id = ${user.id}
  `;
  return Boolean(row);
}

export async function listWeek(mondayISO: string): Promise<SlotRow[]> {
  await ready();
  const user = await requireUser();
  const sunday = addDays(mondayISO, 6);
  // on_date phải ép sang text: driver trả kiểu date thành Date của JS, mà phía
  // client cần đúng chuỗi "YYYY-MM-DD" theo giờ treo tường, không qua múi giờ.
  return sql<SlotRow[]>`
    select s.*, s.on_date::text as on_date, st.name as student_name
    from schedules s
    left join students st on st.id = s.student_id
    where s.owner_id = ${user.id}
      and s.on_date between ${mondayISO} and ${sunday}
    order by s.on_date, s.start_min
  `;
}

export async function listUpcoming(limit = 5): Promise<SlotRow[]> {
  await ready();
  const user = await requireUser();
  return sql<SlotRow[]>`
    select s.*, s.on_date::text as on_date, st.name as student_name
    from schedules s
    left join students st on st.id = s.student_id
    where s.owner_id = ${user.id} and s.done = false and s.on_date >= current_date
    order by s.on_date, s.start_min
    limit ${limit}
  `;
}

/** Học viên của chính mình, dùng cho ô chọn trong hộp thoại thêm buổi. */
export async function listMyStudents(): Promise<{ id: string; name: string }[]> {
  await ready();
  const user = await requireUser();
  return sql<{ id: string; name: string }[]>`
    select id, name from students
    where owner_id = ${user.id} and archived = false
    order by name
  `;
}

export async function createSlot(form: FormData) {
  await ready();
  const user = await requireUser();

  const onDate = text(form, "on_date");
  const startMin = startMinute(form);
  const duration = Math.max(15, num(form, "duration_min", 60));
  if (!onDate) return;

  const studentId = text(form, "student_id") || null;
  const title = text(form, "title");
  const location = text(form, "location");
  const note = text(form, "note");

  // Lặp hàng tuần được tạo thành nhiều dòng thật thay vì một quy tắc lặp,
  // để sau này sửa hoặc đánh dấu từng buổi riêng lẻ không vướng gì.
  const repeat = Math.min(52, Math.max(1, num(form, "repeat_weeks", 1)));

  const rows = Array.from({ length: repeat }, (_, i) => ({
    owner_id: user.id,
    student_id: studentId,
    title,
    on_date: addDays(onDate, i * 7),
    start_min: startMin,
    duration_min: duration,
    location,
    note,
  }));

  await sql`insert into schedules ${sql(rows, "owner_id", "student_id", "title", "on_date", "start_min", "duration_min", "location", "note")}`;
  revalidatePath("/lich");
}

export async function updateSlot(form: FormData) {
  await ready();
  const id = text(form, "id");
  if (!id || !(await ownsSlot(id))) return;
  await sql`
    update schedules set
      student_id   = ${text(form, "student_id") || null},
      title        = ${text(form, "title")},
      on_date      = ${text(form, "on_date")},
      start_min    = ${startMinute(form)},
      duration_min = ${Math.max(15, num(form, "duration_min", 60))},
      location     = ${text(form, "location")},
      note         = ${text(form, "note")}
    where id = ${id}
  `;
  revalidatePath("/lich");
}

export async function toggleDone(form: FormData) {
  await ready();
  const id = text(form, "id");
  if (!id || !(await ownsSlot(id))) return;
  await sql`update schedules set done = not done where id = ${id}`;
  revalidatePath("/lich");
}

export async function deleteSlot(form: FormData) {
  await ready();
  const id = text(form, "id");
  if (!id || !(await ownsSlot(id))) return;
  await sql`delete from schedules where id = ${id}`;
  revalidatePath("/lich");
}

/** Xoá cả chuỗi buổi giống nhau từ ngày này trở đi, dùng khi lỡ tạo lặp sai. */
export async function deleteFollowing(form: FormData) {
  await ready();
  const user = await requireUser();
  const id = text(form, "id");
  if (!id || !(await ownsSlot(id))) return;
  const [row] = await sql<Schedule[]>`select *, on_date::text as on_date from schedules where id = ${id}`;
  if (!row) return;
  await sql`
    delete from schedules
    where owner_id = ${user.id}
      and on_date >= ${row.on_date}
      and start_min = ${row.start_min}
      and coalesce(student_id::text, '') = ${row.student_id ?? ""}
      and title = ${row.title}
  `;
  revalidatePath("/lich");
}
