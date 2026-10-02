"use client";

import { useState } from "react";
import LessonForm, { type LessonDraft } from "./LessonForm";
import { deleteLesson } from "@/app/actions";

export default function LessonList({ studentId, lessons }: { studentId: string; lessons: LessonDraft[] }) {
  const [editing, setEditing] = useState<string | null>(null);

  if (lessons.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
        Chưa có buổi học nào.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {lessons.map((l) => (
        <li key={l.id}>
          {editing === l.id ? (
            <LessonForm studentId={studentId} lesson={l} nextDay={l.day_label} onDone={() => setEditing(null)} />
          ) : (
            <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">
                {l.day_label}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">{l.lesson_name || "(chưa đặt tên bài)"}</p>
                <p className="whitespace-pre-wrap text-xs text-slate-600">{l.comment}</p>
                {l.test_link && (
                  <a href={l.test_link} target="_blank" rel="noreferrer" className="mt-1 block truncate text-xs text-sky-600 underline">
                    {l.test_link}
                  </a>
                )}
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => setEditing(l.id!)}
                  className="rounded-lg px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
                >
                  Sửa
                </button>
                <form action={deleteLesson}>
                  <input type="hidden" name="id" value={l.id} />
                  <input type="hidden" name="student_id" value={studentId} />
                  <button className="rounded-lg px-2 py-1 text-xs text-rose-600 hover:bg-rose-50">Xoá</button>
                </form>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
