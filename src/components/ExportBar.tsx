"use client";

import { useState } from "react";
import { toPng } from "html-to-image";
import { PAGE } from "@/lib/layout";
import { IconImage, IconPdf, IconShare } from "./icons";

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

export default function ExportBar({ fileBase, shareText }: { fileBase: string; shareText: string }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  async function run(label: string, fn: () => Promise<void>) {
    setBusy(label);
    setNote(null);
    try {
      await fn();
    } catch (err) {
      // Người dùng bấm huỷ ở bảng chia sẻ không phải là lỗi.
      if (err instanceof DOMException && err.name === "AbortError") return;
      setNote(err instanceof Error ? err.message : "Có lỗi xảy ra, thử lại nhé.");
    } finally {
      setBusy(null);
    }
  }

  const names = (n: number) => (i: number) =>
    n > 1 ? `${fileBase} - trang ${i + 1}.png` : `${fileBase}.png`;

  const savePng = () =>
    run("png", async () => {
      const imgs = await renderPages();
      imgs.forEach((src, i) => download(src, names(imgs.length)(i)));
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
    });

  const share = () =>
    run("share", async () => {
      const imgs = await renderPages();
      const files = imgs.map((src, i) => dataUrlToFile(src, names(imgs.length)(i)));
      // Ảnh để phụ huynh xem ngay trong khung chat, text để bấm được link.
      const payload = { files, text: shareText, title: fileBase };
      if (!navigator.canShare?.(payload)) {
        setNote("Trình duyệt này không chia sẻ được file. Dùng nút Tải ảnh rồi gửi thủ công qua Zalo.");
        return;
      }
      await navigator.share(payload);
    });

  const ghost =
    "flex items-center gap-1.5 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink transition hover:border-sage-300 disabled:opacity-50";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={share}
        disabled={!!busy}
        className="flex items-center gap-1.5 rounded-xl bg-sage px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-600 disabled:opacity-50"
      >
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
      {note && (
        <p className="w-full rounded-xl bg-warn-bg px-3 py-2 text-sm text-warn">{note}</p>
      )}
    </div>
  );
}
