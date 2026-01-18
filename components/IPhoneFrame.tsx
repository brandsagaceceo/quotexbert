"use client";

import { ReactNode } from "react";

interface IPhoneFrameProps {
  children: ReactNode;
  className?: string;
}

export function IPhoneFrame({ children, className = "" }: IPhoneFrameProps) {
  return (
    <div className={`relative ${className}`}>
      {/* iPhone Frame - Only on desktop/tablet */}
      <div className="hidden md:block relative mx-auto" style={{ width: '375px' }}>
        {/* Device Frame */}
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-3 shadow-2xl">
          {/* Notch/Dynamic Island */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
            <div className="bg-black rounded-b-3xl px-8 py-1.5 shadow-lg">
              <div className="w-20 h-5 bg-gradient-to-r from-slate-800 to-slate-900 rounded-full flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                <div className="w-8 h-1 rounded-full bg-slate-800"></div>
              </div>
            </div>
          </div>

          {/* Screen */}
          <div className="relative bg-white rounded-[2.5rem] overflow-hidden shadow-inner" 
               style={{ height: '750px' }}>
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-slate-50 to-transparent z-10 flex items-center justify-between px-8 pt-2">
              <span className="text-xs font-semibold text-slate-900">9:41</span>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                </svg>
                <svg className="w-3 h-3 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
                <svg className="w-6 h-3 text-slate-900" fill="none" viewBox="0 0 24 12">
                  <rect x="1" y="1" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <rect x="20" y="4" width="2" height="4" rx="1" fill="currentColor"/>
                  <rect x="3" y="3" width="14" height="6" rx="1" fill="currentColor"/>
                </svg>
              </div>
            </div>

            {/* Content Area */}
            <div className="h-full pt-12 pb-8 overflow-y-auto custom-scrollbar">
              {children}
            </div>
          </div>
        </div>

        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-orange-500/10 rounded-[3rem] -z-10 blur-xl"></div>
      </div>

      {/* Mobile View - No frame */}
      <div className="md:hidden w-full">
        {children}
      </div>
    </div>
  );
}
