"use client";

import { useFormStatus } from "react-dom";

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`anim-spin ${className}`}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Nút gửi form biết lúc nào server action đang chạy.
 * Phải nằm bên trong <form> thì useFormStatus mới đọc được trạng thái.
 * Không có phản hồi này người dùng sẽ bấm lại nhiều lần vì tưởng chưa ăn.
 */
export default function SubmitButton({
  children,
  pendingLabel,
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "ghost" | "danger";
  className?: string;
}) {
  const { pending } = useFormStatus();

  const styles = {
    primary: "bg-sage text-white hover:bg-sage-600",
    ghost: "border border-line bg-white text-ink hover:border-sage-300",
    danger: "text-alert hover:bg-alert-bg",
  }[variant];

  return (
    <button
      disabled={pending}
      aria-busy={pending}
      className={`press inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold disabled:cursor-wait disabled:opacity-70 ${styles} ${className}`}
    >
      {pending && <Spinner />}
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}
