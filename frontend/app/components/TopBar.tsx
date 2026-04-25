"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMyProgress, ProgressResponse } from '../../lib/api';
import { useAuth } from '../../lib/auth-context';

export default function TopBar({ title }: { title: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [progress, setProgress] = useState<ProgressResponse | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      getMyProgress().then(setProgress).catch(console.error);
    }
  }, [isAuthenticated]);

  return (
    <header className="fixed top-0 right-0 left-0 h-[72px] bg-white border-b-4 border-black z-40 flex items-center justify-between px-6 md:px-12">
      <div className="flex items-center gap-6">
        <Link href="/map" className="font-space-grotesk text-2xl font-black text-black uppercase tracking-tighter flex items-center gap-2 hover:-translate-y-1 transition-transform">
          <span className="w-6 h-6 bg-[#A3E635] border-2 border-black inline-flex items-center justify-center shadow-[2px_2px_0_black]">
            <span className="material-symbols-outlined text-[16px] font-black text-black">terminal</span>
          </span>
          CodeLingo
        </Link>
        <div className="hidden md:flex font-space-grotesk text-xl font-black text-black uppercase tracking-tighter items-center gap-2 border-l-4 border-black pl-6">
          <span className="w-4 h-4 bg-[#FF00FF] border-2 border-black inline-block shadow-[2px_2px_0_black]"></span>
          {title}
        </div>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        <Link href="/leaderboard" className="hidden lg:flex items-center gap-2 bg-[#00FFFF] border-4 border-black px-4 py-2 shadow-[4px_4px_0_black] font-jetbrains-mono font-bold text-black uppercase hover:-translate-y-1 hover:shadow-[6px_6px_0_black] active:translate-y-[2px] active:shadow-[0_0_0_black] transition-all">
          <span className="material-symbols-outlined text-[18px]">military_tech</span>
          <span className="text-sm">Leaderboard</span>
        </Link>

        {isAuthenticated && (
          <>
            <div className="hidden sm:flex items-center gap-2 bg-[#FFD700] border-4 border-black px-4 py-2 shadow-[4px_4px_0_black] font-jetbrains-mono font-bold text-black uppercase">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span className="text-sm">XP {progress?.experience_points ?? 0}</span>
            </div>
            
            <div className="flex items-center gap-2 bg-[#FF90E8] border-4 border-black px-4 py-2 shadow-[4px_4px_0_black] font-jetbrains-mono font-bold text-black uppercase">
              <span className="material-symbols-outlined text-[18px] filled-icon">favorite</span>
              <span className="text-sm">{progress?.health_points ?? 0}/{progress?.max_health_points ?? 5}</span>
            </div>
          </>
        )}

        <Link href="/profile" className="flex items-center justify-center bg-black border-4 border-black text-white w-10 h-10 shadow-[4px_4px_0_black] hover:-translate-y-1 hover:shadow-[6px_6px_0_black] active:translate-y-[2px] active:shadow-[0_0_0_black] transition-all">
          <span className="material-symbols-outlined text-[20px]">person</span>
        </Link>
      </div>
    </header>
  );
}
