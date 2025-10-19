"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useGetEventDetails } from "@/hooks/events/useGetEventDetails";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate, formatTime } from "@/lib/utils";
import Banner from "@/components/common/Banner";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useApplyEvent } from "@/hooks/events/useApplyEvent";
import { useAuthStore } from "@/store/auth.store";

const EventDetailsPage = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data: event, isLoading, error } = useGetEventDetails(id ?? "");

  const { mutateAsync: applyEvent } = useApplyEvent();
  const { authUser } = useAuthStore();

  const [open, setOpen] = useState(false);

  if (isLoading) return <div className="p-10">Loading...</div>;
  if (error || !event) return <div className="p-10">Event not found</div>;

  const handleConfirm = async () => {
    try {
      const volunteerId = authUser?.volunteerId;
      if (!volunteerId) {
        console.error("No authenticated volunteer ID found.");
        return;
      }
      await applyEvent({
        eventId: event.id,
        volunteerIds: [volunteerId],
      });
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background container mx-auto">
      {/* Hero Banner */}
      <Banner
        location={event.location}
        startDate={event.start_date}
        title={event.name}
        subtitle={event.description}
        backgroundImage={event.image_url}
      />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Event Details */}
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
                  <p className="text-sm text-muted-foreground">
                    View on map below
                  </p>
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

          {/* Right Column - Event Info */}
          <div className="lg:col-span-1">
            <Card className="p-8 sticky top-6 space-y-6 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
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
                  <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
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
                  <Users className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
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

              <div className="border-t border-border"></div>

              {/* Apply Button with Popup */}
              <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    size="lg"
                    className="w-full font-semibold text-base"
                    onClick={() => setOpen(true)}
                  >
                    Apply as Volunteer
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to apply as a volunteer?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      You will be registered for this event. And perform the
                      tasks.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm}>
                      Yes, Apply
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetailsPage;
