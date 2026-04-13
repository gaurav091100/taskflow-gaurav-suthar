import type { Project } from "../types";
import { ProjectCard } from "./ProjectCard";

export const ProjectsList = ({ projects }: { projects: Project[] }) => {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </ul>
  );
};