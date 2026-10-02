"use client";

import { useRef } from "react";
import { createStudent } from "@/app/actions";
import { IconPlus } from "./icons";

export default function NewStudent() {
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        onClick={() => dialog.current?.showModal()}
        className="flex items-center gap-1.5 rounded-md bg-sage px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-600"
      >
        <IconPlus />
        Thêm học viên
      </button>

      <dialog
        ref={dialog}
        className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-lg border border-line bg-white p-0 backdrop:bg-ink/30 backdrop:backdrop-blur-sm"
      >
        <form action={createStudent} className="p-6">
          <h2 className="text-lg font-bold text-ink">Thêm học viên</h2>
          <p className="mt-1 text-sm text-ink-soft">Mã lớp và playlist có thể điền sau.</p>

          <div className="mt-5 grid gap-4">
            <div>
              <label htmlFor="n" className="label">
                Tên học sinh
              </label>
              <input id="n" name="name" required placeholder="Bùi Diệu Anh" className="field" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="c" className="label">
                  Mã lớp
                </label>
                <input id="c" name="class_code" placeholder="PK2609125" className="field" />
              </div>
              <div>
                <label htmlFor="t" className="label">
                  Giáo viên
                </label>
                <input id="t" name="teacher_name" placeholder="Nguyễn Văn Quyền" className="field" />
              </div>
            </div>
            <div>
              <label htmlFor="p" className="label">
                Link playlist lớp
              </label>
              <input id="p" name="playlist_url" placeholder="https://youtube.com/playlist?..." className="field" />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              className="rounded-md px-4 py-2.5 text-sm font-medium text-ink-soft transition hover:bg-sand"
            >
              Huỷ
            </button>
            <button className="rounded-md bg-sage px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-600">
              Thêm
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
