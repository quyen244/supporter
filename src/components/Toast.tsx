"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { IconCheck, IconWarn } from "./icons";

type Kind = "ok" | "warn";
type Item = { id: number; kind: Kind; text: string };

const ToastContext = createContext<{
  ok: (text: string) => void;
  warn: (text: string) => void;
} | null>(null);

/** Gọi trong client component để báo cho người dùng biết thao tác đã xong. */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast phải nằm trong ToastProvider");
  return ctx;
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);

  const push = useCallback((kind: Kind, text: string) => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, kind, text }]);
    // Thông báo tự tắt; lỗi để lâu hơn vì người dùng cần thời gian đọc.
    setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), kind === "ok" ? 2600 : 5000);
  }, []);

  const api = useMemo(
    () => ({ ok: (t: string) => push("ok", t), warn: (t: string) => push("warn", t) }),
    [push]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex flex-col items-center gap-2 px-4"
      >
        {items.map((i) => (
          <div
            key={i.id}
            className={`pointer-events-auto flex items-center gap-2.5 rounded-md px-4 py-2.5 text-sm font-medium ${
              i.kind === "ok" ? "bg-sage-700 text-white" : "bg-alert text-white"
            }`}
          >
            {i.kind === "ok" ? <IconCheck /> : <IconWarn />}
            {i.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
