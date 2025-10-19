/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";
import { Event } from "@/interfaces/event";
import { Button } from "../ui/button";
import Link from "next/link";
import { ROUTES } from "@/config/routes";

export default function EventDetails({
  event,
  showEdit,
}: {
  event: Event;
  showEdit?: boolean;
}) {
  if (!event) {
    return (
      <div className="text-center text-muted-foreground py-20">
        Event details not available.
      </div>
    );
  }

  return (
    <main className="container mx-auto px-6 pt-4">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8 transition-all hover:shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              {event.name}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          </Card>

          <Card className="p-8 transition-all hover:shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              Location
            </h2>
            <div className="flex items-start gap-3 mb-6">
              <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-foreground">
                  {event.location}
                </p>
                <p className="text-sm text-muted-foreground">View on map</p>
              </div>
            </div>

            {event.map_url && (
              <div className="w-full h-80 rounded-lg overflow-hidden border border-border shadow-sm">
                <iframe
                  src={event.map_url}
                  className="w-full h-full"
                  allowFullScreen
                  loading="lazy"
                  title="Event location map"
                />
              </div>
            )}
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1">
          <Card className="p-8 sticky top-6 space-y-6 shadow-lg">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold text-sm text-muted-foreground">
                    Date
                  </p>
                  <p className="text-foreground font-medium">
                    {formatDate(event.start_date)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold text-sm text-muted-foreground">
                    Time
                  </p>
                  <p className="text-foreground font-medium">
                    {formatTime(event.start_date)} -{" "}
                    {formatTime(event.end_date)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold text-sm text-muted-foreground">
                    Volunteers
                  </p>
                  <p className="text-foreground font-medium">
                    {event.totalApproved} / {event.capacity} registered
                  </p>
                </div>
              </div>
            </div>
            {showEdit && (
              <Link href={ROUTES.EDIT_CAMPAIGN(event.id)} className="w-full">
                <Button className="w-full">Edit Campaign</Button>
              </Link>
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}
