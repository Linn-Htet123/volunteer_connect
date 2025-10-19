"use client";

import { TaskFormValues } from "@/components/task/EditTaskForm";
import { KEYS } from "@/config/queryKey";
import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TaskFormValues & { id: number }) => {
      const { id, ...payload } = data;
      const res = await api.patch(`/tasks/${id}`, payload);
      return res.data;
    },

    onSuccess: (_, variables) => {
      // Invalidate task list and specific task queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: [KEYS.tasks.all] });
      queryClient.invalidateQueries({
        queryKey: [KEYS.tasks.detail(variables.id)],
      });
      toast.success("Task Updated successfully");
    },
    onError: (err: unknown) => {
      const errorMessage =
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data
          ? (err.response.data as { message?: string }).message ||
            "Task update fail"
          : "Task update fail";
      toast.error(errorMessage);
      console.error("Update task failed:", err);
    },
  });
};
