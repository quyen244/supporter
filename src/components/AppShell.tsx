"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { IconCalendar, IconCap, IconLogout, IconSheet, IconShield, IconStudents } from "./icons";

function RailLink({
  href,
  active,
  label,
  children,
}: {
  href: string;
  active: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      title={label}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={`grid h-11 w-11 place-items-center rounded-2xl transition ${
        active ? "bg-sage text-white shadow-sm" : "text-ink-soft hover:bg-sage-50 hover:text-sage-700"
      }`}
    >
      {children}
    </Link>
  );
}

export type ShellUser = { name: string; email: string; role: string };

export default function AppShell({
  title,
  breadcrumb,
  actions,
  studentId,
  user,
  children,
}: {
  title: string;
  breadcrumb?: React.ReactNode;
  actions?: React.ReactNode;
  studentId?: string;
  user: ShellUser;
  children: React.ReactNode;
}) {
  const path = usePathname();
  const router = useRouter();
  const admin = user.role === "admin";

  async function logout() {
    await signOut();
    router.push("/dang-nhap");
    router.refresh();
  }

  const nav = (
    <>
      <RailLink href="/" active={path === "/"} label="Học viên">
        <IconStudents />
      </RailLink>
      <RailLink href="/lich" active={path.startsWith("/lich")} label="Lịch dạy">
        <IconCalendar />
      </RailLink>
      {studentId && (
        <RailLink href={`/phieu/${studentId}`} active={path.startsWith("/phieu/")} label="Phiếu">
          <IconSheet />
        </RailLink>
      )}
      {admin && (
        <RailLink href="/quan-tri" active={path.startsWith("/quan-tri")} label="Quản trị">
          <IconShield />
        </RailLink>
      )}
    </>
  );

  return (
    <div className="min-h-dvh">
      {/* Máy tính: thanh dọc nổi bên trái */}
      <nav className="fixed top-4 bottom-4 left-4 z-20 hidden w-17 flex-col items-center justify-between rounded-[26px] border border-line bg-white py-5 md:flex">
        <div className="flex flex-col items-center gap-2">
          <span className="mb-3 grid h-10 w-10 place-items-center rounded-2xl bg-sage-100 text-sage-700">
            <IconCap />
          </span>
          {nav}
        </div>
        <button
          onClick={logout}
          title={`Đăng xuất ${user.email}`}
          aria-label="Đăng xuất"
          className="grid h-11 w-11 place-items-center rounded-2xl text-ink-faint transition hover:bg-alert-bg hover:text-alert"
        >
          <IconLogout />
        </button>
      </nav>

      {/* Điện thoại: thanh ngang trên cùng */}
      <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-line bg-cream/90 px-4 py-2.5 backdrop-blur md:hidden">
        <Link href="/" className="mr-auto flex items-center gap-2 font-semibold text-ink">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-sage-100 text-sage-700">
            <IconCap className="scale-75" />
          </span>
          Teachly
        </Link>
        <Link href="/lich" aria-label="Lịch dạy" className="grid h-9 w-9 place-items-center rounded-xl text-ink-soft">
          <IconCalendar />
        </Link>
        {admin && (
          <Link href="/quan-tri" aria-label="Quản trị" className="grid h-9 w-9 place-items-center rounded-xl text-ink-soft">
            <IconShield />
          </Link>
        )}
        <button onClick={logout} aria-label="Đăng xuất" className="grid h-9 w-9 place-items-center rounded-xl text-ink-faint">
          <IconLogout />
        </button>
      </header>

      <div className="md:pl-25">
        <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-4 sm:px-6 md:pt-8">
          <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold tracking-tight text-ink sm:text-[28px]">{title}</h1>
              {breadcrumb && <div className="mt-1 text-sm text-ink-soft">{breadcrumb}</div>}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
