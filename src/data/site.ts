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
  email: "Info@galaxybiolabs.in",
  phone: "+91 99405 79585",
  address: "52/7, 2/235C, Rajesh Nagar, Oomachikulam Main Road,15B, Mettupatti,Madurai - 625502,Tamil Nadu, India.",
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

// Firestore ("products" collection, via src/lib/db-service.ts) is the
// single source of truth for product data. No static/dummy product
// arrays or lookup helpers live here anymore.
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
  { value: 10, suffix: "+", label: "Years in bio-science" },
  { value: 40, suffix: "", label: "Formulations in market" },
  { value: 900, suffix: "+", label: "Farms served" },
  { value: 3, suffix: "", label: "States of distribution" },
];

export { aboutLab, heroLab };
