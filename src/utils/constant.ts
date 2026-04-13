import type { TaskStatus } from "@/features/tasks/types";

export const ASSIGNEE_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All assignees" },
  { value: "unassigned", label: "Unassigned" },
  { value: "1", label: "Test User" },
  { value: "2", label: "Jane Doe" },
];

export const STATUS_OPTIONS: TaskStatus[] = ["todo", "in_progress", "done"];

export function formatStatus(s: TaskStatus) {
  return s.replace("_", " ");
}

export const getPriorityStyle = (priority:string) => {
  switch (priority) {
    case "low":
      return "bg-green-50 text-green-700";
    case "medium":
      return "bg-orange-50 text-orange-700";
    case "high":
      return "bg-red-50 text-red-700";
    default:
      return "bg-gray-50 text-gray-700";
  }
};

export function assigneeLabel(id: string | null) {
  if (id == null) return "Unassigned";
  if (id === "1") return "Test User";
  if (id === "2") return "Jane Doe";
  return id;
}

export const getStatusStyle = (status: TaskStatus) => {
  switch (status) {
    case "todo":
      return "bg-yellow-50 text-yellow-700";
    case "in_progress":
      return "bg-blue-50 text-blue-700";
    case "done":
      return "bg-green-50 text-green-700";
    default:
      return "bg-gray-50 text-gray-700";
  }
};
