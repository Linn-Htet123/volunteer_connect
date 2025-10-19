import { KEYS } from "@/config/queryKey";
import { Events } from "@/interfaces/event";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";

export const useGetMyEvents = () => {
  const { authUser } = useAuthStore();

  return useQuery({
    queryKey: [KEYS.events.my_events, authUser?.id],
    queryFn: async (): Promise<Events> => {
      const { data } = await api.get<Events>("/event-volunteers/my-events");
      return data;
    },
    enabled: !!authUser?.id,
    staleTime: 1000 * 60 * 1,
  });
};
