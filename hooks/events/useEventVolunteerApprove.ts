import { KEYS } from "@/config/queryKey";
import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useEventVolunteerApprove = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      eventId,
      volunteerId,
    }: {
      eventId: number;
      volunteerId: number;
    }) => {
      await api.patch(
        `/event-volunteers/${eventId}/volunteer/${volunteerId}/approve`
      );
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data.message || "Volunteer Approve fail");
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [KEYS.events.event_volunteers(variables.eventId)],
      });
      toast.success("Volunteer Approved");
    },
  });
};
