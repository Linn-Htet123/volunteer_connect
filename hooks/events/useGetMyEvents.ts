import { KEYS } from "@/config/queryKey";
import { Events } from "@/interfaces/event";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetMyEvents = () => {
  return useQuery({
    queryKey: [KEYS.events.my_events],
    queryFn: async (): Promise<Events> => {
      const { data } = await api.get<Events>("/event-volunteers/my-events");
      return data;
    },
  });
};
