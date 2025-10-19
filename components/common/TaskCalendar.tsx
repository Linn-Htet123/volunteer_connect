/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import type {
  DateSelectArg,
  EventClickArg,
  EventApi,
} from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { VolunteerInEvent } from "@/interfaces/volunteer";
import { MultiSelect } from "@/components/ui/multi-select";
import { useAssignTask } from "@/hooks/tasks/useAssignTask";
import { useGetVolunteersForTask } from "@/hooks/tasks/useGetVolunteersForTask";
import { AssignedVolunteerEvent } from "@/interfaces/task";
import { useDeleteAssignmentTask } from "@/hooks/tasks/useDeleteAssignmentTask";

export default function TaskCalendar({
  taskId,
  taskStart,
  taskEnd,
  volunteers,
}: {
  taskId: number;
  taskStart: string;
  taskEnd: string;
  volunteers: VolunteerInEvent[];
}) {
  const [events, setEvents] = useState<AssignedVolunteerEvent[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<
    DateSelectArg | EventApi | null
  >(null);
  const [selectedVolunteers, setSelectedVolunteers] = useState<number[]>([]);
  const { mutateAsync: assignTask } = useAssignTask();
  const { data: assignedVolunteers } = useGetVolunteersForTask(taskId);
  const { mutateAsync: deleteAssignment } = useDeleteAssignmentTask();

  useEffect(() => {
    if (assignedVolunteers?.length) {
      const mappedEvents: AssignedVolunteerEvent[] = assignedVolunteers.map(
        (v) => ({
          id: v.id.toString(),
          title: v.title,
          start: v.start, // should be ISO string
          end: v.end, // should be ISO string
          volunteerIds: v.volunteerIds || [],
        })
      );
      setEvents(mappedEvents);
    }
  }, [assignedVolunteers]);

  const volunteerOptions = volunteers.map((v) => ({
    value: v.value.toString(),
    label: `${v.label}`,
  }));

  const handleSelect = (selectInfo: DateSelectArg) => {
    const start = new Date(selectInfo.start);
    const end = new Date(selectInfo.end);

    if (start < new Date(taskStart) || end > new Date(taskEnd)) {
      alert("Selected time is outside task dates");
      return;
    }

    setSelectedSlot(selectInfo);
    setSelectedVolunteers([]);
    setModalOpen(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    setSelectedSlot(clickInfo.event);
    setSelectedVolunteers(clickInfo.event.extendedProps.volunteerIds ?? []);
    setModalOpen(true);
  };

  const handleAssign = async () => {
    if (!selectedSlot) return;

    const selectedNames = volunteers
      .filter((v) => selectedVolunteers.includes(v.value))
      .map((v) => v.label)
      .join(", ");

    const volunteerIds = [...selectedVolunteers];

    // store previous state
    const previousEvents = [...events];

    // determine start and end
    let start: string, end: string;
    if ("id" in selectedSlot) {
      // existing event
      start = selectedSlot.startStr;
      end = selectedSlot.endStr;
    } else {
      // new selection
      start = (selectedSlot as DateSelectArg).startStr;
      end = (selectedSlot as DateSelectArg).endStr;
    }

    // update UI optimistically
    let updatedEvents: AssignedVolunteerEvent[];
    if ("id" in selectedSlot && selectedSlot.extendedProps) {
      updatedEvents = events.map((e) =>
        e.id === selectedSlot.id
          ? { ...e, title: selectedNames, volunteerIds, start, end }
          : e
      );
      setEvents(updatedEvents);
    } else {
      const newEvent: AssignedVolunteerEvent = {
        id: String(events.length + 1),
        title: selectedNames || "Unnamed Volunteer",
        start,
        end,
        volunteerIds,
      };
      updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
    }

    setSelectedVolunteers([]);
    setSelectedSlot(null);
    setModalOpen(false);

    try {
      await assignTask({
        taskId,
        volunteerIds,
        start,
        end,
      });
    } catch (error) {
      // rollback UI if API fails
      setEvents(previousEvents);
    }
  };

  const handleDelete = async () => {
    if (!selectedSlot || !("id" in selectedSlot)) return;

    const eventToDelete = events.find((e) => e.id === selectedSlot.id);
    if (!eventToDelete) return;

    const previousEvents = [...events];
    setEvents(events.filter((e) => e.id !== selectedSlot.id));
    setModalOpen(false);

    try {
      await deleteAssignment({
        taskId,
        volunteerIds: eventToDelete.volunteerIds,
      });
    } catch (error) {
      setEvents(previousEvents); // rollback on error
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        Assign Volunteers (Task #{taskId})
      </h2>

      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        selectable={true}
        select={handleSelect}
        events={events}
        validRange={{ start: taskStart, end: taskEnd }}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridWeek,timeGridDay",
        }}
        allDaySlot={false}
        slotDuration="00:30:00"
        height="80vh"
        editable={true}
        eventClick={handleEventClick}
        scrollTime={"08:00:00"}
      />

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {selectedSlot && "id" in selectedSlot
                ? "Edit Volunteers"
                : "Assign Volunteers"}
            </DialogTitle>
            <DialogDescription>
              {selectedSlot && "id" in selectedSlot
                ? "Edit or remove volunteer assignment"
                : "Select volunteers for this time slot"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 mt-2">
            <MultiSelect
              options={volunteerOptions}
              defaultValue={selectedVolunteers.map(String)}
              onValueChange={(vals: any[]) =>
                setSelectedVolunteers(vals.map(Number))
              }
            />

            <div className="flex justify-end gap-2 mt-2">
              {selectedSlot && "id" in selectedSlot && (
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              )}
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              {selectedSlot && "id" in selectedSlot == false && (
                <Button onClick={handleAssign}>Save</Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
