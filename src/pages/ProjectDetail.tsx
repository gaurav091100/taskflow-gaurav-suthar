import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTasksByProject } from "../services/tasks";

const ProjectDetail = () => {
  const { id } = useParams();

  const {
    data: tasks,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tasks", id],
    queryFn: () => getTasksByProject(id!),
  });

  if (isLoading) {
    return <p style={styles.center}>Loading tasks...</p>;
  }

  if (isError) {
    return <p style={styles.center}>Failed to load tasks</p>;
  }

  if (!tasks.length) {
    return <p style={styles.center}>No tasks yet</p>;
  }

  return (
    <div style={styles.container}>
      <h2>Tasks</h2>

      <div style={styles.grid}>
        {tasks.map((task) => (
          <div key={task.id} style={styles.card}>
            <h3>{task.title}</h3>
            <p>Status: {task.status}</p>
            <p>Priority: {task.priority}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectDetail;

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "20px",
  },
  grid: {
    display: "grid",
    gap: "12px",
  },
  card: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
  },
  center: {
    textAlign: "center",
    marginTop: "50px",
  },
};