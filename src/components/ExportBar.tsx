"use client";

import { useState } from "react";
import { toPng } from "html-to-image";
import { PAGE } from "@/lib/layout";

const SCALE = 3; // 216 dpi - nét khi phụ huynh phóng to trên điện thoại

function pages(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>(".phieu-page"));
}

async function renderPages(): Promise<string[]> {
  const out: string[] = [];
  for (const el of pages()) {
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

export default function ExportBar({ fileBase }: { fileBase: string }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  async function run(label: string, fn: () => Promise<void>) {
    setBusy(label);
    setNote(null);
    try {
      await fn();
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setBusy(null);
    }
  }

  const savePng = () =>
    run("png", async () => {
      const imgs = await renderPages();
      imgs.forEach((src, i) =>
        download(src, imgs.length > 1 ? `${fileBase} - trang ${i + 1}.png` : `${fileBase}.png`)
      );
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
      const files = imgs.map((src, i) =>
        dataUrlToFile(src, imgs.length > 1 ? `${fileBase} - trang ${i + 1}.png` : `${fileBase}.png`)
      );
      if (!navigator.canShare?.({ files })) {
        setNote("Thiết bị này không chia sẻ trực tiếp được. Hãy tải ảnh về rồi gửi qua Zalo.");
        return;
      }
      await navigator.share({ files, title: fileBase });
    });

  const btn = "rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button onClick={share} disabled={!!busy} className={`${btn} bg-sky-600 text-white hover:bg-sky-700`}>
        {busy === "share" ? "Đang tạo ảnh…" : "Gửi qua Zalo"}
      </button>
      <button onClick={savePng} disabled={!!busy} className={`${btn} bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50`}>
        {busy === "png" ? "Đang tạo…" : "Tải ảnh PNG"}
      </button>
      <button onClick={savePdf} disabled={!!busy} className={`${btn} bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50`}>
        {busy === "pdf" ? "Đang tạo…" : "Tải PDF"}
      </button>
      {note && <p className="w-full text-sm text-amber-700">{note}</p>}
    </div>
  );
}
