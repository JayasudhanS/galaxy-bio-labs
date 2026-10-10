import frontScreen from "@/assets/front_screen_reorder.jpeg";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--forest-deep)] pt-20 sm:pt-24">
      <img
        src={frontScreen}
        alt=""
        aria-hidden
                className="absolute inset-0 -z-10 size-full object-cover"
        style={{
          opacity: 0.4,
          filter: "blur(40px)",
          WebkitFilter: "blur(40px)",
          transform: "scale(1.25)",
        }}
      />

      <div className="gbl-container relative pb-6 sm:pb-10">
        <div className="text-center">
          <p className="font-display text-[1.4rem] leading-tight text-primary-foreground sm:text-4xl">
            Dr. P. Shanmuganandam
          </p>
          <p className="mt-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent sm:mt-1 sm:text-xs sm:tracking-[0.28em]">
            Founder &amp; CEO, Galaxy Bio Labs
          </p>
        </div>

        <img
          src={frontScreen}
          alt=""
          fetchPriority="high"
          className="mx-auto mt-3 block h-auto w-full max-w-6xl sm:mt-5"
        />
      </div>
    </section>
  );
}