"use client";

import { useState } from "react";
import CommentBuilder from "./CommentBuilder";
import { saveLesson } from "@/app/actions";

export type LessonDraft = {
  id?: string;
  day_label: string;
  lesson_name: string;
  comment: string;
  test_link: string;
};

export default function LessonForm({
  studentId,
  lesson,
  nextDay,
  onDone,
}: {
  studentId: string;
  lesson?: LessonDraft;
  nextDay: string;
  onDone?: () => void;
}) {
  const [comment, setComment] = useState(lesson?.comment ?? "");

  function addLine(line: string) {
    setComment((prev) => (prev.trim() ? `${prev.replace(/\s+$/, "")}\n- ${line}` : `- ${line}`));
  }

  return (
    <form
      action={async (fd) => {
        await saveLesson(fd);
        if (!lesson?.id) setComment("");
        onDone?.();
      }}
      className="card space-y-4 p-5"
    >
      <input type="hidden" name="student_id" value={studentId} />
      {lesson?.id && <input type="hidden" name="id" value={lesson.id} />}

      <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
        <div>
          <label className="label" htmlFor={`d-${lesson?.id ?? "new"}`}>
            Buổi
          </label>
          <input
            id={`d-${lesson?.id ?? "new"}`}
            name="day_label"
            defaultValue={lesson?.day_label ?? nextDay}
            className="field text-center font-semibold"
          />
        </div>
        <div>
          <label className="label" htmlFor={`l-${lesson?.id ?? "new"}`}>
            Tên bài học
          </label>
          <input
            id={`l-${lesson?.id ?? "new"}`}
            name="lesson_name"
            defaultValue={lesson?.lesson_name ?? ""}
            placeholder="Unit 1 - Lesson 1"
            className="field"
          />
        </div>
      </div>

      <CommentBuilder onAdd={addLine} />

      <div>
        <label className="label" htmlFor={`c-${lesson?.id ?? "new"}`}>
          Nhận xét
        </label>
        <textarea
          id={`c-${lesson?.id ?? "new"}`}
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={5}
          placeholder="Bấm mẫu câu ở trên, hoặc gõ trực tiếp."
          className="field resize-y leading-relaxed"
        />
      </div>

      <div>
        <label className="label" htmlFor={`t-${lesson?.id ?? "new"}`}>
          Link kết quả test
        </label>
        <input
          id={`t-${lesson?.id ?? "new"}`}
          name="test_link"
          defaultValue={lesson?.test_link ?? ""}
          placeholder="https://..."
          className="field"
        />
      </div>

      <div className="flex gap-2 pt-1">
        <button className="rounded-xl bg-sage px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-600">
          {lesson?.id ? "Lưu" : "Thêm buổi"}
        </button>
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-ink-soft transition hover:bg-sand"
          >
            Huỷ
          </button>
        )}
      </div>
    </form>
  );
}
