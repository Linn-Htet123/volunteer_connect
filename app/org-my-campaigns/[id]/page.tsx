"use client";

import { useGetEventDetails } from "@/hooks/events/useGetEventDetails";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Banner from "@/components/common/Banner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventDetails from "@/components/common/EventDetails";
import ChatRoom from "@/components/common/ChatRoom";
import CreateTaskForm from "@/components/task/CreateTaskForm";
import { useGetTasks } from "@/hooks/tasks/useGetTasks";
import TaskCard from "@/components/task/TaskCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import VolunteerTab from "@/components/campaign/VolunteerTab";
import DriveResources from "@/components/campaign/DriveResources";

export default function OrgCampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabQuery = searchParams.get("tab") ?? "details"; // default tab
  const [activeTab, setActiveTab] = useState(tabQuery);

  const { data: event } = useGetEventDetails(Number(params.id));
  const { data: tasks } = useGetTasks();

  // ✅ Keep URL synced when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newUrl = `?tab=${value}`;
    router.replace(newUrl, { scroll: false }); // no reload, no scroll jump
  };

  // ✅ Update state if user manually changes URL
  useEffect(() => {
    if (tabQuery !== activeTab) setActiveTab(tabQuery);
  }, [tabQuery]);

  return (
    <div className="container mx-auto">
      <Button onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="w-10" />
      </Button>
      {event ? (
        <Banner
          location={event?.location ?? ""}
          startDate={event?.start_date ?? ""}
          title={event?.name ?? ""}
          subtitle={event?.description ?? ""}
          backgroundImage={event?.image_url}
        />
      ) : (
        <div className="text-muted-foreground flex justify-center items-center h-96">
          Campaign not found.
        </div>
      )}

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full my-4"
      >
        <TabsList className="grid w-full max-w-xl grid-cols-3 md:grid-cols-5 p-1 bg-slate-100 rounded-xl mb-6">
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
            Tasks
          </TabsTrigger>
          <TabsTrigger
            value="volunteers"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
          >
            Volunteers
          </TabsTrigger>
          <TabsTrigger
            value="chat"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
          >
            Chat Room
          </TabsTrigger>
          <TabsTrigger
            value="drive"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
          >
            Drive
          </TabsTrigger>
        </TabsList>

        {/* 🟦 TASKS TAB */}
        <TabsContent value="tasks">
          <CreateTaskForm eventId={event?.id ?? 0} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full">
            {tasks?.map((task) => (
              <TaskCard key={task.id} task={task} eventId={event?.id ?? 0} />
            ))}
          </div>
          {tasks?.length === 0 && (
            <div className="text-muted-foreground w-full flex  flex-col justify-center items-center h-96">
              No tasks created yet.
            </div>
          )}
        </TabsContent>
        <TabsContent value="volunteers">
          <div className="w-full">
            <VolunteerTab eventId={params.id as unknown as number} />
          </div>
        </TabsContent>
        {/* 🟩 DETAILS TAB */}
        <TabsContent value="details">
          {event ? (
            <EventDetails event={event} showEdit />
          ) : (
            <div className="text-muted-foreground">Event not found.</div>
          )}
        </TabsContent>

        {/* 🟨 CHAT TAB */}
        <TabsContent value="chat" className="h-[calc(100vh-300px)]">
          <ChatRoom eventId={event?.id ?? 0} eventName={event?.name} />
        </TabsContent>
        <TabsContent value="drive" className="h-[calc(100vh-300px)]">
          <DriveResources eventId={event?.id ?? 0} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
