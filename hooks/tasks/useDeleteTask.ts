import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { KEYS } from "@/config/queryKey";
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/tasks/${id}`);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [KEYS.tasks.all] });
      queryClient.invalidateQueries({
        queryKey: [KEYS.tasks.detail(variables)],
      });
      toast.success("Task deleted successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Failed to delete task");
      console.error("Delete task failed:", error);
    },
  });
};
