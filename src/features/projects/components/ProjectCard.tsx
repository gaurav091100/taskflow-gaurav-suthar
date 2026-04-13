import { Link } from "react-router-dom";
import type { Project } from "../types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import EditProjectDialog from "./EditProjectDailog";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useDeleteProject } from "../hooks";

export const ProjectCard = ({ project }: { project: Project }) => {
  const [open, setOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const deleteMutation = useDeleteProject();

  return (
    <>
      <EditProjectDialog
        open={open}
        onOpenChange={setOpen}
        editingProject={editingProject as Project}
        setEditingProject={setEditingProject}
      />
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle className="line-clamp-2 text-lg">
            {project.name || "Untitled project"}
          </CardTitle>
          <CardDescription className="line-clamp-3">
            {project.description?.trim()
              ? project.description
              : "No description added yet."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Button variant="secondary" className="w-full" asChild>
            <Link to={`/projects/${project.id}`}>Open project</Link>
          </Button>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1 min-[400px]:flex-none"
            onClick={() => {
              setEditingProject(project)
              setOpen(true)
            }}
          >
            <Pencil className="size-3.5" />
            Edit
          </Button>
          <ConfirmDialog
            trigger={
              <Button variant="destructive" size="sm">
                <Trash2 className="size-3.5" />
                Delete
              </Button>
            }
            title="Delete project?"
            description="This will permanently delete the project and all its tasks."
            confirmText="Delete"
            onConfirm={() => deleteMutation.mutate(project.id)}
            loading={deleteMutation.isPending}
          />
        </CardFooter>
      </Card>
    </>
  );
};
