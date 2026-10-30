'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Trash2, CheckCircle } from 'lucide-react';

export default function BeneficiariesPage() {
  const [beneficiaries, setBeneficiaries] = useState<{ id: string; name: string; bank: string; account: string }[]>([]);
  const [newBenName, setNewBenName] = useState('');
  const [newBenBank, setNewBenBank] = useState('');
  const [newBenAccount, setNewBenAccount] = useState('');
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const savedBens = JSON.parse(localStorage.getItem('settings_beneficiaries') || '[]');
    setBeneficiaries(savedBens.length ? savedBens : [
      { id: '1', name: 'John Doe', bank: 'Access Bank', account: '0123456789' },
      { id: '2', name: 'Jane Smith', bank: 'GTBank', account: '9876543210' },
    ]);
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBenName || !newBenBank || !newBenAccount) return;
    const newBen = {
      id: Date.now().toString(),
      name: newBenName,
      bank: newBenBank,
      account: newBenAccount,
    };
    const updated = [newBen, ...beneficiaries];
    setBeneficiaries(updated);
    localStorage.setItem('settings_beneficiaries', JSON.stringify(updated));
    setNewBenName('');
    setNewBenBank('');
    setNewBenAccount('');
    setSuccess('Beneficiary added successfully!');
    setTimeout(() => setSuccess(null), 2000);
  };

  const handleDelete = (id: string) => {
    const updated = beneficiaries.filter(b => b.id !== id);
    setBeneficiaries(updated);
    localStorage.setItem('settings_beneficiaries', JSON.stringify(updated));
    setSuccess('Beneficiary removed.');
    setTimeout(() => setSuccess(null), 2000);
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
          <h1 className="font-heading font-bold text-lg tracking-tight">Beneficiaries</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-heading font-bold text-slate-900 text-lg">Saved Beneficiaries</h3>
            <p className="text-xs text-slate-500">
              Quickly transfer funds to your frequently saved accounts.
            </p>
          </div>

          {success && (
            <div className="rounded-xl bg-emerald-50 p-4 text-xs text-emerald-800 border border-emerald-100 flex gap-2 items-center">
              <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Add Form */}
          <form onSubmit={handleAdd} className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Add New Beneficiary</span>
            <input
              type="text"
              required
              placeholder="Recipient Name"
              value={newBenName}
              onChange={(e) => setNewBenName(e.target.value)}
              className="w-full py-2.5 px-3 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:border-blue-500 font-medium text-slate-900"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                placeholder="Bank Name"
                value={newBenBank}
                onChange={(e) => setNewBenBank(e.target.value)}
                className="py-2.5 px-3 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:border-blue-500 font-medium text-slate-900"
              />
              <input
                type="text"
                required
                placeholder="Account Number"
                value={newBenAccount}
                onChange={(e) => setNewBenAccount(e.target.value.replace(/\D/g, ''))}
                className="py-2.5 px-3 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:border-blue-500 font-medium text-slate-900"
              />
            </div>
            <button type="submit" className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors">
              Save Beneficiary
            </button>
          </form>

          {/* List */}
          <div className="space-y-2 pr-1">
            {beneficiaries.map((b) => (
              <div key={b.id} className="flex justify-between items-center p-3 bg-slate-50/50 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{b.name}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">{b.bank} • {b.account}</span>
                </div>
                <button onClick={() => handleDelete(b.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>
            ))}
            {beneficiaries.length === 0 && (
              <p className="text-center text-xs text-slate-400 py-4">No saved beneficiaries yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
