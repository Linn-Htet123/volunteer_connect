import { Calendar, MapPin, Clock, Hourglass, Info, Trash } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TaskStatus } from "@/enum/task";
import { formatTime } from "@/lib/utils";
import { Task } from "@/interfaces/task";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import EditTaskForm from "./EditTaskForm";
import { useDeleteTask } from "@/hooks/tasks/useDeleteTask";
import DeleteTask from "./DeleteTask";
import TaskStatusDropdown from "./TaskStatusDropdown";

interface TaskCardProps {
  task: Task;
  eventId: number;
}

const statusConfig: Partial<
  Record<TaskStatus, { label: string; className: string }>
> = {
  [TaskStatus.IN_PROGRESS]: {
    label: "In Progress",
    className:
      "bg-status-in-progress/10 text-status-in-progress border-status-in-progress/20",
  },
  [TaskStatus.COMPLETED]: {
    label: "Completed",
    className:
      "bg-status-completed/10 text-status-completed border-status-completed/20",
  },
};

const TaskCard = ({ task, eventId }: TaskCardProps) => {
  const status = statusConfig[task.status] ?? {
    label: task.status,
    className: "bg-gray-100 text-gray-700 border-gray-200",
  };
  const { mutate } = useDeleteTask();
  return (
    <Card className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between">
      <div>
        <CardHeader>
          <div className="flex items-end justify-between gap-3">
            {/* Title with Popover */}
            <div className="flex items-center gap-1">
              <CardTitle className="text-lg font-semibold leading-tight truncate">
                {task.title}
              </CardTitle>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-muted-foreground hover:text-primary"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="max-w-sm">
                  <h4 className="font-semibold text-base mb-2">{task.title}</h4>
                  {task.description ? (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {task.description}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No description provided
                    </p>
                  )}
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex gap-3 items-center">
              <EditTaskForm eventId={eventId} taskId={task.id!} />
              <DeleteTask taskId={task.id!} />
              <TaskStatusDropdown
                taskId={task.id!}
                currentStatus={task.status as TaskStatus}
              />
            </div>
          </div>

          {task.description && (
            <CardDescription className="mt-2 line-clamp-2">
              {task.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="space-y-2 text-sm text-muted-foreground mt-4">
          {task.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{task.location}</span>
            </div>
          )}
          {(task.start_date || task.end_date) && (
            <>
              <div className="flex items-center gap-2">
                <Hourglass className="h-4 w-4 shrink-0" />
                <span className="truncate">
                  {task.start_date && formatTime(task.start_date)}
                  {task.start_date && task.end_date && " - "}
                  {task.end_date && formatTime(task.end_date)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 shrink-0" />
                <span className="truncate">
                  {task.start_date &&
                    new Date(task.start_date).toLocaleDateString()}
                  {task.start_date && task.end_date && " - "}
                  {task.end_date &&
                    new Date(task.end_date).toLocaleDateString()}
                </span>
              </div>
            </>
          )}

          <div className="flex items-center gap-2 text-xs">
            <Clock className="h-3 w-3 shrink-0" />
            <span>
              Created {new Date(task.created_at!).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
        <CardFooter>
          <Link
            className="flex w-full justify-end"
            href={ROUTES.TASK_ASSIGNMENT(task.id!, eventId)}
          >
            <Badge>Assign</Badge>
          </Link>
        </CardFooter>
      </div>
    </Card>
  );
};

export default TaskCard;
