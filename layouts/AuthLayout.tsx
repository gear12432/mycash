import React from 'react';

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#191F2C] flex items-center justify-center p-0 md:p-4 font-sans antialiased">
      <div className="w-full max-w-md bg-[#191F2C] min-h-screen md:min-h-[840px] md:rounded-3xl shadow-2xl overflow-hidden border border-gray-800">
        {children}
      </div>
    </div>
  );
};
