import { KEYS } from "@/config/queryKey";
import { Task } from "@/interfaces/task";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetTask = (taskId: number) => {
  return useQuery({
    queryKey: [KEYS.tasks.detail(taskId)],
    queryFn: async (): Promise<Task> => {
      const { data } = await api.get<Task>(`/tasks/${taskId}`);
      return data;
    },
  });
};
