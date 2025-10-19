import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export const useEditAssignmentTask = () => {
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
      // Make sure taskId is numeric
      const numericTaskId = Number(taskId);
      console.log(taskId);

      await api.patch(`/tasks/${numericTaskId}/volunteers/bulk`, {
        volunteer_ids: volunteerIds.map(Number),
        start,
        end,
      });
    },
  });
};
