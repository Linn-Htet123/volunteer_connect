import { Home, Users } from "lucide-react";
import { ROUTES } from "./routes";

export const items = [
  {
    title: "Campaign",
    url: ROUTES.CAMPAIGN,
    icon: Home,
  },
  {
    title: "My Campaigns",
    url: ROUTES.MY_CAMPAIGN,
    icon: Users,
  },
];
