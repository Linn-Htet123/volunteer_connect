/* eslint-disable @typescript-eslint/no-explicit-any */
import { TaskStatus, VolunteerTaskStatus } from "@/enum/task";
import { User } from "./user";

export interface Volunteer {
  id: number;
  date_of_birth: string;
  address: string;
  emergency_contact: string;
  onboarding_status: string;
  user: User;
}

export interface VolunteerTaskAssignment {
  id: number;
  volunteer: Volunteer;
  assigned_at: string;
  status: VolunteerTaskStatus;
}

export interface TaskForVolunteer {
  [x: string]: any;
  id: number;
  title: string;
  description?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  status: TaskStatus;
  volunteerStatus?: VolunteerTaskStatus | null;
  assigned_at?: string | null;
  volunteer?: Volunteer | null;
}
