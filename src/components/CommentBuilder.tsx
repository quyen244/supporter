"use client";

import { useState } from "react";
import { SKILLS, TONE_STYLE, fillPhrase, slotCount, type Phrase } from "@/lib/phrases";

function PhraseChip({ phrase, onAdd }: { phrase: Phrase; onAdd: (line: string) => void }) {
  const slots = slotCount(phrase.text);
  const [values, setValues] = useState<string[]>(() =>
    Array.from({ length: slots }, (_, i) => String(phrase.defaults?.[i] ?? ""))
  );

  const segments = phrase.text.split("{n}");

  return (
    <button
      type="button"
      onClick={() => onAdd(fillPhrase(phrase.text, values))}
      className={`flex flex-wrap items-center gap-1 rounded-lg border px-2.5 py-1.5 text-left text-sm transition ${TONE_STYLE[phrase.tone]}`}
    >
      {segments.map((seg, i) => (
        <span key={i} className="contents">
          <span>{seg}</span>
          {i < slots && (
            <input
              type="number"
              value={values[i]}
              onChange={(e) => {
                const next = [...values];
                next[i] = e.target.value;
                setValues(next);
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-12 rounded border border-current/30 bg-white/90 px-1 py-0.5 text-center text-sm text-slate-900 outline-none focus:ring-2 focus:ring-sky-300"
            />
          )}
        </span>
      ))}
      <span className="ml-1 font-bold opacity-50">+</span>
    </button>
  );
}

export default function CommentBuilder({ onAdd }: { onAdd: (line: string) => void }) {
  const [active, setActive] = useState(SKILLS[0].id);
  const skill = SKILLS.find((s) => s.id === active)!;

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="mb-3 flex flex-wrap gap-1.5">
        {SKILLS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActive(s.id)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition ${
              s.id === active ? "bg-sky-600 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {skill.phrases.map((p) => (
          <PhraseChip key={p.id} phrase={p} onAdd={onAdd} />
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-500">
        Sửa số trong ô rồi bấm vào câu để thêm vào nhận xét.
      </p>
    </div>
  );
}
