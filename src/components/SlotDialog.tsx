"use client";

import { useEffect, useRef } from "react";
import { createSlot, deleteFollowing, deleteSlot, toggleDone, updateSlot, type SlotRow } from "@/app/lich/actions";
import { hhmm } from "@/lib/week";
import { IconTrash } from "./icons";

export type Draft =
  | { mode: "create"; on_date: string; start_min: number }
  | { mode: "edit"; slot: SlotRow };

export default function SlotDialog({
  draft,
  students,
  onClose,
}: {
  draft: Draft | null;
  students: { id: string; name: string }[];
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (draft && !el.open) el.showModal();
    if (!draft && el.open) el.close();
  }, [draft]);

  if (!draft) return <dialog ref={ref} className="hidden" />;

  const editing = draft.mode === "edit";
  const slot = editing ? draft.slot : null;
  const onDate = editing ? slot!.on_date : draft.on_date;
  const startMin = editing ? slot!.start_min : draft.start_min;

  async function submit(fd: FormData) {
    await (editing ? updateSlot(fd) : createSlot(fd));
    onClose();
  }

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="m-auto w-[min(34rem,calc(100vw-2rem))] rounded-3xl border border-line bg-white p-0 backdrop:bg-ink/30 backdrop:backdrop-blur-sm"
    >
      <form action={submit} className="p-6">
        {editing && <input type="hidden" name="id" value={slot!.id} />}

        <h2 className="text-lg font-bold text-ink">{editing ? "Sửa buổi dạy" : "Thêm buổi dạy"}</h2>
        <p className="mt-1 text-sm text-ink-soft">
          {editing ? "Đổi thông tin hoặc xoá buổi này." : "Buổi mới sẽ nằm đúng ô bạn vừa bấm."}
        </p>

        <div className="mt-5 grid gap-4">
          <div>
            <label htmlFor="sd-student" className="label">
              Học viên
            </label>
            <select id="sd-student" name="student_id" defaultValue={slot?.student_id ?? ""} className="field">
              <option value="">Không gắn học viên cụ thể</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sd-title" className="label">
              Tên lớp hoặc nội dung
            </label>
            <input
              id="sd-title"
              name="title"
              defaultValue={slot?.title ?? ""}
              placeholder="Lớp PK2609125 - Unit 1"
              className="field"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="sd-date" className="label">
                Ngày
              </label>
              <input id="sd-date" type="date" name="on_date" defaultValue={onDate} required className="field" />
            </div>
            <div>
              <label htmlFor="sd-time" className="label">
                Giờ bắt đầu
              </label>
              <input id="sd-time" type="time" name="start_time" defaultValue={hhmm(startMin)} required step={300} className="field" />
            </div>
            <div>
              <label htmlFor="sd-dur" className="label">
                Thời lượng
              </label>
              <select id="sd-dur" name="duration_min" defaultValue={String(slot?.duration_min ?? 60)} className="field">
                {[30, 45, 60, 90, 120, 180].map((m) => (
                  <option key={m} value={m}>
                    {m} phút
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="sd-loc" className="label">
                Địa điểm
              </label>
              <input
                id="sd-loc"
                name="location"
                defaultValue={slot?.location ?? ""}
                placeholder="Online / Phòng 302"
                className="field"
              />
            </div>
            {!editing && (
              <div>
                <label htmlFor="sd-rep" className="label">
                  Lặp hàng tuần
                </label>
                <select id="sd-rep" name="repeat_weeks" defaultValue="1" className="field">
                  <option value="1">Chỉ buổi này</option>
                  <option value="4">4 tuần</option>
                  <option value="8">8 tuần</option>
                  <option value="12">12 tuần</option>
                  <option value="24">24 tuần</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="sd-note" className="label">
              Ghi chú
            </label>
            <textarea id="sd-note" name="note" defaultValue={slot?.note ?? ""} rows={2} className="field resize-y" />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <button className="rounded-xl bg-sage px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-600">
            {editing ? "Lưu" : "Thêm buổi"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-ink-soft transition hover:bg-sand"
          >
            Huỷ
          </button>
        </div>
      </form>

      {editing && (
        <div className="flex flex-wrap items-center gap-2 border-t border-line bg-cream px-6 py-4">
          <form action={async (fd) => { await toggleDone(fd); onClose(); }}>
            <input type="hidden" name="id" value={slot!.id} />
            <button
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                slot!.done ? "bg-ok-bg text-sage-700" : "bg-white text-ink ring-1 ring-line hover:ring-sage"
              }`}
            >
              {slot!.done ? "Đã dạy xong" : "Đánh dấu đã dạy"}
            </button>
          </form>

          <form action={async (fd) => { await deleteSlot(fd); onClose(); }} className="ml-auto">
            <input type="hidden" name="id" value={slot!.id} />
            <button className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-alert transition hover:bg-alert-bg">
              <IconTrash />
              Xoá buổi này
            </button>
          </form>

          <form action={async (fd) => { await deleteFollowing(fd); onClose(); }}>
            <input type="hidden" name="id" value={slot!.id} />
            <button className="rounded-xl px-3 py-2 text-sm font-medium text-alert transition hover:bg-alert-bg">
              Xoá cả chuỗi từ đây
            </button>
          </form>
        </div>
      )}
    </dialog>
  );
}
