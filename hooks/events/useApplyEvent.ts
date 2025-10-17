/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type ApplyEventVars = {
  volunteerIds: number[];
  eventId: number;
};

export const useApplyEvent = () => {
  return useMutation({
    mutationFn: async ({ volunteerIds, eventId }: ApplyEventVars) => {
      try {
        const { data } = await api.post("/event-volunteers/apply", {
          event_id: eventId,
          volunteer_ids: volunteerIds,
        });

        return data;
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error(String(error));
      }
    },
    onSuccess: () => {
      toast.success("Successfuly applied as volunteer");
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(error.response.data.message || "Failed to apply");
    },
  });
};
