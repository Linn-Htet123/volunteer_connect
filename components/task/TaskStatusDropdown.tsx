"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateTaskStatus } from "@/hooks/tasks/useUpdateTaskStatus";
import { TaskStatus } from "@/enum/task";

interface TaskStatusDropdownProps {
  taskId: number;
  currentStatus: TaskStatus;
}

export default function TaskStatusDropdown({
  taskId,
  currentStatus,
}: TaskStatusDropdownProps) {
  const [status, setStatus] = useState<TaskStatus>(currentStatus);
  const updateStatusMutation = useUpdateTaskStatus();

  const handleStatusChange = (newStatus: TaskStatus) => {
    setStatus(newStatus);
    updateStatusMutation.mutate({
      taskId,
      status: newStatus,
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case TaskStatus.OPEN:
        return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
      case TaskStatus.IN_PROGRESS:
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300";
      case TaskStatus.COMPLETED:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
      default:
        return "bg-muted text-foreground";
    }
  };

  return (
    <Select
      value={status}
      onValueChange={(val) => handleStatusChange(val as TaskStatus)}
      disabled={updateStatusMutation.isPending}
    >
      <SelectTrigger
        className={`capitalize w-[140px] justify-between ${getStatusStyle(
          status
        )}`}
      >
        <SelectValue placeholder="Select Status" />
      </SelectTrigger>
      <SelectContent>
        {Object.values(TaskStatus).map((s) => (
          <SelectItem key={s} value={s} className="capitalize">
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
