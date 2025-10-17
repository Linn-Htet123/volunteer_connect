"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { useGetMyEvents } from "@/hooks/events/useGetMyEvents";
import { EventCard } from "@/components/common/EventCard";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import { EmptyState } from "@/components/common/EmptyState";
import { VolunteerEventStatus } from "@/enum/event";
import { Badge } from "@/components/ui/badge";
const TABS = [
  { key: "all", label: "All" },
  { key: VolunteerEventStatus.PENDING, label: "Pending" },
  { key: VolunteerEventStatus.APPROVED, label: "Approved" },
  { key: VolunteerEventStatus.REJECTED, label: "Rejected" },
];

export default function MyCampaignPage() {
  const { data, isLoading } = useGetMyEvents();
  const [activeTab, setActiveTab] = useState<string>("all");

  // Filter data by status
  const filteredEvents = useMemo(() => {
    if (!data) return [];
    if (activeTab === "all") return data;
    return data.filter((event) => event.status === activeTab);
  }, [data, activeTab]);

  return (
    <section className="container mx-auto px-4 py-10 max-w-7xl">
      <div className="flex flex-col gap-8 w-full">
        {/* Tabs */}
        <div className="flex flex-wrap gap-3">
          {TABS.map((tab) => (
            <Badge
              variant={"outline"}
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`cursor-pointer px-3 py-1 rounded-full border text-sm font-medium transition-all
                ${
                  activeTab === tab.key
                    ? "bg-primary text-white shadow-sm"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
            >
              {tab.label}
            </Badge>
          ))}
        </div>

        {/* Event grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}

          {!isLoading && filteredEvents.length === 0 && (
            <div className="col-span-full">
              <EmptyState message="No campaigns found." />
            </div>
          )}

          {filteredEvents.map((event) => (
            <Link href={ROUTES.MY_CAMPAIGN_DETAIL(event.id)} key={event.id}>
              <EventCard event={event} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
