import { KEYS } from "@/config/queryKey";
import { TaskForVolunteer } from "@/interfaces/task";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetTaskForVolunteerInEvent = (ids: {
  volunteerId: number;
  eventId: number;
}) => {
  const { volunteerId, eventId } = ids;
  return useQuery({
    queryKey: [KEYS.events.tasksForVolunteerInEvent(ids)],
    queryFn: async (): Promise<TaskForVolunteer> => {
      const { data } = await api.get<TaskForVolunteer>(
        `/tasks/event/${eventId}/volunteer/${volunteerId}`
      );

      return data;
    },
  });
};
