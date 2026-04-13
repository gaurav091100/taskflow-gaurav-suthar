import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FolderOpen, Plus } from "lucide-react";
import { useState } from "react";
import { CreateProjectDialog } from "./CreateProjectDialog";

const EmptyState = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <CreateProjectDialog open={open} onOpenChange={setOpen} />
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
          <Button onClick={() => setOpen(true)} className="w-full sm:w-auto">
            <Plus className="size-4" />
            Create project
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default EmptyState;
