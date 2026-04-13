import type { Task } from "../types";
import EmptyState from "./EmptyState";
import { TaskCard } from "./TaskCard";

type TaskListProps = {
  tasks: Task[];
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  assigneeFilter: string;
  setAssigneeFilter: (value: string) => void;
};

export const TaskList = ({
  tasks,
  statusFilter,
  setStatusFilter,
  assigneeFilter,
  setAssigneeFilter,
}: TaskListProps) => {
  if (!tasks.length)
    return (
      <EmptyState
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        assigneeFilter={assigneeFilter}
        setAssigneeFilter={setAssigneeFilter}
      />
    );

  return (
    <ul className="list-none space-y-4 p-0">
      {tasks.map((task: Task) => (
        <li key={task.id}>
          <TaskCard
            key={task.id}
            task={task}
            // onEdit={onEdit}
          />
        </li>
      ))}
    </ul>
  );
};
