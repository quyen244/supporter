import AppShell from "@/components/AppShell";
import { ROLE_ADMIN, ROLE_TEACHER } from "@/lib/auth";
import { requireAdmin } from "@/lib/session";
import { listTeachers, setBanned, setRole } from "./actions";

export const dynamic = "force-dynamic";

const fmt = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

export default async function QuanTri() {
  const me = await requireAdmin();
  const teachers = await listTeachers();

  return (
    <AppShell
      title="Quản trị"
      user={me}
      breadcrumb={`${teachers.length} tài khoản · ${teachers.reduce((s, t) => s + t.student_count, 0)} học viên toàn hệ thống`}
    >
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[46rem] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs font-semibold tracking-wide text-ink-soft">
              <th className="px-5 py-3">Giáo viên</th>
              <th className="px-3 py-3">Tham gia</th>
              <th className="px-3 py-3 text-right">Học viên</th>
              <th className="px-3 py-3 text-right">Buổi</th>
              <th className="px-3 py-3">Quyền</th>
              <th className="px-5 py-3 text-right">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((t) => {
              const self = t.id === me.id;
              return (
                <tr key={t.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-ink">
                      {t.name}
                      {self && (
                        <span className="ml-2 rounded bg-sand px-1.5 py-0.5 text-xs font-medium text-ink-soft">
                          tài khoản của bạn
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-ink-soft">{t.email}</p>
                  </td>
                  <td className="px-3 py-3.5 text-ink-soft">{fmt.format(new Date(t.created_at))}</td>
                  <td className="px-3 py-3.5 text-right font-medium text-ink">{t.student_count}</td>
                  <td className="px-3 py-3.5 text-right font-medium text-ink">{t.lesson_count}</td>
                  <td className="px-3 py-3.5">
                    {self ? (
                      <span className="rounded-md bg-sage-100 px-2 py-1 text-xs font-semibold text-sage-700">
                        Quản trị
                      </span>
                    ) : (
                      <form action={setRole}>
                        <input type="hidden" name="id" value={t.id} />
                        <input type="hidden" name="role" value={t.role === ROLE_ADMIN ? ROLE_TEACHER : ROLE_ADMIN} />
                        <button className="rounded-md bg-sand px-2 py-1 text-xs font-semibold text-ink transition hover:bg-sage-100 hover:text-sage-700">
                          {t.role === ROLE_ADMIN ? "Quản trị" : "Giáo viên"}
                        </button>
                      </form>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {self ? (
                      <span className="text-xs text-ink-faint">–</span>
                    ) : (
                      <form action={setBanned} className="inline">
                        <input type="hidden" name="id" value={t.id} />
                        <input type="hidden" name="banned" value={t.banned ? "0" : "1"} />
                        <button
                          className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                            t.banned
                              ? "bg-alert-bg text-alert hover:bg-alert hover:text-white"
                              : "bg-ok-bg text-sage-700 hover:bg-sage hover:text-white"
                          }`}
                        >
                          {t.banned ? "Đang khoá" : "Hoạt động"}
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-ink-faint">
        Bấm vào ô Quyền hoặc Trạng thái để đổi. Khoá tài khoản sẽ đăng xuất người đó khỏi mọi thiết bị ngay lập tức.
        Bạn không tự đổi quyền hay tự khoá được chính mình.
      </p>
    </AppShell>
  );
}
