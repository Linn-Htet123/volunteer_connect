import { KEYS } from "@/config/queryKey";
import { Task } from "@/interfaces/task";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetTasks = () => {
  return useQuery({
    queryKey: [KEYS.tasks.all],
    queryFn: async (): Promise<Task[]> => {
      const { data } = await api.get<Task[]>("tasks");
      return data ?? [];
    },
  });
};
