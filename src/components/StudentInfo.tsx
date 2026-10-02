"use client";

import { useState } from "react";
import { archiveStudent, updateStudent } from "@/app/actions";
import type { Student } from "@/lib/db";
import { useToast } from "./Toast";

export default function StudentInfo({ student }: { student: Student }) {
  const toast = useToast();
  const [open, setOpen] = useState(false);

  return (
    <section className="card mb-6 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span>
          <span className="block font-bold text-ink">Thông tin trên phiếu</span>
          <span className="mt-0.5 block text-xs text-ink-soft">
            {student.class_code || "chưa có mã lớp"} · {student.teacher_name || "chưa có tên giáo viên"} ·{" "}
            {student.playlist_url ? "đã có playlist" : "chưa có playlist"}
          </span>
        </span>
        <span className={`text-ink-faint transition ${open ? "rotate-180" : ""}`}>▾</span>
      </button>

      {open && (
        <div className="border-t border-line p-5">
          <form
            action={async (fd) => {
              await updateStudent(fd);
              toast.ok("Đã lưu thông tin phiếu");
            }}
            // Một cột: khối này nằm ở cột phụ hẹp, chia đôi sẽ chật khó đọc.
            className="grid gap-3.5"
          >
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
            <div>
              <button className="rounded-md bg-sage px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-600">
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
      )}
    </section>
  );
}
