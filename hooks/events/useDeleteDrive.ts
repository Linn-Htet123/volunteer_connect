import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useDeleteDrive = () => {
  return useMutation({
    mutationFn: async (resourceId: number) => {
      await api.delete(`/event-resources/${resourceId}`);
    },
    onSuccess: () => {
      toast.success("Resource deleted successfully");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data.message || "Resource deleted fail");
    },
  });
};
