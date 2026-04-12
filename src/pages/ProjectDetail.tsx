import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createTask,
  deleteTask,
  getTasksByProject,
  updateTask,
} from "../services/tasks";
import { getProjectById } from "../services/projects";
import type {
  Task,
  TaskPriority,
  TaskStatus,
  TaskUpdatePayload,
} from "../types/api";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  ArrowLeft,
  ClipboardList,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

type TaskDraft = Omit<Task, "due_date" | "description"> & {
  due_date: string;
  description: string;
};

const ASSIGNEE_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All assignees" },
  { value: "unassigned", label: "Unassigned" },
  { value: "1", label: "Test User" },
  { value: "2", label: "Jane Doe" },
];

const STATUS_OPTIONS: TaskStatus[] = ["todo", "in_progress", "done"];

function formatStatus(s: TaskStatus) {
  return s.replace("_", " ");
}

function assigneeLabel(id: string | null) {
  if (id == null) return "Unassigned";
  if (id === "1") return "Test User";
  if (id === "2") return "Jane Doe";
  return id;
}

const getPriorityStyle = (priority: TaskPriority) => {
  switch (priority) {
    case "low":
      return "bg-green-50 text-green-700";
    case "medium":
      return "bg-orange-50 text-orange-700";
    case "high":
      return "bg-red-50 text-red-700";
    default:
      return "bg-gray-50 text-gray-700";
  }
};
const getStatusStyle = (status: TaskStatus) => {
  switch (status) {
    case "todo":
      return "bg-yellow-50 text-yellow-700";
    case "in_progress":
      return "bg-blue-50 text-blue-700";
    case "done":
      return "bg-green-50 text-green-700";
    default:
      return "bg-gray-50 text-gray-700";
  }
};
export default function ProjectDetail() {
  const { id: projectId } = useParams();
  const queryClient = useQueryClient();
  const pid = projectId ?? "";

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<{
    title: string;
    description: string;
    priority: TaskPriority;
    assignee_id: string;
    due_date: string;
  }>({
    title: "",
    description: "",
    priority: "medium",
    assignee_id: "none",
    due_date: "",
  });

  const [statusFilter, setStatusFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [editingTask, setEditingTask] = useState<TaskDraft | null>(null);

  const taskFilters = useMemo(
    () => ({
      status: statusFilter === "all" ? undefined : statusFilter,
      assignee: assigneeFilter === "all" ? undefined : assigneeFilter,
    }),
    [statusFilter, assigneeFilter]
  );

  const {
    data: project,
    isLoading: projectLoading,
    isError: projectError,
    error: projectErr,
  } = useQuery({
    queryKey: ["project", pid],
    queryFn: () => getProjectById(pid),
    enabled: Boolean(pid),
  });

  const {
    data: tasks = [],
    isLoading: tasksLoading,
    isError: tasksError,
  } = useQuery({
    queryKey: ["tasks", pid, taskFilters],
    queryFn: () => getTasksByProject(pid, taskFilters),
    enabled: Boolean(pid),
  });

  const createMutation = useMutation({
    mutationFn: (payload: TaskUpdatePayload & { title: string }) =>
      createTask(pid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", pid] });
      queryClient.invalidateQueries({ queryKey: ["project", pid] });
      setForm({
        title: "",
        description: "",
        priority: "medium",
        assignee_id: "none",
        due_date: "",
      });
      setCreateOpen(false);
    },
  });

  // const statusMutation = useMutation({
  //   mutationFn: ({
  //     taskId,
  //     status,
  //   }: {
  //     taskId: string;
  //     status: TaskStatus;
  //   }) => updateTask(taskId, { status }),
  //   onMutate: async ({ taskId, status }) => {
  //     await queryClient.cancelQueries({ queryKey: ["tasks", pid] });
  //     const previousEntries = queryClient.getQueriesData<Task[]>({
  //       queryKey: ["tasks", pid],
  //     });

  //     queryClient.setQueriesData<Task[]>(
  //       { queryKey: ["tasks", pid] },
  //       (old) =>
  //         old?.map((t) => (t.id === taskId ? { ...t, status } : t)) ?? old
  //     );

  //     return { previousEntries };
  //   },
  //   onError: (_err, _vars, context) => {
  //     context?.previousEntries.forEach(([key, data]) => {
  //       if (data) queryClient.setQueryData(key, data);
  //     });
  //   },
  //   onSettled: () => {
  //     queryClient.invalidateQueries({ queryKey: ["tasks", pid] });
  //     queryClient.invalidateQueries({ queryKey: ["project", pid] });
  //   },
  // });

  const updateMutation = useMutation({
    mutationFn: ({
      taskId,
      payload,
    }: {
      taskId: string;
      payload: TaskUpdatePayload;
    }) => updateTask(taskId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", pid] });
      queryClient.invalidateQueries({ queryKey: ["project", pid] });
      setEditingTask(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", pid] });
      queryClient.invalidateQueries({ queryKey: ["project", pid] });
    },
  });

  const openCreate = () => {
    setForm({
      title: "",
      description: "",
      priority: "medium",
      assignee_id: "none",
      due_date: "",
    });
    setCreateOpen(true);
  };

  if (!pid) {
    return (
      <Alert>
        <AlertTitle>Invalid link</AlertTitle>
        <AlertDescription>Missing project id in the URL.</AlertDescription>
      </Alert>
    );
  }

  if (projectLoading || tasksLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-10 w-full max-w-lg" />
        <Skeleton className="h-24 w-full" />
        <div className="flex flex-col gap-3 sm:flex-row">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
        <Skeleton className="h-12 w-40" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (projectError) {
    const is404 =
      projectErr &&
      typeof projectErr === "object" &&
      "response" in projectErr &&
      (projectErr as { response?: { status?: number } }).response?.status ===
        404;
    return (
      <div className="mx-auto max-w-lg space-y-4">
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>{is404 ? "Project not found" : "Unable to load project"}</AlertTitle>
          <AlertDescription>
            {is404
              ? "It may have been deleted or the link is wrong."
              : "Please try again in a moment."}
          </AlertDescription>
        </Alert>
        <Button variant="outline" asChild>
          <Link
            to="/"
            className="inline-flex items-center gap-2"
          >
            <ArrowLeft className="size-4" />
            Back to projects
          </Link>
        </Button>
      </div>
    );
  }

  if (tasksError) {
    return (
      <div className="mx-auto max-w-lg space-y-4">
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Tasks could not be loaded</AlertTitle>
          <AlertDescription>
            Check your connection and try opening the project again.
          </AlertDescription>
        </Alert>
        <Button variant="outline" asChild>
          <Link
            to="/"
            className="inline-flex items-center gap-2"
          >
            <ArrowLeft className="size-4" />
            Back to projects
          </Link>
        </Button>
      </div>
    );
  }

  const projectTitle =
    project && typeof project === "object" && "name" in project
      ? String((project as { name?: string }).name || "Project")
      : "Project";
  const projectDesc =
    project &&
    typeof project === "object" &&
    "description" in project &&
    typeof (project as { description?: string }).description === "string" &&
    (project as { description: string }).description.trim()
      ? (project as { description: string }).description
      : null;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Button variant="ghost" size="sm" className="mb-4 -ml-2" asChild>
          <Link to="/" className="inline-flex items-center gap-2">
            <ArrowLeft className="size-4" />
            Projects
          </Link>
        </Button>
        <header className="space-y-2">
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            {projectTitle}
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            {projectDesc ?? "No description provided for this project."}
          </p>
        </header>
      </div>

      <Separator />

      <section className="space-y-4" aria-labelledby="tasks-heading">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="tasks-heading" className="text-lg font-semibold">
              Tasks
            </h2>
            <p className="text-sm text-muted-foreground">
              Filter by status or assignee. Status changes save immediately.
            </p>
          </div>
          <Button className="w-full shrink-0 sm:w-auto" onClick={openCreate}>
            <Plus className="size-4" />
            New task
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="filter-status">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger
                id="filter-status"
                className="w-full min-w-0"
                size="default"
              >
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="in_progress">In progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-assignee">Assignee</Label>
            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger
                id="filter-assignee"
                className="w-full min-w-0"
                size="default"
              >
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                {ASSIGNEE_FILTER_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {createMutation.isError ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Could not create task</AlertTitle>
            <AlertDescription>Please try again.</AlertDescription>
          </Alert>
        ) : null}

        {/* {statusMutation.isError ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Status update failed</AlertTitle>
            <AlertDescription>
              Your change was reverted. Try again.
            </AlertDescription>
          </Alert>
        ) : null} */}

        {tasks.length === 0 ? (
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
              <Button className="w-full sm:w-auto" onClick={openCreate}>
                <Plus className="size-4" />
                New task
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <ul className="list-none space-y-4 p-0">
            {tasks.map((task) => (
              <li key={task.id}>
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
                      <CardDescription>
                        No extra details for this task.
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
                      <p>
                        <span className="font-medium text-foreground">
                          Assignee:
                        </span>{" "}
                        {assigneeLabel(task.assignee_id)}
                      </p>
                      <p>
                        <span className="font-medium text-foreground">
                          Due:
                        </span>{" "}
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
                      {/* <Select
                        value={task.status}
                        onValueChange={(v) =>
                          statusMutation.mutate({
                            taskId: task.id,
                            status: v as TaskStatus,
                          })
                        }
                        disabled={statusMutation.isPending}
                      >
                        <SelectTrigger
                          id={`status-${task.id}`}
                          className="w-full min-w-0 sm:max-w-xs"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s}>
                              {formatStatus(s)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select> */}
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
                      }}
                    >
                      <Pencil className="size-3.5" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm("Delete this task?")) {
                          deleteMutation.mutate(task.id);
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
      </section>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New task</DialogTitle>
            <DialogDescription>
              Add a task to this project. You can assign it and set a due date.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="task-title">Title<span className="text-red-500">*</span></Label>
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
              onClick={() => setCreateOpen(false)}
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

      <Dialog
        open={editingTask !== null}
        onOpenChange={(open) => {
          if (!open) setEditingTask(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          {editingTask ? (
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
                    value={editingTask.due_date}
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
                        due_date: editingTask.due_date.trim() || null,
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
    </div>
  );
}
