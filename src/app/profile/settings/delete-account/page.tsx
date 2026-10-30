'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2, AlertTriangle } from 'lucide-react';

export default function DeleteAccountPage() {
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    setError('Account deletion must be authorized by an administrator.');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md">
        <div className="max-w-md mx-auto flex items-center gap-3 px-6 py-4">
          <Link 
            href="/profile/settings"
            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-heading font-bold text-lg tracking-tight">Delete Account</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 border border-red-100">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="font-heading font-bold text-red-700 text-lg">Permanently Delete Account</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Warning: This action is irreversible. All your wallet data, transaction details, and access tokens will be deleted permanently.
            </p>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-xs text-red-800 border border-red-100 flex gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-100 text-xs font-semibold leading-relaxed flex gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <span>Deleting your account will forfeit any active asset balances in your workspace wallet.</span>
          </div>

          <div className="flex gap-3">
            <Link 
              href="/profile/settings" 
              className="flex-1 py-3 border border-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-50 text-slate-700 transition-colors text-center block"
            >
              Cancel
            </Link>
            <button 
              onClick={handleDelete} 
              className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
