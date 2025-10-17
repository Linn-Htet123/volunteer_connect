"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useGetEventDetails } from "@/hooks/events/useGetEventDetails";
import { useGetTaskForVolunteerInEvent } from "@/hooks/events/useGetTasksForVolunteerInEvent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Banner from "@/components/common/Banner";
import TasksList from "@/components/common/TaskList";
import EventDetails from "@/components/common/EventDetails";
import ChatRoom from "@/components/common/ChatRoom";

export default function MyCampaignDetailPage() {
  const params = useParams();
  const { authUser } = useAuthStore();

  const eventId =
    typeof params.id === "string"
      ? Number(params.id)
      : Array.isArray(params.id) && params.id.length
      ? Number(params.id[0])
      : 0;

  const { data: event } = useGetEventDetails(eventId ?? "");
  const {
    data: tasks,
    isLoading,
    error,
  } = useGetTaskForVolunteerInEvent({
    volunteerId: authUser?.volunteerId ?? 0,
    eventId,
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-muted-foreground">
        Loading tasks...
      </div>
    );

  return (
    <div className="min-h-screen bg-background pb-12">
      <Banner
        title={event?.name ?? ""}
        subtitle={event?.description ?? ""}
        backgroundImage={event?.image_url}
      />

      <div className="container mx-auto px-6 mt-10">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full max-w-lg grid-cols-3 p-1 bg-slate-100 rounded-xl mb-6">
            <TabsTrigger
              value="details"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
            >
              Event Details
            </TabsTrigger>
            <TabsTrigger
              value="tasks"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
            >
              My Tasks
              {tasks && (
                <Badge
                  variant="secondary"
                  className="ml-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {tasks.length}
                </Badge>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="chat"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
            >
              Chat Room
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
            <TasksList
              tasks={Array.isArray(tasks) ? tasks : tasks ? [tasks] : []}
            />
          </TabsContent>

          <TabsContent value="details">
            {event ? (
              <EventDetails event={event} />
            ) : (
              <div className="text-muted-foreground">Event not found.</div>
            )}
          </TabsContent>

          <TabsContent value="chat" className="h-[calc(100vh-300px)]">
            <ChatRoom eventId={eventId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
