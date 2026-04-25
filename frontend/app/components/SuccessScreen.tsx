import React from 'react';
import Link from 'next/link';
import TopBar from './TopBar';

interface SuccessScreenProps {
  onNextChallenge: () => void;
  xpEarned?: number;
  streak?: number;
  accuracy?: number;
  currentXp?: number;
  level?: number;
  levelName?: string;
  xpForCurrentLevel?: number;
  xpForNextLevel?: number | null;
  xpToNextLevel?: number | null;
  missionsCompleted?: number;
  missionsTotal?: number;
}

export default function SuccessScreen({ 
  onNextChallenge, 
  xpEarned = 0, 
  streak = 1, 
  currentXp = 0,
  level = 1,
  levelName = "Newcomer",
  xpForCurrentLevel = 0,
  xpForNextLevel = 100,
  xpToNextLevel = 100,
  missionsCompleted = 0,
  missionsTotal = 5
}: SuccessScreenProps) {
  
  const progressPercent = xpForNextLevel 
    ? Math.min(100, Math.max(0, ((currentXp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100))
    : 100;

  return (
    <div className="fixed inset-0 z-[100] bg-[#A3E635] text-black font-space-grotesk flex overflow-hidden selection:bg-black selection:text-white">

      {/* Main App Content */}
      <div className="flex-grow flex flex-col h-screen relative z-10 pt-[72px]">
        <TopBar title={<><span>Mission Status</span> — Success</>} />

        {/* Content Canvas */}
        <main className="flex-grow overflow-y-auto no-scrollbar flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-5xl flex flex-col items-center">
            
            {/* Celebration Hero */}
            <div className="relative w-full flex flex-col items-center mb-12">
              {/* Title Content */}
              <div className="text-center space-y-4 bg-white border-4 border-black p-8 shadow-[12px_12px_0_black] z-20">
                <h1 className="font-space-grotesk text-5xl md:text-7xl tracking-tighter uppercase font-black text-black">
                  Mission Cleared
                </h1>
                <p className="font-jetbrains-mono text-xl text-black font-bold tracking-widest max-w-2xl mx-auto uppercase bg-[#FFD700] border-4 border-black inline-block px-4 py-2 shadow-[4px_4px_0_black]">
                  Systems optimized. {levelName} protocol updated.
                </p>
              </div>
            </div>

            {/* Result Grid */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start z-10">
              
              {/* Stats Section */}
              <div className="lg:col-span-7 grid grid-cols-2 gap-6">
                <div className="bg-black rounded-none p-8 flex flex-col items-center justify-center border-4 border-black shadow-[8px_8px_0_#FF00FF] hover:-translate-y-2 transition-transform cursor-default group">
                  <span className="material-symbols-outlined text-[#A3E635] text-5xl mb-4 group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
                  <span className="font-space-grotesk text-5xl text-white font-black">+{xpEarned}</span>
                  <span className="font-jetbrains-mono text-black uppercase tracking-widest mt-4 font-black text-sm bg-[#A3E635] px-4 py-1 border-2 border-black">XP GAINED</span>
                </div>
                
                <div className="bg-white rounded-none p-8 flex flex-col items-center justify-center border-4 border-black shadow-[8px_8px_0_black] hover:-translate-y-2 transition-transform cursor-default group">
                  <span className="material-symbols-outlined text-[#FF00FF] text-5xl mb-4 group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
                  <span className="font-space-grotesk text-4xl text-black font-black">{missionsCompleted} / {missionsTotal}</span>
                  <span className="font-jetbrains-mono text-black uppercase tracking-widest mt-4 font-bold text-xs bg-[#00FFFF] px-3 py-1 border-2 border-black">Subtopic Progress</span>
                </div>
                
                {/* Progress Bar Row */}
                <div className="col-span-2 bg-white p-8 border-4 border-black shadow-[8px_8px_0_black] relative group mt-2">
                  <div className="flex justify-between items-end mb-6 relative z-10">
                    <div className="flex flex-col">
                      <span className="font-jetbrains-mono text-black uppercase tracking-[0.2em] font-black mb-2 text-sm bg-[#FFD700] px-2 py-1 border-2 border-black w-max">Rank Progression</span>
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-black text-black font-space-grotesk">LEVEL {level}</span>
                        {xpForNextLevel && (
                          <>
                            <span className="material-symbols-outlined text-black text-3xl">trending_flat</span>
                            <span className="text-2xl font-black text-black font-space-grotesk">LEVEL {level + 1}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-jetbrains-mono text-xl text-black font-black">{currentXp} / {xpForNextLevel || currentXp} XP</span>
                      {xpToNextLevel !== null && (
                        <span className="text-[10px] text-black uppercase tracking-widest font-bold">{xpToNextLevel} XP to next level</span>
                      )}
                    </div>
                  </div>
                  <div className="h-8 w-full bg-white border-4 border-black relative z-10">
                    <div 
                      className="h-full bg-[#FFD700] border-r-4 border-black transition-all duration-1000 ease-out" 
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Actions Section */}
              <div className="lg:col-span-5 flex flex-col gap-6 h-full">
                <button 
                  onClick={onNextChallenge}
                  className="w-full py-8 bg-[#FF00FF] text-white border-4 border-black font-space-grotesk text-2xl font-black uppercase tracking-widest shadow-[8px_8px_0_black] flex items-center justify-center gap-4 hover:-translate-y-2 hover:translate-x-[-4px] hover:shadow-[12px_12px_0_black] active:translate-y-[4px] active:translate-x-[4px] active:shadow-[0px_0px_0px_black] transition-all group"
                >
                  <span>{missionsCompleted >= missionsTotal ? 'Protocol Complete' : 'Next Mission'}</span>
                  <span className="material-symbols-outlined text-4xl group-hover:translate-x-2 transition-transform">
                    {missionsCompleted >= missionsTotal ? 'workspace_premium' : 'keyboard_double_arrow_right'}
                  </span>
                </button>
                
                <div className="flex flex-col gap-6 flex-grow">
                  <Link href="/map" className="w-full py-8 bg-white border-4 border-black shadow-[6px_6px_0_black] flex flex-col items-center justify-center gap-3 hover:-translate-y-2 hover:translate-x-[-2px] hover:shadow-[8px_8px_0_black] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[2px_2px_0px_black] transition-all group">
                    <div className="w-16 h-16 rounded-none bg-[#FF90E8] border-4 border-black flex items-center justify-center shadow-[4px_4px_0_black]">
                      <span className="material-symbols-outlined text-black text-3xl">map</span>
                    </div>
                    <span className="tracking-widest uppercase font-black font-space-grotesk text-black mt-2">View Map</span>
                  </Link>
                </div>              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-20" style={{ backgroundImage: "radial-gradient(#000 2px, transparent 2px)", backgroundSize: "32px 32px" }}></div>
    </div>
  );
}
