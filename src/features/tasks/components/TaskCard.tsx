import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2 } from "lucide-react";
import { useDeleteTask } from "../hooks";
import { useParams } from "react-router-dom";
import {
  assigneeLabel,
  getPriorityStyle,
  getStatusStyle,
} from "@/utils/constant";
import type { Task, TaskDraft, TaskStatus } from "../types";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useState } from "react";
import EditTaskDialog from "./EditTaskDialog";
import { Badge } from "@/components/ui/badge";

type TaskCardProps = {
  task: Task;
};
export const TaskCard = ({ task }: TaskCardProps) => {
  const { id: pid } = useParams();
  const projectId = pid ?? "";
    const [open, setOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
  const deleteMutation = useDeleteTask(projectId);

  return (
   <>
    <EditTaskDialog
        open={open}
        onOpenChange={setOpen}
        editingTask={editingTask as Task}
        setEditingTask={setEditingTask}
      />
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <CardTitle className="text-base leading-snug sm:text-lg">
            {task.title?.trim() ? task.title : "Untitled task"}
          </CardTitle>
          <Badge
            className={`w-fit shrink-0 capitalize ${getPriorityStyle(task.priority)}`}
          >
            {task.priority}
          </Badge>
        </div>
        {task.description?.trim() ? (
          <CardDescription className="text-foreground/90">
            {task.description}
          </CardDescription>
        ) : (
          <CardDescription>No extra details for this task.</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
          <p>
            <span className="font-medium text-foreground">Assignee:</span>{" "}
            {assigneeLabel(task.assignee_id)}
          </p>
          <p>
            <span className="font-medium text-foreground">Due:</span>{" "}
            {task.due_date?.trim() ? task.due_date : "—"}
          </p>
        </div>
        <div className="space-y-2 flex gap-2 items-start">
          <Label htmlFor={`status-${task.id}`}>Status</Label>
          <Badge
            className={`w-fit shrink-0 capitalize ${getStatusStyle(task.status as TaskStatus)}`}
          >
            {task.status}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const draft: TaskDraft = {
              ...task,
              due_date: task.due_date ?? "",
              description: task.description ?? "",
            };
            setEditingTask(draft);
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
          title="Delete task?"
          description="This will permanently delete the task."
          confirmText="Delete"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onConfirm={() => deleteMutation.mutate(task.id as any)}
          loading={deleteMutation.isPending}
        />
      </CardFooter>
    </Card>
   </>
  );
};
