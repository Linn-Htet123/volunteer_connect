"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";
import { Event } from "@/interfaces/event";

export default function EventDetailsEdit({ event }: { event?: Event }) {
  const [editableEvent, setEditableEvent] = useState<Event | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);

  useEffect(() => {
    if (event) setEditableEvent(event);
  }, [event]);

  if (!editableEvent) {
    return (
      <div className="text-center text-muted-foreground py-20">
        Loading event details...
      </div>
    );
  }

  const handleFieldDoubleClick = (field: keyof Event) => {
    setEditingField(field);
  };

  const handleFieldChange = (field: keyof Event, value: string) => {
    setEditableEvent((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleFieldBlur = (field: keyof Event) => {
    setEditingField(null);
    console.log(`Updated ${field}:`, editableEvent[field]);
  };

  return (
    <main className="container mx-auto px-6 pt-4">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8 transition-all hover:shadow-lg">
            {editingField === "name" ? (
              <Input
                value={editableEvent.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                onBlur={() => handleFieldBlur("name")}
                autoFocus
                className="text-2xl font-bold mb-4"
              />
            ) : (
              <h2
                className="text-2xl font-bold mb-4 text-foreground cursor-pointer"
                onDoubleClick={() => handleFieldDoubleClick("name")}
                title="Double click to edit name"
              >
                {editableEvent.name}
              </h2>
            )}

            {editingField === "description" ? (
              <Textarea
                value={editableEvent.description || ""}
                onChange={(e) =>
                  handleFieldChange("description", e.target.value)
                }
                onBlur={() => handleFieldBlur("description")}
                autoFocus
                className="leading-relaxed"
              />
            ) : (
              <p
                className="text-muted-foreground leading-relaxed cursor-pointer"
                onDoubleClick={() => handleFieldDoubleClick("description")}
                title="Double click to edit description"
              >
                {editableEvent.description || "No description yet."}
              </p>
            )}
          </Card>

          {/* Location */}
          <Card className="p-8 transition-all hover:shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              Location
            </h2>
            <div className="flex items-start gap-3 mb-6">
              <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                {editingField === "location" ? (
                  <Input
                    value={editableEvent.location || ""}
                    onChange={(e) =>
                      handleFieldChange("location", e.target.value)
                    }
                    onBlur={() => handleFieldBlur("location")}
                    autoFocus
                    className="font-semibold text-foreground"
                  />
                ) : (
                  <p
                    className="font-semibold text-foreground cursor-pointer"
                    onDoubleClick={() => handleFieldDoubleClick("location")}
                    title="Double click to edit location"
                  >
                    {editableEvent.location || "No location"}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">View on map</p>
              </div>
            </div>

            {editableEvent.map_url && (
              <div className="w-full h-80 rounded-lg overflow-hidden border border-border shadow-sm">
                <iframe
                  src={editableEvent.map_url}
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
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="capitalize">
                {editableEvent.status}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold text-sm text-muted-foreground">
                    Date
                  </p>
                  <p className="text-foreground font-medium">
                    {formatDate(editableEvent.start_date)}
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
                    {formatTime(editableEvent.start_date)} -{" "}
                    {formatTime(editableEvent.end_date)}
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
                    {editableEvent.totalApproved} / {editableEvent.capacity}{" "}
                    registered
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
