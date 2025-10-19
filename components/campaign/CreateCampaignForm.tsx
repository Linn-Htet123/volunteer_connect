"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCreateEvent } from "@/hooks/events/useCreateEvent";
import { CampaignImageUpload } from "./CampaignImageUpload";
import { CampaignDetailsForm } from "./CampaignDetailsForm";

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
  status: z.enum(["draft", "published", "cancelled", "completed"]).optional(),
  image: z.any().optional(),
});

export type CampaignFormValues = z.infer<typeof CampaignFormSchema>;

export default function CreateCampaignForm({
  onFormChange,
}: {
  onFormChange?: (data: Partial<CampaignFormValues>) => void;
}) {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string>("");
  const { mutateAsync: createEventMutation, isPending: isSubmitting } =
    useCreateEvent();

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(CampaignFormSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      map_url: "",
      capacity: "",
      status: "published",
    },
  });

  // 🔄 Send live updates to parent (OrgCampaignPage)
  useEffect(() => {
    const subscription = form.watch((values) => {
      onFormChange?.(values);
    });
    return () => subscription.unsubscribe();
  }, [form, onFormChange]);

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

  const onSubmit = async (data: CampaignFormValues) => {
    await createEventMutation(data);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Create Campaign
          </h1>
          <p className="text-muted-foreground">Fill in the essential details</p>
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
                {isSubmitting ? "Creating..." : "Create Campaign"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
