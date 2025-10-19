import { KEYS } from "@/config/queryKey";
import { VolunteerInEvent } from "@/interfaces/volunteer";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetVolunteersInEventByOrg = (eventId: number) => {
  return useQuery({
    queryKey: [KEYS.events.event_volunteers(eventId)],
    queryFn: async (): Promise<VolunteerInEvent[]> => {
      const { data } = await api.get<VolunteerInEvent[]>(
        `/event-volunteers/volunteers/${eventId}`
      );
      return data;
    },
  });
};
