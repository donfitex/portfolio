import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";
import { ProjectsExplorer } from "@/components/projects-explorer";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <div className="container py-16">
      <PageHeading
        eyebrow="// case studies"
        title="Projects & Case Studies"
        description="Each card expands into the problem, the solution, an architecture diagram, and the numbers."
      />
      <div className="mt-10">
        <ProjectsExplorer />
      </div>
    </div>
  );
}