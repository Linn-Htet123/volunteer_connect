import { CampaignFormValues } from "@/components/campaign/EditCampaignForm";
import { KEYS } from "@/config/queryKey";
import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useEditEvent = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CampaignFormValues) => {
      const formData = new FormData();

      // Convert and append all valid fields
      if (data.start_date)
        formData.append("start_date", new Date(data.start_date).toISOString());
      if (data.end_date)
        formData.append("end_date", new Date(data.end_date).toISOString());
      if (data.capacity) formData.append("capacity", String(data.capacity));

      ["name", "description", "location", "map_url", "image"].forEach((key) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const value = (data as any)[key];
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const response = await api.patch(`/events/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    },

    // ✅ Invalidate caches to trigger refetch
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEYS.events.detail(id)] });
      queryClient.invalidateQueries({ queryKey: [KEYS.events.all] });
      queryClient.invalidateQueries({ queryKey: [KEYS.events.my_events] });
    },
  });
};
