import { useParams, Link } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
} from "../services/tasks";
import { getProjectById } from "../services/projects";
import type {
  Task,
  TaskPriority,
  TaskStatus,
  TaskUpdatePayload,
} from "../types/api";

/** Task shape while editing (date input uses string). */
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

export default function ProjectDetail() {
  const { id: projectId } = useParams();
  const queryClient = useQueryClient();
  const pid = projectId!;

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
    assignee_id: "",
    due_date: "",
  });

  const [statusFilter, setStatusFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [editingTask, setEditingTask] = useState<TaskDraft | null>(null);

  const taskFilters = useMemo(
    () => ({
      status: statusFilter === "all" ? undefined : statusFilter,
      assignee:
        assigneeFilter === "all" ? undefined : assigneeFilter,
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
        assignee_id: "",
        due_date: "",
      });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({
      taskId,
      status,
    }: {
      taskId: string;
      status: TaskStatus;
    }) => updateTask(taskId, { status }),
    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", pid] });
      const previousEntries = queryClient.getQueriesData<Task[]>({
        queryKey: ["tasks", pid],
      });

      queryClient.setQueriesData<Task[]>(
        { queryKey: ["tasks", pid] },
        (old) =>
          old?.map((t) => (t.id === taskId ? { ...t, status } : t)) ?? old
      );

      return { previousEntries };
    },
    onError: (_err, _vars, context) => {
      context?.previousEntries.forEach(([key, data]) => {
        if (data) queryClient.setQueryData(key, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", pid] });
      queryClient.invalidateQueries({ queryKey: ["project", pid] });
    },
  });

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

  if (!pid) {
    return <p style={styles.muted}>Invalid project.</p>;
  }

  if (projectLoading || tasksLoading) {
    return <p style={styles.muted}>Loading…</p>;
  }

  if (projectError) {
    const msg =
      projectErr &&
      typeof projectErr === "object" &&
      "response" in projectErr &&
      (projectErr as { response?: { status?: number } }).response?.status ===
        404
        ? "Project not found."
        : "Could not load project.";
    return (
      <div style={styles.wrap}>
        <p role="alert">{msg}</p>
        <Link to="/">Back to projects</Link>
      </div>
    );
  }

  if (tasksError) {
    return (
      <div style={styles.wrap}>
        <p role="alert">Could not load tasks.</p>
        <Link to="/">Back to projects</Link>
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      <Link to="/" style={styles.back}>
        ← Projects
      </Link>

      <header style={styles.header}>
        <h2>{project?.name}</h2>
        <p style={styles.muted}>
          {project?.description || "No description"}
        </p>
      </header>

      <h3>Tasks</h3>

      <div style={styles.filters}>
        <label style={styles.filterLabel}>
          Status{" "}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="all">All</option>
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </label>
        <label style={styles.filterLabel}>
          Assignee{" "}
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            aria-label="Filter by assignee"
          >
            {ASSIGNEE_FILTER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <section style={styles.create} aria-label="Create task">
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          aria-label="Task title"
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          aria-label="Task description"
        />
        <select
          value={form.priority}
          onChange={(e) =>
            setForm({
              ...form,
              priority: e.target.value as TaskPriority,
            })
          }
          aria-label="Priority"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select
          value={form.assignee_id}
          onChange={(e) =>
            setForm({ ...form, assignee_id: e.target.value })
          }
          aria-label="Assignee"
        >
          <option value="">Unassigned</option>
          <option value="1">Test User</option>
          <option value="2">Jane Doe</option>
        </select>
        <input
          type="date"
          value={form.due_date}
          onChange={(e) => setForm({ ...form, due_date: e.target.value })}
          aria-label="Due date"
        />
        <button
          type="button"
          disabled={createMutation.isPending || !form.title.trim()}
          onClick={() => {
            createMutation.mutate({
              title: form.title.trim(),
              description: form.description,
              priority: form.priority,
              // status: "todo",
              assignee_id: form.assignee_id || null,
              due_date: form.due_date || null,
            });
          }}
        >
          {createMutation.isPending ? "Adding…" : "Add task"}
        </button>
      </section>
      {createMutation.isError && (
        <p style={styles.error} role="alert">
          Failed to create task.
        </p>
      )}

      {statusMutation.isError && (
        <p style={styles.error} role="alert">
          Could not update status. Reverted.
        </p>
      )}

      <div style={styles.taskList}>
        {tasks.length === 0 && (
          <p style={styles.muted}>No tasks match these filters.</p>
        )}
        {tasks.map((task) => (
          <article key={task.id} style={styles.taskCard}>
            <h4>{task.title}</h4>
            {task.description ? <p>{task.description}</p> : null}

            <p style={styles.meta}>
              <strong>Priority:</strong> {task.priority}
            </p>
            <p style={styles.meta}>
              <strong>Assignee:</strong>{" "}
              {task.assignee_id == null
                ? "Unassigned"
                : task.assignee_id === "1"
                  ? "Test User"
                  : task.assignee_id === "2"
                    ? "Jane Doe"
                    : task.assignee_id}
            </p>
            <p style={styles.meta}>
              <strong>Due:</strong> {task.due_date || "—"}
            </p>

            <label style={styles.statusLabel}>
              Status
              <select
                value={task.status}
                onChange={(e) =>
                  statusMutation.mutate({
                    taskId: task.id,
                    status: e.target.value as TaskStatus,
                  })
                }
                disabled={statusMutation.isPending}
                aria-label={`Status for ${task.title}`}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.replace("_", " ")}
                  </option>
                ))}
              </select>
            </label>

            <div style={styles.actions}>
              <button
                type="button"
                onClick={() => {
                  const draft: TaskDraft = {
                    ...task,
                    due_date: task.due_date ?? "",
                    description: task.description ?? "",
                  };
                  setEditingTask(draft);
                }}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Delete this task?")) {
                    deleteMutation.mutate(task.id);
                  }
                }}
              >
                Delete
              </button>
            </div>

            {editingTask?.id === task.id && (
              <div style={styles.editPanel}>
                <input
                  value={editingTask.title}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, title: e.target.value })
                  }
                  aria-label="Edit title"
                />
                {/* <input
                  value={editingTask.description}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      description: e.target.value,
                    })
                  }
                  aria-label="Edit description"
                /> */}
                <select
                  value={editingTask.priority}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      priority: e.target.value as Task["priority"],
                    })
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <select
                  value={editingTask.status}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      status: e.target.value as TaskStatus,
                    })
                  }
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
                <select
                  value={editingTask.assignee_id ?? ""}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      assignee_id: e.target.value || null,
                    })
                  }
                  aria-label="Edit assignee"
                >
                  <option value="">Unassigned</option>
                  <option value="1">Test User</option>
                  <option value="2">Jane Doe</option>
                </select>
                <input
                  type="date"
                  value={editingTask.due_date || ""}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      due_date: e.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  disabled={updateMutation.isPending}
                  onClick={() =>
                    updateMutation.mutate({
                      taskId: task.id,
                      payload: {
                        title: editingTask.title,
                        // description: editingTask.description,
                        priority: editingTask.priority,
                        status: editingTask.status,
                        assignee_id: editingTask.assignee_id,
                        due_date: editingTask.due_date || null,
                      },
                    })
                  }
                >
                  Save
                </button>
                <button type="button" onClick={() => setEditingTask(null)}>
                  Cancel
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  back: { display: "inline-block", marginBottom: "16px" },
  header: {
    marginBottom: "20px",
    paddingBottom: "12px",
    borderBottom: "1px solid #ddd",
  },
  muted: { color: "#555" },
  filters: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "16px",
  },
  filterLabel: { display: "flex", flexDirection: "column", gap: "4px" },
  create: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    alignItems: "center",
    marginBottom: "12px",
  },
  taskList: { marginTop: "16px" },
  taskCard: {
    border: "1px solid #ddd",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    background: "#fff",
  },
  meta: { fontSize: "14px", margin: "4px 0" },
  statusLabel: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    marginTop: "8px",
    maxWidth: "200px",
  },
  actions: { marginTop: "10px", display: "flex", gap: "10px" },
  editPanel: {
    marginTop: "12px",
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    padding: "12px",
    background: "#fafafa",
    borderRadius: "8px",
  },
  error: { color: "#b00020", fontSize: "14px" },
};
