import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../services/projects";
import type { Project } from "../types/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, FolderOpen, Pencil, Plus, Trash2 } from "lucide-react";

type UpdateProjectInput = { id: string; name: string; description: string };

const Projects = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const queryClient = useQueryClient();

  const {
    data: projects = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setCreateOpen(false);
      setName("");
      setDescription("");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...payload }: UpdateProjectInput) =>
      updateProject(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setEditingProject(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const openCreate = () => {
    setName("");
    setDescription("");
    setCreateOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-10 w-full sm:w-36" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardFooter className="gap-2">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 flex-1" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>Projects could not be loaded</AlertTitle>
        <AlertDescription>
          {error instanceof Error
            ? error.message
            : "Check your connection and try again."}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Projects
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Open a project to view and manage its tasks.
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="w-full shrink-0 sm:w-auto"
          size="lg"
        >
          <Plus className="size-4" />
          New project
        </Button>
      </div>

      {createMutation.isError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Create failed</AlertTitle>
          <AlertDescription>Could not create the project. Try again.</AlertDescription>
        </Alert>
      ) : null}

      {projects.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader className="text-center sm:text-left">
            <div className="mx-auto flex size-12 items-center justify-center rounded-3xl bg-muted sm:mx-0">
              <FolderOpen className="size-6 text-muted-foreground" />
            </div>
            <CardTitle>No projects yet</CardTitle>
            <CardDescription>
              Create your first project to add tasks, assign work, and track
              progress.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={openCreate} className="w-full sm:w-auto">
              <Plus className="size-4" />
              Create project
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <ul className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <li key={project.id}>
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
                    onClick={() => setEditingProject(project)}
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="flex-1 min-[400px]:flex-none"
                    onClick={() => {
                      if (confirm("Delete this project and all its tasks?")) {
                        deleteMutation.mutate(project.id);
                      }
                    }}
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New project</DialogTitle>
            <DialogDescription>
              Give your project a name. You can add a short description too.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="project-name">Name<span className="text-red-500">*</span></Label>
              <Input
                id="project-name"
                placeholder="e.g. Website redesign"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-desc">Description (optional)</Label>
              <Input
                id="project-desc"
                placeholder="What is this project about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={createMutation.isPending || !name.trim()}
              onClick={() =>
                createMutation.mutate({
                  name: name.trim(),
                  description: description.trim() || undefined,
                })
              }
            >
              {createMutation.isPending ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editingProject !== null}
        onOpenChange={(open) => {
          if (!open) setEditingProject(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          {editingProject ? (
            <>
              <DialogHeader>
                <DialogTitle>Edit project</DialogTitle>
                <DialogDescription>
                  Update the name or description. Changes save to your workspace.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="edit-project-name">Name</Label>
                  <Input
                    id="edit-project-name"
                    value={editingProject.name}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-project-desc">Description</Label>
                  <Input
                    id="edit-project-desc"
                    value={editingProject.description ?? ""}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingProject(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={updateMutation.isPending}
                  onClick={() =>
                    updateMutation.mutate({
                      id: editingProject.id,
                      name: editingProject.name.trim() || "Untitled project",
                      description: editingProject.description ?? "",
                    })
                  }
                >
                  {updateMutation.isPending ? "Saving…" : "Save changes"}
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Projects;