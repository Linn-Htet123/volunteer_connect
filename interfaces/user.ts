/* eslint-disable @typescript-eslint/no-explicit-any */
import { Roles } from "@/enum/role";
import { Volunteer } from "./volunteer";

export interface User {
  id?: number;
  name: string;
  email: string;
  role?: Roles;
  password?: string;
  phone: string;
  access_token?: string;
  volunteer?: Volunteer;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: Roles;
  createdAt: string;
  updatedAt: string;

  volunteerId?: number;
  date_of_birth?: string;
  address?: string;
  emergency_contact?: string;
  onboarding_status?: string;
  event_volunteers?: any[];
}
