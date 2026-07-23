'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/auth-context';
import { 
  ArrowLeft, 
  Shield, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle,
  FileCheck,
  MapPin,
  Phone
} from 'lucide-react';

export default function Level2KycPage() {
  const { user, updateUserLocal } = useAuth();
  const router = useRouter();

  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [idType, setIdType] = useState('National ID');
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const kycLevel = user?.kycLevel ?? '1';

  // Redirect or block if not eligible for Level 2 upgrade
  if (kycLevel !== '1') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans pb-16">
        <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-md">
          <div className="max-w-md mx-auto flex items-center gap-3 px-6 py-4">
            <Link 
              href="/profile"
              className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="font-heading font-bold text-lg tracking-tight">Level 2 KYC Upgrade</h1>
          </div>
        </header>
        <main className="max-w-md mx-auto px-4 py-8 flex-1 flex flex-col justify-center items-center text-center space-y-4">
          <div className="h-16 w-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-100 mb-2">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h2 className="font-heading font-bold text-slate-900 text-xl">Upgrade Restricted</h2>
          <p className="text-sm text-slate-500 max-w-sm">
            {parseInt(kycLevel, 10) >= 2 
              ? 'You have already completed or surpassed Level 2 (Standard) verification.' 
              : 'You must upgrade sequentially. Please complete previous levels first.'}
          </p>
          <button 
            onClick={() => router.push('/profile')}
            className="px-6 py-2.5 bg-slate-900 text-white font-semibold text-xs rounded-xl hover:bg-slate-850 transition-all shadow-sm"
          >
            Return to Security Profile
          </button>
        </main>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !address || !fileName) {
      setErrorMsg('Please fill in all details and upload your document.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    // Simulate verification processing
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      
      // Update app state and storage
      updateUserLocal({ kycLevel: '2' });
      
      setTimeout(() => {
        router.push('/profile');
      }, 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-md">
        <div className="max-w-md mx-auto flex items-center gap-3 px-6 py-4">
          <Link 
            href="/profile"
            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-heading font-bold text-lg tracking-tight">Level 2 (Standard) KYC</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
          
          {/* Step description */}
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Standard Tier Verification</h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Unlock standard tier limits: Daily Transfer up to ₦500,000, Funding up to ₦1,000,000, and Max Balance up to ₦5,000,000.
              </p>
            </div>
          </div>

          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
              <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-100 animate-bounce">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-slate-900 text-base">Verification Submitted!</h3>
                <p className="text-xs text-slate-500 mt-1">Successfully upgraded to Level 2 (Standard)</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="flex items-center gap-2 bg-red-50 text-red-700 p-3 rounded-xl text-xs font-semibold border border-red-100">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Phone Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +234 801 234 5678"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                    required
                  />
                </div>
              </div>

              {/* Address Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Residential Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your street address, city, state"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                    required
                  />
                </div>
              </div>

              {/* ID Type Select */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Government ID Type</label>
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-850 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                >
                  <option value="National ID">National ID Card (NIN)</option>
                  <option value="International Passport">International Passport</option>
                  <option value="Drivers License">Driver's License</option>
                  <option value="Voters Card">Voter's Card</option>
                </select>
              </div>

              {/* ID Upload Dropzone */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Upload Government ID Document</label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50 hover:bg-slate-100/55 transition-colors relative flex flex-col items-center justify-center text-center cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {fileName ? (
                    <div className="space-y-2">
                      <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                        <FileCheck className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800 block truncate max-w-[250px]">{fileName}</span>
                      <span className="text-[10px] text-slate-400 block">Click or drag to replace file</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="h-10 w-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto">
                        <UploadCloud className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800 block">Select ID Document File</span>
                      <span className="text-[10px] text-slate-400 block">Supports PDF, PNG, JPG up to 5MB</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-550 disabled:bg-blue-400 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex justify-center items-center gap-2 mt-4"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Document...</span>
                  </>
                ) : (
                  <span>Submit Standard Level KYC</span>
                )}
              </button>
            </form>
          )}

        </div>
      </main>
    </div>
  );
}
