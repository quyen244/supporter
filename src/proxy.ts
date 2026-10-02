import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Chỉ kiểm tra nhanh sự tồn tại của cookie phiên để chuyển hướng sớm.
 * Việc xác thực thật và phân quyền nằm ở server component và server action,
 * vì proxy chạy trên edge runtime nên không truy cập được database.
 */
export function proxy(req: NextRequest) {
  if (getSessionCookie(req)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/dang-nhap";
  url.search = `?tiep=${encodeURIComponent(req.nextUrl.pathname)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!dang-nhap|dang-ky|api/auth|img/|_next/|favicon.ico).*)"],
};
