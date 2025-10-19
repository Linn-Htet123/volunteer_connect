"use client";

import { EventsGrid } from "@/components/common/InfiniteGrid";
import { useGetEvents } from "@/hooks/events/useGetEvents";

export default function OrgCampaignPage() {
  const { data } = useGetEvents();

  return (
    <div className="min-h-screen w-full">
      <EventsGrid data={data} placeholder="Search events..." />
    </div>
  );
}
