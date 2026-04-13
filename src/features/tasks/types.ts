/* eslint-disable @typescript-eslint/no-explicit-any */
export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority: TaskPriority | any; 
  project_id?: string;
  assignee_id: string | null;
  due_date: string | null;
  created_at?: string;
  updated_at?: string;
};

export type TaskFilters = {
  status?: string;
  assignee?: string;
};

export type TaskUpdatePayload = Partial<{
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority | any;
  assignee_id: string | null;
  due_date: string | null;
}>;

export type TaskDraft = Omit<Task, "due_date" | "description"> & {
  due_date: string;
  description: string;
};