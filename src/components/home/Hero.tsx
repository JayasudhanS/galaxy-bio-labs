import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { HERO_SLIDES } from "@/data/site";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { useQuote } from "@/components/quote/QuoteProvider";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const [index, setIndex] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const { open } = useQuote();
  const slide = HERO_SLIDES[index] ?? HERO_SLIDES[0]!;

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % HERO_SLIDES.length), 6500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      className="relative isolate flex min-h-[58svh] items-end overflow-hidden bg-[var(--forest-deep)] md:min-h-[64svh]"
      onMouseMove={(e) =>
        setPointer({
          x: (e.clientX / window.innerWidth - 0.5) * 22,
          y: (e.clientY / window.innerHeight - 0.5) * 16,
        })
      }
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0, scale: 1.14 }}
          animate={{ opacity: 1, scale: 1.02 }}
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ opacity: { duration: 1.6, ease }, scale: { duration: 8, ease: "linear" } }}
        >
          <motion.img
            src={slide.image}
            alt=""
            width={1920}
            height={1088}
            fetchPriority={index === 0 ? "high" : "low"}
            className="size-full object-cover"
            animate={{ x: pointer.x, y: pointer.y }}
            transition={{ type: "spring", stiffness: 40, damping: 20 }}
          />
        </motion.div>
      </AnimatePresence>
      <div aria-hidden className="hero-veil absolute inset-0 -z-10" />

      <div className="gbl-container relative w-full pb-10 pt-28 md:pb-14 md:pt-32">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.p
              key={`k-${index}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.7, ease }}
              className="flex items-center gap-4 text-[0.66rem] font-semibold uppercase tracking-[0.32em] text-primary-foreground/70"
            >
              <span className="h-px w-12 bg-accent" />
              {slide.kicker}
            </motion.p>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.h1
              key={`t-${index}`}
              initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
              transition={{ duration: 1, ease }}
              className="mt-7 max-w-2xl font-display text-[2.6rem] leading-[1.03] text-primary-foreground text-balance-tight sm:text-6xl lg:text-[4.4rem]"
            >
              {slide.title}
            </motion.h1>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p
              key={`c-${index}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.9, ease, delay: 0.08 }}
              className="mt-6 max-w-lg text-base leading-relaxed text-primary-foreground/70"
            >
              {slide.copy}
            </motion.p>
          </AnimatePresence>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton to="/products" variant="light">
              Explore products
            </MagneticButton>
            <MagneticButton onClick={() => open()} variant="invert">
              Get a quote
            </MagneticButton>
          </div>
        </div>

        <div className="mt-10 flex items-end justify-between gap-8 border-t border-primary-foreground/15 pt-7 md:mt-14">
          <div className="flex items-center gap-3">
            {HERO_SLIDES.map((s, i) => (
              <button
                key={s.kicker}
                onClick={() => setIndex(i)}
                aria-label={`Show slide ${i + 1}`}
                className="group relative h-px w-14 bg-primary-foreground/25"
              >
                <span
                  className={`absolute inset-y-0 left-0 bg-accent transition-all duration-700 ${i === index ? "w-full" : "w-0 group-hover:w-1/3"
                    }`}
                />
              </button>
            ))}
          </div>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-3 text-[0.62rem] uppercase tracking-[0.28em] text-primary-foreground/55"
          >
            Scroll <ArrowDown className="size-3.5" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
