import type { ReactNode } from "react";
import type { IconName } from "@/types/ui";

const icons: Record<IconName, ReactNode> = {
  alien: (
    <>
      <path d="M12 3c-4.4 0-7 3.2-7 7.4 0 5.1 3.2 10.6 7 10.6s7-5.5 7-10.6C19 6.2 16.4 3 12 3Z" />
      <path d="M8.5 11h2m3 0h2m-5.5 4c1.3 1 2.7 1 4 0" />
    </>
  ),
  "arrow-right": <path d="M5 12h14m-6-6 6 6-6 6" />,
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="14" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18m-11 0v2h4v-2" />
    </>
  ),
  chart: (
    <>
      <path d="M4 19V5m0 14h17" />
      <path d="m7 15 4-4 3 2 6-7" />
    </>
  ),
  "chevron-down": <path d="m7 10 5 5 5-5" />,
  grid: (
    <>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="5" rx="1.5" />
      <rect x="13" y="10" width="8" height="11" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9a2.5 2.5 0 1 1 4.2 1.8c-1 .8-1.8 1.2-1.8 2.7m0 3v.1" />
    </>
  ),
  history: (
    <>
      <path d="M3 12a9 9 0 1 0 2.6-6.4L3 8" />
      <path d="M3 3v5h5m4-1v5l3 2" />
    </>
  ),
  more: (
    <>
      <circle cx="5" cy="12" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
    </>
  ),
  omnitrix: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m12 6 2.2 4.5L19 12l-4.8 1.5L12 18l-2.2-4.5L5 12l4.8-1.5L12 6Z" />
    </>
  ),
  plus: <path d="M12 5v14m-7-7h14" />,
  ranking: (
    <>
      <path d="M4 20h16M6 20v-6h4v6m4 0V8h4v12M5 10l4-4 3 3 6-6" />
      <path d="M15 3h3v3" />
    </>
  ),
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 5 5" />
    </>
  ),
  settings: (
    <>
      <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
      <path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.5.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.5-.9l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.8l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.5-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.5.9l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 1.7Z" />
    </>
  ),
  swords: (
    <>
      <path d="m6 4 14 14m-2 2 2-2M4 6l2-2m12 0L4 18m-2 2 2-2" />
      <path d="m14 5 5-2-2 5M5 14l-2 5 5-2" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 21h8m-4-4v4m-5-18h10v5a5 5 0 0 1-10 0V3Zm0 2H4v2a4 4 0 0 0 4 4m8-6h4v2a4 4 0 0 1-4 4" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m6-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M20 21v-2a4 4 0 0 0-3-3.9m-1-12a4 4 0 0 1 0 7.8" />
    </>
  ),
};

export default function Icon({ name }: { name: IconName }) {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name]}
    </svg>
  );
}
