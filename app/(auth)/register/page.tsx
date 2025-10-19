import PublicGuard from "@/components/guard/PublicGuard";
import { RegisterForm } from "@/components/register/RegisterForm";
import React from "react";

export default function RegisterPage() {
  return (
    <PublicGuard>
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      >
        <div className="backdrop-blur-md bg-white/20 p-8 rounded-2xl shadow-lg w-full max-w-2xl">
          <RegisterForm />
        </div>
      </div>
    </PublicGuard>
  );
}
