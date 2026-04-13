import { Alert } from "@/components/ui/alert";
import EmptyState from "@/features/projects/components/EmptyState";
import { ProjectsHeader } from "@/features/projects/components/ProjectsHeader";
import { ProjectsList } from "@/features/projects/components/ProjectsList";
import ProjectsSkeleton from "@/features/projects/components/ProjectsSkeleton";
import { useProjects } from "@/features/projects/hooks";
import type { Project } from "@/features/projects/types";
const ProjectsPage = () => {
  const { data, isLoading, isError } = useProjects();

  if (isLoading) return <ProjectsSkeleton />;
  if (isError) return <Alert>Failed to load projects</Alert>;

  return (
    <div className="space-y-8">
      <ProjectsHeader />

      {data?.length === 0 ? (
        <EmptyState />
      ) : (
        <ProjectsList projects={data as Project[]} />
      )}
    </div>
  );
};

export default ProjectsPage;