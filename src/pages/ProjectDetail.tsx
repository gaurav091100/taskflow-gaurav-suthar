import { useParams } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
} from "../services/tasks";
import { getProjectById } from "../services/projects";
import { useState } from "react";

export default function ProjectDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  // 🔹 Create form
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignee_id: "1",
    due_date: "",
  });

  // 🔹 Filter
  const [statusFilter, setStatusFilter] = useState("all");

  // 🔹 Edit state
  const [editingTask, setEditingTask] = useState<any | null>(null);

  // 🔹 Fetch project
  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectById(id!),
  });

  // 🔹 Fetch tasks
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks", id],
    queryFn: () => getTasksByProject(id!),
  });

  // 🔹 Create task
  const createMutation = useMutation({
    mutationFn: (payload: any) => createTask(id!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });

      setForm({
        title: "",
        description: "",
        priority: "medium",
        assignee_id: "1",
        due_date: "",
      });
    },
  });

  // 🔹 Update task
  const updateMutation = useMutation({
    mutationFn: ({ id, ...payload }: any) =>
      updateTask(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });
      setEditingTask(null);
    },
  });

  // 🔹 Delete task
  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });
    },
  });

  if (projectLoading || tasksLoading) return <p>Loading...</p>;

  // 🔹 Filter logic
  const filteredTasks =
    statusFilter === "all"
      ? tasks
      : tasks.filter((t: any) => t.status === statusFilter);

  return (
    <div style={{ padding: "20px" }}>
      {/* 📌 PROJECT DETAILS */}
      <div
        style={{
          marginBottom: "20px",
          borderBottom: "1px solid #ddd",
          paddingBottom: "10px",
        }}
      >
        <h2>{project?.name}</h2>
        <p>{project?.description || "No description"}</p>
      </div>

      <h3>Tasks</h3>

      {/* 🔍 FILTER */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="all">All</option>
        <option value="todo">Todo</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      {/* ➕ CREATE TASK */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <select
          value={form.priority}
          onChange={(e) =>
            setForm({ ...form, priority: e.target.value })
          }
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          type="date"
          value={form.due_date}
          onChange={(e) =>
            setForm({ ...form, due_date: e.target.value })
          }
        />

        <button
          disabled={createMutation.isPending}
          onClick={() => {
            if (!form.title) return;

            createMutation.mutate({
              ...form,
              status: "todo",
            });
          }}
        >
          {createMutation.isPending ? "Adding..." : "Add Task"}
        </button>
      </div>

      {/* 📋 TASK LIST */}
      <div style={{ marginTop: "20px" }}>
        {filteredTasks.map((task: any) => (
          <div
            key={task.id}
            style={{
              border: "1px solid #ddd",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "6px",
            }}
          >
            <h4>{task.title}</h4>
            <p>{task.description}</p>

            <p>
              <strong>Status:</strong> {task.status}
            </p>
            <p>
              <strong>Priority:</strong> {task.priority}
            </p>

            <p>
              <strong>Due:</strong> {task.due_date || "N/A"}
            </p>

            {/* 🔄 QUICK STATUS CHANGE */}
            <select
              value={task.status}
              onChange={(e) =>
                updateMutation.mutate({
                  id: task.id,
                  status: e.target.value,
                })
              }
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>

            {/* ACTIONS */}
            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              <button
                onClick={() =>
                  setEditingTask({
                    ...task,
                    due_date: task.due_date || "",
                  })
                }
              >
                Edit
              </button>

              <button onClick={() => deleteMutation.mutate(task.id)}>
                Delete
              </button>
            </div>

            {/* ✏️ FULL EDIT FORM */}
            {editingTask?.id === task.id && (
              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                <input
                  value={editingTask.title}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      title: e.target.value,
                    })
                  }
                />

                <input
                  value={editingTask.description}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      description: e.target.value,
                    })
                  }
                />

                <select
                  value={editingTask.priority}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      priority: e.target.value,
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
                      status: e.target.value,
                    })
                  }
                >
                  <option value="todo">Todo</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>

                <input
                  type="date"
                  value={editingTask.due_date}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      due_date: e.target.value,
                    })
                  }
                />

                <button
                  onClick={() =>
                    updateMutation.mutate({
                      id: task.id,
                      ...editingTask,
                    })
                  }
                >
                  Save
                </button>

                <button onClick={() => setEditingTask(null)}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}