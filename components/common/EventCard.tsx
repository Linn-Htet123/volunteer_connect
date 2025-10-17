"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Event } from "@/interfaces/event";
import { getImageUrl } from "@/lib/utils";

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  return (
    <Card className="group overflow-hidden border-0 shadow-none p-0 m-0 transition-all duration-300">
      {event.image_url && (
        <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <Image
            src={getImageUrl(event.image_url)}
            alt={event.name}
            width={400}
            height={200}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}
      <CardContent className="py-4 px-3">
        <CardTitle className="flex justify-between items-end">
          <div className="text-lg font-semibold line-clamp-1 group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">
            {event.name}
          </div>
          <span className="text-sm">{event.capacity}</span>
        </CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {event.description}
        </p>
      </CardContent>
    </Card>
  );
};
