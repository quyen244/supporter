"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconCap, IconLogout, IconSheet, IconStudents } from "./icons";

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

function Rail({ studentId }: { studentId?: string }) {
  const path = usePathname();
  const onList = path === "/";
  const onSheet = path.startsWith("/phieu/");

  return (
    <>
      {/* Máy tính: thanh dọc nổi bên trái */}
      <nav className="fixed top-4 bottom-4 left-4 z-20 hidden w-[68px] flex-col items-center justify-between rounded-[26px] border border-line bg-white py-5 md:flex">
        <div className="flex flex-col items-center gap-2">
          <span className="mb-3 grid h-10 w-10 place-items-center rounded-2xl bg-sage-100 text-sage-700">
            <IconCap />
          </span>
          <RailLink href="/" active={onList} label="Học viên">
            <IconStudents />
          </RailLink>
          {studentId && (
            <RailLink href={`/phieu/${studentId}`} active={onSheet} label="Phiếu">
              <IconSheet />
            </RailLink>
          )}
        </div>
        <form action="/api/dang-xuat" method="post">
          <button
            title="Đăng xuất"
            aria-label="Đăng xuất"
            className="grid h-11 w-11 place-items-center rounded-2xl text-ink-faint transition hover:bg-alert-bg hover:text-alert"
          >
            <IconLogout />
          </button>
        </form>
      </nav>

      {/* Điện thoại: thanh ngang trên cùng */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-cream/90 px-4 py-3 backdrop-blur md:hidden">
        <Link href="/" className="flex items-center gap-2 font-semibold text-ink">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-sage-100 text-sage-700">
            <IconCap className="scale-75" />
          </span>
          Phiếu học tập
        </Link>
        <form action="/api/dang-xuat" method="post">
          <button aria-label="Đăng xuất" className="grid h-9 w-9 place-items-center rounded-xl text-ink-faint">
            <IconLogout />
          </button>
        </form>
      </header>
    </>
  );
}

export default function AppShell({
  title,
  breadcrumb,
  actions,
  studentId,
  children,
}: {
  title: string;
  breadcrumb?: React.ReactNode;
  actions?: React.ReactNode;
  studentId?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh">
      <Rail studentId={studentId} />
      <div className="md:pl-[100px]">
        <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-4 sm:px-6 md:pt-8">
          <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-[28px]">{title}</h1>
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
