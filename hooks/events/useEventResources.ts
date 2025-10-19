import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";
import { AxiosError } from "axios";

export type EventResource = {
  id: number;
  name: string;
  path: string;
  size?: number;
  mimeType?: string;
  uploaderId?: number;
  uploadedAt?: string;
  createdAt: string;
};

// Fetch resources for an event
const fetchEventResources = async (
  eventId: number
): Promise<EventResource[]> => {
  const { data } = await api.get(`/event-resources/list/${eventId}`);
  return data;
};

// Upload a new resource - FIXED ENDPOINT AND DATA STRUCTURE
const uploadEventResource = async (eventId: number, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("eventId", String(eventId));

  const { data } = await api.post("/event-resources/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const useEventResources = (eventId: number) => {
  return useQuery({
    queryKey: ["event-resources", eventId],
    queryFn: () => fetchEventResources(eventId),
    enabled: !!eventId, // Only fetch if eventId is provided
  });
};

export const useUploadEventResource = (eventId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadEventResource(eventId, file),
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Upload failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-resources", eventId] });
      toast.success("File uploaded successfully");
    },
  });
};
