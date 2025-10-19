import { formatDate, getImageUrl } from "@/lib/utils";
import { Calendar, MapPin } from "lucide-react";
import React from "react";

interface EventBannerProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  location: string;
  startDate: string;
}

const EventBanner = ({
  title,
  location,
  startDate,
  backgroundImage,
}: EventBannerProps) => {
  return (
    <div className="relative w-full h-48 overflow-hidden rounded-2xl px-6">
      {/* Background Image with Overlay */}

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundSize: "cover",
          backgroundImage: backgroundImage
            ? `url(${getImageUrl(backgroundImage)})`
            : "url(/banner-default.jpg)",
        }}
      >
        {/* Gradient Overlay */}
        {backgroundImage ? (
          <div className="absolute inset-0 backdrop-blur-sm bg-black/20" />
        ) : (
          <div className="absolute inset-0  bg-black/10" />
        )}
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto max-w-6xl">
        <div className="flex flex-col justify-end h-full pb-12 space-y-4 max-w-3xl">
          <h1 className="text-xl md:text-4xl font-bold text-white leading-tight animate-fade-in">
            {title}
          </h1>
          <div className="flex gap-5 text-white">
            <div className="flex gap-2">
              <Calendar className="w-5 h-5" />
              <span className="text-sm font-thin">
                {(() => {
                  const d = new Date(startDate);
                  return startDate && !isNaN(d.getTime())
                    ? formatDate(startDate)
                    : "Start date";
                })()}
              </span>
            </div>
            <div className="flex gap-2">
              <MapPin className="w-5 h-5" />
              <span className="text-sm font-thin">
                {location ? location : "Location"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventBanner;
