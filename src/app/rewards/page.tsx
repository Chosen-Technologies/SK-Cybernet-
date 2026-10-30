'use client';

import React, { useState } from 'react';
import { useAuth } from '@/features/auth/auth-context';
import { Gift, Wallet, Award, ArrowUpRight, Check, ShieldCheck, Share2 } from 'lucide-react';

export default function RewardsPage() {
  const { user } = useAuth();
  const [copiedLink, setCopiedLink] = useState(false);

  const mockRewards = {
    cashbackBalance: 1200.50, // Naira
    referralCount: 4,
    referralEarnings: 20.0, // Credits
    referralCode: 'SKCYB-JDOE92'
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(`https://app.skcybernet.com/register?ref=${mockRewards.referralCode}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-blue-500" />
            <h1 className="font-heading font-bold text-lg tracking-tight">Rewards & Referrals</h1>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Cashback Balance Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-2xl p-6 shadow-lg border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 h-32 w-32 rounded-full bg-blue-500 opacity-10 filter blur-xl"></div>
          
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Accumulated Cashbacks</span>
              <h3 className="text-3xl font-bold font-heading mt-1">
                ₦{mockRewards.cashbackBalance.toLocaleString()}{' '}
                <span className="text-xs font-semibold text-slate-400">Cashback</span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">Automatically earned from transactions.</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400">
              <Award className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Referrals Balance */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h4 className="font-heading font-bold text-slate-900">Referral Program</h4>
            <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5">
              +{mockRewards.referralEarnings.toFixed(1)} CR earned
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-3.5 text-center">
              <span className="block text-[9px] font-bold text-slate-400 uppercase">Referrals Invited</span>
              <span className="text-xl font-bold text-slate-850 mt-1 block">{mockRewards.referralCount}</span>
            </div>
            <div className="bg-slate-50 rounded-xl p-3.5 text-center">
              <span className="block text-[9px] font-bold text-slate-400 uppercase">Total Earned</span>
              <span className="text-xl font-bold text-blue-600 mt-1 block">{mockRewards.referralEarnings.toFixed(1)} CR</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <span className="block text-[10px] font-semibold text-slate-500 uppercase">Invite Friends</span>
            <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:border-blue-500">
              <input
                type="text"
                readOnly
                value={`ref=${mockRewards.referralCode}`}
                className="block w-full py-2.5 px-3 text-xs bg-slate-50 text-slate-600 focus:outline-none font-semibold"
              />
              <button
                onClick={copyReferralLink}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 flex items-center gap-1.5 transition-colors"
              >
                {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
                {copiedLink ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
