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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect, FormEvent } from "react";
import { useGetTask } from "@/hooks/tasks/useGetTask";
import { useUpdateTask } from "@/hooks/tasks/useUpdateTask";
import { Pencil } from "lucide-react";

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

export default function EditTaskForm({
  taskId,
  eventId,
}: {
  taskId: number;
  eventId: number;
}) {
  const { authUser } = useAuthStore();
  const { data: task } = useGetTask(taskId);
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

  const { mutateAsync, isPending } = useUpdateTask();

  // Populate form when task data is loaded
  useEffect(() => {
    if (task && currentUserId) {
      form.reset({
        event_id: Number(eventId),
        created_by: Number(task.created_by),
        title: task.title || "",
        description: task.description || "",
        location: task.location || "",
        start_date: task.start_date
          ? new Date(task.start_date).toISOString().slice(0, 16)
          : "",
        end_date: task.end_date
          ? new Date(task.end_date).toISOString().slice(0, 16)
          : "",
      });
    }
  }, [task, eventId, currentUserId, form]);

  const onSubmit = async (data: TaskFormValues) => {
    console.log("✅ onSubmit called with data:", data);
    try {
      console.log("🔄 Calling mutateAsync...");
      await mutateAsync({ ...data, id: taskId });
      console.log("✅ mutateAsync completed");
      setOpen(false);
      form.reset();
    } catch (err: unknown) {
      console.error("❌ Update task error:", err);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("🎯 Form submit triggered");

    // Ensure hidden fields are numbers
    const currentValues = form.getValues();
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
          <button
            type="button"
            className="p-1 text-muted-foreground hover:text-primary"
          >
            <Pencil className="h-5 w-5" />
          </button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>

          <Card className="p-6 space-y-5 max-w-2xl">
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <Label htmlFor="title" className="my-2">
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="Task title"
                  {...form.register("title")}
                />
                {form.formState.errors.title && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>
              {/* Description */}
              <div>
                <Label htmlFor="description" className="my-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the task..."
                  {...form.register("description")}
                />
              </div>
              {/* Location */}
              <div>
                <Label htmlFor="location" className="my-2">
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="e.g. Main Hall"
                  {...form.register("location")}
                />
              </div>
              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date" className="my-2">
                    Start Date
                  </Label>
                  <Input
                    id="start_date"
                    type="datetime-local"
                    {...form.register("start_date")}
                  />
                </div>
                <div>
                  <Label htmlFor="end_date" className="my-2">
                    End Date
                  </Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    {...form.register("end_date")}
                  />
                </div>
              </div>
              {/* Hidden fields - using setValue instead of register to ensure proper type */}
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
                    handleFormSubmit(e as unknown as FormEvent<Element>);
                  }}
                >
                  {isPending ? "Updating..." : "Update Task"}
                </Button>
              </div>
            </form>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
}
