type LogoProps = {
  className?: string;
};

export default function Logo({ className = '' }: LogoProps) {
  return (
    <span className={`flex flex-col leading-none ${className}`}>
      <span className="font-serif text-xl text-forest md:text-2xl">North Country</span>
      <span className="mt-0.5 text-[10px] font-semibold tracking-[0.25em] text-charcoal/70 md:text-xs">
        TREE CO.
      </span>
    </span>
  );
}
