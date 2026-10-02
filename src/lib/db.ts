import postgres from "postgres";

declare global {
  // eslint-disable-next-line no-var
  var __sql: ReturnType<typeof postgres> | undefined;
  // eslint-disable-next-line no-var
  var __migrated: Promise<void> | undefined;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL chưa được cấu hình");

export const sql =
  global.__sql ??
  postgres(connectionString, {
    max: 5,
    idle_timeout: 20,
    ssl: connectionString.includes("localhost") || connectionString.includes("127.0.0.1") ? false : "require",
  });

if (process.env.NODE_ENV !== "production") global.__sql = sql;

async function migrate() {
  await sql`
    create table if not exists students (
      id           uuid primary key default gen_random_uuid(),
      name         text not null,
      class_code   text not null default '',
      teacher_name text not null default '',
      playlist_url text not null default '',
      parent_note  text not null default '',
      archived     boolean not null default false,
      created_at   timestamptz not null default now()
    )
  `;
  await sql`
    create table if not exists lessons (
      id          uuid primary key default gen_random_uuid(),
      student_id  uuid not null references students(id) on delete cascade,
      day_label   text not null default '',
      lesson_name text not null default '',
      comment     text not null default '',
      test_link   text not null default '',
      taught_on   date,
      position    integer not null default 0,
      created_at  timestamptz not null default now()
    )
  `;
  await sql`create index if not exists lessons_student_idx on lessons (student_id, position)`;
}

export function ready() {
  global.__migrated ??= migrate();
  return global.__migrated;
}

export type Student = {
  id: string;
  name: string;
  class_code: string;
  teacher_name: string;
  playlist_url: string;
  parent_note: string;
  archived: boolean;
  created_at: Date;
};

export type Lesson = {
  id: string;
  student_id: string;
  day_label: string;
  lesson_name: string;
  comment: string;
  test_link: string;
  taught_on: Date | null;
  position: number;
  created_at: Date;
};
