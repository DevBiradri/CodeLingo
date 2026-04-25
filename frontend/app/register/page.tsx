"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { registerUser } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Basic client-side validation
    if (name.trim().length < 2) {
      setError("Username must be at least 2 characters.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const data = await registerUser(email.trim(), name.trim(), password);
      setUser(data.user);
      router.push("/choose-language");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

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

          {/* Error Message */}
          {error && (
            <div className="w-full mb-6 bg-red-50 border-4 border-red-500 p-4 shadow-[4px_4px_0_#ef4444] flex items-start gap-3">
              <span className="material-symbols-outlined text-red-500 text-2xl flex-shrink-0">error</span>
              <p className="font-jetbrains-mono text-sm font-bold text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-6" noValidate>

            {/* Username Field */}
            <div className="space-y-2 group/input">
              <label
                htmlFor="register-name"
                className="font-jetbrains-mono text-sm font-black text-black uppercase tracking-widest bg-[#FF90E8] border-2 border-black px-2 py-1 shadow-[2px_2px_0_black]"
              >
                Username
              </label>
              <div className="relative mt-2">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-black text-2xl">badge</span>
                <input
                  id="register-name"
                  className="bg-[#F3F4F6] border-4 border-black w-full py-4 pl-14 pr-4 text-black font-jetbrains-mono font-bold text-lg focus:bg-white hover:shadow-[4px_4px_0_black] focus:shadow-[4px_4px_0_black] outline-none transition-all placeholder:text-gray-500"
                  placeholder="Your Username"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2 group/input pt-2">
              <label
                htmlFor="register-email"
                className="font-jetbrains-mono text-sm font-black text-black uppercase tracking-widest bg-[#FFD700] border-2 border-black px-2 py-1 shadow-[2px_2px_0_black]"
              >
                Email Address
              </label>
              <div className="relative mt-2">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-black text-2xl">alternate_email</span>
                <input
                  id="register-email"
                  className="bg-[#F3F4F6] border-4 border-black w-full py-4 pl-14 pr-4 text-black font-jetbrains-mono font-bold text-lg focus:bg-white hover:shadow-[4px_4px_0_black] focus:shadow-[4px_4px_0_black] outline-none transition-all placeholder:text-gray-500"
                  placeholder="your@email.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2 group/input pt-2">
              <label
                htmlFor="register-password"
                className="font-jetbrains-mono text-sm font-black text-black uppercase tracking-widest bg-[#00FFFF] border-2 border-black px-2 py-1 shadow-[2px_2px_0_black]"
              >
                Password
              </label>
              <div className="relative mt-2">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-black text-2xl">key</span>
                <input
                  id="register-password"
                  className="bg-[#F3F4F6] border-4 border-black w-full py-4 pl-14 pr-12 text-black font-jetbrains-mono font-bold text-lg focus:bg-white hover:shadow-[4px_4px_0_black] focus:shadow-[4px_4px_0_black] outline-none transition-all placeholder:text-gray-500"
                  placeholder="min. 8 characters"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:text-[#FF00FF] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <span className="material-symbols-outlined text-2xl font-black">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-8">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-[#A3E635] border-4 border-black text-black font-space-grotesk text-2xl font-black uppercase shadow-[8px_8px_0_black] hover:-translate-y-2 hover:translate-x-[-2px] hover:shadow-[12px_12px_0_black] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[0px_0px_0px_black] transition-all flex items-center justify-center gap-4 group disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:translate-x-0 disabled:hover:shadow-[8px_8px_0_black]"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined text-3xl font-black animate-spin">progress_activity</span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    SIGN UP NOW
                    <span className="material-symbols-outlined text-3xl font-black group-hover:translate-x-2 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="mt-10 pt-8 border-t-4 border-black w-full text-center">
            <p className="font-jetbrains-mono text-base font-bold text-black">
              Already have an account?&nbsp;
              <Link
                className="text-white bg-[#FF00FF] border-2 border-black px-2 py-1 shadow-[2px_2px_0_black] font-black uppercase tracking-widest hover:bg-black hover:text-[#FF00FF] transition-colors ml-1"
                href="/login"
              >
                LOG IN
              </Link>
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
