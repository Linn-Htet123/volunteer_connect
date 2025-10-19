import { Providers } from "@/providers/Providers";
import { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/common/Navbar";

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
          {/* Since there are only two menu items, a simple top navbar is sufficient */}
          <div className="flex flex-col w-full">
            <Navbar />
            <main className="w-full p-4">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
