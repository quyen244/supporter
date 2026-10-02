/**
 * Toạ độ đo trực tiếp từ PDF gốc bằng script dò pixel, đơn vị point
 * (1pt = 1px khi render ở 72dpi). Khổ US Letter 612x792.
 * Nếu phiếu gốc thay đổi, đo lại rồi cập nhật ở đây - đừng chỉnh tay theo cảm tính.
 */
export const PAGE = { w: 612, h: 792 } as const;

export const BLUE = "#00B0F0";
export const TINT = "#C9DAF8";
export const TITLE_BLUE = "#3C78D8";
export const GRID = "#000";

/** Khung viền xanh: 2 cạnh dọc chạy hết chiều cao trang, cạnh trên ở y=52. */
export const FRAME = { x1: 12, x2: 602, top: 52, width: 6, startY: 49 } as const;

/** Vị trí các đường kẻ dọc của bảng. */
export const COLS = [17, 90, 153, 442, 596] as const;

/** Đường kẻ ngang của dải tiêu đề bảng. */
export const HEADER = { top: 195, split: 220, bottom: 281 } as const;

export const ROWS = { top: 281, bottom: 727, perPage: 18 } as const;
export const BODY_HEIGHT = ROWS.bottom - ROWS.top;
export const ROW_HEIGHT = BODY_HEIGHT / ROWS.perPage;

/**
 * Biên ngang của 18 dòng, lấy đúng từ bản gốc. Các dòng không cao đều nhau
 * (xen kẽ 24 và 25pt), nên chia đều sẽ lệch 1px ở vài dòng.
 */
export const ROW_EDGES = [
  281, 306, 331, 356, 380, 405, 430, 455, 479, 504, 529, 554, 578, 603, 628, 653, 677, 702, 727,
] as const;

export function naturalEdge(i: number): number {
  return ROW_EDGES[i] ?? ROWS.top + i * ROW_HEIGHT;
}

export const LOGO = { x: 19.5, y: 57.6, w: 87, h: 88 } as const;
export const STAR = { x: 486.7, y: 61.4, w: 42, h: 42 } as const;
export const WATERMARK = { x: 88.5, y: -8.8, w: 481, h: 468 } as const;

export const COMMENT_FONT = 8;
export const COMMENT_LINE_HEIGHT = 9.6;

/** Ước lượng thận trọng số ký tự vừa một dòng trong ô nhận xét (rộng 289pt). */
const CHARS_PER_LINE = 55;

export function commentLines(text: string): number {
  if (!text.trim()) return 1;
  return text
    .split("\n")
    .reduce((total, line) => total + Math.max(1, Math.ceil(line.length / CHARS_PER_LINE)), 0);
}

export function rowHeight(comment: string): number {
  return Math.max(ROW_HEIGHT, commentLines(comment) * COMMENT_LINE_HEIGHT + 6);
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
