"use client";
import React, { useEffect, useState, useRef } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useGetChatMessages } from "@/hooks/chat/useGetChatMessages";
import { useAuthStore } from "@/store/auth.store";
import { ChatMessage } from "@/interfaces/chat";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { ENV } from "@/config/env";

const ChatRoom = ({ eventId }: { eventId: number }) => {
  const { data, refetch } = useGetChatMessages(eventId);
  const { authUser } = useAuthStore();
  const [message, setMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { token } = useAuthStore();

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  // Connect to Socket when eventId is set
  useEffect(() => {
    if (!eventId) return;

    const socket = io(`${ENV.API_BASE_URL}/chat`, {
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

    socket.on("message", (msg: ChatMessage) => {
      console.log("💬 Received message:", msg);
      refetch(); // Refetch messages when new message arrives
    });

    socket.on("error", (err: unknown) => {
      console.error("⚠️ Socket error:", err);
    });

    socket.on("disconnect", (reason: string) => {
      console.log("❌ Disconnected:", reason);
      setConnected(false);
    });

    socket.on("connect_error", (err: Error) => {
      console.error("❌ Connection error:", err.message);
    });

    socket.connect();

    return () => {
      socket.disconnect();
      socket.off();
      setConnected(false);
    };
  }, [eventId, refetch]);

  const sendMessage = () => {
    if (!message.trim()) return;
    if (!socketRef.current?.connected) return;
    if (!eventId) return;

    const payload = { eventId, content: message };
    socketRef.current.emit("sendMessage", payload);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className="flex flex-col bg-background border rounded-lg shadow-sm"
      style={{
        minHeight: "500px",
        maxHeight: "500px",
      }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b bg-card">
        <h1 className="text-lg font-semibold text-foreground">Chat Room</h1>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              connected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-xs text-muted-foreground">
            {connected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-3">
        {data && data.length > 0 ? (
          <>
            {data.map((msg: ChatMessage) => {
              const isCurrentUser = msg.sender?.id === authUser?.id;

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${
                    isCurrentUser ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage
                      src="/placeholder-user.jpg"
                      alt={msg.sender?.name ?? "User"}
                    />
                    <AvatarFallback>
                      {msg.sender?.name?.charAt(0).toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div
                    className={`flex flex-col max-w-[70%] ${
                      isCurrentUser ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`px-3 py-2 rounded-2xl text-sm break-words ${
                        isCurrentUser
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-muted text-foreground rounded-bl-sm"
                      }`}
                    >
                      <p>{msg.content}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1 px-1">
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <p className="text-center text-muted-foreground text-sm">
            No messages yet.
          </p>
        )}
      </main>

      {/* Footer Input */}
      <footer className="flex items-center gap-2 p-3 border-t bg-card">
        <Input
          className="flex-1"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={!connected}
        />
        <Button
          size="sm"
          className="font-medium"
          onClick={sendMessage}
          disabled={!connected || !message.trim()}
        >
          Send
        </Button>
      </footer>
    </div>
  );
};

export default ChatRoom;
