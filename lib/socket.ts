import io from "socket.io-client";

// You can export a single socket instance to reuse
export const socket = io("http://localhost:3000/chat", {
  auth: {
    token:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRsaC5saW5uaHRldEBnbWFpbC5jb20iLCJzdWIiOjgsInJvbGUiOiJPcmdhbml6ZXIiLCJwaG9uZSI6IjA5Nzk1NTUwODAiLCJ1c2VybmFtZSI6ImxhcnJ5IiwiaWF0IjoxNzYwNDcyMzExLCJleHAiOjE3NjA1NTg3MTF9.C1vLdUK70FqiTEnPxxoSVkxVTCKl8T0Q_IcM4cv7f5o", // use your real token from login
  },
  autoConnect: false, // we’ll connect manually
});
