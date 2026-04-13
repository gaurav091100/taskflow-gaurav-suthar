import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ASSIGNEE_FILTER_OPTIONS } from "../../../utils/constant";

type TaskFiltersProps = {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  assigneeFilter: string;
  setAssigneeFilter: (value: string) => void;
};

export const TaskFilters = ({
  statusFilter,
  setStatusFilter,
  assigneeFilter,
  setAssigneeFilter,
}: TaskFiltersProps) => {


  return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="filter-status">Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger
              id="filter-status"
              className="w-full min-w-0"
              size="default"
            >
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="todo">Todo</SelectItem>
              <SelectItem value="in_progress">In progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="filter-assignee">Assignee</Label>
          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger
              id="filter-assignee"
              className="w-full min-w-0"
              size="default"
            >
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              {ASSIGNEE_FILTER_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
   
  );
};
