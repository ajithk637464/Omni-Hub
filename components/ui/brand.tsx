import Link from "next/link";

export default function Brand() {
  return (
    <Link className="brand" href="/dashboard" aria-label="Northstar Workspace home">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3.5 14.1 9.9 20.5 12l-6.4 2.1L12 20.5l-2.1-6.4L3.5 12l6.4-2.1L12 3.5Z"
            fill="white"
          />
          <circle cx="12" cy="12" r="2" fill="#655BE9" />
        </svg>
      </span>
      <span>Omni-Hub</span>
    </Link>
  );
}
