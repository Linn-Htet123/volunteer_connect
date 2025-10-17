export interface ChatSender {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  date_of_birth: string; // ISO date string
  address: string;
  emergency_contact: string;
  onboarding_status: string;
}

export interface ChatMessage {
  id: number;
  content: string;
  created_at: string; // ISO date string
  sender: ChatSender;
}
