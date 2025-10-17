"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Phone, UserCircle, Loader2 } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { useUserRegister } from "@/hooks/auth/useRegister";
import { Roles } from "@/enum/role";
import { User } from "@/interfaces/user";

const organizerSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(8, "Phone number is required"),
});

type OrganizerFormData = z.infer<typeof organizerSchema>;

export function OrganizerForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrganizerFormData>({
    resolver: zodResolver(organizerSchema),
  });

  const { mutateAsync: registerUser, isPending: isRegisteringUser } =
    useUserRegister(Roles.Organizer);

  const onSubmit = async (organizerData: OrganizerFormData) => {
    const user = await registerUser({
      name: organizerData.name,
      email: organizerData.email,
      password: organizerData.password,
      phone: organizerData.phone,
    } as User);
    console.log("Organizer registration:", user);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <UserCircle className="w-4 h-4" />
            Full Name
          </Label>
          <Input
            id="name"
            placeholder="Enter your full name"
            {...register("name")}
            className={clsx(
              errors.name && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="organizer@gmail.com"
            {...register("email")}
            className={clsx(
              errors.email && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a strong password"
            {...register("password")}
            className={clsx(
              errors.password && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="0979555080"
            {...register("phone")}
            className={clsx(
              errors.phone && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full h-11 text-base font-semibold">
        {isRegisteringUser && <Loader2 className="w-4 h-4 animate-spin" />}
        {isRegisteringUser ? "Creating Account..." : "Create Account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={ROUTES.LOGIN}
          className="text-primary hover:underline font-medium"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
