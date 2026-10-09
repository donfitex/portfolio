import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";
import { ExperienceTimeline } from "@/components/experience-timeline";

export const metadata: Metadata = { title: "Experience" };

export default function ExperiencePage() {
  return (
    <div className="container py-16">
      <PageHeading
        eyebrow="// timeline"
        title="Engineering Experience"
        description="Roles focused on Django backend scale and production AI implementations."
      />
      <div className="mt-12 max-w-3xl">
        <ExperienceTimeline />
      </div>
    </div>
  );
}