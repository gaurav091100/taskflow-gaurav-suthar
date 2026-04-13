/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectById,
} from "./api";
import type { UpdateProjectPayload } from "./types";

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
};
export const useProjectDetails = (projectId:string) => {
  return useQuery({
      queryKey: ["project", projectId],
      queryFn: () => getProjectById(projectId),
      enabled: Boolean(projectId),
    });
};

export const useCreateProject = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: (..._args) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      options?.onSuccess?.();
    },
  });
};

export const useUpdateProject = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateProjectPayload) =>
      updateProject(id, payload),
    onSuccess: (..._args) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      options?.onSuccess?.();
    },
  });
};

export const useDeleteProject = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: deleteProject,
      onSuccess: (..._args) => {
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        options?.onSuccess?.();
      },
    });
};
