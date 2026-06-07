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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {!success && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {success ? (
          <div className="flex flex-col items-center py-8 text-center space-y-4 animate-fade-in">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-500/10 border border-blue-500/25 rounded-full">
              <CheckCircle className="w-8 h-8 text-blue-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Report Submitted</h3>
              <p className="text-neutral-400 text-sm">
                Thank you for keeping Norinly safe. We will review this session.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <ShieldAlert className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Report Session</h3>
                <p className="text-neutral-400 text-xs">Help us maintain a safe community</p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-blue-950/20 border border-blue-900/40 rounded-xl text-blue-400 text-xs">
                {error}
              </div>
            )}

            {/* Reasons List */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                Reason for report
              </label>
              <div className="grid grid-cols-1 gap-2">
                {REPORT_REASONS.map((r) => (
                  <label
                    key={r}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                      reason === r
                        ? 'bg-neutral-800/80 border-white text-white font-medium'
                        : 'bg-neutral-950/45 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-300'
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
                      reason === r ? 'border-white bg-white' : 'border-neutral-700 bg-transparent'
                    }`}>
                      {reason === r && <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />}
                    </span>
                    <span className="text-sm">{r}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional details */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                Details <span className="text-neutral-600">(optional)</span>
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe what happened..."
                rows={3}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-neutral-600 transition-colors resize-none"
              />
            </div>

            {/* Footer Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 h-12 bg-neutral-850 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 font-semibold rounded-xl transition-all duration-200 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !reason}
                className={`flex-1 h-12 font-semibold rounded-xl text-sm transition-all duration-200 ${
                  reason && !submitting
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
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
