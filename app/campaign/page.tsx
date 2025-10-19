"use client";

import { EventsGrid } from "@/components/common/InfiniteGrid";
import { useGetEvents } from "@/hooks/events/useGetEvents";

export default function EventsPage() {
  const { data } = useGetEvents();

  return (
    <div className="min-h-screen container mx-auto">
      <EventsGrid data={data} placeholder="Search events..." />
    </div>
  );
}
