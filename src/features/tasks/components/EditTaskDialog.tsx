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
import { Button } from "@/components/ui/button";
import { formatStatus, STATUS_OPTIONS } from "@/utils/constant";
import type { Task, TaskStatus } from "../types";
import { useUpdateTask } from "../hooks";
import { useParams } from "react-router-dom";


type EditTaskDialogProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editingTask:Task;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setEditingTask : any;
}; 
const EditTaskDialog = ({ open, onOpenChange, editingTask, setEditingTask }: EditTaskDialogProps) => {
    const { id: pid } = useParams();
  const projectId = pid ?? "";
  const updateMutation = useUpdateTask(projectId,{
    onSuccess: () => {
      setEditingTask(null);
      onOpenChange(false);
    }
  })
  return (
    <Dialog
        open={open}
        onOpenChange={onOpenChange}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          {open ? (
            <>
              <DialogHeader>
                <DialogTitle>Edit task</DialogTitle>
                <DialogDescription>
                  Update details, status, assignee, or due date.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="edit-task-title">Title</Label>
                  <Input
                    id="edit-task-title"
                    placeholder="Enter title"
                    value={editingTask.title}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, title: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-task-desc">Description</Label>
                  <Textarea
                    id="edit-task-desc"
                    rows={3}
                    placeholder="Enter Description"
                    value={editingTask.description}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={editingTask.priority}
                      onValueChange={(v) =>
                        setEditingTask({
                          ...editingTask,
                          priority: v as TaskPriority,
                        })
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
                    <Label>Status</Label>
                    <Select
                      value={editingTask.status}
                      onValueChange={(v) =>
                        setEditingTask({
                          ...editingTask,
                          status: v as TaskStatus,
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s) => (
                          <SelectItem key={s} value={s}>
                            {formatStatus(s)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Assignee</Label>
                  <Select
                    value={editingTask.assignee_id ?? "none"}
                    onValueChange={(v) =>
                      setEditingTask({
                        ...editingTask,
                        assignee_id: v === "none" ? null : v,
                      })
                    }
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
                <div className="grid gap-2">
                  <Label htmlFor="edit-task-due">Due date</Label>
                  <Input
                    id="edit-task-due"
                    type="date"
                    value={editingTask.due_date as string}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        due_date: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingTask(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={updateMutation.isPending}
                  onClick={() =>
                    updateMutation.mutate({
                      taskId: editingTask.id,
                      payload: {
                        title: editingTask.title.trim() || "Untitled task",
                        description: editingTask.description,
                        priority: editingTask.priority,
                        status: editingTask.status,
                        assignee_id: editingTask.assignee_id,
                        due_date: editingTask.due_date?.trim() || null,
                      },
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
  )
}

export default EditTaskDialog