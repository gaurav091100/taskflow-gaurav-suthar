import { api } from "./api";

export const getTasksByProject = async (projectId: string) => {
  const { data } = await api.get(`/projects/${projectId}/tasks`);
  return data.tasks;
};