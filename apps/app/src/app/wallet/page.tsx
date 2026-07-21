'use client';

import React, { useState } from 'react';
import { useAuth } from '@/features/auth/auth-context';
import { 
  Wallet, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  ArrowDownLeft, 
  ArrowUpRight, 
  CreditCard,
  Plus,
  Info
} from 'lucide-react';

export default function WalletPage() {
  const { user } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [copiedText, setCopiedText] = useState<'acc' | 'bank' | null>(null);
  const [fundingAmount, setFundingAmount] = useState('');
  const [isFunding, setIsFunding] = useState(false);
  
  // Mock transactions for rich UI simulation
  const mockTransactions = [
    { id: 'tx-001', type: 'funding', method: 'Virtual Account Transfer', amount: 50.0, currency: 'credits', status: 'success', date: '2026-07-21 14:32' },
    { id: 'tx-002', type: 'booking', method: 'Weekly Pass Redemption', amount: -25.0, currency: 'credits', status: 'success', date: '2026-07-20 09:15' },
    { id: 'tx-003', type: 'funding', method: 'Paystack Card Pay', amount: 10.0, currency: 'credits', status: 'success', date: '2026-07-18 18:01' },
    { id: 'tx-004', type: 'dispute', method: 'Refund Credit Adjust', amount: 5.0, currency: 'credits', status: 'pending', date: '2026-07-17 11:22' },
    { id: 'tx-005', type: 'booking', method: 'Daily Pass Redemption', amount: -5.0, currency: 'credits', status: 'failed', date: '2026-07-15 08:00' },
  ];

  const handleCopy = (text: string, type: 'acc' | 'bank') => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleFundingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fundingAmount || isNaN(Number(fundingAmount)) || Number(fundingAmount) <= 0) return;
    
    setIsFunding(true);
    // Simulate Paystack popup initialization
    setTimeout(() => {
      alert(`Simulated Paystack checkout initialized for ₦${Number(fundingAmount).toLocaleString()}`);
      setIsFunding(false);
      setFundingAmount('');
    }, 1000);
  };

  const virtualAccount = {
    bankName: 'Wema Bank (Providus)',
    accountNumber: '9928374829',
    accountName: `SK-CYBERNET - ${user?.fullName || 'Client'}`
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-blue-500" />
            <h1 className="font-heading font-bold text-lg tracking-tight">My Wallet</h1>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Core Balance Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 h-32 w-32 rounded-full bg-blue-500 opacity-10 filter blur-xl"></div>
          
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-1">
                Available Credits
                <button 
                  onClick={() => setShowBalance(!showBalance)} 
                  className="text-slate-500 hover:text-slate-300 focus:outline-none"
                  aria-label={showBalance ? "Hide balance" : "Show balance"}
                >
                  {showBalance ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </p>
              <h3 className="text-4xl font-bold font-heading mt-2">
                {showBalance 
                  ? `${user?.wallet?.availableCredits?.toFixed(1) || '75.0'}` 
                  : '••••'}{' '}
                <span className="text-lg font-medium text-slate-400">CR</span>
              </h3>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400">
              <Wallet className="h-5 w-5" />
            </div>
          </div>

          <div className="border-t border-slate-800 mt-6 pt-4 flex justify-between items-center text-xs text-slate-400">
            <span>Escrowed: {showBalance ? `${user?.wallet?.escrowedCredits?.toFixed(1) || '0.0'}` : '••'} CR</span>
            <span>1 CR = ₦{user?.wallet?.creditExchangeRate || '100'}</span>
          </div>
        </div>

        {/* Dedicated Virtual Account */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <CreditCard className="h-5 w-5 text-blue-500" />
            <h4 className="font-heading font-bold text-slate-900">Virtual Bank Account</h4>
          </div>
          
          <p className="text-xs text-slate-500">
            Fund your credit balance instantly by making a transfer to your dedicated virtual account.
          </p>

          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <div>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">Account Name</span>
              <span className="text-sm font-semibold text-slate-900">{virtualAccount.accountName}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">Bank Name</span>
                <span className="text-sm font-semibold text-slate-900">{virtualAccount.bankName}</span>
              </div>
              <button 
                onClick={() => handleCopy(virtualAccount.bankName, 'bank')}
                className="p-2 text-slate-400 hover:text-blue-500 rounded-lg hover:bg-slate-200 transition-colors"
                aria-label="Copy Bank Name"
              >
                {copiedText === 'bank' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 pt-2">
              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">Account Number</span>
                <span className="text-lg font-bold text-slate-900 tracking-wider">{virtualAccount.accountNumber}</span>
              </div>
              <button 
                onClick={() => handleCopy(virtualAccount.accountNumber, 'acc')}
                className="p-2 text-slate-400 hover:text-blue-500 rounded-lg hover:bg-slate-200 transition-colors"
                aria-label="Copy Account Number"
              >
                {copiedText === 'acc' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Fund Wallet */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Plus className="h-5 w-5 text-blue-500" />
            <h4 className="font-heading font-bold text-slate-900">Fund via Paystack</h4>
          </div>

          <form onSubmit={handleFundingSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Amount in Naira (₦)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 font-bold text-sm">₦</span>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="5,000"
                  value={fundingAmount}
                  onChange={(e) => setFundingAmount(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 py-3 pl-8 pr-4 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold"
                />
              </div>
            </div>

            <div className="flex gap-2">
              {[1000, 5000, 10000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setFundingAmount(amt.toString())}
                  className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-colors text-slate-600 hover:text-blue-600"
                >
                  ₦{amt.toLocaleString()}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={isFunding || !fundingAmount}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors flex justify-center items-center gap-2 disabled:bg-slate-300"
            >
              {isFunding ? 'Initializing secure portal...' : 'Pay with Card'}
            </button>
          </form>
        </div>

        {/* Transaction History Ledger */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-heading font-bold text-slate-900">Transaction History</h4>
            <span className="text-[10px] uppercase font-bold text-slate-400">Append-Only Ledger</span>
          </div>

          <div className="space-y-4">
            {mockTransactions.map((tx) => {
              const isCreditAddition = tx.amount > 0;
              const statusColors = {
                success: 'bg-blue-50 text-blue-700 border-blue-100',
                pending: 'bg-amber-50 text-amber-700 border-amber-100',
                failed: 'bg-red-50 text-red-700 border-red-100',
              };

              return (
                <div key={tx.id} className="flex justify-between items-center text-sm py-2 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-xl border flex items-center justify-center ${
                      isCreditAddition ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {isCreditAddition ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{tx.method}</p>
                      <span className="block text-[10px] text-slate-400">{tx.date}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold ${isCreditAddition ? 'text-emerald-600' : 'text-slate-800'}`}>
                      {isCreditAddition ? '+' : ''}{tx.amount.toFixed(1)} CR
                    </span>
                    <span className={`block text-[9px] uppercase tracking-wider font-semibold border rounded px-1.5 py-0.5 mt-1 text-center ${statusColors[tx.status as keyof typeof statusColors]}`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
