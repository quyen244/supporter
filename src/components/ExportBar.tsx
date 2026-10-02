"use client";

import { useState } from "react";
import { toPng } from "html-to-image";
import { PAGE } from "@/lib/layout";
import { useToast } from "./Toast";
import { IconCopy, IconImage, IconPdf, IconShare } from "./icons";

const SCALE = 3; // 216 dpi - nét khi phụ huynh phóng to trên điện thoại

async function renderPages(): Promise<string[]> {
  const els = Array.from(document.querySelectorAll<HTMLElement>(".phieu-page"));
  const out: string[] = [];
  for (const el of els) {
    out.push(
      await toPng(el, {
        pixelRatio: SCALE,
        width: PAGE.w,
        height: PAGE.h,
        backgroundColor: "#ffffff",
        cacheBust: true,
      })
    );
  }
  return out;
}

function dataUrlToFile(dataUrl: string, name: string): File {
  const [head, b64] = dataUrl.split(",");
  const mime = head.match(/:(.*?);/)![1];
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new File([bytes], name, { type: mime });
}

function download(href: string, name: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = name;
  a.click();
}

export default function ExportBar({
  fileBase,
  shareText,
  hasLinks,
}: {
  fileBase: string;
  shareText: string;
  hasLinks: boolean;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const toast = useToast();

  async function run(label: string, fn: () => Promise<void>) {
    setBusy(label);
    try {
      await fn();
    } catch (err) {
      // Người dùng bấm huỷ ở bảng chia sẻ không phải là lỗi.
      if (err instanceof DOMException && err.name === "AbortError") return;
      toast.warn(err instanceof Error ? err.message : "Có lỗi xảy ra, thử lại nhé.");
    } finally {
      setBusy(null);
    }
  }

  const copyLinks = () =>
    run("copy", async () => {
      await navigator.clipboard.writeText(shareText);
      toast.ok("Đã sao chép link, dán vào Zalo là được");
    });

  const names = (n: number) => (i: number) =>
    n > 1 ? `${fileBase} - trang ${i + 1}.png` : `${fileBase}.png`;

  const savePng = () =>
    run("png", async () => {
      const imgs = await renderPages();
      imgs.forEach((src, i) => download(src, names(imgs.length)(i)));
      toast.ok(imgs.length > 1 ? `Đã tải ${imgs.length} ảnh` : "Đã tải ảnh phiếu");
    });

  const savePdf = () =>
    run("pdf", async () => {
      const imgs = await renderPages();
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: [PAGE.w, PAGE.h], orientation: "portrait" });
      imgs.forEach((src, i) => {
        if (i > 0) doc.addPage([PAGE.w, PAGE.h], "portrait");
        doc.addImage(src, "PNG", 0, 0, PAGE.w, PAGE.h);
      });
      doc.save(`${fileBase}.pdf`);
      toast.ok("Đã tải phiếu PDF");
    });

  const share = () =>
    run("share", async () => {
      const imgs = await renderPages();
      const files = imgs.map((src, i) => dataUrlToFile(src, names(imgs.length)(i)));
      // Gửi kèm text để link bấm được. Một số ứng dụng nhận ảnh thì bỏ qua phần
      // text, nên vẫn giữ nút Sao chép link làm đường lui.
      const payload = { files, text: shareText, title: fileBase };
      if (!navigator.canShare?.(payload)) {
        toast.warn("Thiết bị này không chia sẻ được file. Dùng nút Tải ảnh rồi gửi thủ công.");
        return;
      }
      await navigator.share(payload);
    });

  const ghost =
    "flex items-center gap-1.5 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink transition hover:border-sage-300 disabled:opacity-50";
  const primary =
    "flex items-center gap-1.5 rounded-xl bg-sage px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-600 disabled:opacity-50";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Ẩn trên máy tính: Zalo Desktop không nhận chia sẻ từ trình duyệt. */}
      <button onClick={share} disabled={!!busy} className={`touch-only ${primary}`}>
        <IconShare />
        {busy === "share" ? "Đang tạo ảnh…" : "Gửi qua Zalo"}
      </button>
      <button onClick={savePng} disabled={!!busy} className={ghost}>
        <IconImage />
        {busy === "png" ? "Đang tạo…" : "Tải ảnh"}
      </button>
      <button onClick={savePdf} disabled={!!busy} className={ghost}>
        <IconPdf />
        {busy === "pdf" ? "Đang tạo…" : "Tải PDF"}
      </button>
      {hasLinks && (
        <button onClick={copyLinks} disabled={!!busy} className={ghost} title="Dán vào Zalo nếu link không bấm được">
          <IconCopy />
          Sao chép link
        </button>
      )}
    </div>
  );
}
