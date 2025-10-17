import { Providers } from "@/providers/Providers";
import { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/app-sidebar";

export const metadata: Metadata = {
  title: "Volunteer Connect",
  description:
    "Volunteer Connect is a platform to connect volunteers with organizers.",
  keywords: "volunteer, organizer, connect, events, community",
  authors: [{ name: "Thar Lin Htet", url: "" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        <Providers>
          <AppSidebar />
          {/* <SidebarTrigger /> */}
          <main className="w-full">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
