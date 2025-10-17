"use client";

import { Card } from "@/components/ui/card";
import { Label } from "../ui/label";

interface HeroCardProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
}

export const HeroCard = ({
  title,
  subtitle,
  backgroundImage,
}: HeroCardProps) => {
  return (
    <Card
      className="w-full shadow-none border-0"
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Card className="shadow-none border-0 space-y-1 flex flex-col items-center justify-center backdrop-blur-md bg-white/20 dark:bg-black/20 p-6 mx-auto">
        <h1 className="text-4xl font-bold text-pretty dark:text-white">
          {title}
        </h1>
        <Label className="text-center">{subtitle}</Label>
      </Card>
    </Card>
  );
};
