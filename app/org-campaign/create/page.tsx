"use client";

import { useState } from "react";
import Banner from "@/components/common/Banner";
import CreateCampaignForm, {
  CampaignFormValues,
} from "@/components/campaign/CreateCampaignForm";

export default function OrgCampaignCreatePage() {
  const [bannerData, setBannerData] = useState<Partial<CampaignFormValues>>({});

  return (
    <div className="p-6">
      <Banner
        title={bannerData.name || "Create Campaign"}
        subtitle={bannerData.description || "Create a new campaign"}
        location={bannerData.location || "Your Location"}
        startDate={
          bannerData.start_date
            ? new Date(bannerData.start_date).toLocaleDateString()
            : "Your Start Date"
        }
      />
      <CreateCampaignForm onFormChange={setBannerData} />
    </div>
  );
}
