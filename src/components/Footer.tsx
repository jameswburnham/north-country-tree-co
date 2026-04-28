import { Clock, Mail, Phone } from 'lucide-react';
import Logo from './Logo';

const PHONE_DISPLAY = '(518) 555-0142';
const PHONE_HREF = 'tel:+15185550142';
const EMAIL = 'info@northcountrytreeco.com';

export default function Footer() {
  return (
    <footer className="bg-forest text-cream">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="mb-10 md:mb-12">
          <span className="inline-block">
            <span className="flex flex-col leading-none">
              <span className="font-serif text-2xl text-cream">North Country</span>
              <span className="mt-0.5 text-[10px] font-semibold tracking-[0.25em] text-cream/80 md:text-xs">
                TREE CO.
              </span>
            </span>
          </span>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="mb-3 font-serif text-lg">Service Area</h3>
            <p className="text-sm leading-relaxed text-cream/85">
              Plattsburgh, Saranac, Peru, Morrisonville, Champlain, and surrounding North
              Country communities.
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-serif text-lg">Contact</h3>
            <ul className="space-y-2 text-sm text-cream/85">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <a
                  href={PHONE_HREF}
                  className="rounded-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-forest"
                >
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${EMAIL}`}
                  className="rounded-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-forest"
                >
                  {EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <span>24/7 emergency response · Mon–Sat 7am–6pm office</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-serif text-lg">About</h3>
            <p className="text-sm leading-relaxed text-cream/85">
              Fully licensed and insured. Family-owned since 2009.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-cream/15 pt-6 text-xs text-cream/65 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} North Country Tree Co. All rights reserved.</p>
          <p>Plattsburgh, NY · Serving the North Country</p>
        </div>
      </div>
    </footer>
  );
}
