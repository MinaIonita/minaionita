import { Answer } from "@/components/sections/answer";
import { ClosingCta } from "@/components/sections/closing-cta";
import { Cta } from "@/components/sections/cta";
import { Hero } from "@/components/sections/hero";
import { PersonalProjects } from "@/components/sections/personal-projects";
import { SelectedWork } from "@/components/sections/selected-work";
import { ServicesGrid } from "@/components/sections/services-grid";
import { Testimonials } from "@/components/sections/testimonials";
import { homeJsonLd } from "@/lib/schema";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd()) }}
      />
      <Hero />
      <SelectedWork />
      <ServicesGrid />
      <ClosingCta />
      <PersonalProjects />
      <Answer />
      <Testimonials />
      <Cta />
    </>
  );
}
