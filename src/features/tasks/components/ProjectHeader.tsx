import { Button } from "@/components/ui/button";
import type { Project } from "@/features/projects/types";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

type ProjectHeaderProps = {
  project: Project;
};
const ProjectHeader = ({ project }: ProjectHeaderProps) => {
  // const projectTitle =
  //   project && typeof project === "object" && "name" in project
  //     ? String((project as { name?: string }).name || "Project")
  //     : "Project";
  // const projectDesc =
  //   project &&
  //   typeof project === "object" &&
  //   "description" in project &&
  //   typeof (project as { description?: string }).description === "string" &&
  //   (project as { description: string }).description.trim()
  //     ? (project as { description: string }).description
  //     : null;

  const projectTitle = project?.name || "";

const projectDesc = project?.description?.trim()
  ? project.description
  : null;
  return (
    <div>
      <Button variant="ghost" size="sm" className="mb-4 -ml-2" asChild>
        <Link to="/" className="inline-flex items-center gap-2">
          <ArrowLeft className="size-4" />
          Projects
        </Link>
      </Button>
      <header className="space-y-2">
        <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          {projectTitle}
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          {projectDesc ?? "No description provided for this project."}
        </p>
      </header>
    </div>
  );
};

export default ProjectHeader;
