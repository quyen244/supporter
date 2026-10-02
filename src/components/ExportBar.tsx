"use client";

import { useState } from "react";
import { toJpeg, toPng } from "html-to-image";
import { PAGE } from "@/lib/layout";
import { useToast } from "./Toast";
import { IconCopy, IconImage, IconPdf, IconShare } from "./icons";

const SCALE = 3; // 216 dpi - nét khi phụ huynh phóng to trên điện thoại

function sheetPages(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>(".phieu-page"));
}

async function renderPages(format: "png" | "jpeg" = "png"): Promise<string[]> {
  const opts = {
    pixelRatio: SCALE,
    width: PAGE.w,
    height: PAGE.h,
    backgroundColor: "#ffffff",
    cacheBust: true,
    // Chỉ dùng cho jpeg: phiếu là nền trắng và chữ đen nên 0.92 đủ sắc,
    // mà file nhẹ hơn PNG rất nhiều khi nhúng vào PDF.
    quality: 0.92,
  };
  const out: string[] = [];
  for (const el of sheetPages()) {
    out.push(format === "jpeg" ? await toJpeg(el, opts) : await toPng(el, opts));
  }
  return out;
}

/**
 * Vùng chứa link trên một trang phiếu, toạ độ tính theo point để dùng thẳng
 * cho PDF. Phiếu được dựng ở tỉ lệ 1px = 1pt nên không phải quy đổi.
 */
function linkAreas(page: HTMLElement) {
  const base = page.getBoundingClientRect();
  return Array.from(page.querySelectorAll<HTMLElement>("[data-link]")).map((el) => {
    const r = el.getBoundingClientRect();
    return {
      url: el.dataset.link!,
      x: r.left - base.left,
      y: r.top - base.top,
      w: r.width,
      h: r.height,
    };
  });
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [head, b64] = dataUrl.split(",");
  const mime = head.match(/:(.*?);/)![1];
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
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

  /*
   * Cách nhanh nhất trên máy tính: ảnh vào thẳng clipboard, sang Zalo bấm
   * Ctrl+V là xong, không phải tải file rồi đi tìm rồi kéo thả.
   * Chỉ chép trang đầu vì clipboard chỉ giữ được một ảnh.
   */
  const copyImage = () =>
    run("copyimg", async () => {
      const imgs = await renderPages();
      const blob = dataUrlToBlob(imgs[0]);
      if (typeof ClipboardItem === "undefined") {
        toast.warn("Trình duyệt này không chép được ảnh. Dùng nút Tải ảnh nhé.");
        return;
      }
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      toast.ok(
        imgs.length > 1
          ? "Đã chép trang 1, sang Zalo bấm Ctrl+V"
          : "Đã chép ảnh phiếu, sang Zalo bấm Ctrl+V"
      );
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
      // JPEG thay vì PNG: PNG nhúng vào PDF bị lưu gần như thô, một phiếu đã
      // hơn 12MB, quá nặng để gửi qua Zalo. JPEG 0.92 nhẹ hơn vài chục lần mà
      // mắt thường không phân biệt được trên nền trắng chữ đen.
      const imgs = await renderPages("jpeg");
      const pages = sheetPages();
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: [PAGE.w, PAGE.h], orientation: "portrait" });

      let links = 0;
      imgs.forEach((src, i) => {
        if (i > 0) doc.addPage([PAGE.w, PAGE.h], "portrait");
        doc.addImage(src, "JPEG", 0, 0, PAGE.w, PAGE.h, undefined, "FAST");
        // Phiếu được nhúng dạng ảnh nên chữ trên đó không bấm được. Phủ thêm
        // vùng liên kết thật đúng vị trí để phụ huynh mở được playlist và test.
        for (const a of linkAreas(pages[i])) {
          doc.link(a.x, a.y, a.w, a.h, { url: a.url });
          links += 1;
        }
      });

      doc.save(`${fileBase}.pdf`);
      toast.ok(links > 0 ? `Đã tải PDF, có ${links} link bấm được` : "Đã tải phiếu PDF");
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
    "flex items-center gap-1.5 rounded-md border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink transition hover:border-sage-300 disabled:opacity-50";
  const primary =
    "flex items-center gap-1.5 rounded-md bg-sage px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-600 disabled:opacity-50";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Ẩn trên máy tính: Zalo Desktop không nhận chia sẻ từ trình duyệt. */}
      <button onClick={share} disabled={!!busy} className={`touch-only ${primary}`}>
        <IconShare />
        {busy === "share" ? "Đang tạo ảnh…" : "Gửi qua Zalo"}
      </button>
      <button
        onClick={savePdf}
        disabled={!!busy}
        title="PDF giữ được link bấm được, kéo thẳng file vào khung chat Zalo"
        className={`desktop-only ${primary}`}
      >
        <IconPdf />
        {busy === "pdf" ? "Đang tạo…" : "Tải PDF để gửi"}
      </button>
      <button onClick={savePdf} disabled={!!busy} className={`touch-only ${ghost}`}>
        <IconPdf />
        {busy === "pdf" ? "Đang tạo…" : "Tải PDF"}
      </button>
      <button
        onClick={copyImage}
        disabled={!!busy}
        title="Chép ảnh phiếu, sang Zalo bấm Ctrl+V. Ảnh hiện ngay trong chat nhưng link không bấm được."
        className={`desktop-only ${ghost}`}
      >
        <IconCopy />
        {busy === "copyimg" ? "Đang tạo ảnh…" : "Chép ảnh"}
      </button>
      <button onClick={savePng} disabled={!!busy} className={ghost}>
        <IconImage />
        {busy === "png" ? "Đang tạo…" : "Tải ảnh"}
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
