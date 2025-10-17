import { Volunteer } from "@/interfaces/volunteer";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";
import { useMutation } from "@tanstack/react-query";

export const useVolunteerRegister = () => {
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: async (volunteerData: Volunteer) => {
      const { data } = await api.post("/volunteers", { ...volunteerData });

      const meResponse = await api.get("/auth/me");

      if (meResponse.data) {
        updateUser(meResponse.data);
      }

      return data;
    },
  });
};
