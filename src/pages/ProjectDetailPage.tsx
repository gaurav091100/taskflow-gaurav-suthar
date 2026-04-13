import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useProjectDetails } from "@/features/projects/hooks";
import ProjectHeader from "@/features/tasks/components/ProjectHeader";
import TaskSection from "@/features/tasks/components/TaskSection";
import { useParams } from "react-router-dom";

const ProjectDetailPage = () => {
  const { id: projectId } = useParams();
  const pid = projectId ?? "";

  const { data: project } = useProjectDetails(pid);

  if (!pid) {
    return (
      <Alert>
        <AlertTitle>Invalid link</AlertTitle>
        <AlertDescription>Missing project id in the URL.</AlertDescription>
      </Alert>
    );
  }
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <ProjectHeader project={project} />
      <Separator />
      <TaskSection />
    </div>
  );
};

export default ProjectDetailPage;
