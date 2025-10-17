import { User } from "./user";

export interface Event {
  id: number;
  name: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  image_url: string;
  map_url: string;
  created_by: User;
  status?: string;
  created_at: string;
  capacity: number;
  totalApproved?: number;
}

export type Events = Event[];
