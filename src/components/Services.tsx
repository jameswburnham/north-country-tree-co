import {
  Axe,
  CloudLightning,
  Scissors,
  Stethoscope,
  TreePine,
  Trees,
  type LucideIcon,
} from 'lucide-react';

type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const SERVICES: Service[] = [
  {
    icon: TreePine,
    title: 'Tree Removal',
    description: 'Safe, complete removal of any tree, any size.',
  },
  {
    icon: CloudLightning,
    title: 'Emergency Storm Response',
    description: '24/7 response when storms bring trees down.',
  },
  {
    icon: Scissors,
    title: 'Trimming & Pruning',
    description: 'Healthy cuts that keep your trees strong.',
  },
  {
    icon: Axe,
    title: 'Stump Grinding',
    description: 'Below-grade grinding so you can replant or pave.',
  },
  {
    icon: Trees,
    title: 'Lot Clearing',
    description: 'Full-property clearing for builds and expansions.',
  },
  {
    icon: Stethoscope,
    title: 'Health Assessments',
    description: 'Honest evaluations from certified arborists.',
  },
];

export default function Services() {
  return (
    <section id="services" className="scroll-mt-20 bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-12 text-center md:mb-16">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-forest">
            Services
          </p>
          <h2 className="font-serif text-4xl text-charcoal md:text-5xl">
            What We Do
          </h2>
        </div>

        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="rounded-xl border border-charcoal/10 bg-white p-7 md:p-8"
            >
              <Icon
                className="h-9 w-9 text-forest"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <h3 className="mt-5 font-serif text-2xl text-charcoal">{title}</h3>
              <p className="mt-2 text-base leading-relaxed text-charcoal/70">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
