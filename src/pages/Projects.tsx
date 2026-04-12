import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../services/projects";
import { Link } from "react-router-dom";
  import { useMutation, useQueryClient } from "@tanstack/react-query";
  import {
    createProject,
    updateProject,
    deleteProject,
  } from "../services/projects";
import { useState } from "react";


const Projects = () => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingProject, setEditingProject] = useState(null);
  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
  const queryClient = useQueryClient();

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
    mutationFn: ({ id, ...payload }) => updateProject(id, payload),
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
    return <p style={styles.center}>Failed to load projects</p>;
  }

  if (!projects.length) {
    return <p style={styles.center}>No projects yet</p>;
  }

  return (
    <div style={styles.container}>
      <h2>Projects</h2>
      <button onClick={() => setShowForm(true)}>+ New Project</button>
      {showForm && (
        <div style={styles.form}>
          <input
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            disabled={createMutation.isPending}
            onClick={() => createMutation.mutate({ name, description })}
          >
            Create
          </button>
        </div>
      )}

      <div style={styles.grid}>
        {projects.map((project) => (
          <>
            {editingProject?.id === project.id && (
              <div>
                <input
                  value={editingProject.name}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      name: e.target.value,
                    })
                  }
                />
                <input
                  value={editingProject.description}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      description: e.target.value,
                    })
                  }
                />
                <button
                  onClick={() =>
                    updateMutation.mutate({
                      id: project.id,
                      name: editingProject.name,
                      description: editingProject.description,
                    })
                  }
                >
                  Save
                </button>
              </div>
            )}
            <div>
              <Link
                to={`/projects/${project.id}`}
                style={{ textDecoration: "none" }}
              >
                <div style={styles.card}>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                </div>
              </Link>
              <button onClick={() => setEditingProject(project)}>Edit</button>
              <button
                onClick={() => {
                  if (confirm("Delete this project?")) {
                    deleteMutation.mutate(project.id);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default Projects;

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "16px",
  },
  card: {
    padding: "16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    background: "#fff",
  },
  center: {
    textAlign: "center",
    marginTop: "50px",
  },
};