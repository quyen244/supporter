import { NextResponse } from "next/server";
import { COOKIE, expectedToken, safeEqual, tokenFor } from "@/lib/auth";

export async function POST(req: Request) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");
  const next = String(form.get("tiep") ?? "/") || "/";

  const want = await expectedToken();
  if (!want) return NextResponse.redirect(new URL("/", req.url));

  const got = await tokenFor(password);
  if (!safeEqual(got, want)) {
    return NextResponse.redirect(new URL(`/dang-nhap?loi=1&tiep=${encodeURIComponent(next)}`, req.url));
  }

  // Chỉ nhận đường dẫn nội bộ, chặn open redirect.
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";
  const res = NextResponse.redirect(new URL(safeNext, req.url));
  res.cookies.set(COOKIE, want, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
  });
  return res;
}
