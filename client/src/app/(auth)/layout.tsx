"use client";

import React from "react";
import Image from "next/image";
import { Shield } from "lucide-react";
import { GuestRoute } from "@/components/auth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuestRoute>
      <div className="flex min-h-screen w-full">
        {/* Left Side - Form */}
        <div className="flex w-full flex-col justify-center bg-background px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">{children}</div>
        </div>

        {/* Right Side - Visual */}
        <div className="hidden lg:flex w-1/2 bg-muted relative overflow-hidden items-center justify-center text-white">
          <div className="absolute inset-0">
            <Image
              src="/images/auth-hero.png"
              alt="Auth Background"
              fill
              className="object-cover grayscale"
              priority
            />
          </div>

          <div className="absolute inset-0 bg-linear-to-t from-primary/90 to-primary/40 mix-blend-multiply"></div>

          <div className="relative z-10 p-12 max-w-lg">
            <div className="mb-8 p-4 rounded-2xl bg-white/10 backdrop-blur-md w-fit shadow-xl border border-white/10">
              <Shield className="h-10 w-10 text-white" />
            </div>
            &quot;Empowering Bangladesh with real-time crime data. Together we
            build safer communities.&quot;
            <div className="mt-8 flex items-center gap-3">
              <div className="h-1 w-12 bg-white/50 rounded-full"></div>
              <span className="text-sm font-medium tracking-wide uppercase text-white/80">
                Crime Tracker BD Initiative
              </span>
            </div>
          </div>
        </div>
      </div>
    </GuestRoute>
  );
}
