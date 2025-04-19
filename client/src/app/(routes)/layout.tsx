"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo/brand skeleton */}
          <div className="flex items-center justify-center mb-8">
            <div className="h-10 w-32 bg-neutral-800/70 rounded-lg animate-pulse"></div>
          </div>
          
          {/* Multiple pulse bars with different widths */}
          <div className="space-y-4 mb-8">
            {[80, 100, 60, 90, 75].map((width, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className={`h-4 bg-neutral-800/70 rounded-full animate-pulse`} style={{ width: `${width}%` }}></div>
              </div>
            ))}
          </div>
          
          {/* Pulsing dots */}
          <div className="flex items-center justify-center space-x-3">
            {[0, 1, 2].map((i) => (
              <div 
                key={i}
                className="h-3 w-3 rounded-full bg-blue-500/60"
                style={{
                  animation: `pulseDelay 1.5s ease-in-out ${i * 0.2}s infinite`
                }}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Add keyframes animation for the pulsing dots */}
        <style jsx global>{`
          @keyframes pulseDelay {
            0%, 100% { opacity: 0.3; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      {children}
    </div>
  );
} 