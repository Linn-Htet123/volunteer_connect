/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock, ClipboardList, User } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";
import TaskStatusDropdown from "../task/TaskStatusDropdown";
import { TaskStatus } from "@/enum/task";

export default function TaskCard({ task }: { task: any }) {
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 border border-border bg-card">
      <div className="flex items-start justify-between mb-3">
        <h2 className="text-xl font-semibold text-foreground">{task.title}</h2>
        <TaskStatusDropdown
          taskId={task.id}
          currentStatus={task.status as TaskStatus}
        />
      </div>

      <p className="text-sm text-muted-foreground mb-4">{task.description}</p>

      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-primary mt-0.5" />
          <p className="font-medium text-foreground">{task.location}</p>
        </div>

        <div className="flex items-start gap-2">
          <Calendar className="w-4 h-4 text-primary mt-0.5" />
          <p className="text-muted-foreground">{formatDate(task.start_date)}</p>
        </div>

        <div className="flex items-start gap-2">
          <Clock className="w-4 h-4 text-primary mt-0.5" />
          <p className="text-muted-foreground">
            {formatTime(task.start_date)} – {formatTime(task.end_date)}
          </p>
        </div>

        <div className="flex items-start gap-2">
          <ClipboardList className="w-4 h-4 text-primary mt-0.5" />
          <p className="text-muted-foreground">
            Volunteer Status:{" "}
            <span className="font-medium text-foreground">
              {task.volunteerStatus}
            </span>
          </p>
        </div>

        <div className="flex items-start gap-2">
          <User className="w-4 h-4 text-primary mt-0.5" />
          <p className="text-muted-foreground">
            Assigned to:{" "}
            <span className="font-medium text-foreground">
              {task.volunteer?.user?.name}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">
          Assigned at: {formatDate(task.assigned_at)}
        </p>
      </div>
    </Card>
  );
}
