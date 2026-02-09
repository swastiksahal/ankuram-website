import Link from "next/link";
import { BRAND } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.10)] bg-[var(--brand)] text-white/80">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="text-white">
              <div className="text-lg font-semibold tracking-tight">{BRAND.name}</div>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-white/70">
                Expert Maths &amp; Physics tuition for Grades 8-12 in Jubilee Hills. Diagnostic-first approach with small batches of 3-5 students.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/diagnostic"
                className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[var(--brand)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                Book Diagnostic
              </Link>
              <a
                href={BRAND.whatsappHref}
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-transparent px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-white/10"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-white">Curricula</div>
            <ul className="mt-4 grid gap-2 text-sm">
              <li><Link className="hover:text-white" href="/cbse-tuition">CBSE</Link></li>
              <li><Link className="hover:text-white" href="/icse-tuition">ICSE</Link></li>
              <li><Link className="hover:text-white" href="/ib-myp-tuition">IB MYP</Link></li>
              <li><Link className="hover:text-white" href="/ib-dp-tuition">IB DP</Link></li>
              <li><Link className="hover:text-white" href="/igcse-tuition">IGCSE</Link></li>
              <li><Link className="hover:text-white" href="/a-levels-tuition">A-Levels</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-white">Grades</div>
            <ul className="mt-4 grid gap-2 text-sm">
              <li><Link className="hover:text-white" href="/class-8-tuition">Class 8</Link></li>
              <li><Link className="hover:text-white" href="/class-9-tuition">Class 9</Link></li>
              <li><Link className="hover:text-white" href="/class-10-tuition">Class 10</Link></li>
              <li><Link className="hover:text-white" href="/class-11-tuition">Class 11</Link></li>
              <li><Link className="hover:text-white" href="/class-12-tuition">Class 12</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-white">Contact</div>
            <ul className="mt-4 grid gap-2 text-sm">
              <li><a className="hover:text-white" href={BRAND.phoneHref}>{BRAND.phoneDisplay}</a></li>
              <li><a className="hover:text-white" href={`mailto:${BRAND.email}`}>{BRAND.email}</a></li>
              <li className="text-white/70">{BRAND.city}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <div>&copy; {new Date().getFullYear()} Ankuram Tuition Centre. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
