import postgres from "postgres";

declare global {
  var __sql: ReturnType<typeof postgres> | undefined;
  var __migrated: Promise<void> | undefined;
}

/*
 * Không ném lỗi ngay lúc nạp module: Next vẫn import file này khi build, mà
 * lúc build trên Vercel biến môi trường có thể chưa được gắn. Thiếu cấu hình
 * sẽ báo ở ready() với thông điệp rõ ràng thay vì làm hỏng cả bản build.
 */
const connectionString = process.env.DATABASE_URL ?? "";
const isLocal = connectionString.includes("localhost") || connectionString.includes("127.0.0.1");

export const sql =
  global.__sql ??
  postgres(connectionString, {
    // Chạy serverless nên mỗi instance sống ngắn; giữ pool nhỏ để không chạm
    // trần kết nối của Neon. Nhớ dùng chuỗi kết nối có -pooler.
    max: isLocal ? 5 : 3,
    idle_timeout: 20,
    ssl: isLocal ? false : "require",
  });

if (process.env.NODE_ENV !== "production") global.__sql = sql;

async function migrate() {
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL chưa được cấu hình. Trên Vercel vào Settings > Environment Variables để thêm."
    );
  }
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

  // Chủ sở hữu học viên. Để nullable vì bảng user do Better Auth tạo và có thể
  // chưa tồn tại lúc chạy lần đầu; mọi bản ghi mới đều được gán owner.
  await sql`alter table students add column if not exists owner_id text`;
  await sql`create index if not exists students_owner_idx on students (owner_id)`;

  /*
   * Lịch dạy lưu giờ theo đồng hồ treo tường (ngày + số phút từ 0h), không dùng
   * timestamptz. Buổi dạy "thứ Hai 14h" phải luôn là 14h bất kể server đặt ở
   * múi giờ nào; dùng timestamptz sẽ lệch giờ khi deploy lên server UTC.
   * Buổi lặp hàng tuần được tạo thành nhiều dòng thật, nên sửa hoặc đánh dấu
   * từng buổi độc lập được.
   */
  await sql`
    create table if not exists schedules (
      id           uuid primary key default gen_random_uuid(),
      owner_id     text not null,
      student_id   uuid references students(id) on delete set null,
      title        text not null default '',
      on_date      date not null,
      start_min    integer not null,
      duration_min integer not null default 60,
      location     text not null default '',
      note         text not null default '',
      done         boolean not null default false,
      created_at   timestamptz not null default now()
    )
  `;
  await sql`create index if not exists schedules_owner_date_idx on schedules (owner_id, on_date)`;
}

export function ready() {
  global.__migrated ??= migrate();
  return global.__migrated;
}

export type Student = {
  id: string;
  owner_id: string | null;
  name: string;
  class_code: string;
  teacher_name: string;
  playlist_url: string;
  parent_note: string;
  archived: boolean;
  created_at: Date;
};

export type Schedule = {
  id: string;
  owner_id: string;
  student_id: string | null;
  title: string;
  on_date: string;
  start_min: number;
  duration_min: number;
  location: string;
  note: string;
  done: boolean;
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
