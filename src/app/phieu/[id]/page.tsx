import Link from "next/link";
import { notFound } from "next/navigation";
import { getStudent } from "@/app/actions";
import ExportBar from "@/components/ExportBar";
import Sheet from "@/components/Sheet";

export const dynamic = "force-dynamic";

export default async function Phieu({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getStudent(id);
  if (!data) notFound();
  const { student, lessons } = data;

  const fileBase = `Phieu hoc tap - ${student.name}`.replace(/[\\/:*?"<>|]/g, "");

  return (
    <main className="mx-auto w-full max-w-4xl p-4 sm:p-6">
      <Link href={`/hoc-vien/${student.id}`} className="text-sm text-slate-500 hover:text-slate-900">
        ‹ {student.name}
      </Link>

      <div className="mt-3 mb-5">
        <ExportBar fileBase={fileBase} />
      </div>

      <div className="overflow-x-auto rounded-xl bg-slate-200 p-4">
        <div className="mx-auto flex w-fit flex-col gap-4">
          <Sheet student={student} lessons={lessons} />
        </div>
      </div>
    </main>
  );
}
