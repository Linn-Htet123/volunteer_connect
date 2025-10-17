/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";
import { useAuthStore } from "@/store/auth.store";

interface LoginPayload {
  email: string;
  password: string;
}

export const useLogin = () => {
  const router = useRouter();
  const { setAuth, setToken } = useAuthStore();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      try {
        const { data } = await api.post("/auth/login", payload);

        if (data?.access_token) {
          setToken(data.access_token);
        }

        const meResponse = await api.get("/auth/me");
        // localStorage.setItem("authUser", JSON.stringify(meResponse.data));
        if (data?.access_token && meResponse.data) {
          setAuth(data?.access_token, meResponse.data);
        }

        return data;
      } catch (error: any) {
        throw new Error(
          error?.response?.data?.message || "Invalid credentials"
        );
      }
    },

    onSuccess: () => {
      toast.success("✅ Logged in successfully!");
      router.push(ROUTES.CAMPAIGN);
    },

    onError: (error) => {
      toast.error(error.message || "❌ Login failed");
    },
  });
};
