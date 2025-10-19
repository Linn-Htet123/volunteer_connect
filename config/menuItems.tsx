import { Home, Users } from "lucide-react";
import { ROUTES } from "./routes";
import { Roles } from "@/enum/role";

export const items = [
  {
    title: "Campaigns",
    url: ROUTES.ORG_CAMPAIGN,
    icon: Home,
    role: Roles.Organizer,
  },
  {
    title: "My Campaigns",
    url: ROUTES.ORG_MY_CAMPAIGN,
    icon: Users,
    role: Roles.Organizer,
  },
  {
    title: "Campaigns",
    url: ROUTES.CAMPAIGN,
    icon: Home,
    role: Roles.Volunteer,
  },
  {
    title: "My Campaigns",
    url: ROUTES.MY_CAMPAIGN,
    icon: Users,
    role: Roles.Volunteer,
  },
];
