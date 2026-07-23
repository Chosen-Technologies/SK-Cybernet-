'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/auth-context';
import { 
  ArrowLeft, 
  UploadCloud, 
  CheckCircle2, 
  GraduationCap, 
  FileText, 
  X,
  AlertCircle,
  Clock
} from 'lucide-react';

export default function VerifyStudentshipPage() {
  const router = useRouter();
  const { user, updateUserLocal } = useAuth();
  
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const studentStatus = user?.studentStatus ?? 'unverified';

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setErrorMsg('');
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    if (!validTypes.includes(selectedFile.type)) {
      setErrorMsg('Invalid file type. Please upload a PDF, PNG, or JPG document.');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrorMsg('File is too large. Maximum allowed size is 5MB.');
      return;
    }
    setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg('Please select or drop a student ID card file to upload.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    // Simulate file upload and verification setup
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      updateUserLocal({ studentStatus: 'pending_review' });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-md">
        <div className="max-w-md mx-auto flex items-center gap-3 px-6 py-4">
          <Link 
            href="/profile"
            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-heading font-bold text-lg tracking-tight">Verify Studentship</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto w-full px-4 py-6 flex-1 flex flex-col">
        {success ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center my-auto space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 animate-bounce">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="font-heading font-bold text-slate-900 text-xl">Upload Under Review</h2>
              <p className="text-sm text-slate-500">
                Your student ID card has been successfully uploaded and is currently under review by Chosen Technologies.
              </p>
              <p className="text-xs text-slate-400">
                You will save up to 20% on Weekly and Monthly subscription passes once verified.
              </p>
            </div>
            <div className="pt-4">
              <Link 
                href="/profile"
                className="block w-full py-3 bg-slate-900 hover:bg-slate-850 text-white font-semibold text-sm rounded-xl transition-all shadow-sm text-center"
              >
                Back to Profile
              </Link>
            </div>
          </div>
        ) : studentStatus === 'pending_review' ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center my-auto space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              <Clock className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="font-heading font-bold text-slate-900 text-xl">Verification Pending</h2>
              <p className="text-sm text-slate-500">
                We have already received your student verification request.
              </p>
              <p className="text-xs text-slate-400">
                Our support team is reviewing your uploaded Student ID. We will notify you once your studentship discount has been enabled.
              </p>
            </div>
            <div className="pt-4">
              <Link 
                href="/profile"
                className="block w-full py-3 bg-slate-900 hover:bg-slate-850 text-white font-semibold text-sm rounded-xl transition-all shadow-sm text-center"
              >
                Back to Profile
              </Link>
            </div>
          </div>
        ) : studentStatus === 'verified' ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center my-auto space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              <GraduationCap className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="font-heading font-bold text-emerald-950 text-xl">Studentship Verified</h2>
              <p className="text-sm text-slate-500">
                Congratulations! You are verified as a student.
              </p>
              <p className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg inline-block border border-emerald-100">
                20% Student Discount is active on your account
              </p>
            </div>
            <div className="pt-4">
              <Link 
                href="/profile"
                className="block w-full py-3 bg-slate-900 hover:bg-slate-850 text-white font-semibold text-sm rounded-xl transition-all shadow-sm text-center"
              >
                Back to Profile
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
            <div className="flex gap-4 items-start">
              <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100 shrink-0">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-slate-900 text-base">Verify Student Status</h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Upload a clear image or scan of your official Student ID Card. Once verified, a 20% discount will automatically apply to Weekly and Monthly workspace subscriptions.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive ? 'border-blue-500 bg-blue-50/30' : 'border-slate-200 hover:border-slate-300'
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <input 
                  type="file" 
                  id="studentIdUpload" 
                  className="hidden" 
                  accept=".pdf, .png, .jpg, .jpeg"
                  onChange={handleFileChange}
                />
                
                {file ? (
                  <div className="space-y-3">
                    <div className="mx-auto h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-800 max-w-[240px] mx-auto truncate">
                        {file.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button 
                      type="button"
                      onClick={removeFile}
                      className="text-xs text-red-500 hover:text-red-600 font-semibold inline-flex items-center gap-1 bg-red-50 hover:bg-red-100/60 px-3 py-1.5 rounded-lg border border-red-100 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                ) : (
                  <label htmlFor="studentIdUpload" className="cursor-pointer block space-y-3">
                    <UploadCloud className="h-10 w-10 text-slate-400 mx-auto" />
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-700">
                        Drag & drop or <span className="text-blue-600 hover:underline">browse files</span>
                      </p>
                      <p className="text-[10px] text-slate-400">
                        PDF, PNG, or JPG (max. 5MB)
                      </p>
                    </div>
                  </label>
                )}
              </div>

              {errorMsg && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex gap-2 text-xs text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!file || isSubmitting}
                className="w-full py-3 bg-slate-900 hover:bg-slate-850 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Uploading credentials...
                  </div>
                ) : (
                  'Submit Verification Request'
                )}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
