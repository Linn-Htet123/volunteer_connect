import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAssignTask = () => {
  return useMutation({
    mutationFn: async ({
      taskId,
      volunteerIds,
      start,
      end,
    }: {
      taskId: number;
      volunteerIds: number[];
      start: string;
      end: string;
    }) => {
      await api.post(`/tasks/${taskId}/volunteers/multiple`, {
        volunteer_ids: volunteerIds,
        start,
        end,
      });
    },
    onSuccess: () => {
      toast.success("Task assigned successfully");
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Task assignment failed");
    },
  });
};
