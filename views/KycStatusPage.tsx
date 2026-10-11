'use client';

import React, { useEffect, useState } from 'react';
import { AppHeader } from '@/components/common/AppHeader';
import { useAuth } from '@/hooks/useAuth';
import { getKycRecord } from '@/services/kycService';
import { KycRecord } from '@/types/kyc';
import { maskPan, maskAadhaar, formatDate } from '@/lib/formatters';
import { Clock, CheckCircle2 } from 'lucide-react';

interface KycStatusPageProps {
  onBack: () => void;
}

export const KycStatusPage: React.FC<KycStatusPageProps> = ({ onBack }) => {
  const { currentUser } = useAuth();
  const [kycRecord, setKycRecord] = useState<KycRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      getKycRecord(currentUser.uid)
        .then((rec) => setKycRecord(rec))
        .finally(() => setLoading(false));
    }
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-[#191F2C] text-white flex flex-col justify-between max-w-md mx-auto shadow-2xl">
      <AppHeader title="KYC Verification" showBack onBack={onBack} />

      <div className="flex-1 p-4 space-y-4 text-left">
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 text-center space-y-3 text-[#20244F]">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold">KYC Status: Under Review</h2>
            <p className="text-xs text-gray-500 mt-1">
              Your identity documents have been submitted to Firebase secure storage and are currently undergoing compliance review.
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-full flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Full Wallet Functionality Active</span>
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-xl border border-gray-100 text-[#20244F] space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2">
            Submitted KYC Records
          </h3>

          {loading ? (
            <p className="text-xs text-gray-400 py-4 text-center">Loading KYC records...</p>
          ) : kycRecord ? (
            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500 font-medium">PAN Card</span>
                <span className="font-bold font-mono">{maskPan(kycRecord.panNumber)}</span>
              </div>

              <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500 font-medium">Aadhaar Card</span>
                <span className="font-bold font-mono">
                  {maskAadhaar(kycRecord.aadhaarNumber)}
                </span>
              </div>

              <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500 font-medium">Submitted On</span>
                <span className="font-bold">{formatDate(kycRecord.submittedAt)}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-400 py-4 text-center">No KYC record found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default KycStatusPage;
