import heroAgri from "@/assets/hero-1.jpg";
import heroAqua from "@/assets/hero-2.jpg";
import heroLab from "@/assets/hero-3.jpg";
import moduleAgri from "@/assets/module-agri.jpg";
import moduleAqua from "@/assets/module-aqua.jpg";
import moduleOrnamental from "@/assets/module-ornamental.jpg";
import moduleFood from "@/assets/module-food.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import aboutLab from "@/assets/about-lab.jpg";

export const COMPANY = {
  name: "Galaxy Bio Labs",
  tagline: "Bio-science for living systems",
  blurb:
    "A research-led biosciences house formulating inputs for soil, water and table. Placeholder company copy — easily replaced later.",
  email: "hello@galaxybiolabs.example",
  phone: "+91 00000 00000",
  address: "Plot 14, Biotech Park, Hyderabad, India",
  hours: "Mon – Sat · 09:00 to 18:00",
};

export type CategorySlug = "agri-inputs" | "aquaculture" | "ornamental-fish" | "food-products";

export interface Module {
  slug: CategorySlug;
  name: string;
  index: string;
  headline: string;
  description: string;
  image: string;
  highlights: string[];
}

export const MODULES: Module[] = [
  {
    slug: "agri-inputs",
    name: "Agri Inputs",
    index: "01",
    headline: "Soil that remembers how to give",
    description:
      "Bio-stimulants, microbial consortia and organic nutrition engineered to rebuild soil biology and lift yield without exhausting the field.",
    image: moduleAgri,
    highlights: ["Microbial consortia", "Organic nutrition", "Residue-free protocols"],
  },
  {
    slug: "aquaculture",
    name: "Aquaculture",
    index: "02",
    headline: "Clear water, calmer harvests",
    description:
      "Pond probiotics, water conditioners and gut-health formulations that stabilise culture systems from stocking through harvest.",
    image: moduleAqua,
    highlights: ["Pond probiotics", "Water conditioning", "Feed supplements"],
  },
  {
    slug: "ornamental-fish",
    name: "Ornamental Fish",
    index: "03",
    headline: "Colour, kept in condition",
    description:
      "Colour-enhancing nutrition and gentle health care for display aquaria, breeders and export-grade ornamental stock.",
    image: moduleOrnamental,
    highlights: ["Colour nutrition", "Breeder care", "Export-grade stock"],
  },
  {
    slug: "food-products",
    name: "Food Products",
    index: "04",
    headline: "From our fields to your table",
    description:
      "Cold-pressed oils, heritage grains and single-origin spices processed in small batches with full traceability.",
    image: moduleFood,
    highlights: ["Cold-pressed oils", "Heritage grains", "Traceable sourcing"],
  },
];

export const moduleBySlug = (slug: string) => MODULES.find((m) => m.slug === slug);

export interface Product {
  slug: string;
  title: string;
  category: CategorySlug;
  description: string;
  /** Extended description shown in admin form; falls back to description on the public site. */
  fullDescription?: string;
  /** Free-text applications field captured in the admin form. */
  applications?: string;
  benefits: string[];
  specifications: { label: string; value: string }[];
  usage: string;
  images: string[];
  featured?: boolean;
  status: "Active" | "Draft";
  createdAt: string;
  updatedAt: string;
}

const spec = (a: string, b: string, c: string, d: string) => [
  { label: "Form", value: a },
  { label: "Pack sizes", value: b },
  { label: "Shelf life", value: c },
  { label: "Storage", value: d },
];

export const PRODUCTS: Product[] = [
  {
    slug: "terra-bloom-bio-stimulant",
    title: "TerraBloom Bio-Stimulant",
    category: "agri-inputs",
    description:
      "A seaweed and humic based bio-stimulant that improves root architecture and nutrient uptake during vegetative and flowering stages. Placeholder product description.",
    benefits: [
      "Stronger root mass within two applications",
      "Improved flowering and fruit set",
      "Supports recovery after heat or salinity stress",
    ],
    specifications: spec("Liquid concentrate", "500 ml · 1 L · 5 L", "24 months", "Cool, dry, away from sunlight"),
    usage: "Dilute 2–3 ml per litre of water. Foliar spray every 15 days, or apply through drip at 1 L per acre.",
    images: [moduleAgri, heroAgri, gallery1],
    featured: true,
    status: "Active",
    createdAt: "2026-01-12",
    updatedAt: "2026-04-02",
  },
  {
    slug: "rhizo-guard-microbial",
    title: "RhizoGuard Microbial Consortia",
    category: "agri-inputs",
    description:
      "A multi-strain microbial consortium for soil application that restores rhizosphere balance and suppresses common soil-borne stress.",
    benefits: ["Rebuilds soil microbial diversity", "Better phosphorus availability", "Compatible with organic protocols"],
    specifications: spec("Free flowing granules", "1 kg · 4 kg", "18 months", "Below 30°C, sealed"),
    usage: "Broadcast 4 kg per acre with farmyard manure at land preparation or before first irrigation.",
    images: [heroAgri, moduleAgri],
    status: "Active",
    createdAt: "2026-01-20",
    updatedAt: "2026-03-18",
  },
  {
    slug: "aqua-clear-pond-probiotic",
    title: "AquaClear Pond Probiotic",
    category: "aquaculture",
    description:
      "A bacterial blend that digests organic sludge, controls ammonia spikes and keeps pond water within a stable culture window.",
    benefits: ["Reduces ammonia and nitrite load", "Cleaner pond bottom", "Lower water exchange requirement"],
    specifications: spec("Powder", "500 g · 5 kg", "24 months", "Dry, room temperature"),
    usage: "Activate 500 g in 20 L water with jaggery for 6 hours, then broadcast per acre of pond surface weekly.",
    images: [moduleAqua, gallery3, heroAqua],
    featured: true,
    status: "Active",
    createdAt: "2026-02-02",
    updatedAt: "2026-04-11",
  },
  {
    slug: "vital-gut-shrimp-supplement",
    title: "VitalGut Shrimp Supplement",
    category: "aquaculture",
    description:
      "Gut-health supplement for shrimp culture supporting feed conversion and resilience across the grow-out cycle.",
    benefits: ["Improved feed conversion ratio", "Stronger gut and hepatopancreas health", "Uniform growth"],
    specifications: spec("Micro-encapsulated powder", "1 kg", "18 months", "Cool and dry"),
    usage: "Mix 5 g per kg of feed twice daily from DOC 20 onwards.",
    images: [heroAqua, moduleAqua],
    status: "Active",
    createdAt: "2026-02-14",
    updatedAt: "2026-03-30",
  },
  {
    slug: "prisma-colour-flakes",
    title: "Prisma Colour Flakes",
    category: "ornamental-fish",
    description:
      "Carotenoid-rich daily flake feed formulated to deepen natural pigmentation in tropical ornamental species.",
    benefits: ["Visible colour depth in 3–4 weeks", "Low waste, water stays clear", "Balanced daily nutrition"],
    specifications: spec("Flakes", "50 g · 250 g", "12 months", "Airtight, away from humidity"),
    usage: "Feed twice daily, only what the fish consume in two minutes.",
    images: [moduleOrnamental, gallery4],
    featured: true,
    status: "Active",
    createdAt: "2026-02-25",
    updatedAt: "2026-04-05",
  },
  {
    slug: "aurora-koi-pellets",
    title: "Aurora Koi Pellets",
    category: "ornamental-fish",
    description:
      "Floating growth pellets for koi and large ornamentals, built around digestible protein and stable vitamin C.",
    benefits: ["Steady growth without bloat", "Supports skin lustre", "Floating, easy to monitor"],
    specifications: spec("Floating pellets", "500 g · 2 kg", "12 months", "Cool and dry"),
    usage: "Feed 1–2% of body weight daily, split across two feeds.",
    images: [gallery4, moduleOrnamental],
    status: "Active",
    createdAt: "2026-03-04",
    updatedAt: "2026-04-09",
  },
  {
    slug: "cold-pressed-groundnut-oil",
    title: "Cold-Pressed Groundnut Oil",
    category: "food-products",
    description:
      "Wood-pressed groundnut oil from contract-grown kernels, filtered but never refined, bottled in small batches.",
    benefits: ["Natural aroma retained", "No refining or bleaching", "Fully traceable sourcing"],
    specifications: spec("Edible oil", "1 L · 5 L", "9 months", "Away from direct light"),
    usage: "Everyday cooking, tempering and traditional preparations.",
    images: [moduleFood],
    featured: true,
    status: "Active",
    createdAt: "2026-03-11",
    updatedAt: "2026-04-14",
  },
  {
    slug: "heritage-millet-selection",
    title: "Heritage Millet Selection",
    category: "food-products",
    description:
      "A rotating selection of native millets cleaned, graded and packed within days of milling.",
    benefits: ["Single-origin lots", "High fibre profile", "Milled to order"],
    specifications: spec("Whole grain", "1 kg · 5 kg", "6 months", "Airtight container"),
    usage: "Soak for 30 minutes and cook 1:2.5 with water.",
    images: [moduleFood, gallery1],
    status: "Active",
    createdAt: "2026-03-22",
    updatedAt: "2026-04-16",
  },
];

export const productsByCategory = (slug: string) => PRODUCTS.filter((p) => p.category === slug);
export const productBySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const FEATURED = PRODUCTS.filter((p) => p.featured);

export const HERO_SLIDES = [
  {
    image: heroAgri,
    kicker: "Agri Inputs",
    title: "Regenerative science for the fields that feed us",
    copy: "Biological inputs developed in our own laboratories and validated on working farms.",
  },
  {
    image: heroAqua,
    kicker: "Aquaculture",
    title: "Stable water. Healthier stock. Predictable harvests",
    copy: "Probiotics and conditioners that hold a culture system steady through the full cycle.",
  },
  {
    image: heroLab,
    kicker: "Research",
    title: "Every formulation begins under a microscope",
    copy: "In-house R&D, controlled trials and batch-level quality records behind each product.",
  },
];

export const GALLERY = [
  { src: gallery1, alt: "Farmer inspecting a paddy field at sunrise", span: "tall" },
  { src: gallery2, alt: "Researcher pipetting samples in the laboratory", span: "normal" },
  { src: aboutLab, alt: "Interior of the Galaxy Bio Labs research facility", span: "normal" },
  { src: gallery3, alt: "Aerial view of aquaculture ponds at sunset", span: "wide" },
  { src: gallery4, alt: "Ornamental koi and guppy swimming", span: "tall" },
  { src: moduleAgri, alt: "Bio-fertiliser granules at the base of a crop", span: "normal" },
  { src: moduleFood, alt: "Cold pressed oils, grains and spices", span: "normal" },
  { src: heroAqua, alt: "Aquaculture ponds with aerators at dawn", span: "wide" },
];

export const STATS = [
  { value: 18, suffix: "+", label: "Years in bio-science" },
  { value: 42, suffix: "", label: "Formulations in market" },
  { value: 9600, suffix: "+", label: "Farms served" },
  { value: 6, suffix: "", label: "States of distribution" },
];

export { aboutLab, heroLab };
