import { ROWS } from "@/lib/layout";

/**
 * Thẻ số liệu: một con số lớn kèm nhãn. Cố tình không dùng biểu đồ ở đây.
 * Dữ liệu hiện chỉ có số buổi và ngày tháng, chưa lưu điểm số theo kỹ năng,
 * nên vẽ biểu đồ xu hướng sẽ là bịa ra thứ không có thật.
 */
export function StatTile({
  label,
  value,
  unit,
  hint,
}: {
  label: string;
  value: string;
  unit?: string;
  hint?: string;
}) {
  return (
    <div className="card px-4 py-3.5">
      <p className="text-xs font-medium tracking-wide text-ink-soft">{label}</p>
      <p className="mt-1.5 truncate text-[22px] font-bold leading-tight text-ink" title={value}>
        {value}
        {unit && <span className="ml-1 text-sm font-medium text-ink-faint">{unit}</span>}
      </p>
      {hint && <p className="mt-0.5 text-xs text-ink-faint">{hint}</p>}
    </div>
  );
}

/**
 * Thanh sức chứa phiếu: mỗi trang phiếu có đúng 18 dòng. Giáo viên cần biết
 * khi nào sắp tràn sang trang thứ hai, vì phiếu 2 trang gửi phụ huynh bất tiện.
 * Dùng một tông xanh rêu đi từ nhạt tới đậm; chỉ đổi sang màu cảnh báo khi
 * thực sự là trạng thái cần chú ý, không dùng màu để trang trí.
 */
export function SheetCapacity({ used }: { used: number }) {
  const perPage = ROWS.perPage;
  const pages = Math.max(1, Math.ceil(used / perPage) || 1);
  const onLastPage = used - (pages - 1) * perPage;
  const ratio = Math.min(1, onLastPage / perPage);

  const nearFull = used > 0 && onLastPage >= perPage - 2;
  const multiPage = pages > 1;

  const barColor = nearFull ? "bg-warn" : "bg-sage";
  const note = multiPage
    ? `Phiếu đã sang trang ${pages}`
    : nearFull
      ? `Còn ${perPage - onLastPage} dòng là sang trang 2`
      : `Còn ${perPage - onLastPage} dòng trống`;

  return (
    <div className="card px-4 py-3.5">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-xs font-medium tracking-wide text-ink-soft">Sức chứa phiếu</p>
        <p className="text-xs font-semibold tabular-nums text-ink">
          {onLastPage}/{perPage} dòng
        </p>
      </div>

      <div
        className="mt-2.5 h-1.5 w-full overflow-hidden rounded-sm bg-sand"
        role="img"
        aria-label={`Đã dùng ${onLastPage} trên ${perPage} dòng của trang phiếu`}
      >
        <div className={`h-full rounded-sm ${barColor}`} style={{ width: `${Math.max(2, ratio * 100)}%` }} />
      </div>

      <p className={`mt-1.5 text-xs ${nearFull || multiPage ? "text-warn" : "text-ink-faint"}`}>{note}</p>
    </div>
  );
}
