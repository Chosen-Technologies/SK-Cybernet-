'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/auth-context';

export default function OnboardingStartPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || !user.auth) return;

    const hasPhone = !!user.auth.phoneVerifiedAt;
    const hasLoginPin = !!user.auth.loginPinSetAt;
    const hasPaymentPin = !!user.auth.paymentPinSetAt;

    if (!hasPhone) {
      router.replace('/onboarding/phone');
    } else if (!hasLoginPin) {
      router.replace('/onboarding/pin-login');
    } else if (!hasPaymentPin) {
      router.replace('/onboarding/pin-payment');
    } else {
      router.replace('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-transparent"></div>
      <p className="text-sm font-medium text-slate-600">Taking you to the next step...</p>
    </div>
  );
}
