import { z } from "zod";

export const volunteerSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(8, "Phone number is required"),
  date_of_birth: z.string().nonempty("Date of birth is required"),
  address: z.string().nonempty("Address is required"),
  emergency_contact: z.string().nonempty("Emergency contact is required"),
});

export type VolunteerFormData = z.infer<typeof volunteerSchema>;
