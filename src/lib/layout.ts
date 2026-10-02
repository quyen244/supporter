/**
 * Toạ độ đo trực tiếp từ PDF gốc, đơn vị point (1pt = 1px khi render ở 72dpi).
 * Khổ US Letter 612x792. Đừng sửa tay - nếu phiếu gốc đổi, đo lại bằng script
 * trong scratchpad rồi cập nhật ở đây.
 */
export const PAGE = { w: 612, h: 792 } as const;

export const BLUE = "#00B0F0";
export const TINT = "#C9DAF8";
export const TITLE_BLUE = "#3C78D8";

/** Khung viền xanh: 2 cạnh dọc chạy hết chiều cao trang, cạnh trên ở y=52. */
export const FRAME = { x1: 12, x2: 602, top: 52, width: 6, startY: 49 } as const;

/** Biên các cột của bảng. */
export const COLS = [17, 91, 154, 442, 596] as const;

export const HEADER = { top: 195, split: 220, bottom: 282 } as const;

export const ROWS = { top: 282, height: 24.75, perPage: 18 } as const;
export const BODY_HEIGHT = ROWS.height * ROWS.perPage;

export const LOGO = { x: 19.5, y: 57.6, w: 87, h: 88 } as const;
export const STAR = { x: 486.7, y: 61.4, w: 42, h: 42 } as const;
export const WATERMARK = { x: 88.5, y: -8.8, w: 481, h: 468 } as const;

export const COMMENT_FONT = 8;
export const COMMENT_LINE_HEIGHT = 9.6;

/** Ước lượng thận trọng số ký tự vừa một dòng trong ô nhận xét. */
const CHARS_PER_LINE = 55;

export function commentLines(text: string): number {
  if (!text.trim()) return 1;
  return text.split("\n").reduce((total, line) => {
    return total + Math.max(1, Math.ceil(line.length / CHARS_PER_LINE));
  }, 0);
}

export function rowHeight(comment: string): number {
  const needed = commentLines(comment) * COMMENT_LINE_HEIGHT + 6;
  return Math.max(ROWS.height, needed);
}

/** Chia danh sách buổi học thành các trang sao cho không tràn khỏi vùng bảng. */
export function paginate<T extends { comment: string }>(items: T[]): T[][] {
  if (items.length === 0) return [[]];
  const pages: T[][] = [];
  let page: T[] = [];
  let used = 0;
  for (const item of items) {
    const h = rowHeight(item.comment);
    if (page.length > 0 && used + h > BODY_HEIGHT) {
      pages.push(page);
      page = [];
      used = 0;
    }
    page.push(item);
    used += h;
  }
  pages.push(page);
  return pages;
}
