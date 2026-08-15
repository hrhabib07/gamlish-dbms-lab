export function BrandMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="9" fill="#0f172a" />
      <circle cx="16" cy="16" r="9" fill="#38bdf8" />
      <path
        d="M11 16.5c0-3 2.2-5 5-5 1.8 0 3.2.8 4 2l-2.1 1.2c-.4-.7-1.1-1.1-1.9-1.1-1.4 0-2.3 1-2.3 2.9s.9 2.9 2.3 2.9c.8 0 1.5-.4 1.9-1.1L20 19.5c-.8 1.2-2.2 2-4 2-2.8 0-5-2-5-5Z"
        fill="#0f172a"
      />
    </svg>
  );
}
