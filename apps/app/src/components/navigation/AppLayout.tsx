'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import BottomNav from './BottomNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  // Define routes that should NOT display the application navigation shell (auth, onboarding)
  const isNoShellRoute = 
    !mounted ||
    pathname === '/login' || 
    pathname === '/register' || 
    pathname?.startsWith('/onboarding');

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col ${isNoShellRoute ? '' : 'pb-20'}`}>
      <div className="flex-1">
        {children}
      </div>
      {!isNoShellRoute && <BottomNav />}
    </div>
  );
}
