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
