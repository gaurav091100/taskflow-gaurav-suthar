import { api } from "./api";
import type { Task, TaskFilters, TaskUpdatePayload } from "../types/api";

export const getTasksByProject = async (
  projectId: string,
  filters?: TaskFilters
): Promise<Task[]> => {
  const params = new URLSearchParams();
  if (filters?.status) params.set("status", filters.status);
  if (filters?.assignee) params.set("assignee", filters.assignee);
  const qs = params.toString();
  const { data } = await api.get<{ tasks: Task[] }>(
    `/projects/${projectId}/tasks${qs ? `?${qs}` : ""}`
  );
  return data.tasks;
};

export const createTask = async (
  projectId: string,
  payload: TaskUpdatePayload & { title: string }
) => {
  const { data } = await api.post(`/projects/${projectId}/tasks`, payload);
  return data;
};

export const updateTask = async (
  taskId: string,
  payload: TaskUpdatePayload
) => {
  const { data } = await api.patch(`/tasks/${taskId}`, payload);
  return data;
};

export const deleteTask = async (taskId: string) => {
  await api.delete(`/tasks/${taskId}`);
};
