/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { Roles } from "@/enum/role";
import { User } from "@/interfaces/user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";
import { useAuthStore } from "@/store/auth.store";

export const useUserRegister = (role: Roles) => {
  const router = useRouter();
  const { setAuth, setToken } = useAuthStore();

  return useMutation<User, Error, User>({
    mutationFn: async (userData: User): Promise<User> => {
      const { data } = await api.post<User>("/auth/register", {
        ...userData,
        role,
      });

      if (data?.access_token) {
        setToken(data.access_token);
      }
      if (role === Roles.Organizer) {
        const meResponse = await api.get("/auth/me");
        if (data?.access_token && meResponse.data) {
          setAuth(data?.access_token, meResponse.data);
        }
        // localStorage.setItem("authUser", JSON.stringify(meResponse.data));
      }

      return data;
    },

    onSuccess: () => {
      toast.success("🎉 User registered successfully!");
      router.push(ROUTES.CAMPAIGN);
    },

    onError: (error: any) => {
      toast.error(error.response.data.message || "❌ User registration failed");
    },
  });
};
