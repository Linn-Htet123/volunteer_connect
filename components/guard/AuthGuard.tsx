"use client";

import { useAuthMe } from "@/hooks/auth/useAuthMe";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { ROUTES } from "@/config/routes";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isLoading, isError } = useAuthMe();

  useEffect(() => {
    if (!isLoading && isError) {
      router.replace(ROUTES.LOGIN);
    }
  }, [isError, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) return null;

  return <>{children}</>;
}
