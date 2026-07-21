'use client';

import React from 'react';
import { useAuth } from '@/features/auth/auth-context';
import { User, Mail, Phone, ShieldCheck, ShieldAlert, LogOut, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" />
            <h1 className="font-heading font-bold text-lg tracking-tight">Security Profile</h1>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* User Identity Details */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
              {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="font-heading font-bold text-slate-900 text-base">{user.fullName}</h3>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">User Identity Reference</span>
            </div>
          </div>

          <div className="space-y-3.5 text-sm text-slate-700">
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-slate-400" />
              <div>
                <span className="block text-[8px] font-semibold text-slate-400 uppercase">Email Address</span>
                <span className="font-medium text-slate-800">{user.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-slate-400" />
              <div>
                <span className="block text-[8px] font-semibold text-slate-400 uppercase">Phone Number</span>
                <span className="font-medium text-slate-800">{user.phone || '+234 801 234 5678 (Verified)'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Credentials */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
          <h4 className="font-heading font-bold text-slate-900 border-b border-slate-100 pb-3">System Credentials</h4>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">6-Digit Login PIN</p>
                  <p className="text-[10px] text-slate-400">Used for fast, device-native logins.</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5">Active</span>
            </div>

            <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-3">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">4-Digit Payment PIN</p>
                  <p className="text-[10px] text-slate-400">Used to authorize credit redemptions.</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5">Active</span>
            </div>
          </div>
        </div>

        {/* Support & Legal */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3 text-xs text-slate-500">
          <h4 className="font-heading font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 mb-1">Support & Operations</h4>
          <p>For dispute resolution, wallet ledger inquiries, or customer support request, please contact our help desk.</p>
          <div className="pt-2">
            <span className="block font-bold text-[9px] uppercase tracking-wider text-slate-400">Environment</span>
            <span className="font-semibold text-slate-700">Production Mode (v1.0.0-beta)</span>
          </div>
        </div>

        {/* Logout Action */}
        <button
          onClick={() => logout()}
          className="w-full py-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-semibold text-sm transition-colors flex justify-center items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout from Session
        </button>
      </main>
    </div>
  );
}
