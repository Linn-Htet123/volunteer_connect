import { KEYS } from "@/config/queryKey";
import { VolunteerInEvent } from "@/interfaces/volunteer";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetVolunteersInEvent = (eventId: number) => {
  return useQuery({
    queryKey: [KEYS.events.volunteers],
    queryFn: async (): Promise<VolunteerInEvent[]> => {
      const { data } = await api.get<VolunteerInEvent[]>(
        `/event-volunteers/${eventId}/volunteers`
      );
      return data;
    },
  });
};
