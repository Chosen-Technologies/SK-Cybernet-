'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Hourglass } from 'lucide-react';

function PlaceholderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const title = searchParams.get('title') || 'Feature';

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-md">
        <div className="max-w-md mx-auto flex items-center gap-3 px-6 py-4">
          <button 
            onClick={() => router.back()}
            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-heading font-bold text-lg tracking-tight">{title}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md w-full mx-auto px-4 py-12 flex-1 flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center space-y-6 max-w-sm w-full">
          <div className="h-16 w-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 mx-auto">
            <Hourglass className="h-8 w-8 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <div className="space-y-2">
            <h3 className="font-heading font-bold text-slate-900 text-xl">{title} Under Construction</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              We are working hard to bring this feature to your SK Cybernet workspace wallet. Check back soon!
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors"
          >
            Go Back
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

export default function ProfilePlaceholderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-transparent"></div>
      </div>
    }>
      <PlaceholderContent />
    </Suspense>
  );
}
