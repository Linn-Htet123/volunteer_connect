"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useGetEventDetails } from "@/hooks/events/useGetEventDetails";
import { useGetTaskForVolunteerInEvent } from "@/hooks/events/useGetTasksForVolunteerInEvent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Banner from "@/components/common/Banner";
import TasksList from "@/components/common/TaskList";
import EventDetails from "@/components/common/EventDetails";
import ChatRoom from "@/components/common/ChatRoom";
import { VolunteerEventStatus } from "@/enum/event";
import { useGetMyEvents } from "@/hooks/events/useGetMyEvents";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import DriveResources from "@/components/campaign/DriveResources";

export default function MyCampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { authUser } = useAuthStore();
  const { data: myEvents } = useGetMyEvents();

  const eventId =
    typeof params.id === "string"
      ? Number(params.id)
      : Array.isArray(params.id) && params.id.length
      ? Number(params.id[0])
      : 0;

  const { data: event } = useGetEventDetails(eventId ?? "");
  const myEvent = myEvents?.filter((ev) => ev.id === eventId);

  const { data: tasks, isLoading } = useGetTaskForVolunteerInEvent({
    volunteerId: authUser?.volunteerId ?? 0,
    eventId,
  });

  // Get tab from URL or default to "details"
  const tabFromUrl = searchParams.get("tab") || "details";
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Sync tab when URL changes (for back/forward)
  useEffect(() => {
    const tab = searchParams.get("tab") || "details";
    setActiveTab(tab);
  }, [searchParams]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-muted-foreground">
        Loading tasks...
      </div>
    );

  return (
    <div className="min-h-screen bg-background pb-12 container mx-auto">
      <Button onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="w-10" />
      </Button>
      <Banner
        location={event?.location ?? ""}
        startDate={event?.start_date ?? ""}
        title={event?.name ?? ""}
        subtitle={event?.description ?? ""}
        backgroundImage={event?.image_url}
      />

      <div className="container mx-auto px-6 mt-10">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-lg grid-cols-4 p-1 bg-slate-100 rounded-xl mb-6">
            <TabsTrigger
              value="details"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
            >
              Details
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
            </TabsTrigger>{" "}
            <TabsTrigger
              value="drive"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
            >
              Drive
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
            {myEvent?.[0]?.status == VolunteerEventStatus.APPROVED ? (
              <ChatRoom eventId={eventId} eventName={event?.name} />
            ) : (
              <div className="text-muted-foreground flex justify-center items-center h-96">
                You have not approved to join this chat.
              </div>
            )}
          </TabsContent>
          <TabsContent value="drive" className="h-[calc(100vh-300px)]">
            {myEvent?.[0]?.status == VolunteerEventStatus.APPROVED ? (
              <DriveResources eventId={eventId} />
            ) : (
              <div className="text-muted-foreground flex justify-center items-center h-96">
                You have not approved for this drive.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
