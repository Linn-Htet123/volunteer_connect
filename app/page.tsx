import { ROUTES } from "@/config/routes";
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect(ROUTES.CAMPAIGN);
}
