import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "North Country Tree Co. — Plattsburgh's 24/7 Tree Removal & Care",
  description:
    'Family-owned, fully insured tree service serving Plattsburgh and the North Country. 24/7 emergency response. Free quotes within 24 hours.',
  openGraph: {
    title: "North Country Tree Co. — Plattsburgh's 24/7 Tree Removal & Care",
    description:
      'Family-owned, fully insured tree service. 24/7 emergency response. Free quotes within 24 hours.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="bg-cream font-sans text-charcoal" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
