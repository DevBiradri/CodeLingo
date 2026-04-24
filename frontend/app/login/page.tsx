import React from 'react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="bg-[#E5E7EB] text-black min-h-screen font-space-grotesk overflow-x-hidden selection:bg-black selection:text-white flex items-center justify-center p-6 relative">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>

      {/* Main Content Shell */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen max-w-lg w-full mx-auto">
        
        {/* Header Branding */}
        <header className="w-full flex flex-col items-center mb-10 bg-white border-4 border-black p-6 shadow-[8px_8px_0_black]">
          <Link href="/" className="group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 border-4 border-black bg-[#A3E635] flex items-center justify-center shadow-[4px_4px_0_black] group-hover:-translate-y-1 group-hover:translate-x-[-1px] group-hover:shadow-[6px_6px_0_black] transition-all">
                <span className="material-symbols-outlined text-black text-3xl font-black">terminal</span>
              </div>
              <h1 className="font-space-grotesk text-5xl font-black text-black tracking-tighter uppercase">
                CodeLingo
              </h1>
            </div>
          </Link>
          <p className="font-jetbrains-mono text-sm text-black font-bold uppercase tracking-[0.2em] bg-[#FFD700] border-2 border-black px-4 py-1 shadow-[2px_2px_0_black]">
            Login Page
          </p>
        </header>

        {/* Central Login Component */}
        <div className="w-full bg-white p-8 md:p-12 flex flex-col items-center border-4 border-black shadow-[12px_12px_0_black] relative">
          
          {/* Profile Icon */}
          <div className="relative mb-8 mt-4">
            <div className="w-24 h-24 bg-[#FF00FF] flex items-center justify-center border-4 border-black shadow-[6px_6px_0_black]">
              <span className="material-symbols-outlined text-white text-6xl">account_circle</span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#A3E635] border-4 border-black shadow-[2px_2px_0_black]"></div>
          </div>

          {/* Narrative Intro */}
          <div className="text-center mb-10 space-y-2">
            <h2 className="font-space-grotesk text-3xl font-black text-black uppercase tracking-tighter">Welcome Back</h2>
            <p className="font-jetbrains-mono text-black font-bold">
              Enter your details to login
            </p>
          </div>

          {/* Credentials Input */}
          <div className="w-full space-y-6 mb-10">
            <div className="space-y-2 group/input">
              <label className="font-jetbrains-mono text-sm font-black text-black uppercase tracking-widest bg-[#00FFFF] border-2 border-black px-2 py-1 shadow-[2px_2px_0_black]">Username</label>
              <div className="relative mt-2">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-black text-2xl">person</span>
                <input 
                  className="w-full bg-[#F3F4F6] border-4 border-black py-4 pl-14 pr-4 text-black font-jetbrains-mono font-bold text-lg focus:bg-white focus:shadow-[4px_4px_0_black] hover:shadow-[4px_4px_0_black] transition-all outline-none placeholder:text-gray-500" 
                  placeholder="your username" 
                  type="text" 
                />
              </div>
            </div>
            
            <div className="space-y-2 group/input pt-4">
              <label className="font-jetbrains-mono text-sm font-black text-black uppercase tracking-widest bg-[#FFD700] border-2 border-black px-2 py-1 shadow-[2px_2px_0_black]">Password</label>
              <div className="relative mt-2">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-black text-2xl">key</span>
                <input 
                  className="w-full bg-[#F3F4F6] border-4 border-black py-4 pl-14 pr-14 text-black font-jetbrains-mono font-bold text-lg focus:bg-white focus:shadow-[4px_4px_0_black] hover:shadow-[4px_4px_0_black] transition-all outline-none placeholder:text-gray-500" 
                  placeholder="••••••••" 
                  type="password" 
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:text-[#FF00FF] transition-colors">
                  <span className="material-symbols-outlined text-2xl font-black">visibility</span>
                </button>
              </div>
            </div>
            
            <div className="text-right">
              <a className="font-jetbrains-mono text-sm text-black font-black uppercase tracking-widest hover:bg-black hover:text-white px-2 py-1 transition-colors" href="#">Forgot Password?</a>
            </div>
          </div>

          {/* Primary Actions */}
          <div className="w-full space-y-6">
            <Link href="/choose-language" className="w-full py-5 bg-[#FF00FF] border-4 border-black text-white font-space-grotesk text-2xl font-black uppercase shadow-[8px_8px_0_black] hover:-translate-y-2 hover:translate-x-[-2px] hover:shadow-[12px_12px_0_black] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[0px_0px_0px_black] transition-all flex items-center justify-center gap-4 group block text-center">
              Login
              <span className="material-symbols-outlined text-3xl font-black group-hover:translate-x-2 transition-transform">login</span>
            </Link>
            
            <div className="text-center pt-8 border-t-4 border-black mt-6">
              <p className="font-jetbrains-mono text-base font-bold text-black">
                Don't have an account? 
                <Link className="text-black bg-[#A3E635] border-2 border-black px-2 py-1 shadow-[2px_2px_0_black] font-black uppercase tracking-widest hover:bg-black hover:text-[#A3E635] transition-colors ml-3" href="/register">SIGN UP</Link>
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
