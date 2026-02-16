import Link from "next/link";
import { BRAND } from "@/lib/constants";
import TrackedCTALink from "@/components/tracking/TrackedCTALink";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy text-white/70">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="text-white">
              <div className="text-lg font-semibold tracking-tight">{BRAND.name}</div>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-white/50">
                Expert Maths &amp; Physics tuition for Grades 8-12 in Jubilee Hills. Diagnostic-first approach with small batches of 3-5 students.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/diagnostic"
                className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-navy shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:bg-accent-light"
              >
                Book Diagnostic
              </Link>
              <TrackedCTALink
                trackingType="whatsapp"
                href={BRAND.whatsappHref}
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-transparent px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-white/5"
              >
                WhatsApp
              </TrackedCTALink>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-accent uppercase tracking-wider">Curricula</div>
            <ul className="mt-4 grid gap-2 text-sm">
              <li><Link className="hover:text-white transition-colors" href="/cbse-maths-tuition">CBSE</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/icse-maths-tuition">ICSE</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/ib-myp-maths-tuition">IB MYP</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/ib-dp-maths-tuition">IB DP</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/igcse-maths-tuition">IGCSE</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/a-levels-maths-tuition">A-Levels</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-accent uppercase tracking-wider">Grades</div>
            <ul className="mt-4 grid gap-2 text-sm">
              <li><Link className="hover:text-white transition-colors" href="/class-8-tuition">Class 8</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/class-9-tuition">Class 9</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/class-10-tuition">Class 10</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/class-11-tuition">Class 11</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/class-12-tuition">Class 12</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-accent uppercase tracking-wider">Contact</div>
            <ul className="mt-4 grid gap-2 text-sm">
              <li><TrackedCTALink trackingType="phone" className="hover:text-white transition-colors" href={BRAND.phoneHref}>{BRAND.phoneDisplay}</TrackedCTALink></li>

              <li className="text-white/50">{BRAND.city}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/30 leading-relaxed">
          <p>
            Ankuram Tuition Centre offers expert Maths and Physics tuition in Jubilee Hills, Hyderabad for Grades 6–12. We cover CBSE, ICSE, ISC, IB MYP, IB DP, IGCSE, and Cambridge A-Levels. Small batches of 3–5 students with personalised attention. Serving students from Jubilee Hills, Banjara Hills, Gachibowli, Financial District, HITEC City, Kondapur, Madhapur, Manikonda, and Narsingi. Best tuition centre near me for Maths and Physics.
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <div>&copy; {new Date().getFullYear()} Ankuram Tuition Centre. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
