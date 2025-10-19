/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Volunteer {
  id?: number;
  user_id: number;
  date_of_birth: string;
  address: string;
  emergency_contact: string;
  onboarding_status?: string;
  event_volunteers?: any;
}

export interface VolunteerInEvent {
  value: number;
  label: string;
  status: "Pending" | "Approved" | "Rejected" | "Completed";
}
