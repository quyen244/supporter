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
      className={`press flex flex-wrap items-center gap-1 rounded-md border px-3 py-2 text-left text-sm ${TONE_STYLE[phrase.tone]}`}
    >
      {segments.map((seg, i) => (
        <span key={i} className="contents">
          <span>{seg}</span>
          {i < slots && (
            <input
              type="number"
              value={values[i]}
              aria-label="Giá trị"
              onChange={(e) => {
                const next = [...values];
                next[i] = e.target.value;
                setValues(next);
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-12 rounded-md border border-current/25 bg-white px-1 py-0.5 text-center text-sm font-semibold text-ink outline-none focus:border-sage focus:ring-2 focus:ring-sage-100"
            />
          )}
        </span>
      ))}
      <span className="ml-0.5 text-base leading-none opacity-40">+</span>
    </button>
  );
}

export default function CommentBuilder({ onAdd }: { onAdd: (line: string) => void }) {
  const [active, setActive] = useState(SKILLS[0].id);
  const skill = SKILLS.find((s) => s.id === active)!;

  return (
    <div className="rounded-md border border-line bg-cream p-3.5">
      <div className="mb-3 flex flex-wrap gap-1.5">
        {SKILLS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActive(s.id)}
            className={`press rounded-md px-3.5 py-1.5 text-sm font-medium ${
              s.id === active
                ? "bg-sage text-white"
                : "bg-white text-ink-soft ring-1 ring-line hover:text-sage-700"
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

      <p className="mt-2.5 text-xs text-ink-faint">Sửa số trong ô rồi bấm vào câu để thêm vào nhận xét.</p>
    </div>
  );
}
