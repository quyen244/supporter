/*
 * Cố ý dùng <img> thay next/image: bộ tối ưu của Next trả về URL kèm srcset,
 * khiến html-to-image không rasterise được ảnh khi xuất PNG/PDF.
 */
/* eslint-disable @next/next/no-img-element */
import {
  BLUE,
  BODY_HEIGHT,
  COLS,
  COMMENT_FONT,
  COMMENT_LINE_HEIGHT,
  FRAME,
  GRID,
  HEADER,
  LOGO,
  PAGE,
  ROW_HEIGHT,
  STAR,
  naturalEdge,
  TINT,
  TITLE_BLUE,
  WATERMARK,
  paginate,
  rowHeight,
} from "@/lib/layout";

export type SheetLesson = {
  id?: string;
  day_label: string;
  lesson_name: string;
  comment: string;
  test_link: string;
};

export type SheetStudent = {
  name: string;
  class_code: string;
  teacher_name: string;
  playlist_url: string;
};

const serif = '"Times New Roman", Times, serif';

/**
 * Thêm https:// nếu người dùng chỉ gõ tên miền, nếu không PDF sẽ coi đó là
 * đường dẫn tương đối và bấm vào không mở được gì.
 */
export function normalizeUrl(raw: string): string {
  const s = raw.trim();
  if (!s) return "";
  return /^https?:\/\//i.test(s) ? s : `https://${s}`;
}

function Box({
  x1,
  x2,
  top,
  height,
  children,
  style,
  link,
}: {
  x1: number;
  x2: number;
  top: number;
  height: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  /** Khi xuất PDF, vùng này được phủ một liên kết bấm được. */
  link?: string;
}) {
  return (
    <div
      data-link={link || undefined}
      style={{
        position: "absolute",
        left: x1,
        top,
        width: x2 - x1,
        height,
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function HLine({ y, x1 = COLS[0], x2 = COLS[4] }: { y: number; x1?: number; x2?: number }) {
  return <div style={{ position: "absolute", left: x1, top: y, width: x2 - x1 + 1, height: 1, background: GRID }} />;
}

function VLine({ x, y1, y2 }: { x: number; y1: number; y2: number }) {
  return <div style={{ position: "absolute", left: x, top: y1, width: 1, height: y2 - y1 + 1, background: GRID }} />;
}

function HeaderBand() {
  // Chữ trong dải tiêu đề căn theo mép trên, không căn giữa: bản gốc đặt dòng
  // đầu cách mép ô một khoảng cố định dù ô có 2 hay 4 dòng chữ.
  const label: React.CSSProperties = {
    color: "#fff",
    fontFamily: serif,
    fontWeight: 700,
    fontSize: 11,
    lineHeight: "12.4px",
    textAlign: "center",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "6.8px 3px 0",
  };
  return (
    <>
      <Box x1={COLS[0]} x2={COLS[1]} top={HEADER.top} height={HEADER.bottom - HEADER.top} style={{ background: BLUE, ...label }}>
        <span>
          NGÀY
          <br />
          NHẬN XÉT
          <br />
          (DAY)
        </span>
      </Box>
      <Box x1={COLS[1]} x2={COLS[2]} top={HEADER.top} height={HEADER.bottom - HEADER.top} style={{ background: BLUE, ...label }}>
        <span>
          TÊN BÀI
          <br />
          HỌC
          <br />
          (LESSON
          <br />
          NAME)
        </span>
      </Box>
      <Box x1={COLS[2]} x2={COLS[4]} top={HEADER.top} height={HEADER.split - HEADER.top} style={{ background: BLUE, ...label }}>
        <span>NHẬN XÉT CỦA GIÁO VIÊN (TEACHER&rsquo;S COMMENTS)</span>
      </Box>
      <Box x1={COLS[2]} x2={COLS[3]} top={HEADER.split} height={HEADER.bottom - HEADER.split} style={{ background: BLUE, ...label }}>
        <span>
          4 KỸ NĂNG (Từ vựng, nghe, nói, đọc, viết - tuỳ theo bài học)
          <br />
          (4 SKILLS (Vocabulary, listening, speaking, reading, writing - depending on the lesson))
        </span>
      </Box>
      <Box x1={COLS[3]} x2={COLS[4]} top={HEADER.split} height={HEADER.bottom - HEADER.split} style={{ background: BLUE, ...label }}>
        <span>
          LINK KẾT QUẢ TEST
          <br />
          (TEST RESULT LINK)
        </span>
      </Box>
    </>
  );
}

function Page({ student, lessons, startIndex }: { student: SheetStudent; lessons: SheetLesson[]; startIndex: number }) {
  const cell: React.CSSProperties = {
    fontFamily: serif,
    fontSize: 9,
    color: "#000",
    padding: "2px 4px",
    overflow: "hidden",
    wordBreak: "break-word",
  };

  // Dựng danh sách dòng: buổi học thật, rồi dòng trống lấp cho đầy trang.
  const rows: (SheetLesson | undefined)[] = [...lessons];
  let used = lessons.reduce((s, l) => s + rowHeight(l.comment), 0);
  while (used + ROW_HEIGHT <= BODY_HEIGHT + 0.01) {
    rows.push(undefined);
    used += ROW_HEIGHT;
  }

  // Bám theo biên gốc; dòng nào cần cao hơn thì đẩy các dòng sau xuống đúng phần dôi ra.
  const edges: number[] = [];
  let shift = 0;
  rows.forEach((lesson, i) => {
    const natural = naturalEdge(i + 1) - naturalEdge(i);
    edges.push(naturalEdge(i) + shift);
    shift += Math.max(natural, lesson ? rowHeight(lesson.comment) : natural) - natural;
  });
  edges.push(naturalEdge(rows.length) + shift);
  const tableBottom = edges[edges.length - 1];

  const field: React.CSSProperties = {
    position: "absolute",
    fontFamily: serif,
    fontSize: 11,
    fontWeight: 700,
    color: "#000",
  };
  const value: React.CSSProperties = { fontWeight: 400, fontSize: 9 };

  return (
    <div
      className="phieu-page"
      style={{
        position: "relative",
        width: PAGE.w,
        height: PAGE.h,
        background: "#fff",
        overflow: "hidden",
        flex: "none",
      }}
    >
      <img
        src="/img/watermark.png"
        alt=""
        style={{ position: "absolute", left: WATERMARK.x, top: WATERMARK.y, width: WATERMARK.w, height: WATERMARK.h }}
      />

      {/* Khung viền xanh: 2 cạnh dọc chạy hết trang, cạnh trên ở y=52 (đúng bản gốc) */}
      <div style={{ position: "absolute", left: FRAME.x1 - FRAME.width / 2, top: FRAME.startY, width: FRAME.width, height: PAGE.h - FRAME.startY, background: BLUE }} />
      <div style={{ position: "absolute", left: FRAME.x2 - FRAME.width / 2, top: FRAME.startY, width: FRAME.width, height: PAGE.h - FRAME.startY, background: BLUE }} />
      <div style={{ position: "absolute", left: FRAME.x1 - FRAME.width / 2 - 3, top: FRAME.top - FRAME.width / 2, width: FRAME.x2 - FRAME.x1 + FRAME.width + 6, height: FRAME.width, background: BLUE }} />

      <img src="/img/logo.png" alt="" style={{ position: "absolute", left: LOGO.x, top: LOGO.y, width: LOGO.w, height: LOGO.h }} />
      <img src="/img/star.png" alt="" style={{ position: "absolute", left: STAR.x, top: STAR.y, width: STAR.w, height: STAR.h }} />

      <div style={{ ...field, left: 0, top: 105, width: PAGE.w, textAlign: "center", color: TITLE_BLUE }}>
        EVALUATION (PHIẾU HỌC TẬP)
      </div>

      <div style={{ ...field, left: 42, top: 135 }}>
        Học sinh (Student&rsquo;s name): <span style={value}>{student.name}</span>
      </div>
      <div style={{ ...field, left: 390, top: 135 }}>
        Mã lớp (Class code): <span style={value}>{student.class_code}</span>
      </div>
      <div style={{ ...field, left: 42, top: 162 }}>
        Giáo viên (Teacher&rsquo;s name): <span style={value}>{student.teacher_name}</span>
      </div>
      <div style={{ ...field, left: 390, top: 162, width: 204 }}>
        Playlist lớp học (Playlist):{" "}
        <span
          data-link={student.playlist_url ? normalizeUrl(student.playlist_url) : undefined}
          style={{ ...value, fontSize: 6.5, color: "#1155cc", wordBreak: "break-all" }}
        >
          {student.playlist_url}
        </span>
      </div>

      <HeaderBand />

      {rows.map((l, i) => {
        const top = edges[i];
        const height = edges[i + 1] - top;
        const bg = (startIndex + i) % 2 === 1 ? TINT : "#fff";
        return (
          <div key={i}>
            <Box x1={COLS[0]} x2={COLS[1]} top={top} height={height} style={{ ...cell, background: bg, textAlign: "center" }}>
              {l?.day_label}
            </Box>
            <Box x1={COLS[1]} x2={COLS[2]} top={top} height={height} style={{ ...cell, background: bg, fontSize: 7.5 }}>
              {l?.lesson_name}
            </Box>
            <Box
              x1={COLS[2]}
              x2={COLS[3]}
              top={top}
              height={height}
              style={{ ...cell, background: bg, fontSize: COMMENT_FONT, lineHeight: `${COMMENT_LINE_HEIGHT}px`, whiteSpace: "pre-wrap" }}
            >
              {l?.comment}
            </Box>
            <Box
              x1={COLS[3]}
              x2={COLS[4]}
              top={top}
              height={height}
              link={l?.test_link ? normalizeUrl(l.test_link) : undefined}
              style={{ ...cell, background: bg, fontSize: 6.5, color: "#1155cc" }}
            >
              {l?.test_link}
            </Box>
          </div>
        );
      })}

      {/* Lưới kẻ vẽ sau cùng để nằm trên nền ô, khớp từng pixel với bản gốc */}
      {COLS.map((x) => (
        <VLine key={x} x={x} y1={HEADER.top} y2={tableBottom} />
      ))}
      <HLine y={HEADER.top} />
      <HLine y={HEADER.split} x1={COLS[2]} />
      {edges.map((y) => (
        <HLine key={y} y={y} />
      ))}
    </div>
  );
}

export default function Sheet({ student, lessons }: { student: SheetStudent; lessons: SheetLesson[] }) {
  const pages = paginate(lessons);
  // Số buổi đứng trước mỗi trang, để màu nền dòng xen kẽ liên tục qua các trang.
  const offsets = pages.reduce<number[]>((acc, p, i) => [...acc, acc[i] + p.length], [0]);
  return (
    <>
      {pages.map((pageLessons, i) => (
        <Page key={i} student={student} lessons={pageLessons} startIndex={offsets[i]} />
      ))}
    </>
  );
}
