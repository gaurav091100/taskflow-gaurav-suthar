import { api } from "@/lib/api";
import type { Project } from "./types";

export const getProjects = async (): Promise<Project[]> => {
  const { data } = await api.get<{ projects: Project[] }>("/projects");
  return data.projects;
};

export const getProjectById = async (id: string) => {
  const { data } = await api.get(`/projects/${id}`);
  return data;
};

export const createProject = async (payload: {
  name: string;
  description?: string;
}) => {
  const { data } = await api.post<Project>("/projects", payload);
  return data;
};

export const updateProject = async (
  id: string,
  payload: {
    name?: string;
    description?: string;
  }
) => {
  const { data } = await api.patch<Project>(`/projects/${id}`, payload);
  return data;
};

export const deleteProject = async (id: string) => {
  await api.delete(`/projects/${id}`);
};
