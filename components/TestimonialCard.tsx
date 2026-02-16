type TestimonialCardProps = {
  quote: string;
  name: string;
  detail?: string;
  result?: string;
};

export default function TestimonialCard({ quote, name, detail, result }: TestimonialCardProps) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-0.5 text-accent text-lg">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="leading-none">★</span>
        ))}
      </div>

      {result && (
        <div className="mt-3">
          <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-navy">
            {result}
          </span>
        </div>
      )}

      <p className="mt-4 flex-1 text-base leading-relaxed text-gray-600">&ldquo;{quote}&rdquo;</p>

      <div className="mt-auto pt-5">
        <div className="h-px w-full bg-gray-100" />
        <div className="mt-4">
          <div className="text-sm font-semibold text-navy">{name}</div>
          {detail && <div className="mt-0.5 text-sm text-gray-400">{detail}</div>}
        </div>
      </div>
    </div>
  );
}
