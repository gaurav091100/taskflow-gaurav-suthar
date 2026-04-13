import { Button } from "@/components/ui/button";
import { TaskFilters } from "./TaskFilters";
import { TaskList } from "./TaskList";
import CreateTaskDialog from "./CreateTaskDialog";
import { useMemo, useState } from "react";
import { useTasks } from "../hooks";
import { useParams } from "react-router-dom";
import TaskSkeleton from "./TaskSkeleton";

export type TaskFiltersState = {
  status: string;
  assignee: string;
};

const TaskSection = () => {
  const { id: pid } = useParams();
  const projectId = pid ?? "";

  const [open, setOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const taskFilters = useMemo(
    () => ({
      status: statusFilter === "all" ? undefined : statusFilter,
      assignee: assigneeFilter === "all" ? undefined : assigneeFilter,
    }),
    [statusFilter, assigneeFilter],
  );

  const { data: tasks = [], isLoading } = useTasks(projectId, taskFilters);

  if(isLoading){
    return <TaskSkeleton />;
  }
  return (
    <section className="space-y-4" aria-labelledby="tasks-heading">
      <TaskFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        assigneeFilter={assigneeFilter}
        setAssigneeFilter={setAssigneeFilter}
      />
      <Button onClick={() => setOpen(true)}>New Task</Button>
      <TaskList tasks={tasks} statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        assigneeFilter={assigneeFilter}
        setAssigneeFilter={setAssigneeFilter} />
      <CreateTaskDialog open={open} onOpenChange={setOpen} />
      {/* <EditTaskDialog task={editingTask} onClose={() => setEditingTask(null)} /> */}
    </section>
  );
};

export default TaskSection;
