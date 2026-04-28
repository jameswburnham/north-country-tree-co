import Image from 'next/image';
import { Phone } from 'lucide-react';

const PHONE_DISPLAY = '(518) 555-0142';
const PHONE_HREF = 'tel:+15185550142';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1754321860056-ca7254d5e7ac?auto=format&fit=crop&w=2400&q=70';

export default function Hero() {
  return (
    <section className="relative h-screen max-h-[800px] min-h-[600px] w-full overflow-hidden bg-forest-dark">
      <Image
        src={HERO_IMAGE}
        alt="Arborist in a hard hat using a chainsaw to cut a large tree trunk, with sawdust flying"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Gradient overlay — slightly darker at top and bottom for headline legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/65"
      />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-start justify-center px-4 md:px-6">
        <h1 className="max-w-4xl font-serif text-[2.5rem] leading-[1.05] text-cream sm:text-5xl md:text-6xl lg:text-7xl">
          Plattsburgh&apos;s 24/7 Tree Removal &amp; Care
        </h1>
        <p className="mt-5 max-w-2xl text-lg font-light text-cream/90 md:mt-6 md:text-xl">
          Family-owned, fully insured, free quotes within 24 hours.
        </p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4 md:mt-10">
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-md bg-forest px-6 py-3.5 text-base font-semibold text-cream shadow-lg shadow-black/20 transition-all hover:bg-forest-dark hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-forest sm:px-8 sm:text-lg"
          >
            Get a Free Quote
          </a>
          <a
            href={PHONE_HREF}
            className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-cream bg-transparent px-6 py-3.5 text-base font-semibold text-cream transition-colors hover:bg-cream hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-forest sm:px-8 sm:text-lg"
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
            Call {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </section>
  );
}
