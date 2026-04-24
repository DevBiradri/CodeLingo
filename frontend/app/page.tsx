import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-[#E5E7EB] text-black font-space-grotesk selection:bg-black selection:text-white pb-24 md:pb-0 relative overflow-hidden min-h-screen">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>
      
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 h-20 bg-white border-b-4 border-black flex justify-between items-center px-6 md:px-12">
        <div className="flex items-center gap-4 group">
          <div className="w-10 h-10 border-4 border-black bg-[#FF00FF] flex items-center justify-center shadow-[4px_4px_0_black] group-hover:-translate-y-1 group-hover:translate-x-[-1px] transition-transform">
            <span className="material-symbols-outlined text-white text-2xl font-black">terminal</span>
          </div>
          <span className="text-2xl font-black text-black tracking-tighter uppercase font-space-grotesk">CodeLingo</span>
        </div>
        
        <nav className="hidden lg:flex items-center gap-10 font-jetbrains-mono font-black tracking-widest">
          <a className="text-black hover:bg-black hover:text-white px-2 py-1 uppercase text-sm border-2 border-transparent hover:border-black transition-colors" href="#">Learn</a>
          <a className="text-black hover:bg-black hover:text-white px-2 py-1 uppercase text-sm border-2 border-transparent hover:border-black transition-colors" href="#">Projects</a>
          <a className="text-black hover:bg-black hover:text-white px-2 py-1 uppercase text-sm border-2 border-transparent hover:border-black transition-colors" href="#">Leaderboard</a>
        </nav>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 mr-2">
            <Link href="/login" className="font-jetbrains-mono font-black text-black hover:bg-[#00FFFF] px-4 py-2 border-4 border-black uppercase tracking-widest text-xs transition-colors shadow-[4px_4px_0_black] hover:-translate-y-1 hover:shadow-[6px_6px_0_black] active:translate-y-[2px] active:shadow-[0_0_0_black]">
              Login
            </Link>
            <Link href="/register" className="px-5 py-2 bg-[#FFD700] border-4 border-black font-jetbrains-mono font-black text-black uppercase tracking-widest text-xs transition-all shadow-[4px_4px_0_black] hover:-translate-y-1 hover:shadow-[6px_6px_0_black] active:translate-y-[2px] active:shadow-[0_0_0_black]">
              Join
            </Link>
          </div>
          <div className="flex items-center gap-4 border-l-4 border-black pl-6 h-10">
            <span className="material-symbols-outlined text-black font-black text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
            <span className="material-symbols-outlined text-black font-black text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
            <span className="material-symbols-outlined text-black font-black text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-4 border-black text-black mb-10 font-jetbrains-mono font-black text-xs uppercase tracking-[0.2em] shadow-[4px_4px_0_black]">
            <span className="material-symbols-outlined text-sm">rocket_launch</span>
            Learn to Code, Simplified
          </div>
          
          <div className="bg-white border-4 border-black p-8 md:p-12 shadow-[16px_16px_0_black] mb-12">
            <h1 className="font-space-grotesk text-5xl md:text-8xl leading-none tracking-tighter text-black uppercase font-black">
              Learn Code By <span className="bg-[#A3E635] px-2 border-4 border-black inline-block mt-2 md:mt-0 transform -rotate-2">Doing</span>
            </h1>
          </div>
          
          <p className="font-jetbrains-mono text-xl text-black font-bold max-w-2xl mx-auto mb-12 leading-relaxed bg-[#00FFFF] border-4 border-black p-4 shadow-[8px_8px_0_black]">
            Practice coding with real-world problems, build cool projects, and level up your skills in a fun and interactive way.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full sm:w-auto">
            <Link href="/register" className="w-full sm:w-auto h-20 px-12 bg-[#FF00FF] border-4 border-black text-white font-space-grotesk text-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-[8px_8px_0_black] hover:-translate-y-2 hover:translate-x-[-2px] hover:shadow-[12px_12px_0_black] active:translate-y-[4px] active:translate-x-[4px] active:shadow-[0_0_0_black] transition-all">
              Start Learning
              <span className="material-symbols-outlined text-4xl">bolt</span>
            </Link>
            <button className="w-full sm:w-auto h-20 px-12 bg-white border-4 border-black text-black font-space-grotesk text-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-[8px_8px_0_black] hover:-translate-y-2 hover:translate-x-[-2px] hover:shadow-[12px_12px_0_black] active:translate-y-[4px] active:translate-x-[4px] active:shadow-[0_0_0_black] transition-all">
              View Courses
            </button>
          </div>
        </div>
      </section>

      {/* Perks Bento Grid */}
      <section className="py-32 relative px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center flex flex-col items-center">
            <div className="bg-black text-white font-jetbrains-mono font-black tracking-widest uppercase text-xs mb-6 px-4 py-2 border-4 border-black shadow-[4px_4px_0_black]">Features</div>
            <h2 className="font-space-grotesk text-5xl md:text-7xl font-black text-black uppercase tracking-tighter bg-white border-4 border-black px-6 py-4 shadow-[12px_12px_0_black]">What You Will Get</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Perk 1: Narrative */}
            <div className="md:col-span-8 group relative overflow-hidden bg-[#FFD700] border-4 border-black shadow-[12px_12px_0_black] p-10 h-auto md:h-[450px] flex flex-col justify-between hover:-translate-y-2 hover:shadow-[16px_16px_0_black] transition-transform">
              <div className="bg-black text-white px-3 py-1 font-jetbrains-mono font-black text-sm uppercase tracking-widest w-max border-2 border-black">01 // Skill Tree</div>
              <div className="mt-8 md:mt-0">
                <h3 className="font-space-grotesk text-4xl md:text-6xl font-black text-black mb-6 uppercase tracking-tighter leading-none bg-white border-4 border-black inline-block p-4">Structured<br/>Roadmap</h3>
                <p className="font-jetbrains-mono text-lg font-bold text-black max-w-xl leading-relaxed bg-white/80 p-4 border-4 border-black">
                  Follow a structured path from basics to advanced programming concepts. Click on a node to learn a quick tip and unlock its challenges.
                </p>
              </div>
            </div>

            {/* Perk 2: Real-time */}
            <div className="md:col-span-4 bg-white border-4 border-black shadow-[12px_12px_0_black] p-10 flex flex-col hover:-translate-y-2 hover:shadow-[16px_16px_0_black] transition-transform">
              <div className="w-20 h-20 bg-[#A3E635] flex items-center justify-center mb-8 border-4 border-black shadow-[4px_4px_0_black]">
                <span className="material-symbols-outlined text-black text-5xl font-black">code</span>
              </div>
              <h3 className="font-space-grotesk text-3xl font-black text-black mb-4 uppercase tracking-tighter leading-none">3 Challenge Modes</h3>
              <p className="font-jetbrains-mono text-black font-bold mb-8 leading-relaxed">
                Test your knowledge by dragging blocks to build code, predicting the output of scripts, or refactoring code in a real editor.
              </p>
              <div className="bg-[#F3F4F6] border-4 border-black p-4 font-jetbrains-mono text-sm font-bold shadow-inner mt-auto">
                <div className="flex gap-2 mb-4">
                  <div className="w-4 h-4 bg-black"></div>
                  <div className="w-4 h-4 bg-black"></div>
                  <div className="w-4 h-4 bg-black"></div>
                </div>
                <div className="space-y-1">
                  <p><code className="text-[#FF00FF]">def</code> <code className="text-blue-600">hello_world</code>():</p>
                  <p className="pl-4"><code className="text-gray-500 italic"># Print message</code></p>
                  <p className="pl-4"><code className="text-black">print("Hello!")</code></p>
                </div>
              </div>
            </div>

            {/* Perk 3: AI Tutor */}
            <div className="md:col-span-4 bg-white border-4 border-black shadow-[12px_12px_0_black] p-10 relative overflow-hidden hover:-translate-y-2 hover:shadow-[16px_16px_0_black] transition-transform flex flex-col">
              <div className="w-20 h-20 bg-[#00FFFF] flex items-center justify-center mb-8 border-4 border-black shadow-[4px_4px_0_black]">
                <span className="material-symbols-outlined text-black text-5xl font-black">smart_toy</span>
              </div>
              <h3 className="font-space-grotesk text-3xl font-black text-black mb-4 uppercase tracking-tighter leading-none">Built-in Editor</h3>
              <p className="font-jetbrains-mono text-black font-bold leading-relaxed">
                Refactor code and solve problems directly in the browser with our integrated Monaco editor, complete with a sleek neobrutalist theme.
              </p>
            </div>

            {/* Perk 4: Habits */}
            <div className="md:col-span-8 bg-[#FF00FF] border-4 border-black shadow-[12px_12px_0_black] p-10 h-auto flex flex-col justify-center hover:-translate-y-2 hover:shadow-[16px_16px_0_black] transition-transform">
              <div className="flex flex-col lg:flex-row items-center gap-10">
                <div className="flex-1">
                  <h3 className="font-space-grotesk text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter leading-none bg-black border-4 border-black inline-block p-4 shadow-[6px_6px_0_white]">Climb the Ranks</h3>
                  <p className="font-jetbrains-mono text-xl font-bold text-black bg-white p-4 border-4 border-black leading-relaxed">
                    Earn XP by completing challenges, maintain your daily streaks, and compete with other learners on the global leaderboard.
                  </p>
                </div>
                <div className="flex flex-col gap-6 w-full lg:w-auto">
                  <div className="px-6 py-4 bg-white border-4 border-black flex items-center gap-4 shadow-[6px_6px_0_black]">
                    <span className="material-symbols-outlined text-[#FFD700] text-4xl font-black" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                    <span className="font-space-grotesk font-black text-black text-2xl uppercase tracking-tighter">42 DAY STREAK</span>
                  </div>
                  <div className="px-6 py-4 bg-[#A3E635] border-4 border-black flex items-center gap-4 shadow-[6px_6px_0_black]">
                    <span className="material-symbols-outlined text-black text-4xl font-black">military_tech</span>
                    <span className="font-space-grotesk font-black text-black text-2xl uppercase tracking-tighter">LEVEL 14</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-[#A3E635] border-y-4 border-black relative">
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
          <h2 className="font-space-grotesk text-5xl md:text-7xl font-black text-black uppercase tracking-tighter mb-10 leading-none bg-white border-4 border-black p-8 shadow-[12px_12px_0_black] inline-block transform rotate-1">
            Ready to Start <br/>Learning?
          </h2>
          <p className="font-jetbrains-mono text-xl font-bold text-black mb-14 max-w-2xl mx-auto leading-relaxed bg-white border-4 border-black p-4 shadow-[6px_6px_0_black]">
            Join thousands of learners worldwide who have transformed their coding journey into a fun adventure.
          </p>
          <Link href="/register" className="h-24 px-16 bg-black text-white font-space-grotesk text-3xl font-black uppercase tracking-widest border-4 border-black shadow-[12px_12px_0_black] hover:-translate-y-2 hover:translate-x-[-2px] hover:shadow-[16px_16px_0_black] active:translate-y-[4px] active:translate-x-[4px] active:shadow-[0_0_0_black] transition-all flex items-center justify-center group transform -rotate-1">
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-20 bg-white border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 border-4 border-black bg-black flex items-center justify-center shadow-[4px_4px_0_black]">
                <span className="material-symbols-outlined text-white text-xl font-black">terminal</span>
              </div>
              <div className="text-3xl font-black text-black font-space-grotesk uppercase tracking-tighter">CodeLingo</div>
            </div>
            <div className="font-jetbrains-mono text-xs font-black tracking-widest text-black uppercase bg-[#F3F4F6] border-2 border-black inline-block px-2 py-1">
              © 2024 CODELINGO // LEARN TO CODE WITH FUN
            </div>
          </div>
          <div className="flex flex-wrap gap-x-10 gap-y-6 md:justify-end">
            <a className="font-jetbrains-mono text-sm font-black tracking-widest text-black hover:bg-black hover:text-white px-2 py-1 transition-colors uppercase border-2 border-transparent hover:border-black" href="#">Blog</a>
            <a className="font-jetbrains-mono text-sm font-black tracking-widest text-black hover:bg-black hover:text-white px-2 py-1 transition-colors uppercase border-2 border-transparent hover:border-black" href="#">About Us</a>
            <a className="font-jetbrains-mono text-sm font-black tracking-widest text-black hover:bg-black hover:text-white px-2 py-1 transition-colors uppercase border-2 border-transparent hover:border-black" href="#">Terms of Service</a>
            <a className="font-jetbrains-mono text-sm font-black tracking-widest text-black hover:bg-black hover:text-white px-2 py-1 transition-colors uppercase border-2 border-transparent hover:border-black" href="#">Support</a>
          </div>
        </div>
      </footer>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-24 bg-white border-t-4 border-black flex justify-around items-center px-4 z-50">
        <a className="flex flex-col items-center justify-center text-black hover:-translate-y-1 transition-transform" href="#">
          <div className="w-12 h-12 bg-[#FF00FF] border-4 border-black shadow-[4px_4px_0_black] flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-2xl font-black" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
          </div>
          <span className="font-jetbrains-mono text-[10px] font-black uppercase tracking-widest mt-2">Learn</span>
        </a>
        <a className="flex flex-col items-center justify-center text-black hover:-translate-y-1 transition-transform" href="#">
          <div className="w-12 h-12 bg-white border-4 border-black shadow-[4px_4px_0_black] flex items-center justify-center">
            <span className="material-symbols-outlined text-black text-2xl font-black">handyman</span>
          </div>
          <span className="font-jetbrains-mono text-[10px] font-black uppercase tracking-widest mt-2">Projects</span>
        </a>
        <a className="flex flex-col items-center justify-center text-black hover:-translate-y-1 transition-transform" href="/leaderboard">
          <div className="w-12 h-12 bg-white border-4 border-black shadow-[4px_4px_0_black] flex items-center justify-center">
            <span className="material-symbols-outlined text-black text-2xl font-black">leaderboard</span>
          </div>
          <span className="font-jetbrains-mono text-[10px] font-black uppercase tracking-widest mt-2">Leaderboard</span>
        </a>
        <Link className="flex flex-col items-center justify-center text-black hover:-translate-y-1 transition-transform" href="/login">
          <div className="w-12 h-12 bg-white border-4 border-black shadow-[4px_4px_0_black] flex items-center justify-center">
            <span className="material-symbols-outlined text-black text-2xl font-black">person</span>
          </div>
          <span className="font-jetbrains-mono text-[10px] font-black uppercase tracking-widest mt-2">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
