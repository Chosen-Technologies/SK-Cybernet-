'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/auth-context';
import { 
  Wallet, 
  ShieldAlert, 
  User, 
  Headphones, 
  Bell, 
  Ticket,
  Calendar,
  Lock,
  UploadCloud,
  CheckCircle,
  FileCheck,
  KeyRound,
  History,
  Coins,
  Share2,
  TrendingDown,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import BookingModal from '@/components/booking/BookingModal';

export default function DashboardPage() {
  const { user, loading, refreshUser } = useAuth();
  
  // Timer for welcome back text vs tier level
  const [showWelcomeBack, setShowWelcomeBack] = useState(true);

  // Simulated state for wallet & user data edits
  const [localCredits, setLocalCredits] = useState<number | null>(null);
  const [studentStatus, setStudentStatus] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<{ name: string; cost: number; duration: string } | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [isFunding, setIsFunding] = useState(false);

  // 20-second timer to switch header text from "Welcome back" to tier level
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeBack(false);
    }, 20000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-600 text-sm font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const currentCredits = localCredits !== null ? localCredits : (user.wallet?.availableCredits ?? 75.0);
  const currentStudentStatus = studentStatus !== null ? studentStatus : (user.studentStatus ?? 'unverified');
  const userTier = currentStudentStatus === 'verified' ? 'Student Discount Tier' : 'Standard Access Tier';

  // Transaction Ledger (mocked to represent 3 recent transactions)
  const recentTransactions = [
    { id: 'tx-1', type: 'fund', desc: 'Wallet Fund via Virtual Bank', time: '2026-07-21 14:32', amount: '+50.0 CR' },
    { id: 'tx-2', type: 'booking', desc: 'Weekly Hub Pass Purchase', time: '2026-07-20 09:15', amount: '-25.0 CR' },
    { id: 'tx-3', type: 'fund', desc: 'Paystack Card Settlement', time: '2026-07-18 18:01', amount: '+10.0 CR' }
  ];

  const subscriptionTiers = [
    {
      name: 'Daily Hub Pass',
      cost: 5.0,
      duration: '24 Hours Access',
      description: 'Ideal for quick project sessions and hot-desking.'
    },
    {
      name: 'Weekly Hub Pass',
      cost: currentStudentStatus === 'verified' ? 20.0 : 25.0,
      duration: '7 Days Access',
      description: 'Great for weekly sprints. Includes 20% student discount if verified.',
      studentDiscount: true
    },
    {
      name: 'Monthly Hub Pass',
      cost: currentStudentStatus === 'verified' ? 65.0 : 80.0,
      duration: '30 Days Access',
      description: 'Full workspace solution. Includes 20% student discount if verified.',
      studentDiscount: true
    }
  ];

  const handleSelectTier = (tier: typeof subscriptionTiers[0]) => {
    setSelectedTier(tier);
    setIsBookingOpen(true);
  };

  const handleConfirmBooking = async (pin: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (pin === '1234') {
          if (selectedTier) {
            setLocalCredits(prev => (prev !== null ? prev : currentCredits) - selectedTier.cost);
          }
          resolve();
        } else {
          reject(new Error('Incorrect Payment PIN. Try "1234" for mock checkout.'));
        }
      }, 1000);
    });
  };

  const handleUploadStudentId = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setTimeout(() => {
      setStudentStatus('pending_review');
      setIsUploading(false);
      setShowUploadModal(false);
    }, 1500);
  };

  const handleFundWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fundAmount || isNaN(Number(fundAmount)) || Number(fundAmount) <= 0) return;
    setIsFunding(true);
    setTimeout(() => {
      const addedCredits = Number(fundAmount) / 100; // 1 CR = 100 Naira
      setLocalCredits(prev => (prev !== null ? prev : currentCredits) + addedCredits);
      setIsFunding(false);
      setShowFundModal(false);
      setFundAmount('');
      alert(`Successfully added ${addedCredits.toFixed(1)} CR to your wallet!`);
    }, 1500);
  };

  // Google avatar image mockup or user picture
  const profileAvatarUrl = user.avatarUrl || 'https://lh3.googleusercontent.com/a/default-user=s96-c';

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      {/* Top Navbar */}
      <header className="bg-slate-900 text-white shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            {/* Google Profile Avatar */}
            <div className="h-10 w-10 rounded-full border border-slate-700 overflow-hidden shrink-0">
              <img 
                src={profileAvatarUrl} 
                alt="Profile Avatar" 
                className="h-full w-full object-cover"
                onError={(e) => {
                  // Fallback to initials if image load fails
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'User')}&background=3b82f6&color=fff`;
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 font-medium">
                {showWelcomeBack ? 'Welcome back' : userTier}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label="Contact support"
              className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Headphones className="h-4 w-4" />
            </button>
            <button
              aria-label="Notifications"
              className="relative h-9 w-9 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-500"></span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Verification banner if applicable */}
        {currentStudentStatus === 'unverified' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 shadow-sm">
            <ShieldAlert className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-amber-800">Student Discount Eligibility</h4>
              <p className="text-xs text-amber-700 mt-0.5">
                Verify your student credentials to save up to 20% on Weekly and Monthly hub subscription passes.
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="mt-3 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 py-1.5 px-3 rounded-lg border border-amber-200 transition-colors"
              >
                Upload Student ID Card
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Balance Main Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 h-32 w-32 rounded-full bg-blue-500 opacity-10 filter blur-xl"></div>
          
          <div className="space-y-4">
            <div>
              {/* User Legal Full Name (Small) */}
              <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                {user.fullName}
              </span>
              
              <h3 className="text-4xl font-bold font-heading mt-1 tracking-tight">
                {currentCredits.toFixed(1)} <span className="text-lg font-medium text-slate-400">CR</span>
              </h3>
            </div>
            
            {/* Quick Actions (Fund Wallet, History) */}
            <div className="flex gap-3 border-t border-slate-800 pt-4 mt-2">
              <button
                onClick={() => setShowFundModal(true)}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-blue-500 shadow-sm"
              >
                <Wallet className="h-3.5 w-3.5" />
                Fund Wallet
              </button>
              <a
                href="#transactions-ledger"
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-slate-700 shadow-sm"
              >
                <History className="h-3.5 w-3.5" />
                History
              </a>
            </div>
          </div>
        </div>

        {/* Services Grid Tile */}
        <div className="space-y-3">
          <h4 className="font-heading font-bold text-slate-900 text-sm">Workspace Services</h4>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Access Token Service */}
            <a 
              href="/passes"
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center hover:border-blue-200 transition-all cursor-pointer space-y-2"
            >
              <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500">
                <KeyRound className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-slate-800">Access Token</span>
            </a>

            {/* Hub Booking Service */}
            <button 
              onClick={() => handleSelectTier(subscriptionTiers[0])}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center hover:border-blue-200 transition-all cursor-pointer space-y-2"
            >
              <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500">
                <Ticket className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-slate-800">Hub Booking</span>
            </button>
          </div>

          {/* Cashbacks and Referrals Grid */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            {/* Cashbacks Tile */}
            <a 
              href="/rewards"
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center hover:border-blue-200 transition-all cursor-pointer space-y-2"
            >
              <div className="h-10 w-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-500">
                <Coins className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-slate-800">Cashbacks</span>
              <span className="text-[10px] text-slate-400">Earned Rewards</span>
            </a>

            {/* Referrals Tile */}
            <a 
              href="/rewards"
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center hover:border-blue-200 transition-all cursor-pointer space-y-2"
            >
              <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
                <Share2 className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-slate-800">Referrals</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1 py-0.5 rounded">
                +20.0 CR
              </span>
            </a>
          </div>
        </div>

        {/* Hub Passes pricing list */}
        <div className="space-y-4 pt-2">
          <h4 className="font-heading font-bold text-slate-900 text-sm">Select Hub Access Tier</h4>
          <div className="space-y-3">
            {subscriptionTiers.map((tier) => (
              <div 
                key={tier.name}
                onClick={() => handleSelectTier(tier)}
                className="bg-white rounded-2xl p-5 border border-slate-100 hover:border-blue-200 transition-all cursor-pointer shadow-sm relative overflow-hidden"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-heading font-bold text-slate-900 text-sm">{tier.name}</h5>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{tier.duration}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold text-blue-600">{tier.cost.toFixed(1)} CR</span>
                    {tier.studentDiscount && currentStudentStatus === 'verified' && (
                      <span className="block text-[8px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5 mt-1 text-center">
                        20% Student Discount Applied
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-2.5 text-xs text-slate-500 leading-relaxed">{tier.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div id="transactions-ledger" className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-heading font-bold text-slate-900 text-sm">Recent Transactions</h4>
            <span className="text-[9px] uppercase font-bold text-slate-400">Append-Only</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[9px] uppercase tracking-wider text-slate-400 border-b border-slate-150 pb-2">
                  <th className="font-semibold py-2">Timestamp</th>
                  <th className="font-semibold py-2">Transaction Details</th>
                  <th className="font-semibold py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {recentTransactions.map((tx) => {
                  const isPositive = tx.amount.startsWith('+');
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 text-[10px] text-slate-400 whitespace-nowrap">{tx.time}</td>
                      <td className="py-2.5 font-medium text-slate-800">{tx.desc}</td>
                      <td className={`py-2.5 text-right font-bold whitespace-nowrap ${
                        isPositive ? 'text-emerald-600' : 'text-slate-900'
                      }`}>
                        {tx.amount}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Booking Checkout Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        tier={selectedTier}
        availableCredits={currentCredits}
        onConfirm={handleConfirmBooking}
      />

      {/* Fund Wallet Modal */}
      {showFundModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl p-6 shadow-xl space-y-5 relative border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-heading font-bold text-slate-900 text-lg">Fund Naira Wallet</h3>
              <button onClick={() => setShowFundModal(false)} className="text-slate-400 hover:text-slate-600">
                Cancel
              </button>
            </div>

            <form onSubmit={handleFundWallet} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Amount in Naira (₦)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 font-bold text-sm">₦</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="5,000"
                    required
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 py-3 pl-8 pr-4 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                {[1000, 5000, 10000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setFundAmount(amt.toString())}
                    className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-colors text-slate-600 hover:text-blue-600"
                  >
                    ₦{amt.toLocaleString()}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={isFunding || !fundAmount}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors flex justify-center items-center gap-2 disabled:bg-slate-400 animate-pulse-subtle"
              >
                {isFunding ? 'Connecting secure gateway...' : 'Authorize Paystack Charge'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Upload Student ID Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl p-6 shadow-xl space-y-5 relative border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-heading font-bold text-slate-900 text-lg">Verify Student Status</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                Cancel
              </button>
            </div>

            <form onSubmit={handleUploadStudentId} className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center space-y-2 hover:border-blue-400 transition-colors cursor-pointer">
                <UploadCloud className="h-8 w-8 text-slate-400 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">Drag & drop or tap to upload</p>
                <p className="text-[10px] text-slate-400">PDF, PNG, or JPG (max. 5MB)</p>
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors disabled:bg-slate-400"
              >
                {isUploading ? 'Uploading credentials...' : 'Submit Verification Request'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
