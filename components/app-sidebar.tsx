"use client";
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
import { useAuthStore } from "@/store/auth.store";

export function AppSidebar() {
  const { authUser } = useAuthStore();
  console.log(authUser);
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
              {authUser?.role}
            </span>
          </CardContent>
        </Card>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isShow = item.role === authUser?.role;
                return isShow ? (
                  <SidebarMenuItem key={item.title} className="text-base">
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span className="text-base">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : null;
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
