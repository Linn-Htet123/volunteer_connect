/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState, useRef } from "react";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";

const API_URL = "http://localhost:3000";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRsaC5saW5uaHRldEBnbWFpbC5jb20iLCJzdWIiOjgsInJvbGUiOiJPcmdhbml6ZXIiLCJwaG9uZSI6IjA5Nzk1NTUwODAiLCJ1c2VybmFtZSI6ImxhcnJ5IiwiaWF0IjoxNzYwNTM3MzY0LCJleHAiOjE3NjA2MjM3NjR9.fz_WsK_Jbo6PnI2e6zCZt6Km8KnGWqY90EyGMD_ke48";

interface Sender {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  date_of_birth?: string;
  address?: string;
  emergency_contact?: string;
  onboarding_status?: string;
}

interface Message {
  id?: number;
  sender: Sender;
  content: string;
  created_at: string;
}

export default function ChatPage() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [eventId, setEventId] = useState<number | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // 🔹 Fetch chat history from REST API
  const fetchMessages = async (eventId: number) => {
    try {
      const res = await fetch(`${API_URL}/api/chat/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("❌ Failed to fetch messages:", error);
      setMessages([]);
    }
  };

  // 🔹 Connect to Socket when eventId is set
  useEffect(() => {
    if (!eventId) return;

    fetchMessages(eventId);

    const socket = io(`${API_URL}/chat`, {
      auth: { token: `Bearer ${token}` },
      autoConnect: false,
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
      setConnected(true);
      socket.emit("joinEvent", { eventId });
    });

    socket.on("joined", (data: { eventId: number }) => {
      console.log(`✅ Joined event room: ${data.eventId}`);
    });

    socket.on("message", (msg: any) => {
      console.log("💬 Received message:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("error", (err: any) => {
      console.error("⚠️ Socket error:", err);
    });

    socket.on("disconnect", (reason: any) => {
      console.log("❌ Disconnected:", reason);
      setConnected(false);
    });

    socket.on("connect_error", (err: any) => {
      console.error("❌ Connection error:", err.message);
    });

    socket.connect();

    return () => {
      socket.disconnect();
      socket.off();
      setConnected(false);
    };
  }, [eventId]);

  const sendMessage = () => {
    if (!message.trim()) return console.warn("⚠️ Empty message");
    if (!socketRef.current?.connected)
      return console.error("❌ Socket not connected");
    if (!eventId) return console.error("⚠️ No event selected");

    const payload = { eventId, content: message };
    socketRef.current.emit("sendMessage", payload);
    setMessage("");
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-3 text-center">
        🧩 Group Chat {connected ? "🟢" : "🔴"}
      </h2>

      <div className="flex gap-2 mb-4">
        <input
          type="number"
          value={eventId ?? ""}
          onChange={(e) =>
            setEventId(e.target.value ? Number(e.target.value) : null)
          }
          placeholder="Enter event ID..."
          className="border p-2 flex-1 rounded-lg shadow-sm"
        />
        <button
          onClick={() => eventId && fetchMessages(eventId)}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg"
        >
          Load
        </button>
      </div>

      <div className="border rounded-lg h-[500px] overflow-y-auto p-3 bg-gray-50 mb-3 shadow-inner">
        {messages.length === 0 ? (
          <div className="text-gray-400 text-center mt-20">
            {eventId ? "No messages yet" : "Enter an event ID to start"}
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className="mb-3 bg-white shadow-sm p-3 rounded-lg border border-gray-200"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-blue-700">
                  {msg.sender?.name || "Unknown"}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(msg.created_at).toLocaleString()}
                </span>
              </div>

              <p className="text-gray-800 mb-2">{msg.content}</p>

              <div className="text-xs text-gray-600 space-y-0.5">
                <div>
                  <strong>Email:</strong> {msg.sender?.email || "N/A"}
                </div>
                <div>
                  <strong>Phone:</strong> {msg.sender?.phone || "N/A"}
                </div>
                <div>
                  <strong>Role:</strong> {msg.sender?.role || "N/A"}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {eventId && (
        <div className="flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="border p-2 flex-1 rounded-lg shadow-sm"
          />
          <button
            onClick={sendMessage}
            disabled={!connected}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
          >
            Send
          </button>
        </div>
      )}

      <div className="mt-2 text-xs text-gray-500 text-center">
        Socket ID: {socketRef.current?.id || "Not connected"}
      </div>
    </div>
  );
}
