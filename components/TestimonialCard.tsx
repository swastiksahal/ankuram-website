type TestimonialCardProps = {
  quote: string;
  name: string;
  detail?: string;
  result?: string;
};

export default function TestimonialCard({ quote, name, detail, result }: TestimonialCardProps) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(8,24,48,0.14)]">
      <div className="flex items-center gap-0.5 text-yellow-400 text-lg">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="leading-none">★</span>
        ))}
      </div>

      {result && (
        <div className="mt-3">
          <span className="inline-flex items-center rounded-full bg-[rgba(48,112,240,0.10)] px-3 py-1 text-xs font-semibold text-[var(--text)] ring-1 ring-[rgba(48,112,240,0.18)]">
            {result}
          </span>
        </div>
      )}

      <p className="mt-4 flex-1 text-base leading-relaxed text-[var(--text)]">&ldquo;{quote}&rdquo;</p>

      <div className="mt-auto pt-5">
        <div className="h-px w-full bg-[var(--border)]" />
        <div className="mt-4">
          <div className="text-sm font-semibold text-[var(--text)]">{name}</div>
          {detail && <div className="mt-0.5 text-sm text-[var(--muted)]">{detail}</div>}
        </div>
      </div>
    </div>
  );
}
