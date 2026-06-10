'use client';

import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, X } from 'lucide-react';

interface ReportModalProps {
  sessionToken: string;
  onClose: () => void;
}

const REPORT_REASONS = [
  'Inappropriate language',
  'Harassment or bullying',
  'Spam or bot',
  'Other'
];

export default function ReportModal({ sessionToken, onClose }: ReportModalProps) {
  const [reason, setReason] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionToken,
          reason,
          details: details.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit report');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {!success && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {success ? (
          <div className="flex flex-col items-center py-8 text-center space-y-4 animate-fade-in">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-50 border border-blue-100 rounded-full">
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">Report Submitted</h3>
              <p className="text-slate-500 text-sm">
                Thank you for keeping Norinly safe. We will review this session.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl">
                <ShieldAlert className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Report Session</h3>
                <p className="text-slate-500 text-xs">Help us maintain a safe community</p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-605 text-red-605 text-red-650 text-red-600 text-xs">
                {error}
              </div>
            )}

            {/* Reasons List */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-slate-550 text-slate-500 uppercase tracking-wider block">
                Reason for report
              </label>
              <div className="grid grid-cols-1 gap-2">
                {REPORT_REASONS.map((r) => (
                  <label
                    key={r}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                      reason === r
                        ? 'bg-blue-50 border-blue-600 text-blue-800 font-medium'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={r}
                      checked={reason === r}
                      onChange={() => setReason(r)}
                      className="sr-only"
                    />
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      reason === r ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-transparent'
                    }`}>
                      {reason === r && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                    <span className="text-sm">{r}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional details */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-550 text-slate-500 uppercase tracking-wider block">
                Details <span className="text-slate-400">(optional)</span>
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe what happened..."
                rows={3}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-slate-300 transition-colors resize-none"
              />
            </div>

            {/* Footer Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 h-12 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 font-semibold rounded-xl transition-all duration-200 text-sm cursor-pointer shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !reason}
                className={`flex-1 h-12 font-semibold rounded-xl text-sm transition-all duration-200 cursor-pointer ${
                  reason && !submitting
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-100'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
