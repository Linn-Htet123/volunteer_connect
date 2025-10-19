import { CampaignFormValues } from "@/components/campaign/CreateCampaignForm";
import { queryClient } from "@/config/queryClient";
import { KEYS } from "@/config/queryKey";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ROUTES } from "@/config/routes";
import { useRouter } from "next/navigation";

export const useCreateEvent = () => {
  const router = useRouter();
  const { authUser } = useAuthStore();
  return useMutation({
    mutationFn: async (event: CampaignFormValues) => {
      const formData = new FormData();
      formData.append("name", event.name);
      formData.append("description", event.description);
      formData.append("location", event.location);
      formData.append("map_url", event.map_url || "");
      formData.append("start_date", event.start_date.toISOString());
      const userId = authUser?.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }
      formData.append("created_by", String(userId));
      if (event.end_date) {
        formData.append("end_date", event.end_date.toISOString());
      }
      formData.append("capacity", event.capacity);
      if (event.status) formData.append("status", "Upcoming");
      if (event.image) formData.append("image", event.image);

      // Send POST request
      const { data } = await api.post("/events", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data;
    },
    onSuccess: (data) => {
      router.push(ROUTES.ORG_MY_CAMPAIGN);
      queryClient.invalidateQueries({ queryKey: [KEYS.events.all] });
      queryClient.invalidateQueries({ queryKey: [KEYS.events.org_all] });
      toast.success("Campaign created successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Failed to create campaign");
      console.error("Create campaign failed:", error);
    },
  });
};
