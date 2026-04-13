import type { Task } from "../tasks/types";

export type Project = {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  created_at: string;
};

export type UpdateProjectPayload = { id: string; name: string; description: string };

export type ProjectWithTasks = Project & { tasks: Task[] };

