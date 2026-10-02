"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn, signUp } from "@/lib/auth-client";
import { IconGoogle } from "./icons";

/** Chuyển mã lỗi của Better Auth sang câu tiếng Việt người dùng hiểu được. */
function message(code: string | undefined, fallback: string): string {
  switch (code) {
    case "INVALID_EMAIL_OR_PASSWORD":
      return "Email hoặc mật khẩu không đúng.";
    case "USER_ALREADY_EXISTS":
      return "Email này đã được đăng ký.";
    case "PASSWORD_TOO_SHORT":
      return "Mật khẩu phải có ít nhất 8 ký tự.";
    case "BANNED_USER":
      return "Tài khoản này đã bị khoá. Liên hệ quản trị viên.";
    case "ACCOUNT_NOT_LINKED":
      return "Email này đã đăng ký bằng mật khẩu. Hãy đăng nhập bằng mật khẩu trước.";
    default:
      return fallback;
  }
}

export default function AuthForm({
  mode,
  next,
  google = false,
}: {
  mode: "signin" | "signup";
  next: string;
  google?: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function withGoogle() {
    setBusy(true);
    setError(null);
    // Google tự chuyển hướng về callbackURL, nên không gọi router.push ở đây.
    const res = await signIn.social({ provider: "google", callbackURL: next });
    if (res?.error) {
      setBusy(false);
      setError(message(res.error.code, res.error.message ?? "Không đăng nhập được bằng Google."));
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    const name = String(fd.get("name") ?? "").trim();

    setBusy(true);
    setError(null);

    const res =
      mode === "signup"
        ? await signUp.email({ email, password, name })
        : await signIn.email({ email, password });

    setBusy(false);

    if (res.error) {
      setError(message(res.error.code, res.error.message ?? "Không thực hiện được, thử lại nhé."));
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <>
      {google && (
        <div className="mt-7">
          <button
            type="button"
            onClick={withGoogle}
            disabled={busy}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-line bg-white px-4 py-3 font-semibold text-ink transition hover:border-sage-300 hover:bg-sage-50 disabled:opacity-60"
          >
            <IconGoogle />
            Tiếp tục với Google
          </button>
          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-line" />
            <span className="text-xs text-ink-faint">hoặc dùng email</span>
            <span className="h-px flex-1 bg-line" />
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className={google ? "space-y-4" : "mt-7 space-y-4"}>
        {mode === "signup" && (
          <div>
            <label htmlFor="name" className="label">
              Tên của bạn
            </label>
            <input
              id="name"
              name="name"
              required
              autoComplete="name"
              placeholder="Nguyễn Văn Quyền"
              className="field"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoFocus={mode === "signin" && !google}
            autoComplete="email"
            placeholder="ten@gmail.com"
            className="field"
          />
        </div>

        <div>
          <label htmlFor="password" className="label">
            Mật khẩu
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            placeholder={mode === "signup" ? "Ít nhất 8 ký tự" : "••••••••"}
            className="field"
          />
        </div>

        {error && (
          <p role="alert" className="rounded-xl bg-alert-bg px-3 py-2 text-sm text-alert">
            {error}
          </p>
        )}

        <button
          disabled={busy}
          className="w-full rounded-xl bg-sage px-4 py-3 font-semibold text-white transition hover:bg-sage-600 disabled:opacity-60"
        >
          {busy ? "Đang xử lý…" : mode === "signup" ? "Tạo tài khoản" : "Đăng nhập"}
        </button>
      </form>
    </>
  );
}
