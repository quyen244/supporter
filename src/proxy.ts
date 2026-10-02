import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, expectedToken, safeEqual } from "@/lib/auth";

export async function proxy(req: NextRequest) {
  const want = await expectedToken();
  // Chưa đặt APP_PASSWORD thì mở khoá, để chạy thử cục bộ không vướng.
  if (!want) return NextResponse.next();

  const got = req.cookies.get(COOKIE)?.value;
  if (got && safeEqual(got, want)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/dang-nhap";
  url.searchParams.set("tiep", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!dang-nhap|api/dang-nhap|img/|_next/|favicon.ico).*)"],
};
