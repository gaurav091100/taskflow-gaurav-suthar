export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export type User = {
  id: string;
  name: string;
  email: string;
};

export type Project = {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  created_at: string;
};

export type ProjectWithTasks = Project & { tasks: Task[] };

export type Task = {
  id: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority: TaskPriority;
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

/** Fields allowed on create/update (API subset). */
export type TaskUpdatePayload = Partial<{
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee_id: string | null;
  due_date: string | null;
}>;
