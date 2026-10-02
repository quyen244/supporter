import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phiếu học tập",
  description: "Nhập nhận xét sau buổi dạy và xuất phiếu gửi phụ huynh",
};

export const viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-slate-100 text-slate-900">{children}</body>
    </html>
  );
}
