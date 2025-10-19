"use client";

import { ROUTES } from "@/config/routes";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

export default function PublicGuard({ children }: { children: ReactNode }) {
  const { authUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (authUser) {
      router.replace(ROUTES.HOME); // or redirect to dashboard if you prefer
    }
  }, [authUser, router]);

  return <>{children}</>;
}
