"use client";

import { useState, useMemo } from "react";
import { Events, Event } from "@/interfaces/event";
import { SearchBar } from "./SearchBar";
import { HeroCard } from "./HeroCard";
import { EventCard } from "./EventCard";
import { EmptyState } from "./EmptyState";
import { SkeletonCard } from "./SkeletonCard";
import Link from "next/link";
import { ROUTES } from "@/config/routes";

interface GridProps {
  data: Events;
  placeholder?: string;
  isLoading?: boolean;
}

export const EventsGrid = ({
  data,
  placeholder = "Search events...",
  isLoading = false,
}: GridProps) => {
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    if (!search) return data ?? [];
    return (data ?? []).filter((item: Event) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-10 max-w-7xl flex flex-col">
        <div className="space-y-6 text-center mb-8">
          <HeroCard
            title="Discover Events"
            subtitle="Browse through the collection"
            backgroundImage="/bg.jpg"
          />
          <div className="flex justify-center">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder={placeholder}
            />
          </div>
        </div>

        {!isLoading && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 text-right">
            {filteredItems.length}{" "}
            {filteredItems.length === 1 ? "event" : "events"} found
          </p>
        )}

        <div className="flex-1 w-full">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {!isLoading && filteredItems.length === 0 && <EmptyState />}

            {isLoading &&
              Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}

            {filteredItems.map((event) => (
              <Link href={ROUTES.CAMPAIGN_DETAILS(event.id)} key={event.id}>
                <EventCard event={event} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
