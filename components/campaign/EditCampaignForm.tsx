"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useEditEvent } from "@/hooks/events/useEditEvent";
import { useGetEventDetails } from "@/hooks/events/useGetEventDetails";
import { CampaignImageUpload } from "./CampaignImageUpload";
import { CampaignDetailsForm } from "./CampaignDetailsForm";
import { getImageUrl } from "@/lib/utils"; // ✅ import your util
import { ROUTES } from "@/config/routes";

// 🧩 Schema
const CampaignFormSchema = z.object({
  name: z.string().min(3, "Campaign name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(3, "Location is required"),
  map_url: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  start_date: z.date(),
  end_date: z.date().optional(),
  capacity: z.string().min(1, "Capacity is required"),
  image: z.any().optional(),
});

export type CampaignFormValues = z.infer<typeof CampaignFormSchema>;

// 🧠 Main Component
export default function EditCampaignForm({ eventId }: { eventId: number }) {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string>("");

  // ✅ hooks
  const { mutateAsync: editEventMutation, isPending: isSubmitting } =
    useEditEvent(eventId);
  const { data: eventData, isLoading } = useGetEventDetails(eventId);

  // ✅ Form setup
  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(CampaignFormSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      map_url: "",
      capacity: "",
    },
  });

  // ✅ When event data is fetched, set form default values
  useEffect(() => {
    if (eventData) {
      form.reset({
        name: eventData.name,
        description: eventData.description,
        location: eventData.location,
        map_url: eventData.map_url || "",
        start_date: new Date(eventData.start_date),
        end_date: eventData.end_date ? new Date(eventData.end_date) : undefined,
        capacity: String(eventData.capacity),
      });

      // ✅ image preview
      if (eventData.image_url) {
        setImagePreview(getImageUrl(eventData.image_url));
      }
    }
  }, [eventData, form]);

  // ✅ Image change handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview("");
    form.setValue("image", undefined);
  };

  // ✅ Submit handler
  const onSubmit = async (data: CampaignFormValues) => {
    await editEventMutation({
      ...data,
    });
    router.push(ROUTES.ORG_MY_CAMPAIGN_DETAIL(eventId));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        Loading event details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Edit Campaign
          </h1>
          <p className="text-muted-foreground">
            Update the campaign details below
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CampaignImageUpload
                    form={form}
                    imagePreview={imagePreview}
                    handleImageChange={handleImageChange}
                    removeImage={removeImage}
                  />
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card>
                  <CampaignDetailsForm form={form} />
                </Card>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
