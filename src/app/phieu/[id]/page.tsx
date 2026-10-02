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

      <div className="mt-3 space-y-1.5 text-xs leading-relaxed text-ink-faint">
        <p>
          <span className="font-semibold text-ink-soft">Trên điện thoại:</span> bấm Gửi qua Zalo, chọn phụ huynh.
          Ảnh kèm theo phần chữ chứa link để bấm được.
        </p>
        <p>
          <span className="font-semibold text-ink-soft">Trên máy tính:</span> Zalo Desktop không nhận chia sẻ
          trực tiếp từ trình duyệt, nên hãy bấm Tải ảnh rồi kéo ảnh vào khung chat, kèm nút Sao chép link.
        </p>
      </div>
    </AppShell>
  );
}
