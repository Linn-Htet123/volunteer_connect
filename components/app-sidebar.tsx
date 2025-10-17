import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { items } from "@/config/menuItems";
import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="px-3 py-2 border-b border-border/50">
        <Card className="w-full h-14 flex items-center justify-center bg-transparent shadow-none border-none">
          <CardContent className="flex items-center justify-center gap-2 p-0">
            <Image
              src="/volunteer.png"
              alt="Volunteer Connect Logo"
              width={32}
              height={32}
              className="rounded-sm"
            />
            <span className="text-lg font-semibold tracking-wide text-foreground">
              Volunteer Connect
            </span>
          </CardContent>
        </Card>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
