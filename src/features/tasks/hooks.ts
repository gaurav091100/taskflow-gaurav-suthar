/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TaskUpdatePayload } from "./types";
import { createTask, deleteTask, getTasksByProject, updateTask } from "./api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useTasks = (projectId: string, filters: any) => {
  return useQuery({
    queryKey: ["tasks", projectId, filters],
    queryFn: () => getTasksByProject(projectId, filters),
    enabled: Boolean(projectId),
  });
};

export const useCreateTask = (
  projectId: string,
  options?: { onSuccess?: () => void },
) => {
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: (payload: TaskUpdatePayload & { title: string }) =>
        createTask(projectId, payload),
      onSuccess: (..._args) => {
        queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
        queryClient.invalidateQueries({ queryKey: ["project", projectId] });
       options?.onSuccess?.();
      },
    });
};
export const useUpdateTask = (projectId:string,
  options?: { onSuccess?: () => void },
) => {
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: ({
        taskId,
        payload,
      }: {
        taskId: string;
        payload: TaskUpdatePayload;
      }) => updateTask(taskId, payload),
      onSuccess: (..._args) => {
        queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
        queryClient.invalidateQueries({ queryKey: ["project", projectId] });
         options?.onSuccess?.();
      },
    });
};

export const useDeleteTask = (projectId:string, options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: deleteTask,
      onSuccess: (..._args) => {
        queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
        queryClient.invalidateQueries({ queryKey: ["project", projectId] });
        options?.onSuccess?.();
      },
    });
};
