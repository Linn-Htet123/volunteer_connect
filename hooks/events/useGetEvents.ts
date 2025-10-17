import { KEYS } from "@/config/queryKey";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetEvents = () => {
  return useQuery({
    queryKey: [KEYS.events.all],
    queryFn: async () => {
      const { data } = await api.get("/events");

      return data;
    },
  });
};
