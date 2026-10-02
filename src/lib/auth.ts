import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins/admin";
import { Pool } from "pg";

// Để trống thay vì ném lỗi: file này bị import lúc build, khi đó Vercel có thể
// chưa gắn biến môi trường. Pool của pg chỉ thực sự kết nối khi có truy vấn.
const connectionString = process.env.DATABASE_URL ?? "";
const local = connectionString.includes("localhost") || connectionString.includes("127.0.0.1");

export const ROLE_TEACHER = "teacher";
export const ROLE_ADMIN = "admin";

const googleId = process.env.GOOGLE_CLIENT_ID;
const googleSecret = process.env.GOOGLE_CLIENT_SECRET;

/** Chưa khai báo khoá Google thì không bật, để chạy cục bộ không cần tài khoản Google. */
export const googleEnabled = Boolean(googleId && googleSecret);

/*
 * Vercel tự cấp hai biến: VERCEL_PROJECT_PRODUCTION_URL là tên miền chính,
 * VERCEL_URL là tên miền riêng của từng lần deploy. Lấy chúng làm phương án dự
 * phòng để không phụ thuộc hoàn toàn vào BETTER_AUTH_URL khai tay.
 */
const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const vercelDeploy = process.env.VERCEL_URL;

const baseURL =
  process.env.BETTER_AUTH_URL ||
  (vercelProd ? `https://${vercelProd}` : undefined) ||
  "http://localhost:3000";

/*
 * Better Auth so header Origin của trình duyệt với baseURL, lệch một ký tự là
 * trả về INVALID_ORIGIN 403. Lỗi này rất khó thấy vì gọi bằng curl thì không
 * có header Origin nên vẫn trả 200. Khai thêm mọi tên miền hợp lệ ở đây để
 * bản xem trước của Vercel, vốn mỗi lần deploy một tên miền khác, cũng chạy.
 */
const trustedOrigins = [
  baseURL,
  vercelProd && `https://${vercelProd}`,
  vercelDeploy && `https://${vercelDeploy}`,
].filter((v): v is string => Boolean(v));

export const auth = betterAuth({
  database: new Pool({ connectionString, ssl: local ? false : { rejectUnauthorized: true } }),
  baseURL,
  trustedOrigins,
  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    // Chưa có dịch vụ gửi mail nên bỏ qua bước xác minh email.
    requireEmailVerification: false,
  },

  socialProviders: googleEnabled
    ? { google: { clientId: googleId!, clientSecret: googleSecret! } }
    : undefined,

  account: {
    accountLinking: {
      // Người đã đăng ký bằng mật khẩu, sau bấm đăng nhập Google cùng email thì
      // gộp vào một tài khoản thay vì tạo tài khoản thứ hai. Chỉ tin Google vì
      // Google đã xác minh email hộ mình.
      enabled: true,
      trustedProviders: ["google"],
    },
  },

  user: {
    additionalFields: {
      role: { type: "string", input: false },
    },
  },

  plugins: [
    admin({
      defaultRole: ROLE_TEACHER,
      adminRoles: [ROLE_ADMIN],
    }),
  ],

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Email trong ADMIN_EMAILS được cấp quyền quản trị ngay khi đăng ký.
          const admins = (process.env.ADMIN_EMAILS ?? "")
            .split(",")
            .map((e) => e.trim().toLowerCase())
            .filter(Boolean);
          const role = admins.includes(user.email.toLowerCase()) ? ROLE_ADMIN : ROLE_TEACHER;
          return { data: { ...user, role } };
        },
      },
    },
  },
});

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};
