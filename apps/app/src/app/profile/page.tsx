'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/auth-context';
import { 
  ArrowLeft, 
  ChevronRight, 
  Camera, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Edit3, 
  Gift, 
  Users, 
  Bell, 
  HelpCircle, 
  Settings as SettingsIcon, 
  LogOut, 
  Shield, 
  CheckCircle2,
  GraduationCap
} from 'lucide-react';

export default function ProfilePage() {
  const { user, logout, updateUserLocal, uploadAvatar } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [kycLevel, setKycLevel] = useState('1'); // '1' | '2' | '3'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Load data from localStorage (except avatar which is in-memory)
    const storedPhone = localStorage.getItem('profile_phone') ?? user.phone ?? 'Not Set';
    const storedEmail = localStorage.getItem('profile_email') ?? user.email ?? 'Not Set';
    const storedAddress = localStorage.getItem('profile_address') ?? 'Not Set';
    const storedDob = localStorage.getItem('profile_dob') ?? 'Not Set';
    const storedKycLevel = localStorage.getItem('profile_kyc_level') ?? '1';

    setPhone(storedPhone);
    setEmail(storedEmail);
    setAddress(storedAddress);
    setDob(storedDob);
    setKycLevel(storedKycLevel);
    setLoading(false);
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await uploadAvatar(file);
      } catch (err) {
        alert('Failed to upload avatar: ' + err);
      }
    }
  };

  const handleUpgradeKyc = () => {
    const currentNum = parseInt(kycLevel, 10);
    if (currentNum < 3) {
      router.push(`/profile/kyc/level${currentNum + 1}`);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-transparent"></div>
      </div>
    );
  }

  const profileAvatarUrl = user.avatarUrl || 'https://lh3.googleusercontent.com/a/default-user=s96-c';

  const kycLevels = [
    {
      level: '1',
      name: 'Level 1 (Starter)',
      limits: 'Daily Transfer: ₦50,000 • Funding: ₦100,000 • Max Balance: ₦300,000',
    },
    {
      level: '2',
      name: 'Level 2 (Standard)',
      limits: 'Daily Transfer: ₦500,000 • Funding: ₦1,000,000 • Max Balance: ₦5,000,000',
    },
    {
      level: '3',
      name: 'Level 3 (Premium / Highest)',
      limits: 'Daily Transfer: Unlimited • Funding: Unlimited • Max Balance: Unlimited',
    },
  ];

  const currentKyc = kycLevels.find(k => k.level === kycLevel) || kycLevels[0];

  const actionLinks = [
    { name: 'Verify Studentship', icon: GraduationCap, href: '/profile/verify-studentship' },
    { name: 'Refer and Earn', icon: Gift, href: '/rewards' },
    { name: 'Next of Kin', icon: Users, href: '/profile/placeholder?title=Next+of+Kin' },
    { name: 'Notification', icon: Bell, href: '/profile/placeholder?title=Notification' },
    { name: 'Help & Support', icon: HelpCircle, href: '/profile/placeholder?title=Help+and+Support' },
    { name: 'Settings', icon: SettingsIcon, href: '/profile/placeholder?title=Settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-md">
        <div className="max-w-md mx-auto flex items-center gap-3 px-6 py-4">
          <Link 
            href="/dashboard"
            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-heading font-bold text-lg tracking-tight">Security Profile</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Profile Picture Upload & Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-4">
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            <div className="h-24 w-24 rounded-full border-2 border-slate-200 overflow-hidden shrink-0 bg-slate-100">
              <img 
                src={profileAvatarUrl} 
                alt="Profile Avatar" 
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'User')}&background=3b82f6&color=fff`;
                }}
              />
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <button className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-slate-900 text-white border-2 border-white flex items-center justify-center hover:bg-slate-800 transition-colors">
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <div>
            <h3 className="font-heading font-bold text-slate-900 text-lg">{user.fullName}</h3>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">User Identity Reference</span>
          </div>
        </div>

        {/* KYC Section */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <h4 className="font-heading font-bold text-slate-900 text-sm">KYC Account Verification</h4>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
              kycLevel === '3' 
                ? 'text-emerald-700 bg-emerald-50 border-emerald-100' 
                : 'text-amber-700 bg-amber-50 border-amber-100'
            }`}>
              Level {kycLevel}
            </span>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Account Level</p>
              <p className="text-sm font-bold text-slate-900 mt-1">{currentKyc.name}</p>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{currentKyc.limits}</p>
            </div>

            {kycLevel !== '3' ? (
              <div className="space-y-3">
                <button
                  onClick={handleUpgradeKyc}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex justify-center items-center gap-1.5"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Upgrade Account Level (KYC Verification)
                </button>
                <div className="border-t border-slate-100 pt-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Account Level Limits</p>
                  <div className="space-y-2">
                    {kycLevels.map((lvl) => (
                      <div key={lvl.level} className="text-xs">
                        <span className={`font-semibold ${lvl.level === kycLevel ? 'text-blue-600' : 'text-slate-700'}`}>
                          {lvl.name}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">{lvl.limits}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl p-3 justify-center text-xs font-bold">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                You are on the highest verification tier
              </div>
            )}
          </div>
        </div>

        {/* User Details Tile */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
          <h4 className="font-heading font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">User Contact Details</h4>
          
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-slate-400 shrink-0" />
              <div>
                <span className="block text-[8px] font-semibold text-slate-400 uppercase">Phone Number</span>
                <span className="font-medium text-slate-800">{phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-slate-100 pt-3">
              <Mail className="h-4 w-4 text-slate-400 shrink-0" />
              <div>
                <span className="block text-[8px] font-semibold text-slate-400 uppercase">Email Address</span>
                <span className="font-medium text-slate-800">{email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-slate-100 pt-3">
              <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
              <div>
                <span className="block text-[8px] font-semibold text-slate-400 uppercase">Home Address</span>
                <span className="font-medium text-slate-800">{address}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-slate-100 pt-3">
              <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
              <div>
                <span className="block text-[8px] font-semibold text-slate-400 uppercase">Date of Birth</span>
                <span className="font-medium text-slate-800">{dob}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <Link 
              href="/profile/edit"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex justify-center items-center gap-1.5"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit User Details
            </Link>
          </div>
        </div>

        {/* Action Options List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-100">
          {actionLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-slate-700"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-800">{item.name}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
              </Link>
            );
          })}
          
          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors text-red-600 text-left"
          >
            <div className="flex items-center gap-3">
              <LogOut className="h-4 w-4 text-red-400 shrink-0" />
              <span className="text-xs font-semibold text-red-700">Logout</span>
            </div>
            <ChevronRight className="h-4 w-4 text-red-400 shrink-0" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 max-w-md mx-auto w-full">
        SK Cybernet v1.0.0-beta • Product of Chosen Technologies
      </footer>
    </div>
  );
}
