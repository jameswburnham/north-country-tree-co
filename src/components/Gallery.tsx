'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

type GalleryImage = {
  id: string;
  alt: string;
};

const IMAGES: GalleryImage[] = [
  {
    id: '1754321871548-61bdbc6f1506',
    alt: 'Arborist climbing a ladder into a large oak with a chainsaw in the foreground',
  },
  {
    id: '1588878309774-4b3f42a19a8f',
    alt: 'Arborist in a yellow hard hat using a chainsaw high on a branch against blue sky',
  },
  {
    id: '1754321889123-0485c7fea5f1',
    alt: 'Arborist working high in a tree above a residential brick home',
  },
  {
    id: '1754321895426-68b04ba453e3',
    alt: 'Operator running a green stump grinder in a backyard',
  },
  {
    id: '1754322449005-bdc38c631682',
    alt: 'Two-person tree crew working with ropes and a tall ladder beside a home',
  },
  {
    id: '1637176463673-8f63699a85b5',
    alt: 'Stack of freshly cut log ends showing tree rings',
  },
];

const thumbUrl = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=70`;
const fullUrl = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1800&q=80`;

export default function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % IMAGES.length)),
    [],
  );
  const prev = useCallback(
    () =>
      setOpenIndex((i) =>
        i === null ? null : (i - 1 + IMAGES.length) % IMAGES.length,
      ),
    [],
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex, close, next, prev]);

  return (
    <section id="gallery" className="scroll-mt-20 bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-12 text-center md:mb-16">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-forest">
            Gallery
          </p>
          <h2 className="font-serif text-4xl text-charcoal md:text-5xl">
            Recent Work
          </h2>
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {IMAGES.map((img, i) => (
            <FadeInTile key={img.id} index={i}>
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                aria-label={`Open larger view: ${img.alt}`}
                className="group relative block aspect-square w-full overflow-hidden rounded-lg bg-charcoal/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
              >
                <Image
                  src={thumbUrl(img.id)}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </button>
            </FadeInTile>
          ))}
        </ul>
      </div>

      {openIndex !== null && (
        <Lightbox
          image={IMAGES[openIndex]}
          index={openIndex}
          total={IMAGES.length}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </section>
  );
}

function FadeInTile({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <li
      ref={ref}
      style={{ transitionDelay: visible ? `${index * 60}ms` : '0ms' }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      {children}
    </li>
  );
}

function Lightbox({
  image,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  image: GalleryImage;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Auto-focus the close button when the dialog opens.
  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  // Trap Tab focus inside the dialog. Without this, Tab escapes to the
  // page elements behind the modal, which is a real a11y bug for any
  // role="dialog" aria-modal="true" element.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
    >
      <button
        ref={closeBtnRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close image"
        className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <X className="h-6 w-6" aria-hidden="true" />
      </button>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:left-6"
          >
            <ChevronLeft className="h-7 w-7" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            aria-label="Next image"
            className="absolute right-2 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:right-6"
          >
            <ChevronRight className="h-7 w-7" aria-hidden="true" />
          </button>
        </>
      )}

      {/* Plain <img> here is intentional — Next/Image with `fill` requires a sized parent,
          and we need the image to scale to its own intrinsic ratio inside max-h-[85vh]. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        onClick={(e) => e.stopPropagation()}
        src={fullUrl(image.id)}
        alt={image.alt}
        className="max-h-[85vh] max-w-full rounded object-contain"
      />

      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/85">
        {index + 1} / {total}
      </p>
    </div>
  );
}
