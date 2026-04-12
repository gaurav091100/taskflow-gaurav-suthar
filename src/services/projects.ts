import { api } from "./api";

// Get all projects
export const getProjects = async () => {
  const { data } = await api.get("/projects");
  return data.projects;
};

// Get single project (optional but useful)
export const getProjectById = async (id: string) => {
  const { data } = await api.get(`/projects/${id}`);
  return data;
};

// Create project
export const createProject = async (payload: {
  name: string;
  description?: string;
}) => {
  const { data } = await api.post("/projects", payload);
  return data;
};

// Update project
export const updateProject = async (
  id: string,
  payload: {
    name?: string;
    description?: string;
  }
) => {
  const { data } = await api.patch(`/projects/${id}`, payload);
  return data;
};

// Delete project
export const deleteProject = async (id: string) => {
  await api.delete(`/projects/${id}`);
};