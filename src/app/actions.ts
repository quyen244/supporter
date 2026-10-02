"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ready, sql, type Lesson, type Student } from "@/lib/db";

function text(form: FormData, key: string): string {
  return String(form.get(key) ?? "").trim();
}

export async function listStudents() {
  await ready();
  return sql<(Student & { lesson_count: number })[]>`
    select s.*, count(l.id)::int as lesson_count
    from students s
    left join lessons l on l.student_id = s.id
    where s.archived = false
    group by s.id
    order by s.name
  `;
}

export async function getStudent(id: string) {
  await ready();
  const [student] = await sql<Student[]>`select * from students where id = ${id}`;
  if (!student) return null;
  const lessons = await sql<Lesson[]>`
    select * from lessons where student_id = ${id} order by position, created_at
  `;
  return { student, lessons };
}

export async function createStudent(form: FormData) {
  await ready();
  const name = text(form, "name");
  if (!name) return;
  const [row] = await sql<{ id: string }[]>`
    insert into students (name, class_code, teacher_name, playlist_url)
    values (${name}, ${text(form, "class_code")}, ${text(form, "teacher_name")}, ${text(form, "playlist_url")})
    returning id
  `;
  revalidatePath("/");
  redirect(`/hoc-vien/${row.id}`);
}

export async function updateStudent(form: FormData) {
  await ready();
  const id = text(form, "id");
  if (!id) return;
  await sql`
    update students set
      name = ${text(form, "name")},
      class_code = ${text(form, "class_code")},
      teacher_name = ${text(form, "teacher_name")},
      playlist_url = ${text(form, "playlist_url")}
    where id = ${id}
  `;
  revalidatePath(`/hoc-vien/${id}`);
  revalidatePath("/");
}

export async function archiveStudent(form: FormData) {
  await ready();
  const id = text(form, "id");
  if (!id) return;
  await sql`update students set archived = true where id = ${id}`;
  revalidatePath("/");
  redirect("/");
}

export async function saveLesson(form: FormData) {
  await ready();
  const studentId = text(form, "student_id");
  const id = text(form, "id");
  if (!studentId) return;

  const fields = {
    day_label: text(form, "day_label"),
    lesson_name: text(form, "lesson_name"),
    comment: text(form, "comment"),
    test_link: text(form, "test_link"),
  };

  if (id) {
    await sql`
      update lessons set
        day_label = ${fields.day_label},
        lesson_name = ${fields.lesson_name},
        comment = ${fields.comment},
        test_link = ${fields.test_link}
      where id = ${id} and student_id = ${studentId}
    `;
  } else {
    const [{ next }] = await sql<{ next: number }[]>`
      select coalesce(max(position), 0) + 1 as next from lessons where student_id = ${studentId}
    `;
    await sql`
      insert into lessons (student_id, day_label, lesson_name, comment, test_link, position)
      values (${studentId}, ${fields.day_label || String(next)}, ${fields.lesson_name}, ${fields.comment}, ${fields.test_link}, ${next})
    `;
  }
  revalidatePath(`/hoc-vien/${studentId}`);
  revalidatePath(`/phieu/${studentId}`);
}

export async function deleteLesson(form: FormData) {
  await ready();
  const id = text(form, "id");
  const studentId = text(form, "student_id");
  if (!id) return;
  await sql`delete from lessons where id = ${id}`;
  revalidatePath(`/hoc-vien/${studentId}`);
  revalidatePath(`/phieu/${studentId}`);
}
