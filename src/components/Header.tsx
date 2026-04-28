'use client';

import { useEffect, useState } from 'react';
import { Menu, Phone, X } from 'lucide-react';
import Logo from './Logo';

const NAV_ITEMS = [
  { href: '#services', label: 'Services' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#contact', label: 'Contact' },
];

const PHONE_DISPLAY = '(518) 555-0142';
const PHONE_HREF = 'tel:+15185550142';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 bg-cream/95 backdrop-blur-sm transition-shadow duration-200 ${
        scrolled ? 'shadow-[0_2px_12px_rgba(0,0,0,0.06)]' : ''
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
        <a href="#main" aria-label="North Country Tree Co. home" className="rounded">
          <Logo />
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-charcoal transition-colors hover:text-forest"
            >
              {item.label}
            </a>
          ))}
          <a
            href={PHONE_HREF}
            className="inline-flex items-center gap-2 rounded-md bg-forest px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-forest-dark"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {PHONE_DISPLAY}
          </a>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <a
            href={PHONE_HREF}
            aria-label={`Call ${PHONE_DISPLAY}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-forest text-cream"
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
          </a>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-charcoal hover:bg-black/5"
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-black/5 bg-cream md:hidden"
        >
          <ul className="flex flex-col px-4 py-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base font-medium text-charcoal hover:text-forest"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={PHONE_HREF}
                className="block py-3 text-base font-semibold text-forest"
              >
                {PHONE_DISPLAY}
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
