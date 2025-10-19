"use client";
import TaskCalendar from "@/components/common/TaskCalendar";
import { Button } from "@/components/ui/button";
import { useGetVolunteersInEvent } from "@/hooks/events/useGetVolunteersInEvent";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

export default function TaskAssignmentPage() {
  const { id, eventId } = useParams();
  const router = useRouter();

  const taskId = Number(id);
  const evtId = Number(eventId);

  const { data: volunteers } = useGetVolunteersInEvent(evtId);

  if (isNaN(taskId)) return <div>Invalid Task ID</div>;

  return (
    <div>
      <Button onClick={() => router.back()}>
        <ArrowLeft className="w-10" />
      </Button>
      <TaskCalendar
        volunteers={volunteers ?? []}
        taskId={taskId}
        taskStart="2025-10-01T08:00:00"
        taskEnd="2025-11-20T20:00:00"
      />
    </div>
  );
}
