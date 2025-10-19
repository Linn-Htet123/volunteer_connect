/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth.store";
import { useCreateTask } from "@/hooks/tasks/useCreateTask";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

const TaskSchema = z.object({
  event_id: z.number().int().min(1, "Event ID is required"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  location: z.string().optional(),
  created_by: z.number().int().min(1, "Creator ID required"),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof TaskSchema>;

export default function CreateTaskForm({ eventId }: { eventId: number }) {
  const { authUser } = useAuthStore();
  const currentUserId = authUser?.id ?? 0;

  const [open, setOpen] = useState(false);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      event_id: Number(eventId),
      created_by: Number(currentUserId),
      title: "",
      description: "",
      location: "",
      start_date: "",
      end_date: "",
    },
  });

  const { mutateAsync, isPending } = useCreateTask();

  const onSubmit = async (data: TaskFormValues) => {
    console.log("✅ onSubmit called with data:", data);
    try {
      await mutateAsync(data);
      form.reset();
      setOpen(false);
    } catch (err: any) {
      console.error("Create task error:", err);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("🎯 Form submit triggered");

    // Ensure hidden fields are numbers
    form.setValue("event_id", Number(eventId));
    form.setValue("created_by", Number(currentUserId));

    console.log("📋 Form values:", form.getValues());
    console.log("📋 Form errors:", form.formState.errors);

    form.handleSubmit(
      (data) => {
        console.log("✅ Validation passed");
        onSubmit(data);
      },
      (errors) => {
        console.error("❌ Validation failed:", errors);
      }
    )();
  };

  return (
    <div className="mx-auto w-full">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="w-full flex justify-end">
            <Button className="mb-4">Create Task</Button>
          </div>
        </DialogTrigger>

        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>

          <Card className="p-6 space-y-5 max-w-2xl">
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <Label className="my-2" htmlFor="title">
                  Title
                </Label>
                <Input
                  id="title"
                  {...form.register("title")}
                  placeholder="Task title"
                />
                {form.formState.errors.title && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <Label className="my-2" htmlFor="description">
                  Description
                </Label>
                <Textarea
                  id="description"
                  {...form.register("description")}
                  placeholder="Describe the task..."
                />
              </div>

              {/* Location */}
              <div>
                <Label className="my-2" htmlFor="location">
                  Location
                </Label>
                <Input
                  id="location"
                  {...form.register("location")}
                  placeholder="e.g. Main Hall"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="my-2" htmlFor="start_date">
                    Start Date
                  </Label>
                  <Input
                    id="start_date"
                    type="datetime-local"
                    {...form.register("start_date")}
                  />
                </div>
                <div>
                  <Label className="my-2" htmlFor="end_date">
                    End Date
                  </Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    {...form.register("end_date")}
                  />
                </div>
              </div>

              {/* Hidden Fields - using setValue instead of register */}
              <input type="hidden" value={eventId} readOnly />
              <input type="hidden" value={currentUserId} readOnly />

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={isPending}
                  onClick={(e) => {
                    console.log("🖱️ Button clicked");
                    handleFormSubmit(e as any);
                  }}
                >
                  {isPending ? "Creating..." : "Create Task"}
                </Button>
              </div>
            </form>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
}
