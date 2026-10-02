"use client";

import { useRef, useState } from "react";
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
  const formRef = useRef<HTMLFormElement>(null);

  function addLine(line: string) {
    setComment((prev) => (prev.trim() ? `${prev.replace(/\s+$/, "")}\n- ${line}` : `- ${line}`));
  }

  const input = "w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500";

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await saveLesson(fd);
        if (!lesson?.id) setComment("");
        onDone?.();
      }}
      className="space-y-3 rounded-xl border border-slate-200 bg-white p-4"
    >
      <input type="hidden" name="student_id" value={studentId} />
      {lesson?.id && <input type="hidden" name="id" value={lesson.id} />}

      <div className="grid gap-3 sm:grid-cols-[110px_1fr]">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600">Buổi</span>
          <input name="day_label" defaultValue={lesson?.day_label ?? nextDay} className={input} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600">Tên bài học</span>
          <input name="lesson_name" defaultValue={lesson?.lesson_name ?? ""} placeholder="Unit 1 - Lesson 1" className={input} />
        </label>
      </div>

      <CommentBuilder onAdd={addLine} />

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-slate-600">Nhận xét</span>
        <textarea
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={5}
          placeholder="Bấm mẫu câu ở trên, hoặc gõ trực tiếp."
          className={`${input} font-mono text-sm`}
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-slate-600">Link kết quả test</span>
        <input name="test_link" defaultValue={lesson?.test_link ?? ""} placeholder="https://..." className={input} />
      </label>

      <div className="flex gap-2">
        <button className="rounded-lg bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-700">
          {lesson?.id ? "Lưu" : "Thêm buổi"}
        </button>
        {onDone && (
          <button type="button" onClick={onDone} className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100">
            Huỷ
          </button>
        )}
      </div>
    </form>
  );
}
