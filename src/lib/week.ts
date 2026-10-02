/**
 * Tiện ích ngày giờ cho lịch dạy.
 * Ngày là chuỗi "YYYY-MM-DD", giờ là số phút tính từ 0h. Không dùng Date có
 * múi giờ để tránh lệch giờ khi server chạy ở UTC còn giáo viên ở Việt Nam.
 */

export const DAY_NAMES = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

/** Khung giờ hiển thị trên lưới. */
export const GRID = { from: 6, to: 22, rowHeight: 56 } as const;

export function toISODate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function fromISODate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(iso: string, n: number): string {
  const d = fromISODate(iso);
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

/** Thứ Hai của tuần chứa ngày đã cho. */
export function startOfWeek(iso: string): string {
  const d = fromISODate(iso);
  const shift = (d.getDay() + 6) % 7; // Chủ nhật = 0 trong JS, đưa về cuối tuần
  d.setDate(d.getDate() - shift);
  return toISODate(d);
}

export function weekDays(mondayISO: string): string[] {
  return Array.from({ length: 7 }, (_, i) => addDays(mondayISO, i));
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function hhmm(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function minutesFromHHMM(value: string): number {
  const [h, m] = value.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

const dayMonth = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit" });
const full = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

export function shortDate(iso: string): string {
  return dayMonth.format(fromISODate(iso));
}

export function fullDate(iso: string): string {
  return full.format(fromISODate(iso));
}

export function weekLabel(mondayISO: string): string {
  return `${shortDate(mondayISO)} - ${fullDate(addDays(mondayISO, 6))}`;
}
