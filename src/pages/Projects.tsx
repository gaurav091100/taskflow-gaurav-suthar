import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../services/projects";
import type { Project } from "../types/api";

type UpdateProjectInput = { id: string; name: string; description: string };

const Projects = () => {
  const [showForm, setShowForm] = useState(false);
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
      setShowForm(false);
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

  if (isLoading) {
    return <p style={styles.center}>Loading projects...</p>;
  }

  if (isError) {
    return (
      <p style={styles.center}>
        Failed to load projects
        {error instanceof Error ? `: ${error.message}` : ""}
      </p>
    );
  }

  return (
    <div style={styles.container}>
      <h2>Projects</h2>
      <button type="button" onClick={() => setShowForm(true)}>
        + New Project
      </button>

      {projects.length === 0 && (
        <p style={styles.emptyHint}>
          No projects yet. Create your first project to get started.
        </p>
      )}

      {showForm && (
        <div style={styles.form}>
          <input
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Project name"
          />
          <input
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            aria-label="Project description"
          />
          <button
            type="button"
            disabled={createMutation.isPending || !name.trim()}
            onClick={() =>
              createMutation.mutate({ name: name.trim(), description })
            }
          >
            {createMutation.isPending ? "Creating…" : "Create"}
          </button>
          <button type="button" onClick={() => setShowForm(false)}>
            Cancel
          </button>
        </div>
      )}

      {createMutation.isError && (
        <p style={styles.error} role="alert">
          Could not create project. Try again.
        </p>
      )}

      <div style={styles.grid}>
        {projects.map((project) => (
          <div key={project.id} style={styles.cardWrap}>
            {editingProject?.id === project.id && (
              <div style={styles.editBox}>
                <input
                  value={editingProject.name}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      name: e.target.value,
                    })
                  }
                  aria-label="Edit project name"
                />
                <input
                  value={editingProject.description ?? ""}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      description: e.target.value,
                    })
                  }
                  aria-label="Edit project description"
                />
                <button
                  type="button"
                  disabled={updateMutation.isPending}
                  onClick={() =>
                    updateMutation.mutate({
                      id: project.id,
                      name: editingProject.name,
                      description: editingProject.description ?? "",
                    })
                  }
                >
                  Save
                </button>
                <button type="button" onClick={() => setEditingProject(null)}>
                  Cancel
                </button>
              </div>
            )}
            <Link
              to={`/projects/${project.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div style={styles.card}>
                <h3>{project.name}</h3>
                <p>{project.description || "No description"}</p>
              </div>
            </Link>
            <div style={styles.cardActions}>
              <button type="button" onClick={() => setEditingProject(project)}>
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Delete this project?")) {
                    deleteMutation.mutate(project.id);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 260px), 1fr))",
    gap: "16px",
    marginTop: "16px",
  },
  cardWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  card: {
    padding: "16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    background: "#fff",
    minHeight: "100px",
  },
  cardActions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  editBox: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    background: "#fafafa",
  },
  form: {
    marginTop: "16px",
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    alignItems: "center",
  },
  center: {
    textAlign: "center",
    marginTop: "50px",
  },
  emptyHint: {
    marginTop: "12px",
    color: "#555",
    fontSize: "14px",
  },
  error: {
    color: "#b00020",
    marginTop: "8px",
    fontSize: "14px",
  },
};
