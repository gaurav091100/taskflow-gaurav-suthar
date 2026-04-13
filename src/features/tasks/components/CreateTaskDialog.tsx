/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useCreateTask } from "../hooks";
import { useParams } from "react-router-dom";

const initialFormState = {
  title: "",
  description: "",
  priority: "medium" as any,
  assignee_id: "none",
  due_date: "",
};
const CreateTaskDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) => {
  const [form, setForm] = useState<{
    title: string;
    description: string;
    priority: TaskPriority;
    assignee_id: string;
    due_date: string;
  }>(initialFormState);

  const { id: pid } = useParams();
  const projectId = pid ?? "";

  const createMutation = useCreateTask(projectId, {
    onSuccess: () => {
      setForm(initialFormState);
      onOpenChange(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New task</DialogTitle>
          <DialogDescription>
            Add a task to this project. You can assign it and set a due date.
          </DialogDescription>
          {createMutation.isError ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Could not create task</AlertTitle>
              <AlertDescription>Please try again.</AlertDescription>
            </Alert>
          ) : null}
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="task-title">
              Title<span className="text-red-500">*</span>
            </Label>
            <Input
              id="task-title"
              placeholder="Enter title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="task-desc">Description</Label>
            <Textarea
              id="task-desc"
              placeholder="Enter description"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(v) =>
                  setForm({ ...form, priority: v as TaskPriority })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select
                value={form.assignee_id}
                onValueChange={(v) => setForm({ ...form, assignee_id: v })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  <SelectItem value="1">Test User</SelectItem>
                  <SelectItem value="2">Jane Doe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="task-due">Due date</Label>
            <Input
              id="task-due"
              type="date"
              value={form.due_date}
              onChange={(e) => setForm({ ...form, due_date: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={createMutation.isPending || !form.title.trim()}
            onClick={() =>
              createMutation.mutate({
                title: form.title.trim(),
                description: form.description.trim() || undefined,
                priority: form.priority,
                status: "todo",
                assignee_id:
                  form.assignee_id === "none" ? null : form.assignee_id,
                due_date: form.due_date.trim() || null,
              })
            }
          >
            {createMutation.isPending ? "Creating…" : "Create task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
