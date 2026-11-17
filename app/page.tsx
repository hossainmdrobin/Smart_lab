import { getHomepageData } from "@/src/lib/services/homepage";
import type { Metadata } from "next";
import SiteFooter from "@/components/public/layout/SiteFooter";
import SiteHeader from "@/components/public/layout/SiteHeader";
import HeroSection from "@/components/public/homepage/HeroSection";
import ResearchAreasSection from "@/components/public/homepage/ResearchAreasSection";
import AboutPreviewSection from "@/components/public/homepage/AboutPreviewSection";
import ResearchApproachSection from "@/components/public/homepage/ResearchApproachSection";
import FeaturedPublicationsSection from "@/components/public/homepage/FeaturedPublicationsSection";
import ProjectsSection from "@/components/public/homepage/ProjectsSection";
import PeopleSection from "@/components/public/homepage/PeopleSection";
import CollaborationSection from "@/components/public/homepage/CollaborationSection";

export const metadata: Metadata = {
  title: "Laboratory of Algorithmic Life Sciences | Dhaka, Bangladesh",
  description:
    "Explore research in computational drug design, DFT, molecular docking, molecular dynamics, network pharmacology, and AI at the Laboratory of Algorithmic Life Sciences, Dhaka, Bangladesh.",
};

export default async function Home() {
  const homepageData = await getHomepageData();
  // console.log("Homepage Data",homepageData)

  return (
    <div className="min-h-full bg-[#F5F8FA] text-[#1E293B]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-[#10243A]"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content" className="flex flex-col">
        <div id="home">
          <HeroSection />
        </div>

        <div id="research">
          <ResearchAreasSection />
        </div>

        <div id="about">
          <AboutPreviewSection />
        </div>

        <div>
          <ResearchApproachSection />
        </div>

        {homepageData.featuredPublications.length > 0 ? (
          <div id="publications">
            <FeaturedPublicationsSection
              publications={homepageData.featuredPublications}
            />
          </div>
        ) : null}

        {homepageData.featuredProjects.length > 0 ? (
          <div id="projects">
            <ProjectsSection projects={homepageData.featuredProjects} />
          </div>
        ) : null}

        {homepageData.selectedPeople.length > 0 ? (
          <div id="people">
            <PeopleSection people={homepageData.selectedPeople} />
          </div>
        ) : null}

        <div id="contact">
          <CollaborationSection />
        </div>
      </main>
      <SiteFooter settings={homepageData.settings} />
    </div>
  );
}
