import { api } from "./api";

export const getProjects = async () => {
  const { data } = await api.get("/projects");
  return data.projects;
};