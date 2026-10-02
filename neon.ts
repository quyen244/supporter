import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  // Ứng dụng dùng Better Auth tự cài trong chính database này, không dùng
  // Neon Auth. Bật cả hai sẽ thành hai hệ xác thực song song gây nhầm lẫn.
  auth: false,
  preview: {
    buckets: {
      images: { access: "private" },
    },
    functions: {
      api: { name: "api", source: "./hello.ts" },
    },
  },
});
