import {
  Clock,
  FileCheck,
  MapPin,
  Shield,
  type LucideIcon,
} from 'lucide-react';

type Pillar = {
  icon: LucideIcon;
  label: string;
};

const PILLARS: Pillar[] = [
  { icon: Shield, label: 'Fully Insured' },
  { icon: FileCheck, label: 'Free Estimates' },
  { icon: Clock, label: '24/7 Emergency' },
  { icon: MapPin, label: '15+ Years Local' },
];

export default function TrustStrip() {
  return (
    <section
      aria-label="Why choose us"
      className="bg-forest text-cream"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {PILLARS.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-4 lg:justify-center"
            >
              <Icon
                className="h-8 w-8 flex-shrink-0 text-cream/90"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <span className="text-base font-semibold tracking-tight md:text-lg">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
