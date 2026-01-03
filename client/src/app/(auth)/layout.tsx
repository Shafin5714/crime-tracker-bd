import React from 'react';
import Image from 'next/image';
import { Shield } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side - Form */}
      <div className="flex w-full flex-col justify-center bg-background px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
            {children}
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex w-1/2 bg-blue-700 relative overflow-hidden items-center justify-center text-white">
        {/* Abstract Map Background Simulation using CSS */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#ffffff 1px, transparent 1px)',
                backgroundSize: '30px 30px',
                backgroundPosition: '0 0, 15px 15px',
            }}></div>
            {/* Adding some "street" lines for map effect */}
             <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,100 Q400,150 800,100 T1600,100" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.3" />
                <path d="M0,300 Q400,350 800,300 T1600,300" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.3" />
                <path d="M100,0 Q150,400 100,800" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.3" />
                <path d="M500,0 Q550,400 500,800" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.3" />
             </svg>
        </div>
        
        <div className="absolute inset-0 bg-linear-to-t from-blue-900/80 to-blue-600/20 mix-blend-multiply"></div>

        <div className="relative z-10 p-12 max-w-lg">
             <div className="mb-8 p-4 rounded-2xl bg-white/10 backdrop-blur-md w-fit shadow-xl border border-white/10">
                <Shield className="h-10 w-10 text-white" />
             </div>
             <blockquote className="text-3xl font-semibold leading-relaxed tracking-tight">
               "Empowering Bangladesh with real-time crime data. Together we build safer communities."
             </blockquote>
             <div className="mt-8 flex items-center gap-3">
                <div className="h-1 w-12 bg-white/50 rounded-full"></div>
                <span className="text-sm font-medium tracking-wide uppercase text-blue-100">Crime Tracker BD Initiative</span>
             </div>
        </div>
      </div>
    </div>
  );
}
