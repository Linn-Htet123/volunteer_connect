import { KEYS } from "@/config/queryKey";
import { Event } from "@/interfaces/event";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetEventDetails = (id: number | string) => {
  return useQuery({
    queryKey: [KEYS.events.detail(id)],
    queryFn: async (): Promise<Event> => {
      const { data } = await api.get<Event>(`/events/${id}`);

      return data;
    },
  });
};
