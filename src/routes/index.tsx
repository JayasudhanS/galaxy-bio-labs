import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { Modules } from "@/components/home/Modules";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { QuoteCTA } from "@/components/home/QuoteCTA";
import { ContactStrip } from "@/components/home/ContactStrip";

const title = "Galaxy Bio Labs — Bio-science for soil, water and table";
const description =
  "Research-led biological inputs for agriculture, aquaculture, ornamental fish and natural food products. Request a quote from Galaxy Bio Labs.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <Modules />
      <FeaturedProducts />
      <WhyChooseUs />
      <GalleryPreview />
      <QuoteCTA />
      <ContactStrip />
    </>
  );
}
