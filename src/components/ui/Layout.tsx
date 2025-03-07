"use client";

import { ReactNode } from 'react';
import { NavBar } from '@/components/ui/NavBar';
import { Footer } from '@/components/ui/Footer';

interface LayoutProps {
  children: ReactNode;
  isLoggedIn?: boolean;
  userName?: string;
  unreadNotifications?: number;
  showFullFooter?: boolean;
  showNavBar?: boolean;
}

export function Layout({
  children,
  isLoggedIn = false,
  userName = '',
  unreadNotifications = 0,
  showFullFooter = true,
  showNavBar = true,
}: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {showNavBar && (
        <NavBar
          isLoggedIn={isLoggedIn}
          userName={userName}
          unreadNotifications={unreadNotifications}
        />
      )}

      <main className="flex-grow">
        {children}
      </main>

      <Footer showFullFooter={showFullFooter} />
    </div>
  );
}