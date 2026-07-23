'use client';

import React, { useState } from 'react';
import { useAuth } from '@/features/auth/auth-context';
import { 
  Ticket, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Wifi, 
  QrCode, 
  ArrowLeft, 
  Copy, 
  Check, 
  Info 
} from 'lucide-react';

interface BookingPass {
  id: string;
  passId: string;
  tierName: string;
  creditsConsumed: number;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'checked_in' | 'cancelled' | 'expired' | 'refunded';
  couponCode?: string;
}

export default function PassesPage() {
  const { user } = useAuth();
  const [selectedPass, setSelectedPass] = useState<BookingPass | null>(null);
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [filter, setFilter] = useState<'active' | 'history'>('active');

  // Simulated bookings data
  const [bookings, setBookings] = useState<BookingPass[]>([
    {
      id: 'b-001',
      passId: 'CYB-73928',
      tierName: 'Weekly Hub Access',
      creditsConsumed: 25.0,
      startDate: '2026-07-20',
      endDate: '2026-07-27',
      status: 'confirmed'
    },
    {
      id: 'b-002',
      passId: 'CYB-81023',
      tierName: 'Daily Hub Access',
      creditsConsumed: 5.0,
      startDate: '2026-07-21',
      endDate: '2026-07-22',
      status: 'checked_in',
      couponCode: '8392740192'
    },
    {
      id: 'b-003',
      passId: 'CYB-19283',
      tierName: 'Monthly Hub Access',
      creditsConsumed: 80.0,
      startDate: '2026-06-01',
      endDate: '2026-07-01',
      status: 'expired',
      couponCode: '1092837482'
    },
    {
      id: 'b-004',
      passId: 'CYB-48192',
      tierName: 'Daily Hub Access',
      creditsConsumed: 5.0,
      startDate: '2026-05-15',
      endDate: '2026-05-16',
      status: 'refunded'
    }
  ]);

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2000);
  };

  const handleSimulateCheckIn = (passId: string) => {
    setBookings(prev => prev.map(b => {
      if (b.passId === passId) {
        return {
          ...b,
          status: 'checked_in',
          couponCode: Math.floor(1000000000 + Math.random() * 9000000000).toString()
        };
      }
      return b;
    }));
    
    // Update the selected modal view if open
    setSelectedPass(prev => {
      if (prev && prev.passId === passId) {
        return {
          ...prev,
          status: 'checked_in',
          couponCode: Math.floor(1000000000 + Math.random() * 9000000000).toString()
        };
      }
      return prev;
    });
  };

  const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'checked_in' || b.status === 'pending');
  const historicalBookings = bookings.filter(b => b.status === 'expired' || b.status === 'cancelled' || b.status === 'refunded');
  
  const displayedBookings = filter === 'active' ? activeBookings : historicalBookings;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-blue-500" />
            <h1 className="font-heading font-bold text-lg tracking-tight">My Passes</h1>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Toggle Filters */}
        <div className="flex bg-slate-200 p-1 rounded-xl">
          <button
            onClick={() => setFilter('active')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              filter === 'active' 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active & Upcoming ({activeBookings.length})
          </button>
          <button
            onClick={() => setFilter('history')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              filter === 'history' 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            History ({historicalBookings.length})
          </button>
        </div>

        {/* List of Passes */}
        <div className="space-y-4">
          {displayedBookings.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center space-y-3">
              <Ticket className="h-10 w-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-500">No passes found</p>
              <p className="text-xs text-slate-400">You don't have any bookings in this category.</p>
            </div>
          ) : (
            displayedBookings.map((pass) => {
              const isCheckedIn = pass.status === 'checked_in';
              const statusLabel = pass.status.replace('_', ' ');

              return (
                <div 
                  key={pass.id}
                  onClick={() => setSelectedPass(pass)}
                  className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:border-blue-200 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{pass.passId}</span>
                      <h4 className="font-heading font-bold text-slate-900 text-base mt-0.5">{pass.tierName}</h4>
                    </div>
                    
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                      pass.status === 'confirmed' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      pass.status === 'checked_in' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      pass.status === 'expired' ? 'bg-slate-50 text-slate-600 border-slate-200' :
                      'bg-red-50 text-red-700 border-red-100'
                    }`}>
                      {statusLabel}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500 border-t border-slate-50 pt-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{pass.startDate} to {pass.endDate}</span>
                    </div>
                    <div className="text-right font-semibold text-slate-700">
                      Cost: {pass.creditsConsumed.toFixed(1)} CR
                    </div>
                  </div>

                  {/* Checked-in details (Auto-generated Internet access coupon code display) */}
                  {isCheckedIn && pass.couponCode && (
                    <div className="mt-3 bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-emerald-800">
                        <Wifi className="h-4 w-4" />
                        <div className="text-left">
                          <span className="block text-[8px] uppercase tracking-wider font-bold">WiFi Coupon Code</span>
                          <span className="font-bold text-sm tracking-widest">{pass.couponCode}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase">Checked In</span>
                    </div>
                  )}

                  {/* QR scanning hint if active but not checked-in */}
                  {pass.status === 'confirmed' && (
                    <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <QrCode className="h-4 w-4 text-slate-400" />
                        Tap to reveal check-in QR
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSimulateCheckIn(pass.passId);
                        }}
                        className="text-[10px] font-bold text-blue-600 hover:underline"
                      >
                        Simulate Check-In
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Detailed QR Pass Modal */}
        {selectedPass && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 p-4">
            <div className="bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl p-6 shadow-xl space-y-6 relative border border-slate-100">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">{selectedPass.passId}</span>
                  <h3 className="font-heading font-bold text-slate-900 text-lg">{selectedPass.tierName}</h3>
                </div>
                <button
                  onClick={() => setSelectedPass(null)}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600"
                >
                  Close
                </button>
              </div>

              {/* Pass details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs text-slate-500">
                  <div>
                    <span className="block text-[9px] font-semibold text-slate-400 uppercase">Valid From</span>
                    <span className="font-semibold text-slate-800">{selectedPass.startDate}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-semibold text-slate-400 uppercase">Valid Until</span>
                    <span className="font-semibold text-slate-800">{selectedPass.endDate}</span>
                  </div>
                </div>

                {/* QR Code Container */}
                {selectedPass.status === 'confirmed' || selectedPass.status === 'pending' ? (
                  <div className="bg-slate-50 rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 border border-slate-100">
                    <div className="h-44 w-44 bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-center shadow-inner relative">
                      {/* Stylized CSS QR Code Vector */}
                      <div className="w-full h-full border-4 border-slate-900 p-1 flex flex-wrap gap-1">
                        <div className="w-10 h-10 bg-slate-900 border-2 border-white"></div>
                        <div className="w-10 h-10 bg-transparent flex flex-wrap gap-1">
                          <div className="w-4 h-4 bg-slate-900"></div>
                          <div className="w-4 h-4 bg-slate-900"></div>
                        </div>
                        <div className="w-10 h-10 bg-slate-900 border-2 border-white ml-auto"></div>
                        <div className="w-full flex justify-between">
                          <div className="w-8 h-8 bg-slate-900"></div>
                          <div className="w-8 h-8 bg-slate-900"></div>
                        </div>
                        <div className="w-10 h-10 bg-slate-900 border-2 border-white mt-auto"></div>
                        <div className="w-10 h-10 bg-slate-900 mt-auto ml-auto"></div>
                      </div>
                    </div>
                    <p className="text-[10px] text-center text-slate-500">
                      Present this QR code to the admin at the desk upon arrival to scan and check in.
                    </p>
                    <button
                      onClick={() => handleSimulateCheckIn(selectedPass.passId)}
                      className="py-1.5 px-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Simulate Scanner Scan
                    </button>
                  </div>
                ) : selectedPass.status === 'checked_in' && selectedPass.couponCode ? (
                  <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 text-center space-y-4">
                    <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <Wifi className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-emerald-900 text-base">Internet Coupon Generated</h4>
                      <p className="text-[11px] text-emerald-700 mt-1">
                        Use the 10-digit coupon code below to authenticate and access the hub internet connection.
                      </p>
                    </div>

                    <div className="bg-white rounded-xl border border-emerald-200 py-4 px-3 flex justify-between items-center">
                      <span className="font-mono text-xl font-bold text-slate-900 tracking-[0.2em] pl-3">
                        {selectedPass.couponCode}
                      </span>
                      <button
                        onClick={() => copyCoupon(selectedPass.couponCode!)}
                        className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                        aria-label="Copy Wifi Coupon"
                      >
                        {copiedCoupon ? <Check className="h-5 w-5 text-emerald-600" /> : <Copy className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-100 rounded-2xl p-6 text-center text-slate-500 border border-slate-200 text-xs">
                    This pass is {selectedPass.status} and cannot be scanned.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
