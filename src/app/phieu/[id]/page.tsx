import Link from "next/link";
import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import ExportBar from "@/components/ExportBar";
import Sheet from "@/components/Sheet";
import { requireUser } from "@/lib/session";
import { getStudent } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function Phieu({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const data = await getStudent(id);
  if (!data) notFound();
  const { student, lessons } = data;

  const fileBase = `Phieu hoc tap - ${student.name}`.replace(/[\\/:*?"<>|]/g, "");

  // Ảnh không bấm được link, nên gửi kèm text: Zalo tự nhận diện URL trong text.
  const links = [
    `Phiếu học tập - ${student.name}`,
    student.playlist_url && `Playlist lớp: ${student.playlist_url}`,
    ...lessons
      .filter((l) => l.test_link)
      .map((l) => `Kết quả test buổi ${l.day_label}: ${l.test_link}`),
  ].filter(Boolean);

  return (
    <AppShell
      title="Phiếu học tập"
      user={user}
      studentId={student.id}
      breadcrumb={
        <span className="flex items-center gap-2">
          <Link href="/" className="transition hover:text-sage">
            Học viên
          </Link>
          <span className="text-ink-faint">/</span>
          <Link href={`/hoc-vien/${student.id}`} className="transition hover:text-sage">
            {student.name}
          </Link>
        </span>
      }
      actions={<ExportBar fileBase={fileBase} shareText={links.join("\n")} hasLinks={links.length > 1} />}
    >
      <div className="overflow-x-auto rounded-card border border-line bg-sand p-3 sm:p-5">
        <div className="mx-auto flex w-fit flex-col gap-5">
          <Sheet student={student} lessons={lessons} />
        </div>
      </div>

      <div className="mt-4 rounded-card border border-line bg-white p-4 text-sm leading-relaxed">
        <p className="mb-2 font-semibold text-ink">Cách gửi cho phụ huynh</p>
        <ol className="desktop-only list-decimal space-y-1 pl-5 text-ink-soft">
          <li>
            Bấm <span className="font-medium text-ink">Tải PDF để gửi</span>, rồi kéo file vào khung chat Zalo.
            Link playlist và kết quả test trong PDF bấm được ngay.
          </li>
          <li>
            Muốn phụ huynh thấy phiếu luôn trong chat không cần mở file, dùng{" "}
            <span className="font-medium text-ink">Chép ảnh</span> rồi Ctrl+V. Đổi lại link trên ảnh không bấm
            được, nên dán thêm <span className="font-medium text-ink">Sao chép link</span>.
          </li>
        </ol>
        <p className="touch-only text-ink-soft">
          Bấm <span className="font-medium text-ink">Gửi qua Zalo</span> rồi chọn phụ huynh. Nếu Zalo chỉ nhận
          ảnh mà bỏ phần chữ, bấm thêm <span className="font-medium text-ink">Sao chép link</span> rồi dán vào
          khung chat.
        </p>
        <p className="mt-2 text-xs text-ink-faint">
          Link in trên ảnh chỉ là chữ nên không bấm được, vì vậy mới cần gửi kèm phần link riêng.
        </p>
      </div>
    </AppShell>
  );
}
