'use client';
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';
// import NavbarUse from "@/components/Navbar";
import SessionWrapper from '@/components/SessionWrapper'
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from '@/app/context/Userinfo';
import GetUserInfo from '@/components/GetUserInfo'; 
import { RoadmapProvider } from "@/app/context/RoadmapContext";
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from './context/AuthContext';
// import ChatAssistant from "@/components/search/ChatAssistant";
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Adjust the delay as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">

      <body
        className={`antialiased dark`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center min-h-screen">
           <Image src="/logo.png" alt="logo" width={100} height={100} />
           <h1 className="text-2xl font-bold">Loading...</h1>
          </div>
        ) : (
          <SessionProvider>
            <AuthProvider>
              <UserProvider>
                <RoadmapProvider>
                  <main className="bg-black min-h-screen">
                    <SessionWrapper>
                      <GetUserInfo />
                      <div className="relative z-10 overflow-auto">
                        {children}
                        <Analytics />
                      </div>
                    </SessionWrapper>
                  </main>
                  <Toaster />
                </RoadmapProvider>

                </UserProvider>
            </AuthProvider>
          </SessionProvider>
        )}
      </body>
    </html>
  );
}
