"use client";
import { useState, useMemo } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { EventCard } from "@/components/common/EventCard";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import { ROUTES } from "@/config/routes";
import { useGetOrginzerEvents } from "@/hooks/events/useGetOrganizerEvents";
import Link from "next/link";
import React from "react";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function OrgMyCampaignPage() {
  const { data, isLoading } = useGetOrginzerEvents();
  const [search, setSearch] = useState("");
  const router = useRouter();
  const filteredEvents = useMemo(() => {
    if (!data) return [];

    return data.filter((event) => {
      const matchesSearch = event.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [data, search]);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8 w-full flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Campaigns
          </h1>
          <p className="text-muted-foreground">
            Manage and track all your created campaigns
          </p>
        </div>
        <Button
          onClick={() => router.push(ROUTES.ORG_CREATE_CAMPAIGN)}
          className="bg-primary text-white"
        >
          <Plus className="w-4 h-4" />
          Create Campaign
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}

        {!isLoading && filteredEvents.length === 0 && (
          <div className="col-span-full">
            <EmptyState
              message={
                search
                  ? "No campaigns match your search."
                  : "No campaigns found. Create your first campaign to get started!"
              }
            />
          </div>
        )}

        {!isLoading &&
          filteredEvents.map((event) => (
            <Link href={ROUTES.ORG_MY_CAMPAIGN_DETAIL(event.id)} key={event.id}>
              <EventCard event={event} />
            </Link>
          ))}
      </div>
    </div>
  );
}
