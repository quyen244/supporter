"use client";

import Link from "next/link";
import { useState } from "react";
import type { SlotRow } from "@/app/lich/actions";
import SlotDialog, { type Draft } from "./SlotDialog";
import { DAY_NAMES, GRID, hhmm, shortDate, todayISO, weekDays } from "@/lib/week";

const SNAP = 15; // phút

function slotLabel(s: SlotRow): string {
  return s.student_name || s.title || "Buổi dạy";
}

function Block({ slot, onOpen }: { slot: SlotRow; onOpen: () => void }) {
  const top = ((slot.start_min - GRID.from * 60) / 60) * GRID.rowHeight;
  const height = Math.max(22, (slot.duration_min / 60) * GRID.rowHeight - 3);

  return (
    <button
      type="button"
      // Chặn lan lên cột ngày, nếu không ô "thêm mới" sẽ đè lên ô "sửa".
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
      style={{ top, height }}
      className={`absolute inset-x-1 z-10 overflow-hidden rounded-sm border px-2 py-1 text-left transition hover:z-20 ${
        slot.done
          ? "border-line bg-mist text-ink-faint line-through"
          : "border-sage-300 bg-sage-50 text-sage-900 hover:border-sage"
      }`}
    >
      <span className="block truncate text-xs font-semibold">{slotLabel(slot)}</span>
      <span className="block truncate text-[11px] opacity-70">
        {hhmm(slot.start_min)}
        {slot.location && ` · ${slot.location}`}
      </span>
    </button>
  );
}

export default function Calendar({
  monday,
  slots,
  students,
}: {
  monday: string;
  slots: SlotRow[];
  students: { id: string; name: string }[];
}) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const days = weekDays(monday);
  const today = todayISO();
  const hours = Array.from({ length: GRID.to - GRID.from }, (_, i) => GRID.from + i);

  const byDay = (iso: string) => slots.filter((s) => s.on_date === iso);

  function openAt(iso: string, e: React.MouseEvent<HTMLDivElement>) {
    const box = e.currentTarget.getBoundingClientRect();
    const offset = e.clientY - box.top;
    const raw = GRID.from * 60 + (offset / GRID.rowHeight) * 60;
    const snapped = Math.round(raw / SNAP) * SNAP;
    setDraft({ mode: "create", on_date: iso, start_min: Math.min(23 * 60, Math.max(0, snapped)) });
  }

  return (
    <>
      {/* Máy tính: lưới 7 cột theo giờ */}
      <div className="card hidden overflow-hidden md:block">
        <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-line bg-cream">
          <div />
          {days.map((iso, i) => (
            <div
              key={iso}
              className={`border-l border-line px-2 py-2.5 text-center ${iso === today ? "bg-sage-50" : ""}`}
            >
              <p className="text-xs font-semibold text-ink-soft">{DAY_NAMES[i]}</p>
              <p className={`text-sm font-bold ${iso === today ? "text-sage-700" : "text-ink"}`}>{shortDate(iso)}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[56px_repeat(7,1fr)]">
          <div>
            {hours.map((h) => (
              <div
                key={h}
                style={{ height: GRID.rowHeight }}
                className="relative border-b border-line pr-2 text-right text-[11px] text-ink-faint"
              >
                <span className="absolute -top-1.5 right-2">{String(h).padStart(2, "0")}:00</span>
              </div>
            ))}
          </div>

          {days.map((iso) => (
            <div
              key={iso}
              data-day={iso}
              onClick={(e) => openAt(iso, e)}
              className={`relative cursor-pointer border-l border-line ${iso === today ? "bg-sage-50/40" : ""}`}
            >
              {hours.map((h) => (
                <div key={h} style={{ height: GRID.rowHeight }} className="border-b border-line hover:bg-sage-50/60" />
              ))}
              {byDay(iso).map((s) => (
                <Block
                  key={s.id}
                  slot={s}
                  onOpen={() => setDraft({ mode: "edit", slot: s })}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Điện thoại: danh sách theo ngày, lưới 7 cột quá chật để bấm */}
      <div className="space-y-3 md:hidden">
        {days.map((iso, i) => {
          const items = byDay(iso);
          return (
            <section key={iso} className={`card p-4 ${iso === today ? "border-sage-300" : ""}`}>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-bold text-ink">
                  {DAY_NAMES[i]} <span className="font-normal text-ink-soft">{shortDate(iso)}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setDraft({ mode: "create", on_date: iso, start_min: 8 * 60 })}
                  className="rounded-md bg-sage-50 px-2.5 py-1 text-xs font-semibold text-sage-700"
                >
                  + Thêm
                </button>
              </div>
              {items.length === 0 ? (
                <p className="text-xs text-ink-faint">Không có buổi nào.</p>
              ) : (
                <ul className="space-y-1.5">
                  {items.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => setDraft({ mode: "edit", slot: s })}
                        className={`flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left ${
                          s.done ? "border-line bg-mist text-ink-faint" : "border-sage-200 bg-sage-50"
                        }`}
                      >
                        <span className="text-xs font-bold tabular-nums">{hhmm(s.start_min)}</span>
                        <span className="min-w-0 flex-1">
                          <span className={`block truncate text-sm font-semibold ${s.done ? "line-through" : "text-sage-900"}`}>
                            {slotLabel(s)}
                          </span>
                          {s.location && <span className="block truncate text-[11px] text-ink-soft">{s.location}</span>}
                        </span>
                        {s.student_id && !s.done && (
                          <Link
                            href={`/hoc-vien/${s.student_id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="shrink-0 rounded-md bg-white px-2 py-1 text-[11px] font-semibold text-sage-700 ring-1 ring-line"
                          >
                            Nhận xét
                          </Link>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      <SlotDialog draft={draft} students={students} onClose={() => setDraft(null)} />
    </>
  );
}
