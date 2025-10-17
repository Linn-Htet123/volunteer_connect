"use client";

import { useAuthMe } from "@/hooks/auth/useAuthMe";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { ROUTES } from "@/config/routes";

interface PublicGuardProps {
  children: React.ReactNode;
}

export function PublicGuard({ children }: PublicGuardProps) {
  const router = useRouter();
  const { data: user, isLoading } = useAuthMe();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(ROUTES.HOME);
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
