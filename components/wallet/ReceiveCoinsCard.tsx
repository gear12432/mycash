'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Copy, Check, Download, QrCode, ShieldCheck } from 'lucide-react';
import { AppButton } from '../common/AppButton';

interface ReceiveCoinsCardProps {
  userId: string; // e.g. PL18753
  userName: string;
}

export const ReceiveCoinsCard: React.FC<ReceiveCoinsCardProps> = ({
  userId,
  userName,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (userId) {
      const payload = `phoneg://receive?userId=${userId}&name=${encodeURIComponent(
        userName
      )}`;
      QRCode.toDataURL(payload, {
        width: 280,
        margin: 2,
        color: {
          dark: '#111111',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR code generation error:', err));
    }
  }, [userId, userName]);

  const copyUserId = () => {
    navigator.clipboard.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `phoneG_QR_${userId}.png`;
    a.click();
  };

  return (
    <div className="w-full bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-6 text-center">
      <div className="border-b border-gray-100 pb-3 flex items-center justify-between text-left">
        <div>
          <h3 className="text-lg font-bold text-[#20244F]">Receive Coins</h3>
          <p className="text-xs text-gray-500">Scan QR code or share your Public User ID</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <QrCode className="w-5 h-5" />
        </div>
      </div>

      {/* QR Code Container */}
      <div className="mx-auto w-56 h-56 bg-white p-3 rounded-2xl border-2 border-gray-100 shadow-md flex items-center justify-center relative">
        {qrDataUrl ? (
          <img src={qrDataUrl} alt="phoneG Receive QR Code" className="w-full h-full object-contain" />
        ) : (
          <p className="text-xs text-gray-400">Generating QR Code...</p>
        )}
      </div>

      {/* Public User ID Display */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Your Public User ID
        </p>
        <p className="text-2xl font-black text-[#397EF5] tracking-wider">{userId}</p>
        <p className="text-xs font-semibold text-gray-600">{userName}</p>

        <div className="pt-1 flex justify-center space-x-2">
          <button
            onClick={copyUserId}
            className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-100 rounded-xl text-xs font-bold text-[#20244F] flex items-center space-x-1.5 transition-all active:scale-95 shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#397EF5]" />
                <span>Copy User ID</span>
              </>
            )}
          </button>

          <button
            onClick={downloadQr}
            className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-100 rounded-xl text-xs font-bold text-[#20244F] flex items-center space-x-1.5 transition-all active:scale-95 shadow-2xs"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>Save QR</span>
          </button>
        </div>
      </div>

      <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100 text-left flex items-start space-x-2 text-xs text-emerald-800">
        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
        <p>
          Anyone on phoneG can send coins directly to your User ID{' '}
          <strong>{userId}</strong> with zero transfer fees for the receiver.
        </p>
      </div>
    </div>
  );
};
