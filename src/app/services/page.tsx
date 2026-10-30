'use client';

import React from 'react';
import Link from 'next/link';
import { 
  KeyRound, 
  Ticket, 
  CreditCard, 
  HelpCircle,
  LayoutGrid,
  ShieldCheck,
  Building
} from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      name: 'Access Token',
      description: 'Retrieve your active WiFi connection 10-digit coupon code.',
      href: '/passes',
      icon: KeyRound,
      color: 'text-blue-500 bg-blue-50 border-blue-100'
    },
    {
      name: 'Hub Booking',
      description: 'Book space in the workspace hub using available credits.',
      href: '/dashboard',
      icon: Ticket,
      color: 'text-emerald-500 bg-emerald-50 border-emerald-100'
    },
    {
      name: 'Wallet Funding',
      description: 'Fund your Naira wallet and convert instantly to credits.',
      href: '/wallet-fund-simulate', // Link or modal
      icon: CreditCard,
      color: 'text-purple-500 bg-purple-50 border-purple-100',
      action: () => alert('Please use the quick fund option on the dashboard or virtual account transfer.')
    },
    {
      name: 'Support & Inquiries',
      description: 'Contact chosen technologies staff for support.',
      href: '#',
      icon: HelpCircle,
      color: 'text-amber-500 bg-amber-50 border-amber-100',
      action: () => alert('Support portal is loading...')
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-blue-500" />
            <h1 className="font-heading font-bold text-lg tracking-tight">Hub Services</h1>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-heading font-bold text-slate-900 text-base mb-1">Available Services</h3>
          <p className="text-xs text-slate-400">Access features, tokens, and workspace services in one tap.</p>
        </div>

        <div className="space-y-4">
          {services.map((srv) => {
            const Icon = srv.icon;
            
            const content = (
              <div 
                className="bg-white rounded-2xl p-4 border border-slate-100 hover:border-blue-200 shadow-sm flex gap-4 items-center transition-all cursor-pointer"
                onClick={srv.action ? srv.action : undefined}
              >
                <div className={`h-12 w-12 rounded-2xl border flex items-center justify-center shrink-0 ${srv.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-slate-900 text-sm">{srv.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{srv.description}</p>
                </div>
              </div>
            );

            if (srv.href === '#') {
              return <div key={srv.name}>{content}</div>;
            }

            return (
              <Link key={srv.name} href={srv.href} className="block">
                {content}
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
