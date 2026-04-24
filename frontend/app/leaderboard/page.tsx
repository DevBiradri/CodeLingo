import React from 'react';
import TopBar from '../components/TopBar';

const leaderboardData = [
  { id: 1, name: "NeonCoder", level: 42, xp: 12500, rank: 1, isCurrentUser: false },
  { id: 2, name: "BYTE_Master", level: 38, xp: 11200, rank: 2, isCurrentUser: false },
  { id: 3, name: "SyntaxError", level: 35, xp: 9800, rank: 3, isCurrentUser: false },
  { id: 4, name: "OPERATIVE_01", level: 14, xp: 4500, rank: 4, isCurrentUser: true },
  { id: 5, name: "NullPointer", level: 12, xp: 3200, rank: 5, isCurrentUser: false },
  { id: 6, name: "DropTable", level: 9, xp: 2100, rank: 6, isCurrentUser: false },
  { id: 7, name: "HackThePlanet", level: 8, xp: 1950, rank: 7, isCurrentUser: false },
  { id: 8, name: "GhostInTheShell", level: 6, xp: 1400, rank: 8, isCurrentUser: false },
];

export default function LeaderboardPage() {
  return (
    <div className="bg-[#E5E7EB] text-black font-space-grotesk overflow-x-hidden min-h-screen selection:bg-black selection:text-white">
      <TopBar title={<><span>Global</span> — Leaderboard</>} />

      <main className="pt-[72px] pb-32 px-6 md:px-12 min-h-screen flex flex-col items-center">
        
        {/* Header Section */}
        <div className="w-full max-w-4xl mt-12 mb-10 text-center relative z-10 border-4 border-black bg-white shadow-[8px_8px_0_black] p-8">
          <h1 className="text-4xl md:text-6xl font-black text-black font-space-grotesk tracking-tighter uppercase mb-4">
            Global Rankings
          </h1>
          <p className="font-jetbrains-mono text-black uppercase text-sm md:text-base font-bold bg-[#A3E635] border-2 border-black inline-block px-4 py-2 shadow-[4px_4px_0_black]">
            Top Learners by XP Earned
          </p>
        </div>

        {/* Leaderboard Table Container */}
        <div className="w-full max-w-4xl relative">
          
          <div className="bg-white border-4 border-black shadow-[12px_12px_0_black]">
            
            {/* Table Header */}
            <div className="grid grid-cols-[60px_1fr_100px_100px] md:grid-cols-[80px_1fr_120px_120px] gap-4 px-6 py-4 bg-black border-b-4 border-black font-jetbrains-mono text-[12px] md:text-sm font-black text-white uppercase tracking-widest">
              <div className="text-center">Rank</div>
              <div>Learner</div>
              <div className="text-right">Level</div>
              <div className="text-right">XP</div>
            </div>

            {/* List */}
            <div className="flex flex-col">
              {leaderboardData.map((user, index) => {
                // Determine styling based on rank
                let rowBg = "hover:bg-[#E5E7EB] bg-white";
                let rankBadge = null;
                let rankColor = "bg-white";

                if (user.rank === 1) {
                  rowBg = "bg-[#FFD700] hover:bg-[#E6C200]";
                  rankColor = "bg-[#FFD700]";
                  rankBadge = <span className="material-symbols-outlined text-black text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>;
                } else if (user.rank === 2) {
                  rowBg = "bg-[#C0C0C0] hover:bg-[#A9A9A9]";
                  rankColor = "bg-[#C0C0C0]";
                  rankBadge = <span className="material-symbols-outlined text-black text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>;
                } else if (user.rank === 3) {
                  rowBg = "bg-[#CD7F32] hover:bg-[#B87333]";
                  rankColor = "bg-[#CD7F32]";
                  rankBadge = <span className="material-symbols-outlined text-black text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>;
                }

                if (user.isCurrentUser) {
                  rowBg = "bg-[#FF00FF] hover:bg-[#E600E6] text-white";
                }

                return (
                  <div 
                    key={user.id} 
                    className={`grid grid-cols-[60px_1fr_100px_100px] md:grid-cols-[80px_1fr_120px_120px] gap-4 px-6 py-4 items-center border-b-4 border-black last:border-b-0 transition-all duration-150 ${rowBg} group`}
                  >
                    {/* Rank */}
                    <div className={`text-center font-jetbrains-mono font-black text-xl md:text-2xl flex items-center justify-center border-4 border-black w-12 h-12 md:w-16 md:h-16 shadow-[4px_4px_0_black] ${rankColor} mx-auto ${user.isCurrentUser ? 'text-black' : 'text-black'}`}>
                      {rankBadge ? rankBadge : user.rank}
                    </div>

                    {/* Operative Info */}
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="flex flex-col min-w-0">
                        <span className={`font-black truncate text-lg md:text-xl uppercase ${user.isCurrentUser ? 'text-white' : 'text-black'}`}>
                          {user.name}
                        </span>
                        {user.isCurrentUser && (
                          <span className="text-xs font-jetbrains-mono font-black text-black bg-[#A3E635] px-2 py-0.5 border-2 border-black shadow-[2px_2px_0_black] uppercase tracking-wider w-max mt-1">
                            You
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Level */}
                    <div className="text-right flex flex-col items-end justify-center">
                      <span className={`text-lg md:text-2xl font-jetbrains-mono font-black ${user.isCurrentUser ? 'text-white' : 'text-black'}`}>
                        {user.level}
                      </span>
                      <span className={`text-[10px] font-space-grotesk uppercase font-bold tracking-widest hidden md:block ${user.isCurrentUser ? 'text-white' : 'text-black'}`}>
                        Level
                      </span>
                    </div>

                    {/* XP */}
                    <div className="text-right flex flex-col items-end justify-center">
                      <span className={`text-lg md:text-2xl font-jetbrains-mono font-black ${user.isCurrentUser ? 'text-[#00FFFF]' : 'text-black'}`}>
                        {user.xp.toLocaleString()}
                      </span>
                      <span className={`text-[10px] font-space-grotesk uppercase font-bold tracking-widest hidden md:block ${user.isCurrentUser ? 'text-white' : 'text-black'}`}>
                        XP
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

          {/* Footer message */}
          <div className="mt-8 text-center">
            <span className="font-jetbrains-mono text-black uppercase text-xs md:text-sm font-bold bg-[#00FFFF] border-4 border-black inline-block px-6 py-3 shadow-[4px_4px_0_black]">
              [ Rankings update every 5 minutes ]
            </span>
          </div>
        </div>

      </main>
    </div>
  );
}
