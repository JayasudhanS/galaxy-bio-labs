import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Reveal, RevealText } from "@/components/motion/Reveal";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { QuoteCTA } from "@/components/home/QuoteCTA";
import { COMPANY, aboutLab, GALLERY } from "@/data/site";

const title = "About Galaxy Bio Labs — research-led biosciences";
const description =
  "How Galaxy Bio Labs develops biological inputs for agriculture, aquaculture and ornamental fish, and natural food products, from laboratory to field.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: About,
});

const TIMELINE = [
  { year: "2008", title: "A single bench", copy: "Founded as a soil-microbiology consultancy working with regional cooperatives." },
  { year: "2014", title: "First formulations", copy: "Bio-stimulant and microbial lines released after four seasons of on-farm trials." },
  { year: "2019", title: "Into the water", copy: "Aquaculture division opened, extending the same biology into pond systems." },
  { year: "2024", title: "Table and field", copy: "Food products launched, closing the loop from input to finished produce." },
];

function About() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A laboratory that thinks in seasons, not quarters"
        copy={COMPANY.blurb}
      />

      <section className="gbl-container grid items-start gap-14 py-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24 md:py-32">
        <div className="relative overflow-hidden rounded-[2.5rem] shadow-[var(--shadow-lift)]">
          <img
            src={aboutLab}
            alt="Researchers working in the Galaxy Bio Labs facility"
            width={1000}
            height={1200}
            loading="lazy"
            className="aspect-4/5 w-full object-cover"
          />
        </div>
        <div>
          <h2 className="font-display text-3xl leading-[1.12] md:text-[2.7rem]">
            <RevealText text="Biology is patient. Our process respects that." />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-7 text-base leading-relaxed text-muted-foreground">
              Our team works across microbiology, agronomy and aquaculture science. Formulations move through
              strain selection, stability testing and multi-season field validation before commercial release.
              This is placeholder narrative copy, ready to be replaced with the company's own history.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              We keep the supply chain short and the record complete: every batch is traceable to its raw
              materials and its quality release.
            </p>
          </Reveal>

          <div className="mt-14 space-y-0">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.year} delay={i * 0.08}>
                <div className="grid grid-cols-[5rem_1fr] gap-6 border-t border-border py-6">
                  <span className="font-display text-lg text-accent">{t.year}</span>
                  <div>
                    <h3 className="font-display text-xl">{t.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.copy}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--forest-deep)] py-24 text-primary-foreground md:py-32">
        <div className="gbl-container grid gap-14 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-accent">Our promise</p>
            <h2 className="mt-5 font-display text-4xl leading-[1.08] md:text-5xl">
              Products we would use on our own land
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            {[
              ["Mission", "To make regenerative inputs the practical choice, not the idealistic one."],
              ["Vision", "Healthy soil and clean water as the default condition of Indian agriculture."],
              ["Values", "Evidence over claims. Consistency over novelty. Service over transaction."],
              ["People", "Agronomists and field officers who show up between the seasons too."],
            ].map(([k, v]) => (
              <div key={k} className="border-t border-primary-foreground/15 pt-5">
                <h3 className="font-display text-xl">{k}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-primary-foreground/60">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="gbl-container py-24 md:py-28">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {GALLERY.slice(0, 4).map((g) => (
            <figure key={g.src} className="group overflow-hidden rounded-3xl">
              <img
                src={g.src}
                alt={g.alt}
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-luxe)] group-hover:scale-108"
              />
            </figure>
          ))}
        </div>
      </section>

      <WhyChooseUs />
      <QuoteCTA />
    </>
  );
}
