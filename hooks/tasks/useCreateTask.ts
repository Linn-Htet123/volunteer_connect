import { TaskFormValues } from "@/components/task/CreateTaskForm";
import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { KEYS } from "@/config/queryKey";

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TaskFormValues) => {
      const res = await api.post("/tasks", data);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEYS.tasks.all] });
      toast.success("Task created successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "❌ Failed to create task");
      console.error("Create task failed:", error);
    },
  });
};
