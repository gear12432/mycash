import React from 'react';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-0 md:p-4 font-sans antialiased text-[#20244F]">
      <div className="w-full max-w-md bg-[#191F2C] min-h-screen md:min-h-[840px] md:rounded-3xl shadow-2xl overflow-hidden border border-gray-800">
        {children}
      </div>
    </div>
  );
};
