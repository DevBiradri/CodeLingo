"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TopBar from '../components/TopBar';
import { useAuth } from '../../lib/auth-context';
import { getMyProgress, ProgressResponse, updateLanguage } from '../../lib/api';

export default function ProfilePage() {
  const { user, logout, setUser } = useAuth();
  const router = useRouter();
  const [progress, setProgress] = useState<ProgressResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingLang, setIsUpdatingLang] = useState(false);
  const [langError, setLangError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProgress() {
      try {
        const data = await getMyProgress();
        setProgress(data);
      } catch (err) {
        console.error("Failed to fetch progress", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProgress();
  }, []);

  if (!user) {
    return (
      <div className="bg-[#E5E7EB] min-h-screen flex items-center justify-center font-space-grotesk">
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_black] text-center">
          <h2 className="text-2xl font-black uppercase mb-4">Unauthorized Access</h2>
          <Link href="/login" className="bg-[#FF00FF] text-white border-2 border-black px-4 py-2 font-bold uppercase hover:bg-black transition-colors">
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="bg-[#E5E7EB] text-black font-space-grotesk overflow-x-hidden min-h-screen selection:bg-black selection:text-white">
      <TopBar title={<><span>Operative</span> — Dossier</>} />

      <main className="pt-[72px] pb-32 px-6 md:px-12 min-h-screen flex flex-col items-center justify-center">
        
        {/* Main Profile Card */}
        <div className="w-full max-w-3xl mt-12 bg-white border-4 border-black shadow-[16px_16px_0_black] flex flex-col relative z-10">
          
          {/* Header Section */}
          <div className="flex flex-col border-b-4 border-black">
            
            {/* Info Block */}
            <div className="w-full p-8 flex flex-col justify-center text-center md:text-left bg-[#FF00FF]">
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-2" style={{ textShadow: '4px 4px 0 #000' }}>
                {user.name || user.username}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
                <span className="font-jetbrains-mono font-bold uppercase text-sm bg-black text-white px-3 py-1 border-2 border-black">
                  Lvl {progress?.level || 1}
                </span>
                <span className="font-jetbrains-mono font-bold uppercase text-sm bg-[#A3E635] text-black px-3 py-1 border-2 border-black">
                  {progress?.level_name || "Newcomer"}
                </span>
              </div>
              <p className="font-jetbrains-mono font-bold uppercase text-black/60 tracking-widest text-sm">
                ID: {user.id.split('-')[0].toUpperCase()}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-b-4 border-black font-jetbrains-mono uppercase">
            
            <div className="p-6 border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col items-center text-center bg-[#00FFFF] hover:bg-white transition-colors">
              <span className="text-3xl font-black mb-1">{progress?.experience_points || 0}</span>
              <span className="text-xs font-bold tracking-widest">Total XP</span>
            </div>
            
            <div className="p-6 border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col items-center text-center bg-[#FFD700] hover:bg-white transition-colors">
              <span className="text-3xl font-black mb-1">{progress?.health_points || 0}</span>
              <span className="text-xs font-bold tracking-widest">Health (HP)</span>
            </div>
            
            <div className="p-6 flex flex-col items-center text-center bg-[#FF90E8] hover:bg-white transition-colors">
              <span className="text-3xl font-black mb-1">{progress?.xp_to_next_level || 0}</span>
              <span className="text-xs font-bold tracking-widest">To Next Lvl</span>
            </div>

          </div>

          {/* Activity Log (Static for now as backend doesn't have it yet) */}
          <div className="p-8 bg-[#F3F4F6]">
            <h2 className="font-space-grotesk text-2xl font-black uppercase mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">history</span>
              Recent Activity
            </h2>
            <div className="flex flex-col gap-4 font-jetbrains-mono">
              <div className="flex items-center justify-between border-2 border-black bg-white p-4 shadow-[4px_4px_0_black]">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 border-2 border-black bg-[#A3E635]"></div>
                  <span className="font-bold text-sm uppercase">Synchronized with Mainframe</span>
                </div>
                <span className="text-xs font-bold opacity-50 uppercase tracking-widest">Just now</span>
              </div>
            </div>
          </div>

          {/* Language Selection */}
          <div className="p-8 bg-white border-t-4 border-black border-b-4 border-black">
            <h2 className="font-space-grotesk text-2xl font-black uppercase mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">language</span>
              System Language
            </h2>
            
            {langError && (
              <div className="mb-4 text-red-500 font-jetbrains-mono text-sm font-bold bg-red-50 border-2 border-red-500 p-2">
                {langError}
              </div>
            )}
            
            <div className="flex flex-wrap gap-4">
              {['Python', 'JavaScript', 'Go', 'C++', 'Rust'].map(lang => {
                const isSelected = user?.preferred_languages?.includes(lang);
                return (
                  <button
                    key={lang}
                    disabled={isUpdatingLang || isSelected}
                    onClick={async () => {
                      setIsUpdatingLang(true);
                      setLangError(null);
                      try {
                        const updatedUser = await updateLanguage(lang);
                        setUser(updatedUser);
                      } catch(err) {
                        setLangError(err instanceof Error ? err.message : "Failed to update language");
                      } finally {
                        setIsUpdatingLang(false);
                      }
                    }}
                    className={`px-6 py-3 font-jetbrains-mono font-black text-lg border-4 transition-all ${
                      isSelected
                        ? 'bg-[#A3E635] border-black shadow-[4px_4px_0_black] -translate-y-1'
                        : 'bg-[#F3F4F6] border-black hover:bg-black hover:text-white hover:-translate-y-1 shadow-[4px_4px_0_black]'
                    }`}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
            {isUpdatingLang && <p className="mt-4 font-jetbrains-mono text-sm animate-pulse text-black font-bold">Syncing with Mainframe...</p>}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center p-8 bg-[#F3F4F6]">
            <button 
              onClick={handleLogout}
              className="px-12 py-4 bg-[#FF3B30] text-white border-4 border-black font-space-grotesk font-black uppercase tracking-widest hover:-translate-y-1 hover:shadow-[4px_4px_0_black] active:translate-y-[2px] active:shadow-[0_0_0_black] transition-all"
            >
              Abort Session
            </button>
          </div>

        </div>

      </main>
    </div>
  );
}
