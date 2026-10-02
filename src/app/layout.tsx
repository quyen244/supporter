import type { Metadata } from "next";
import ToastProvider from "@/components/Toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Teachly",
  description: "Quản lý lớp, lịch dạy và phiếu nhận xét gửi phụ huynh",
};

export const viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
