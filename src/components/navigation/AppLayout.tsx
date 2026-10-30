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
    <>
      <div className="mobile-app min-h-screen bg-slate-50 flex flex-col">
        <div className={`flex-1 ${isNoShellRoute ? '' : 'pb-20'}`}>
          {children}
        </div>
        {!isNoShellRoute && <BottomNav />}
      </div>
      <main className="wide-screen-message" aria-label="Mobile device required">
        <div className="wide-screen-card">
          <div className="wide-screen-icon" aria-hidden="true">↔</div>
          <p className="wide-screen-eyebrow">SK Cybernet</p>
          <h1>Made for mobile</h1>
          <p className="wide-screen-copy">
            Open this app on a mobile device or tablet for the best experience.
          </p>
        </div>
      </main>
    </>
  );
}
