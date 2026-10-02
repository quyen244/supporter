export type Tone = "good" | "ok" | "work";

export type Phrase = {
  id: string;
  text: string;
  tone: Tone;
  defaults?: number[];
};

export type Skill = {
  id: string;
  label: string;
  en: string;
  phrases: Phrase[];
};

/**
 * `{n}` là ô nhập số. Một mẫu câu có thể chứa nhiều `{n}`, khi đó `defaults`
 * cấp giá trị gợi ý cho từng ô theo thứ tự xuất hiện.
 */
export const SKILLS: Skill[] = [
  {
    id: "vocab",
    label: "Từ vựng",
    en: "Vocabulary",
    phrases: [
      { id: "v1", text: "Thuộc {n}/{n} từ vựng của bài", tone: "good", defaults: [8, 10] },
      { id: "v2", text: "Nhớ được khoảng {n}% từ vựng mới", tone: "good", defaults: [80] },
      { id: "v3", text: "Khả năng ghi nhớ từ vựng nhanh", tone: "good" },
      { id: "v4", text: "Vận dụng tốt từ mới vào câu", tone: "good" },
      { id: "v5", text: "Còn nhầm lẫn {n} từ, cần ôn lại ở nhà", tone: "work", defaults: [3] },
      { id: "v6", text: "Cần học thuộc từ vựng trước khi tới lớp", tone: "work" },
    ],
  },
  {
    id: "listening",
    label: "Nghe",
    en: "Listening",
    phrases: [
      { id: "l1", text: "Nghe hiểu được khoảng {n}% nội dung bài nghe", tone: "good", defaults: [80] },
      { id: "l2", text: "Làm đúng {n}/{n} câu bài tập nghe", tone: "good", defaults: [8, 10] },
      { id: "l3", text: "Bắt được từ khóa tốt, phản xạ nghe nhanh", tone: "good" },
      { id: "l4", text: "Nghe hiểu ở tốc độ chậm, cần luyện thêm tốc độ thường", tone: "ok" },
      { id: "l5", text: "Cần nghe lại audio bài học {n} lần mỗi ngày", tone: "work", defaults: [2] },
    ],
  },
  {
    id: "speaking",
    label: "Nói",
    en: "Speaking",
    phrases: [
      { id: "s1", text: "Phát âm tốt, rõ ràng", tone: "good" },
      { id: "s2", text: "Phát âm chuẩn khoảng {n}% số từ đã học", tone: "good", defaults: [85] },
      { id: "s3", text: "Tự tin, xung phong phát biểu trong giờ", tone: "good" },
      { id: "s4", text: "Trả lời trọn câu, đúng ngữ pháp", tone: "good" },
      { id: "s5", text: "Nói được nhưng còn ngập ngừng, cần luyện phản xạ", tone: "ok" },
      { id: "s6", text: "Cần chú ý âm cuối và trọng âm của từ", tone: "work" },
      { id: "s7", text: "Còn rụt rè, cần khuyến khích nói nhiều hơn", tone: "work" },
    ],
  },
  {
    id: "reading",
    label: "Đọc",
    en: "Reading",
    phrases: [
      { id: "r1", text: "Đọc hiểu được khoảng {n}% bài đọc", tone: "good", defaults: [80] },
      { id: "r2", text: "Đọc trôi chảy, ngắt nghỉ đúng chỗ", tone: "good" },
      { id: "r3", text: "Trả lời đúng {n}/{n} câu hỏi đọc hiểu", tone: "good", defaults: [4, 5] },
      { id: "r4", text: "Đọc được nhưng còn chậm, cần luyện thêm", tone: "ok" },
      { id: "r5", text: "Cần luyện đọc to ở nhà mỗi ngày {n} phút", tone: "work", defaults: [10] },
    ],
  },
  {
    id: "writing",
    label: "Viết",
    en: "Writing",
    phrases: [
      { id: "w1", text: "Viết đúng chính tả {n}/{n} từ", tone: "good", defaults: [9, 10] },
      { id: "w2", text: "Đặt câu đúng cấu trúc đã học", tone: "good" },
      { id: "w3", text: "Chữ viết sạch đẹp, trình bày gọn gàng", tone: "good" },
      { id: "w4", text: "Hoàn thành {n}% bài tập viết trên lớp", tone: "good", defaults: [100] },
      { id: "w5", text: "Còn sai chính tả ở {n} từ", tone: "work", defaults: [3] },
      { id: "w6", text: "Cần chú ý viết hoa đầu câu và dấu chấm câu", tone: "work" },
    ],
  },
  {
    id: "attitude",
    label: "Thái độ",
    en: "Attitude",
    phrases: [
      { id: "a1", text: "Học tốt, tập trung trong suốt buổi học", tone: "good" },
      { id: "a2", text: "Tích cực tham gia hoạt động nhóm", tone: "good" },
      { id: "a3", text: "Hoàn thành đầy đủ bài tập về nhà", tone: "good" },
      { id: "a4", text: "Có tiến bộ rõ rệt so với buổi trước", tone: "good" },
      { id: "a5", text: "Đôi lúc mất tập trung, cần nhắc nhở", tone: "ok" },
      { id: "a6", text: "Chưa làm bài tập về nhà", tone: "work" },
      { id: "a7", text: "Phụ huynh nhắc con ôn bài trước buổi sau", tone: "work" },
    ],
  },
];

export const TONE_STYLE: Record<Tone, string> = {
  good: "border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100",
  ok: "border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100",
  work: "border-rose-300 bg-rose-50 text-rose-900 hover:bg-rose-100",
};

/** Thay từng `{n}` bằng giá trị tương ứng trong `values`. */
export function fillPhrase(text: string, values: (number | string)[]): string {
  let i = 0;
  return text.replace(/\{n\}/g, () => {
    const v = values[i++];
    return v === undefined || v === "" ? "__" : String(v);
  });
}

export function slotCount(text: string): number {
  return (text.match(/\{n\}/g) ?? []).length;
}
