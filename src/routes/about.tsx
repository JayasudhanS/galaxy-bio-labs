import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Reveal, RevealText } from "@/components/motion/Reveal";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { QuoteCTA } from "@/components/home/QuoteCTA";
import { GALLERY } from "@/data/site";
import DrShamuganandham from "@/assets/Dr.Shamuganandham.jpeg";
import SathyaSubash from "@/assets/Mr.M.SATHYA SUBASH.jpeg";

const title = "About Galaxy Bio Labs — MPEDA-certified aquaculture & agriculture solutions";
const description =
  "Thirty years of sustainable aquaculture and agriculture solutions from Galaxy Bio Labs, Madurai — MPEDA-authorized PCR testing, biotech R&D, and a pan-India dealer network.";

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

function ProfileSection({
  eyebrow,
  imageSrc,
  imageAlt,
  name,
  designation,
  paragraphs,
}: {
  eyebrow: string;
  imageSrc: string;
  imageAlt: string;
  name: string;
  designation: string;
  paragraphs: string[];
}) {
  return (
    <div className="grid gap-8 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-10">
      <div className="mx-auto w-full max-w-[220px] overflow-hidden rounded-[1.75rem] bg-secondary sm:mx-0">
        <img
          src={imageSrc}
          alt={imageAlt}
          width={440}
          height={550}
          loading="lazy"
          className="aspect-4/5 w-full object-cover"
        />
      </div>
      <div>
        <p className="eyebrow text-accent">{eyebrow}</p>
        <h3 className="mt-3 font-display text-2xl leading-snug md:text-3xl">{name}</h3>
        <p className="mt-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {designation}
        </p>
        <div className="mt-5 space-y-3">
          {paragraphs.map((p) => (
            <p key={p} className="text-sm leading-relaxed text-muted-foreground">
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function About() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Trusted providers of sustainable aquaculture & agriculture solutions"
        copy="Thirty years of biotechnology expertise, grown from Madurai, Tamil Nadu to serve customers across India."
      />

      {/* 1. About Us */}
      <section className="gbl-container py-20 md:py-28">
        <div className="max-w-3xl">
          <Reveal>
            <p className="eyebrow text-accent">About us</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-5 font-display text-3xl leading-[1.14] md:text-[2.5rem]">
              <RevealText text="Sustainable aquaculture and agriculture, for over thirty years" />
            </h2>
          </Reveal>
          <div className="mt-8 space-y-5">
            <Reveal delay={0.12}>
              <p className="text-base leading-relaxed text-muted-foreground">
                GALAXY BIO LABS has been a trusted provider of sustainable aquaculture and agriculture
                solutions for over thirty years, growing from our roots in Madurai, Tamil Nadu to serve
                customers across India. We support aquaculture and farming communities with advanced
                biotech tools and practical services, including MPEDA-authorized Polymerase Chain
                Reaction (PCR) testing.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="text-base leading-relaxed text-muted-foreground">
                With three decades of expertise in microbiology, viral diagnostics, and product
                development for aqua and agro sectors, we have built a strong national presence. Our
                aqua products are distributed through an extensive dealer network that spans the entire
                Indian coastline.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <p className="text-base leading-relaxed text-muted-foreground">
                We are contributing to agricultural inputs for farmers through our strong efficient
                employees, distributors and dealer network across India.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="text-base leading-relaxed text-muted-foreground">
                We maintain close scientific partnerships with leading national and international
                research organizations, such as the Central Institute of Fisheries Technology (CIFT),
                the Indian Council of Agricultural Research (ICAR), and the Central Salt and Marine
                Chemicals Research Institute (CSMCRI).
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2. Founder / Company History */}
      <section className="gbl-container border-t border-border py-20 md:py-28">
        <Reveal>
          <p className="eyebrow text-accent">Founder</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-5 font-display text-3xl leading-[1.14] md:text-[2.4rem]">
            Founder & Company History
          </h2>
        </Reveal>

        <div className="mt-12">
          <Reveal delay={0.1}>
            <ProfileSection
              eyebrow="Founder"
              imageSrc={DrShamuganandham}
              imageAlt="Dr. P. Shanmuganandam, Founder of Galaxy Bio Labs"
              name="Dr. P. Shanmuganandam"
              designation="Ph.D., CAS in Marine Biology — Founder, Galaxy Bio Labs"
              paragraphs={[
                "Galaxy Bio Labs was established in 2005, founded by Dr. P. Shanmuganandam (Ph.D., CAS in Marine Biology), who has worked across more than three decades of research, consulting, and field experience around the world.",
                "In 2005, he established the MPEDA-certified PCR Laboratory under the name of Galaxy Bio Labs.",
                "He is an open-water PADI certified scuba diver and has reached a depth of 40m in the sea.",
                "Ex. IMC member of ICAR-CIFT.",
              ]}
            />
          </Reveal>
        </div>
      </section>

      {/* 3. Marketing Manager */}
      <section className="gbl-container border-t border-border py-20 md:py-28">
        <Reveal>
          <p className="eyebrow text-accent">Team</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-5 font-display text-3xl leading-[1.14] md:text-[2.4rem]">
            Marketing Manager
          </h2>
        </Reveal>

        <div className="mt-12">
          <Reveal delay={0.1}>
            <ProfileSection
              eyebrow="Team"
              imageSrc={SathyaSubash}
              imageAlt="Mr. M. Sathya Subash, Marketing Manager at Galaxy Bio Labs"
              name="Mr. M. Sathya Subash"
              designation="B.Sc Botany — Marketing Manager"
              paragraphs={[]}
            />
          </Reveal>
        </div>
      </section>

      {/* 4. R&D Approach */}
      <section className="relative overflow-hidden bg-[var(--forest-deep)] py-24 text-primary-foreground md:py-32">
        <div className="gbl-container max-w-3xl">
          <Reveal>
            <p className="eyebrow text-accent">Galaxy Bio Labs</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-5 font-display text-3xl leading-[1.14] md:text-[2.5rem]">
              Galaxy Bio-Lab R&D Approach
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 font-display text-xl italic text-accent md:text-2xl">
              "Driven by Biotechnology. Validated by Science"
            </p>
          </Reveal>

          <div className="mt-8 space-y-5">
            <Reveal delay={0.16}>
              <p className="text-base leading-relaxed text-primary-foreground/70">
                Our R&D wing serves as the backbone of everything we do. With over thirty years of
                deep-rooted expertise in microbiology and viral testing, we focus on solving real-world
                agricultural and aquaculture challenges.
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <p className="text-base leading-relaxed text-primary-foreground/70">
                We specialize in isolating, screening, and formulating beneficial probiotic strains
                tailored for aquatic health and crop resilience. Our bio-inputs are designed to enhance
                nutrient uptake, strengthen immunity, and preserve ecosystem balance — without reliance
                on harsh chemicals.
              </p>
            </Reveal>
            <Reveal delay={0.28}>
              <p className="text-base leading-relaxed text-primary-foreground/70">
                Precision guides every step of our process. Using advanced PCR diagnostics, we verify
                strain purity, confirm pathogen-free formulations, and ensure dependable performance
                under real-farm conditions.
              </p>
            </Reveal>
            <Reveal delay={0.34}>
              <p className="text-base leading-relaxed text-primary-foreground/70">
                Innovation at Galaxy Biolabs is collaborative. Our R&D pipeline is continually reinforced
                through scientific partnerships with leading national and international research
                institutes, translating laboratory breakthroughs into practical field solutions.
              </p>
            </Reveal>
            <Reveal delay={0.4}>
              <p className="text-base leading-relaxed text-primary-foreground/70">
                At Galaxy Biolabs, R&D is the cornerstone of our work. Backed by over thirty years of
                expertise in microbiology and viral testing, we tackle real agricultural and aquaculture
                challenges. Our research centers on two pillars: target-specific probiotics that improve
                aquatic survival and bio-inputs that restore soil health and increase crop yields. By
                combining modern PCR diagnostics with sustainable biotechnology, we deliver certified,
                reliable, high-performance biological solutions to farming communities nationwide.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5-7. Mission / Vision / Values */}
      <section className="gbl-container py-24 md:py-32">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            [
              "Mission",
              "To lead the evolution of sustainable agriculture by bridging biological science with high-efficiency field performance — equipping commercial growers and agricultural partners with advanced bio stimulants, soil amendments, and bio-nutritional solutions that maximize crop yield, enhance soil vitality, and secure long-term agricultural resilience.",
            ],
            [
              "Vision",
              "To be the leader in scientific innovations, consistently delivering superior value to farmers through excellent employees, distributors and dealers, with a strong commitment towards sustainability and our values.",
            ],
            [
              "Values",
              "Happy employees lead to happy customers, which leads to more profits.",
            ],
          ].map(([k, v]) => (
            <Reveal key={k}>
              <div className="border-t border-border pt-5">
                <h3 className="font-display text-xl">{k}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{v}</p>
              </div>
            </Reveal>
          ))}
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