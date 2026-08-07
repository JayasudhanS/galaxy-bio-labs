import { MagneticButton } from "@/components/motion/MagneticButton";
import { Reveal, RevealText } from "@/components/motion/Reveal";
import { useQuote } from "@/components/quote/QuoteProvider";
import { heroLab } from "@/data/site";

export function QuoteCTA() {
  const { open } = useQuote();
  return (
    <section className="relative isolate overflow-hidden">
      <img
        src={heroLab}
        alt=""
        width={1920}
        height={1088}
        loading="lazy"
        className="absolute inset-0 -z-10 size-full object-cover"
      />
      <div aria-hidden className="hero-veil absolute inset-0 -z-10" />
      <div className="gbl-container flex flex-col items-start gap-10 py-28 text-primary-foreground md:py-36">
        <Reveal>
          <p className="eyebrow text-accent">Start a conversation</p>
        </Reveal>
        <h2 className="max-w-3xl font-display text-4xl leading-[1.06] md:text-6xl">
          <RevealText text="Tell us what you grow. We will tell you what it needs." />
        </h2>
        <Reveal delay={0.2}>
          <MagneticButton onClick={() => open()} variant="invert">
            Request a quote
          </MagneticButton>
        </Reveal>
      </div>
    </section>
  );
}
