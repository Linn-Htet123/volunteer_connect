import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export const useDeleteAssignmentTask = () => {
  return useMutation({
    mutationFn: async ({
      taskId,
      volunteerIds,
    }: {
      taskId: number;
      volunteerIds: number[];
    }) => {
      await api.delete(`/tasks/${taskId}/volunteers`, {
        data: { volunteer_ids: volunteerIds },
      });
    },
  });
};
