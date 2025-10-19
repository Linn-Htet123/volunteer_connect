import { KEYS } from "@/config/queryKey";
import { Event } from "@/interfaces/event";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetOrginzerEvents = () => {
  return useQuery({
    queryKey: [KEYS.events.org_all],
    queryFn: async (): Promise<Event[]> => {
      const { data } = await api.get<Event[]>("/events/org/my-events");
      return data;
    },
  });
};
