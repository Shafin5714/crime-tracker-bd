"use client";

import * as React from "react";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const { user, logout, logoutStatus, isAuthenticated } = useAuth();

  // Format user for Header/MobileNav components
  const formattedUser =
    isAuthenticated && user
      ? {
          id: user.id,
          name: user.name ?? "User",
          email: user.email,
          role: user.role as "USER" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN",
        }
      : null;

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        user={formattedUser}
        onLogout={handleLogout}
        logoutPending={logoutStatus.isPending}
        onMenuClick={() => setMobileNavOpen(true)}
      />
      <MobileNav
        open={mobileNavOpen}
        onOpenChange={setMobileNavOpen}
        user={formattedUser}
        onLogout={handleLogout}
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
