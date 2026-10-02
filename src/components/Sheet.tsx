import {
  BLUE,
  COLS,
  COMMENT_FONT,
  COMMENT_LINE_HEIGHT,
  FRAME,
  HEADER,
  LOGO,
  PAGE,
  ROWS,
  STAR,
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

function Cell({
  x1,
  x2,
  top,
  height,
  children,
  style,
}: {
  x1: number;
  x2: number;
  top: number;
  height: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
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

function HeaderBand() {
  const label: React.CSSProperties = {
    color: "#fff",
    fontFamily: serif,
    fontWeight: 700,
    fontSize: 11,
    lineHeight: "12.4px",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 2px",
  };
  return (
    <>
      <Cell x1={COLS[0]} x2={COLS[1]} top={HEADER.top} height={HEADER.bottom - HEADER.top} style={{ background: BLUE, ...label }}>
        <span>
          NGÀY
          <br />
          NHẬN XÉT
          <br />
          (DAY)
        </span>
      </Cell>
      <Cell x1={COLS[1]} x2={COLS[2]} top={HEADER.top} height={HEADER.bottom - HEADER.top} style={{ background: BLUE, ...label }}>
        <span>
          TÊN BÀI
          <br />
          HỌC
          <br />
          (LESSON
          <br />
          NAME)
        </span>
      </Cell>
      <Cell x1={COLS[2]} x2={COLS[4]} top={HEADER.top} height={HEADER.split - HEADER.top} style={{ background: BLUE, ...label }}>
        <span>NHẬN XÉT CỦA GIÁO VIÊN (TEACHER&rsquo;S COMMENTS)</span>
      </Cell>
      <Cell x1={COLS[2]} x2={COLS[3]} top={HEADER.split} height={HEADER.bottom - HEADER.split} style={{ background: BLUE, ...label }}>
        <span>
          4 KỸ NĂNG (Từ vựng, nghe, nói, đọc, viết - tuỳ theo bài học)
          <br />
          (4 SKILLS (Vocabulary, listening, speaking, reading, writing - depending on the lesson))
        </span>
      </Cell>
      <Cell x1={COLS[3]} x2={COLS[4]} top={HEADER.split} height={HEADER.bottom - HEADER.split} style={{ background: BLUE, ...label }}>
        <span>
          LINK KẾT QUẢ TEST
          <br />
          (TEST RESULT LINK)
        </span>
      </Cell>
    </>
  );
}

function Page({
  student,
  lessons,
  startIndex,
}: {
  student: SheetStudent;
  lessons: SheetLesson[];
  startIndex: number;
}) {
  const cellBase: React.CSSProperties = {
    fontFamily: serif,
    fontSize: 9,
    color: "#000",
    padding: "3px 4px",
    overflow: "hidden",
    wordBreak: "break-word",
  };

  let y = ROWS.top;
  const rows = lessons.map((lesson, i) => {
    const h = rowHeight(lesson.comment);
    const top = y;
    y += h;
    const tinted = (startIndex + i) % 2 === 1;
    const bg = tinted ? TINT : "#fff";
    return (
      <div key={lesson.id ?? i}>
        <Cell x1={COLS[0]} x2={COLS[1]} top={top} height={h} style={{ ...cellBase, background: bg, textAlign: "center" }}>
          {lesson.day_label}
        </Cell>
        <Cell x1={COLS[1]} x2={COLS[2]} top={top} height={h} style={{ ...cellBase, background: bg, fontSize: 8 }}>
          {lesson.lesson_name}
        </Cell>
        <Cell
          x1={COLS[2]}
          x2={COLS[3]}
          top={top}
          height={h}
          style={{
            ...cellBase,
            background: bg,
            fontSize: COMMENT_FONT,
            lineHeight: `${COMMENT_LINE_HEIGHT}px`,
            whiteSpace: "pre-wrap",
          }}
        >
          {lesson.comment}
        </Cell>
        <Cell
          x1={COLS[3]}
          x2={COLS[4]}
          top={top}
          height={h}
          style={{ ...cellBase, background: bg, fontSize: 7, color: "#1155cc" }}
        >
          {lesson.test_link}
        </Cell>
      </div>
    );
  });

  // Dòng trống lấp phần còn lại của trang, giữ đúng dáng phiếu gốc.
  const blanks: React.ReactNode[] = [];
  let blankIndex = startIndex + lessons.length;
  while (y + ROWS.height <= ROWS.top + ROWS.height * ROWS.perPage + 0.5) {
    const bg = blankIndex % 2 === 1 ? TINT : "#fff";
    blanks.push(
      <div key={`blank-${blankIndex}`}>
        <Cell x1={COLS[0]} x2={COLS[1]} top={y} height={ROWS.height} style={{ background: bg }} />
        <Cell x1={COLS[1]} x2={COLS[2]} top={y} height={ROWS.height} style={{ background: bg }} />
        <Cell x1={COLS[2]} x2={COLS[3]} top={y} height={ROWS.height} style={{ background: bg }} />
        <Cell x1={COLS[3]} x2={COLS[4]} top={y} height={ROWS.height} style={{ background: bg }} />
      </div>
    );
    y += ROWS.height;
    blankIndex += 1;
  }

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
        src="/phieu/watermark.png"
        alt=""
        style={{ position: "absolute", left: WATERMARK.x, top: WATERMARK.y, width: WATERMARK.w, height: WATERMARK.h }}
      />

      {/* Khung viền xanh: 2 cạnh dọc chạy hết trang, cạnh trên ở y=52 (đúng bản gốc) */}
      <div style={{ position: "absolute", left: FRAME.x1 - FRAME.width / 2, top: FRAME.startY, width: FRAME.width, height: PAGE.h - FRAME.startY, background: BLUE }} />
      <div style={{ position: "absolute", left: FRAME.x2 - FRAME.width / 2, top: FRAME.startY, width: FRAME.width, height: PAGE.h - FRAME.startY, background: BLUE }} />
      <div style={{ position: "absolute", left: FRAME.x1 - FRAME.width / 2 - 3, top: FRAME.top - FRAME.width / 2, width: FRAME.x2 - FRAME.x1 + FRAME.width + 6, height: FRAME.width, background: BLUE }} />

      <img src="/phieu/logo.png" alt="" style={{ position: "absolute", left: LOGO.x, top: LOGO.y, width: LOGO.w, height: LOGO.h }} />
      <img src="/phieu/star.png" alt="" style={{ position: "absolute", left: STAR.x, top: STAR.y, width: STAR.w, height: STAR.h }} />

      <div style={{ ...field, left: 0, top: 95, width: PAGE.w, textAlign: "center", color: TITLE_BLUE }}>
        EVALUATION (PHIẾU HỌC TẬP)
      </div>

      <div style={{ ...field, left: 50, top: 128 }}>
        Học sinh (Student&rsquo;s name): <span style={value}>{student.name}</span>
      </div>
      <div style={{ ...field, left: 389, top: 128 }}>
        Mã lớp (Class code): <span style={value}>{student.class_code}</span>
      </div>
      <div style={{ ...field, left: 50, top: 155 }}>
        Giáo viên (Teacher&rsquo;s name): <span style={value}>{student.teacher_name}</span>
      </div>
      <div style={{ ...field, left: 389, top: 155, width: 200 }}>
        Playlist lớp học (Playlist):{" "}
        <span style={{ ...value, fontSize: 7, color: "#1155cc", wordBreak: "break-all" }}>{student.playlist_url}</span>
      </div>

      <HeaderBand />
      {rows}
      {blanks}
    </div>
  );
}

export default function Sheet({ student, lessons }: { student: SheetStudent; lessons: SheetLesson[] }) {
  const pages = paginate(lessons);
  let offset = 0;
  return (
    <>
      {pages.map((pageLessons, i) => {
        const start = offset;
        offset += pageLessons.length;
        return <Page key={i} student={student} lessons={pageLessons} startIndex={start} />;
      })}
    </>
  );
}
