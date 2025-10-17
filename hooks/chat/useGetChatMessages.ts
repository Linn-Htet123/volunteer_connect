import { KEYS } from "@/config/queryKey";
import { ChatMessage } from "@/interfaces/chat";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetChatMessages = (eventId: number) => {
  return useQuery({
    queryKey: [KEYS.chat.messages(eventId)],
    queryFn: async (): Promise<ChatMessage[]> => {
      const { data } = await api.get<ChatMessage[]>(`/chat/${eventId}`);
      return data;
    },
  });
};
