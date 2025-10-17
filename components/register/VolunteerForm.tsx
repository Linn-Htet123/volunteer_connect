"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Mail,
  MapPin,
  Lock,
  Phone,
  UserCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import clsx from "clsx";
import { VolunteerFormData, volunteerSchema } from "@/validations/register";
import { useUserRegister } from "@/hooks/auth/useRegister";
import { Roles } from "@/enum/role";
import { User } from "@/interfaces/user";
import { useVolunteerRegister } from "@/hooks/auth/useVolunteerRegister";
import Link from "next/link";
import { ROUTES } from "@/config/routes";

export function VolunteerForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VolunteerFormData>({
    resolver: zodResolver(volunteerSchema),
  });

  const { mutateAsync: registerUser, isPending: isRegisteringUser } =
    useUserRegister(Roles.Volunteer);

  const { mutateAsync: registerVolunteer, isPending: isRegisteringVolunteer } =
    useVolunteerRegister();

  const isLoading = isRegisteringUser || isRegisteringVolunteer;

  const onSubmit = async (volunteerData: VolunteerFormData) => {
    try {
      // Wait for user registration to complete
      const user = await registerUser({
        name: volunteerData.name,
        email: volunteerData.email,
        password: volunteerData.password,
        phone: volunteerData.phone,
      } as User);

      await registerVolunteer({
        date_of_birth: volunteerData.date_of_birth,
        address: volunteerData.address,
        emergency_contact: volunteerData.emergency_contact,
        user_id: user.id!,
      });
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <UserCircle className="w-4 h-4" />
            Full Name
          </Label>
          <Input
            id="name"
            placeholder="John Doe"
            {...register("name")}
            className={clsx(errors.name && "border-red-500 focus:ring-red-500")}
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
            placeholder="volunteer@gmail.com"
            {...register("email")}
            className={clsx(
              errors.email && "border-red-500 focus:ring-red-500"
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
              errors.password && "border-red-500 focus:ring-red-500"
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
              errors.phone && "border-red-500 focus:ring-red-500"
            )}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* DOB */}
        <div className="space-y-2">
          <Label htmlFor="dob" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Date of Birth
          </Label>
          <Input
            id="dob"
            type="date"
            {...register("date_of_birth")}
            className={clsx(
              errors.date_of_birth && "border-red-500 focus:ring-red-500"
            )}
          />
          {errors.date_of_birth && (
            <p className="text-sm text-red-500">
              {errors.date_of_birth.message}
            </p>
          )}
        </div>

        {/* Emergency */}
        <div className="space-y-2">
          <Label htmlFor="emergency" className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Emergency Contact
          </Label>
          <Input
            id="emergency"
            placeholder="John Doe - 0897654321"
            {...register("emergency_contact")}
            className={clsx(
              errors.emergency_contact && "border-red-500 focus:ring-red-500"
            )}
          />
          {errors.emergency_contact && (
            <p className="text-sm text-red-500">
              {errors.emergency_contact.message}
            </p>
          )}
        </div>

        {/* Address */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Address
          </Label>
          <Input
            id="address"
            placeholder="123 Sukhumvit Road, Bangkok"
            {...register("address")}
            className={clsx(
              errors.address && "border-red-500 focus:ring-red-500"
            )}
          />
          {errors.address && (
            <p className="text-sm text-red-500">{errors.address.message}</p>
          )}
        </div>
      </div>

      {/* ✅ Button with loader */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 text-base font-semibold flex items-center justify-center gap-2"
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {isRegisteringUser
          ? "Creating Account..."
          : isRegisteringVolunteer
          ? "Volunteer Onboarding..."
          : "Create Account"}
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
