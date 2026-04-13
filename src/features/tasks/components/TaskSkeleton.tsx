import { Skeleton } from "@/components/ui/skeleton";

const TaskSkeleton = () => {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Skeleton className="h-9 w-32" />
      <Skeleton className="h-10 w-full max-w-lg" />
      <Skeleton className="h-24 w-full" />
      <div className="flex flex-col gap-3 sm:flex-row">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </div>
      <Skeleton className="h-12 w-40" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
};

export default TaskSkeleton;
