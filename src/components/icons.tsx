type P = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export function IconStudents({ className }: P) {
  return (
    <svg {...base} className={className} width="20" height="20" aria-hidden>
      <path d="M16 19v-1.5a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3V19" />
      <circle cx="9.5" cy="8" r="3" />
      <path d="M17 14.5a3 3 0 0 1 4 2.8V19M16.5 5.2a3 3 0 0 1 0 5.6" />
    </svg>
  );
}

export function IconSheet({ className }: P) {
  return (
    <svg {...base} className={className} width="20" height="20" aria-hidden>
      <rect x="4" y="3" width="16" height="18" rx="2.5" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  );
}

export function IconLogout({ className }: P) {
  return (
    <svg {...base} className={className} width="20" height="20" aria-hidden>
      <path d="M14 19H6.5A1.5 1.5 0 0 1 5 17.5v-11A1.5 1.5 0 0 1 6.5 5H14" />
      <path d="M17 15.5 20.5 12 17 8.5M20 12h-9" />
    </svg>
  );
}

export function IconPlus({ className }: P) {
  return (
    <svg {...base} className={className} width="18" height="18" aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconShare({ className }: P) {
  return (
    <svg {...base} className={className} width="18" height="18" aria-hidden>
      <circle cx="18" cy="5.5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="18.5" r="2.5" />
      <path d="m8.2 10.8 7.6-4.1M8.2 13.2l7.6 4.1" />
    </svg>
  );
}

export function IconImage({ className }: P) {
  return (
    <svg {...base} className={className} width="18" height="18" aria-hidden>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <circle cx="8.5" cy="10" r="1.5" />
      <path d="m4 17 4.5-4.5 3 3L15 11l5 5" />
    </svg>
  );
}

export function IconPdf({ className }: P) {
  return (
    <svg {...base} className={className} width="18" height="18" aria-hidden>
      <path d="M13 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z" />
      <path d="M13 3v6h6" />
    </svg>
  );
}

export function IconEdit({ className }: P) {
  return (
    <svg {...base} className={className} width="16" height="16" aria-hidden>
      <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17z" />
    </svg>
  );
}

export function IconTrash({ className }: P) {
  return (
    <svg {...base} className={className} width="16" height="16" aria-hidden>
      <path d="M4 7h16M10 7V5h4v2M6 7l1 13h10l1-13M10 11v6M14 11v6" />
    </svg>
  );
}

export function IconChevron({ className }: P) {
  return (
    <svg {...base} className={className} width="18" height="18" aria-hidden>
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

export function IconLink({ className }: P) {
  return (
    <svg {...base} className={className} width="14" height="14" aria-hidden>
      <path d="M10 13a4 4 0 0 0 5.7.4l2.6-2.6a4 4 0 0 0-5.7-5.7l-1.5 1.5" />
      <path d="M14 11a4 4 0 0 0-5.7-.4l-2.6 2.6a4 4 0 0 0 5.7 5.7l1.5-1.5" />
    </svg>
  );
}

/** Logo Google giữ nguyên 4 màu gốc, không tô theo currentColor. */
export function IconGoogle({ className }: P) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.7-2 5-4.4 6.600v5.5h7.1c4.2-3.8 6.6-9.5 6.6-16.1z" />
      <path fill="#34A853" d="M24 46c6 0 11-2 14.6-5.4l-7.1-5.5c-2 1.3-4.5 2.1-7.5 2.1-5.8 0-10.7-3.9-12.4-9.1H4.3v5.7C7.9 41 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.6 28.1c-.4-1.3-.7-2.7-.7-4.1s.2-2.8.7-4.1V14.2H4.3C2.8 17.1 2 20.4 2 24s.8 6.9 2.3 9.8l7.3-5.7z" />
      <path fill="#EA4335" d="M24 10.8c3.3 0 6.2 1.1 8.5 3.3l6.3-6.3C35 4.3 30 2 24 2 15.4 2 7.9 7 4.3 14.2l7.3 5.7c1.7-5.2 6.6-9.1 12.4-9.1z" />
    </svg>
  );
}

export function IconCalendar({ className }: P) {
  return (
    <svg {...base} className={className} width="20" height="20" aria-hidden>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" />
      <circle cx="8.5" cy="13.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="13.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconShield({ className }: P) {
  return (
    <svg {...base} className={className} width="20" height="20" aria-hidden>
      <path d="M12 3.5 5 6v5.4c0 4 2.9 7.6 7 8.6 4.1-1 7-4.6 7-8.6V6z" />
      <path d="m9.2 12 2 2 3.6-3.6" />
    </svg>
  );
}

export function IconCap({ className }: P) {
  return (
    <svg {...base} className={className} width="22" height="22" aria-hidden>
      <path d="M12 4 2.5 8.5 12 13l9.5-4.5z" />
      <path d="M6.5 10.8V15c0 1.4 2.5 2.6 5.5 2.6s5.5-1.2 5.5-2.6v-4.2M21.5 8.5V14" />
    </svg>
  );
}
