import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateProjectDialog } from "./CreateProjectDialog";

export const ProjectsHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-muted-foreground text-sm">
            Manage your projects
          </p>
        </div>

        <Button onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          New project
        </Button>
      </div>

      <CreateProjectDialog open={open} onOpenChange={setOpen} />
    </>
  );
};