import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  id: number;
  email: string;
  role: string;
  exp: number;
}

export const getUserFromToken = (): TokenPayload | null => {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode<TokenPayload>(token);

    // Check if token expired
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("authToken");
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
};
