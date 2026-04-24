import React from 'react';
import Link from 'next/link';
import TopBar from './TopBar';

interface SuccessScreenProps {
  onNextChallenge: () => void;
  xpEarned?: number;
  streak?: number;
  accuracy?: number;
}

export default function SuccessScreen({ 
  onNextChallenge, 
  xpEarned = 35, 
  streak = 48, 
  accuracy = 100 
}: SuccessScreenProps) {
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
                  Systems optimized. Expected parameters exceeded.
                </p>
              </div>
            </div>

            {/* Result Grid */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start z-10">
              
              {/* Stats Section */}
              <div className="lg:col-span-7 grid grid-cols-3 gap-6">
                <div className="bg-white rounded-none p-6 flex flex-col items-center justify-center border-4 border-black shadow-[8px_8px_0_black] hover:-translate-y-2 transition-transform cursor-default group">
                  <span className="material-symbols-outlined text-black text-4xl mb-4 group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
                  <span className="font-space-grotesk text-3xl text-black font-black">+{xpEarned} XP</span>
                  <span className="font-jetbrains-mono text-black uppercase tracking-widest mt-2 font-bold text-xs bg-[#FF00FF] text-white px-2 py-1 border-2 border-black">Combat Bonus</span>
                </div>
                
                <div className="bg-white rounded-none p-6 flex flex-col items-center justify-center border-4 border-black shadow-[8px_8px_0_black] hover:-translate-y-2 transition-transform cursor-default group">
                  <span className="material-symbols-outlined text-black text-4xl mb-4 group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                  <span className="font-space-grotesk text-3xl text-black font-black">{streak}</span>
                  <span className="font-jetbrains-mono text-black uppercase tracking-widest mt-2 font-bold text-xs bg-[#FFD700] px-2 py-1 border-2 border-black">Day Streak</span>
                </div>
                
                <div className="bg-white rounded-none p-6 flex flex-col items-center justify-center border-4 border-black shadow-[8px_8px_0_black] hover:-translate-y-2 transition-transform cursor-default group">
                  <span className="material-symbols-outlined text-black text-4xl mb-4 group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  <span className="font-space-grotesk text-3xl text-black font-black">{accuracy}%</span>
                  <span className="font-jetbrains-mono text-black uppercase tracking-widest mt-2 font-bold text-xs bg-[#00FFFF] px-2 py-1 border-2 border-black">Accuracy</span>
                </div>
                
                {/* Progress Bar Row */}
                <div className="col-span-3 bg-white p-8 border-4 border-black shadow-[8px_8px_0_black] relative group mt-2">
                  <div className="flex justify-between items-end mb-6 relative z-10">
                    <div className="flex flex-col">
                      <span className="font-jetbrains-mono text-black uppercase tracking-[0.2em] font-black mb-2 text-sm bg-[#FFD700] px-2 py-1 border-2 border-black w-max">Rank Progression</span>
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-black text-black font-space-grotesk">LEVEL 14</span>
                        <span className="material-symbols-outlined text-black text-3xl">trending_flat</span>
                        <span className="text-2xl font-black text-black font-space-grotesk">LEVEL 15</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-jetbrains-mono text-xl text-black font-black">850 / 900 XP</span>
                      <span className="text-[10px] text-black uppercase tracking-widest font-bold">50 XP to next level</span>
                    </div>
                  </div>
                  <div className="h-8 w-full bg-white border-4 border-black relative z-10">
                    <div className="h-full bg-[#FFD700] w-[94%] border-r-4 border-black"></div>
                  </div>
                </div>
              </div>

              {/* Actions Section */}
              <div className="lg:col-span-5 flex flex-col gap-6 h-full">
                <button 
                  onClick={onNextChallenge}
                  className="w-full py-8 bg-[#FF00FF] text-white border-4 border-black font-space-grotesk text-2xl font-black uppercase tracking-widest shadow-[8px_8px_0_black] flex items-center justify-center gap-4 hover:-translate-y-2 hover:translate-x-[-4px] hover:shadow-[12px_12px_0_black] active:translate-y-[4px] active:translate-x-[4px] active:shadow-[0px_0px_0px_black] transition-all group"
                >
                  <span>Next Mission</span>
                  <span className="material-symbols-outlined text-4xl group-hover:translate-x-2 transition-transform">keyboard_double_arrow_right</span>
                </button>
                
                <div className="grid grid-cols-2 gap-6 flex-grow">
                  <Link href="/map" className="h-full min-h-[140px] bg-white border-4 border-black shadow-[6px_6px_0_black] flex flex-col items-center justify-center gap-3 hover:-translate-y-2 hover:translate-x-[-2px] hover:shadow-[8px_8px_0_black] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[2px_2px_0px_black] transition-all group">
                    <div className="w-16 h-16 rounded-none bg-[#FF90E8] border-4 border-black flex items-center justify-center shadow-[4px_4px_0_black]">
                      <span className="material-symbols-outlined text-black text-3xl">map</span>
                    </div>
                    <span className="tracking-widest uppercase font-black font-space-grotesk text-black mt-2">View Map</span>
                  </Link>
                  <button className="h-full min-h-[140px] bg-white border-4 border-black shadow-[6px_6px_0_black] flex flex-col items-center justify-center gap-3 hover:-translate-y-2 hover:translate-x-[-2px] hover:shadow-[8px_8px_0_black] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[2px_2px_0px_black] transition-all group">
                    <div className="w-16 h-16 rounded-none bg-[#00FFFF] border-4 border-black flex items-center justify-center shadow-[4px_4px_0_black]">
                      <span className="material-symbols-outlined text-black text-3xl">share</span>
                    </div>
                    <span className="tracking-widest uppercase font-black font-space-grotesk text-black mt-2">Share Log</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-20" style={{ backgroundImage: "radial-gradient(#000 2px, transparent 2px)", backgroundSize: "32px 32px" }}></div>
    </div>
  );
}
