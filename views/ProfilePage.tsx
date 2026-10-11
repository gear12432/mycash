'use client';

import React from 'react';
import { AppHeader } from '@/components/common/AppHeader';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Phone, ShieldCheck, Copy, Check } from 'lucide-react';

interface ProfilePageProps {
  onBack: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onBack }) => {
  const { userProfile, currentUser } = useAuth();
  const [copiedId, setCopiedId] = React.useState(false);

  if (!userProfile || !currentUser) {
    return (
      <div className="min-h-screen bg-[#191F2C] text-white flex flex-col justify-between max-w-md mx-auto shadow-2xl">
        <AppHeader title="My Profile" showBack onBack={onBack} />
        <div className="flex-1 p-6 text-center text-gray-400 text-xs">
          Loading profile details...
        </div>
      </div>
    );
  }

  const copyUserId = () => {
    navigator.clipboard.writeText(userProfile.userId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#191F2C] text-white flex flex-col justify-between max-w-md mx-auto shadow-2xl pb-8">
      <AppHeader title="My Profile" showBack onBack={onBack} />

      <div className="flex-1 p-4 space-y-4 text-left">
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 text-center space-y-3 relative text-[#20244F]">
          <div className="w-20 h-20 rounded-full bg-[#397EF5] text-white font-black text-2xl mx-auto flex items-center justify-center border-4 border-blue-50 shadow-md">
            {userProfile.firstName[0]}
          </div>

          <div>
            <h2 className="text-xl font-extrabold">
              {userProfile.firstName} {userProfile.lastName}
            </h2>
            <div className="mt-1 inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs font-bold text-[#397EF5]">
              <span>User ID: {userProfile.userId}</span>
              <button onClick={copyUserId} className="hover:text-blue-700">
                {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-xl border border-gray-100 text-[#20244F] space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2">
            Account Information
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#397EF5]" />
                <span className="text-gray-600 font-medium">Gmail Address</span>
              </div>
              <span className="font-bold truncate max-w-[180px]">{userProfile.email}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-indigo-600" />
                <span className="text-gray-600 font-medium">Mobile Number</span>
              </div>
              <span className="font-bold">{userProfile.mobileNumber}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-gray-600 font-medium">Internal UID</span>
              </div>
              <span className="font-mono text-[10px] font-bold truncate max-w-[150px]">
                {currentUser.uid}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span className="text-gray-600 font-medium">KYC Verification</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                {userProfile.kycStatus.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
