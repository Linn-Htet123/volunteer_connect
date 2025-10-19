"use client";
import EditCampaignForm from "@/components/campaign/EditCampaignForm";
import { useParams } from "next/navigation";
import React from "react";

export default function CampaignEditPage() {
  const params = useParams();
  return (
    <div>
      <EditCampaignForm eventId={params.id as unknown as number} />
    </div>
  );
}
