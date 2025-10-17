/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import TaskCard from "./TaskCard";

export default function TasksList({ tasks }: { tasks: any[] }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-20">
        No tasks assigned yet.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
