import { getImageUrl } from "@/lib/utils";
import React from "react";

interface EventBannerProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
}

const EventBanner = ({
  title,
  subtitle,
  backgroundImage,
}: EventBannerProps) => {
  return (
    <div className="relative w-full h-48 overflow-hidden">
      {/* Background Image with Overlay */}

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundSize: "cover",
          backgroundImage: backgroundImage
            ? `url(${getImageUrl(backgroundImage)})`
            : "var(--gradient-hero)",
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 backdrop-blur-sm bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto max-w-6xl">
        <div className="flex flex-col justify-end h-full pb-12 space-y-4 max-w-3xl">
          <h1 className="text-xl md:text-4xl font-bold text-white leading-tight animate-fade-in">
            {title}
          </h1>
          {/* <p className="text-xl text-white/90 leading-relaxed animate-fade-in">
            {subtitle}
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default EventBanner;
