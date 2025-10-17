import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { KEYS } from "@/config/queryKey";

export function useAuthMe() {
  return useQuery({
    queryKey: [KEYS.auth.me],
    queryFn: async () => {
      const { data } = await api.get("/auth/me");
      localStorage.setItem("authUser", JSON.stringify(data));
      return data;
    },
    retry: false,
  });
}
