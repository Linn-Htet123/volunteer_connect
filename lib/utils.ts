import { ENV } from "@/config/env";
import { AuthUser, User } from "@/interfaces/user";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getImageUrl = (image?: string): string => {
  if (!image) return "";

  if (!ENV.IMAGE_BASE_URL) {
    throw new Error("IMAGE_BASE_URL is not defined in ENV");
  }

  return image.startsWith("http")
    ? image
    : `${ENV.IMAGE_BASE_URL.replace(/\/$/, "")}/${image.replace(/^\//, "")}`;
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export function flattenUser(user: User | Partial<User>): AuthUser | null {
  if (!user) return null;

  const { volunteer, ...rest } = user;

  // Merge volunteer fields at top level, exclude nested volunteer.user.passwordHash
  const flatVolunteer = volunteer
    ? {
        volunteerId: volunteer.id,
        date_of_birth: volunteer.date_of_birth,
        address: volunteer.address,
        emergency_contact: volunteer.emergency_contact,
        onboarding_status: volunteer.onboarding_status,
        event_volunteers: volunteer.event_volunteers,
      }
    : {};

  return {
    ...rest,
    ...flatVolunteer,
  } as AuthUser;
}
