export const ENV = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  IMAGE_BASE_URL: process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:3000",
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
} as const;
