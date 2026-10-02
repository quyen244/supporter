export const COOKIE = "phieu_auth";

/**
 * Token = SHA-256(mật khẩu + muối cố định). Mật khẩu không bao giờ rời server,
 * cookie chỉ mang giá trị dẫn xuất nên lộ cookie không lộ mật khẩu.
 * Dùng Web Crypto để chạy được cả ở middleware (edge runtime).
 */
export async function tokenFor(password: string): Promise<string> {
  const data = new TextEncoder().encode(`phieu-hoc-tap::${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function expectedToken(): Promise<string | null> {
  const pw = process.env.APP_PASSWORD;
  if (!pw) return null;
  return tokenFor(pw);
}

/** So sánh thời gian cố định để tránh rò rỉ qua timing. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
