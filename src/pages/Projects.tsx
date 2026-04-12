import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../services/projects";
import { Link } from "react-router-dom";

export default function Projects() {
  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
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

      <div style={styles.grid}>
        {projects.map((project) => (
          <Link
            to={`/projects/${project.id}`}
            style={{ textDecoration: "none" }}
          >
            <div style={styles.card}>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

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