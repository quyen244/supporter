"use client";

import { useState } from "react";
import LessonForm, { type LessonDraft } from "./LessonForm";
import { deleteLesson } from "@/app/actions";
import { IconEdit, IconLink, IconTrash } from "./icons";

export default function LessonList({ studentId, lessons }: { studentId: string; lessons: LessonDraft[] }) {
  const [editing, setEditing] = useState<string | null>(null);

  if (lessons.length === 0) {
    return (
      <p className="card px-6 py-10 text-center text-sm text-ink-soft">
        Chưa có buổi học nào. Thêm buổi đầu tiên ở trên.
      </p>
    );
  }

  return (
    <ul className="space-y-2.5">
      {[...lessons].reverse().map((l) =>
        editing === l.id ? (
          <li key={l.id}>
            <LessonForm studentId={studentId} lesson={l} nextDay={l.day_label} onDone={() => setEditing(null)} />
          </li>
        ) : (
          <li key={l.id} className="card flex items-start gap-3.5 p-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-sage-100 text-sm font-bold text-sage-700">
              {l.day_label}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-ink">{l.lesson_name || "Chưa đặt tên bài"}</p>
              {l.comment && (
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">{l.comment}</p>
              )}
              {l.test_link && (
                <a
                  href={l.test_link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex max-w-full items-center gap-1 truncate text-xs font-medium text-sage-700 hover:underline"
                >
                  <IconLink className="shrink-0" />
                  <span className="truncate">{l.test_link}</span>
                </a>
              )}
            </div>

            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                onClick={() => setEditing(l.id!)}
                aria-label="Sửa buổi học"
                className="grid h-8 w-8 place-items-center rounded-lg text-ink-faint transition hover:bg-sand hover:text-ink"
              >
                <IconEdit />
              </button>
              <form action={deleteLesson}>
                <input type="hidden" name="id" value={l.id} />
                <input type="hidden" name="student_id" value={studentId} />
                <button
                  aria-label="Xoá buổi học"
                  className="grid h-8 w-8 place-items-center rounded-lg text-ink-faint transition hover:bg-alert-bg hover:text-alert"
                >
                  <IconTrash />
                </button>
              </form>
            </div>
          </li>
        )
      )}
    </ul>
  );
}
