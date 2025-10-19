import { KEYS } from "@/config/queryKey";
import { TaskStatus } from "@/enum/task";
import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      taskId,
      status,
    }: {
      taskId: number;
      status: TaskStatus;
    }) => {
      return api.patch(`/tasks/${taskId}/status`, {
        status,
      });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data.message || "Status updated successfully.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEYS.tasks.all] });
      toast.success("Task status updated successfully");
    },
  });
};
