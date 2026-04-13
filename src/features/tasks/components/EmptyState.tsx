import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClipboardList } from "lucide-react";


type EmptyStateProps = {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  assigneeFilter: string;
  setAssigneeFilter: (value: string) => void;
};

export const EmptyState = ({
  statusFilter,
  setStatusFilter,
  assigneeFilter,
  setAssigneeFilter,
}: EmptyStateProps) => {
  return (
    <Card className="border-dashed">
      <CardHeader className="text-center sm:text-left">
        <div className="mx-auto flex size-12 items-center justify-center rounded-3xl bg-muted sm:mx-0">
          <ClipboardList className="size-6 text-muted-foreground" />
        </div>
        <CardTitle>No tasks to show</CardTitle>
        <CardDescription>
          {statusFilter !== "all" || assigneeFilter !== "all"
            ? "No tasks match the current filters. Try clearing filters or add a new task."
            : "Add your first task to this project."}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col gap-2 sm:flex-row">
        {statusFilter !== "all" || assigneeFilter !== "all" ? (
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              setStatusFilter("all");
              setAssigneeFilter("all");
            }}
          >
            Clear filters
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
};

export default EmptyState;
