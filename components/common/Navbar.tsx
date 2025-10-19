"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { items } from "@/config/menuItems";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { authUser, clearAuth } = useAuthStore(); // add clearAuth
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = items.filter((item) => item.role === authUser?.role);

  const handleLogout = () => {
    clearAuth(); // clears authUser and token from store/localStorage
    router.push("/login"); // redirect to login page
  };

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                V
              </span>
            </div>
            <span className="font-semibold text-lg">Volunteer Connect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.url;

                return (
                  <Link key={item.url} href={item.url}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "flex items-center gap-2",
                        isActive && "bg-secondary"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.title}
                    </Button>
                  </Link>
                );
              })}
            </div>

            {/* User Info + Logout */}
            {authUser && (
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium cursor-pointer">
                        <User className="h-4 w-4" />
                        <div className="flex flex-col text-left">
                          <span className="font-semibold text-foreground">
                            {authUser.name || "Unknown User"}
                          </span>
                        </div>
                        <div className="ml-3 px-2 py-0.5 rounded-full bg-primary text-white text-xs font-semibold">
                          {authUser.role}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{authUser.email}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Logout Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" /> Logout
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t">
            {authUser && (
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                <User className="h-4 w-4" />
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-foreground">
                    {authUser.name || "Unknown User"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {authUser.email}
                  </span>
                  <span className="text-xs font-semibold text-primary mt-1">
                    {authUser.role}
                  </span>
                </div>
              </div>
            )}

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.url;

              return (
                <Link
                  key={item.url}
                  href={item.url}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-2",
                      isActive && "bg-secondary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Button>
                </Link>
              );
            })}

            {/* Mobile Logout */}
            {authUser && (
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center gap-2 justify-start"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
