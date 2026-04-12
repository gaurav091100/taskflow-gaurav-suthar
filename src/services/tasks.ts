import { api } from "./api";

export const getTasksByProject = async (projectId: string) => {
  const { data } = await api.get(`/projects/${projectId}/tasks`);
  return data.tasks;
};

export const createTask = async (projectId: string, payload: any) => {
  const { data } = await api.post(`/projects/${projectId}/tasks`, payload);
  return data;
};

export const updateTask = async (taskId: string, payload: any) => {
  const { data } = await api.patch(`/tasks/${taskId}`, payload);
  return data;
};

export const deleteTask = async (taskId: string) => {
  await api.delete(`/tasks/${taskId}`);
};