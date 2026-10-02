import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins/admin";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL chưa được cấu hình");

const local = connectionString.includes("localhost") || connectionString.includes("127.0.0.1");

export const ROLE_TEACHER = "teacher";
export const ROLE_ADMIN = "admin";

export const auth = betterAuth({
  database: new Pool({ connectionString, ssl: local ? false : { rejectUnauthorized: true } }),
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    // Chưa có dịch vụ gửi mail nên bỏ qua bước xác minh email.
    requireEmailVerification: false,
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
