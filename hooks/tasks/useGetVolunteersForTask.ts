import { KEYS } from "@/config/queryKey";
import { AssignedVolunteerEvent } from "@/interfaces/task";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetVolunteersForTask = (taskId: number) => {
  return useQuery({
    queryKey: [KEYS.tasks.volunteers(taskId)],
    queryFn: async (): Promise<AssignedVolunteerEvent[]> => {
      const { data } = await api.get<AssignedVolunteerEvent[]>(
        `/tasks/${taskId}/volunteers`
      );
      return data;
    },
    enabled: !!taskId,
  });
};
