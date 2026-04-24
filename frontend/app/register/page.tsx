import React from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="bg-[#E5E7EB] text-black min-h-screen font-space-grotesk overflow-x-hidden selection:bg-black selection:text-white flex items-center justify-center p-6 relative">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>

      {/* Sign Up Container */}
      <main className="w-full max-w-[500px] flex flex-col items-center relative z-10 py-12">
        
        {/* Logo */}
        <div className="mb-10 text-center bg-white border-4 border-black p-6 shadow-[8px_8px_0_black] w-full">
          <Link href="/" className="group flex flex-col items-center justify-center">
            <h1 className="font-space-grotesk text-5xl font-black text-black uppercase tracking-tighter flex items-center gap-4">
              <span className="text-white bg-black px-2 py-1 border-4 border-black group-hover:bg-[#FF00FF] transition-colors">&gt;_</span> 
              CodeLingo
            </h1>
          </Link>
        </div>

        {/* Centered Card Layout */}
        <section className="bg-white w-full p-8 md:p-10 border-4 border-black shadow-[12px_12px_0_black] flex flex-col items-center">
          
          {/* Profile Placeholder */}
          <div className="relative mb-8 mt-4 group">
            <div className="w-24 h-24 bg-[#00FFFF] border-4 border-black shadow-[6px_6px_0_black] flex items-center justify-center relative overflow-hidden">
              <span className="material-symbols-outlined text-black text-5xl font-black" style={{ fontVariationSettings: "'FILL' 0" }}>person_add</span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#FFD700] border-4 border-black flex items-center justify-center shadow-[4px_4px_0_black] group-hover:-translate-y-1 group-hover:translate-x-[-1px] transition-transform">
              <span className="material-symbols-outlined text-black font-black">add</span>
            </div>
          </div>

          <div className="text-center mb-10">
            <h2 className="font-space-grotesk text-3xl font-black text-black uppercase tracking-tighter mb-2">Create an Account</h2>
            <p className="font-jetbrains-mono font-bold text-black bg-[#A3E635] border-2 border-black inline-block px-4 py-1 shadow-[2px_2px_0_black] uppercase text-sm">
              Sign Up
            </p>
          </div>

          {/* Form */}
          <form className="w-full space-y-6">
            
            {/* Full Name Field */}
            <div className="space-y-2 group/input">
              <label className="font-jetbrains-mono text-sm font-black text-black uppercase tracking-widest bg-[#FF90E8] border-2 border-black px-2 py-1 shadow-[2px_2px_0_black]" htmlFor="fullname">Username</label>
              <div className="relative mt-2">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-black text-2xl">badge</span>
                <input 
                  className="bg-[#F3F4F6] border-4 border-black w-full py-4 pl-14 pr-4 text-black font-jetbrains-mono font-bold text-lg focus:bg-white hover:shadow-[4px_4px_0_black] focus:shadow-[4px_4px_0_black] outline-none transition-all placeholder:text-gray-500" 
                  id="fullname" 
                  placeholder="Your Username" 
                  type="text"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2 group/input pt-2">
              <label className="font-jetbrains-mono text-sm font-black text-black uppercase tracking-widest bg-[#FFD700] border-2 border-black px-2 py-1 shadow-[2px_2px_0_black]" htmlFor="email">Email Address</label>
              <div className="relative mt-2">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-black text-2xl">alternate_email</span>
                <input 
                  className="bg-[#F3F4F6] border-4 border-black w-full py-4 pl-14 pr-4 text-black font-jetbrains-mono font-bold text-lg focus:bg-white hover:shadow-[4px_4px_0_black] focus:shadow-[4px_4px_0_black] outline-none transition-all placeholder:text-gray-500" 
                  id="email" 
                  placeholder="your@email.com" 
                  type="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2 group/input pt-2">
              <label className="font-jetbrains-mono text-sm font-black text-black uppercase tracking-widest bg-[#00FFFF] border-2 border-black px-2 py-1 shadow-[2px_2px_0_black]" htmlFor="password">Password</label>
              <div className="relative mt-2">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-black text-2xl">key</span>
                <input 
                  className="bg-[#F3F4F6] border-4 border-black w-full py-4 pl-14 pr-12 text-black font-jetbrains-mono font-bold text-lg focus:bg-white hover:shadow-[4px_4px_0_black] focus:shadow-[4px_4px_0_black] outline-none transition-all placeholder:text-gray-500" 
                  id="password" 
                  placeholder="••••••••" 
                  type="password"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:text-[#FF00FF] transition-colors" type="button">
                  <span className="material-symbols-outlined text-2xl font-black">visibility</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-8">
              <Link href="/choose-language" className="w-full py-5 bg-[#A3E635] border-4 border-black text-black font-space-grotesk text-2xl font-black uppercase shadow-[8px_8px_0_black] hover:-translate-y-2 hover:translate-x-[-2px] hover:shadow-[12px_12px_0_black] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[0px_0px_0px_black] transition-all flex items-center justify-center gap-4 group block text-center">
                SIGN UP NOW
                <span className="material-symbols-outlined text-3xl font-black group-hover:translate-x-2 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
              </Link>
            </div>
          </form>

          {/* Footer Link */}
          <div className="mt-10 pt-8 border-t-4 border-black w-full text-center">
            <p className="font-jetbrains-mono text-base font-bold text-black">
              Already have an account? 
              <Link className="text-black bg-[#FF00FF] text-white border-2 border-black px-2 py-1 shadow-[2px_2px_0_black] font-black uppercase tracking-widest hover:bg-black hover:text-[#FF00FF] transition-colors ml-3" href="/login">LOG IN</Link>
            </p>
          </div>
        </section>

        <p className="mt-10 font-jetbrains-mono text-xs text-black font-bold text-center px-4 uppercase tracking-widest leading-relaxed bg-white border-4 border-black p-4 shadow-[4px_4px_0_black]">
          By enlisting, you agree to the <span className="underline hover:bg-black hover:text-white cursor-pointer transition-colors px-1">Terms of Service</span> and <span className="underline hover:bg-black hover:text-white cursor-pointer transition-colors px-1">Privacy Policy</span>.
        </p>
      </main>
    </div>
  );
}
