'use client';

import React from 'react';
import { useAuth } from '@/features/auth/auth-context';
import { Wallet, LogOut, ShieldAlert, Award, User } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();

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

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top Navbar */}
      <header className="bg-slate-900 text-white shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-blue-400" />
            <h1 className="font-heading font-bold text-xl tracking-tight">SK Cybernet</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-sm text-slate-300 font-medium">
              Hello, {user.fullName}
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Verification banner if applicable */}
        {user.studentStatus === 'unverified' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
            <ShieldAlert className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-amber-800">Student Discount Eligibility</h4>
              <p className="text-xs text-amber-700 mt-0.5">
                Verify your student ID in the account page to get discounts on Weekly and Monthly subscription tiers.
              </p>
            </div>
          </div>
        )}

        {/* Dashboard Balance Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 h-32 w-32 rounded-full bg-blue-500 opacity-10 filter blur-xl"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Available Credits</p>
              <h3 className="text-4xl font-bold font-heading mt-2">
                {user.wallet?.availableCredits?.toFixed(1) || '0.0'} <span className="text-lg font-medium text-slate-400">CR</span>
              </h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400">
              <Wallet className="h-6 w-6" />
            </div>
          </div>
          <div className="border-t border-slate-800 mt-6 pt-4 flex justify-between items-center text-xs text-slate-400">
            <span>Escrowed Balance: {user.wallet?.escrowedCredits?.toFixed(1) || '0.0'} CR</span>
            <span>Rate: 1 CR = ₦{user.wallet?.creditExchangeRate || '100.0'}</span>
          </div>
        </div>

        {/* User Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
          <h3 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="h-5 w-5 text-blue-500" />
            Profile Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase">Full Name</span>
              <span className="font-medium text-slate-900">{user.fullName}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase">Email</span>
              <span className="font-medium text-slate-900">{user.email}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase">Phone</span>
              <span className="font-medium text-slate-900">{user.phone || 'Not configured'}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase">Role</span>
              <span className="font-medium text-slate-900 capitalize">{user.role}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
