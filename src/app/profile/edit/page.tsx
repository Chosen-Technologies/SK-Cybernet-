'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/auth-context';
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Save } from 'lucide-react';

export default function ProfileEditPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Load values from localStorage or fallback to user model defaults
    const storedPhone = localStorage.getItem('profile_phone') ?? user.phone ?? '';
    const storedEmail = localStorage.getItem('profile_email') ?? user.email ?? '';
    const storedAddress = localStorage.getItem('profile_address') ?? '';
    const storedDob = localStorage.getItem('profile_dob') ?? '';

    setPhone(storedPhone);
    setEmail(storedEmail);
    setAddress(storedAddress);
    setDob(storedDob);
    setLoading(false);
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to localStorage
    localStorage.setItem('profile_phone', phone);
    localStorage.setItem('profile_email', email);
    localStorage.setItem('profile_address', address);
    localStorage.setItem('profile_dob', dob);

    // Navigate back to profile
    router.push('/profile');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between pb-12">
      <div>
        {/* Header */}
        <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-md">
          <div className="max-w-md mx-auto flex items-center gap-3 px-6 py-4">
            <button 
              onClick={() => router.back()}
              className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-heading font-bold text-lg tracking-tight">Edit Details</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-md w-full mx-auto px-4 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
              {/* Phone */}
              <div className="space-y-1.5">
                <label htmlFor="phone" className="block text-xs font-semibold uppercase text-slate-500">Phone Number</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Phone className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-slate-950 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                    placeholder="+234 801 234 5678"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-semibold uppercase text-slate-500">Email Address</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-slate-950 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                    placeholder="user@example.com"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <label htmlFor="address" className="block text-xs font-semibold uppercase text-slate-500">Address</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MapPin className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    id="address"
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-slate-950 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                    placeholder="12 Cybernet Way, Lagos"
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div className="space-y-1.5">
                <label htmlFor="dob" className="block text-xs font-semibold uppercase text-slate-500">Date of Birth</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Calendar className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    id="dob"
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-slate-950 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors flex justify-center items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </form>
        </main>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 max-w-md mx-auto w-full">
        SK Cybernet v1.0.0-beta • Product of Chosen Technologies
      </footer>
    </div>
  );
}
