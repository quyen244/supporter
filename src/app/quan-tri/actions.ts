"use server";

import { revalidatePath } from "next/cache";
import { ROLE_ADMIN, ROLE_TEACHER } from "@/lib/auth";
import { ready, sql } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export type TeacherRow = {
  id: string;
  name: string;
  email: string;
  role: string | null;
  banned: boolean | null;
  created_at: Date;
  student_count: number;
  lesson_count: number;
};

export async function listTeachers(): Promise<TeacherRow[]> {
  await ready();
  await requireAdmin();
  return sql<TeacherRow[]>`
    select
      u.id, u.name, u.email, u.role, u.banned, u."createdAt" as created_at,
      count(distinct s.id)::int as student_count,
      count(l.id)::int as lesson_count
    from "user" u
    left join students s on s.owner_id = u.id and s.archived = false
    left join lessons l on l.student_id = s.id
    group by u.id, u.name, u.email, u.role, u.banned, u."createdAt"
    order by u."createdAt"
  `;
}

export async function setRole(form: FormData) {
  const admin = await requireAdmin();
  const id = String(form.get("id") ?? "");
  const role = String(form.get("role") ?? "");
  if (!id || ![ROLE_ADMIN, ROLE_TEACHER].includes(role)) return;
  // Không cho tự hạ quyền chính mình, tránh khoá mất lối vào trang quản trị.
  if (id === admin.id) return;
  await sql`update "user" set role = ${role} where id = ${id}`;
  revalidatePath("/quan-tri");
}

export async function setBanned(form: FormData) {
  const admin = await requireAdmin();
  const id = String(form.get("id") ?? "");
  const banned = String(form.get("banned") ?? "") === "1";
  if (!id || id === admin.id) return;
  await sql`update "user" set banned = ${banned} where id = ${id}`;
  // Khoá tài khoản thì xoá luôn phiên đang mở, nếu không họ vẫn dùng được tới khi hết hạn.
  if (banned) await sql`delete from session where "userId" = ${id}`;
  revalidatePath("/quan-tri");
}
