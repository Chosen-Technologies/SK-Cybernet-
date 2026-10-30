'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Ticket, LayoutGrid, Gift } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Passes', href: '/passes', icon: Ticket },
    { name: 'Services', href: '/services', icon: LayoutGrid },
    { name: 'Rewards', href: '/rewards', icon: Gift },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800 px-4 py-2 flex justify-around items-center text-slate-400">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all duration-200 ${
              isActive ? 'text-blue-500 scale-105 font-semibold' : 'hover:text-white'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] uppercase tracking-wider">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
